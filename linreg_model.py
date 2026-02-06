import pandas as pd
import numpy as np

from dataclasses import dataclass
from typing import Dict, Any, Tuple, Optional, List

from sklearn.model_selection import train_test_split, GridSearchCV, KFold
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.linear_model import ElasticNet
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.impute import SimpleImputer


def prepare_xy(
    df: pd.DataFrame,
    target: str,
    drop_cols: Optional[List[str]] = None
) -> Tuple[pd.DataFrame, pd.Series]:
    """
    target: "cur_ee" or "potential"
    potential is defined as per_ee - cur_ee
    """
    if drop_cols is None:
        drop_cols = []

    if target == "cur_ee":
        y = df["cur_ee"].astype(float)
    elif target == "potential":
        y = (df["per_ee"] - df["cur_ee"]).astype(float)
    else:
        raise ValueError("target must be 'cur_ee' or 'potential'.")

    # Always drop these to avoid leakage / target columns in X
    base_drop = {"cur_ee", "per_ee", "cur_rate"}
    base_drop.update(drop_cols)

    X = df.drop(columns=[c for c in base_drop if c in df.columns])
    return X, y

def build_elasticnet_pipeline(X):
    """
    Preprocess:
      - Numeric: impute median + scale
      - Categorical: impute constant 'unknown' + one-hot
    Model:
      - ElasticNet
    """
    cat_cols = X.select_dtypes(include=["object", "category", "bool"]).columns.tolist()
    num_cols = [c for c in X.columns if c not in cat_cols]

    num_pipe = Pipeline(steps=[
        ("imputer", SimpleImputer(strategy="median")),
        ("scaler", StandardScaler())
    ])

    cat_pipe = Pipeline(steps=[
        ("imputer", SimpleImputer(strategy="constant", fill_value="unknown")),
        ("onehot", OneHotEncoder(handle_unknown="ignore"))
    ])

    pre = ColumnTransformer(
        transformers=[
            ("num", num_pipe, num_cols),
            ("cat", cat_pipe, cat_cols),
        ],
        remainder="drop"
    )

    pipe = Pipeline(steps=[
        ("preprocess", pre),
        ("model", ElasticNet(max_iter=10000, random_state=42))
    ])

    return pipe, num_cols, cat_cols

@dataclass
class TrainedModel:
    best_estimator: object
    best_params: Dict[str, Any]
    cv_results: pd.DataFrame
    test_metrics: Dict[str, float]
    feature_columns: List[str]

def train_elasticnet_cv(
    X, y,
    *,
    test_size=0.15,
    random_state=42,
    cv_splits=5,
    alpha_grid: Optional[List[float]] = None,
    l1_ratio_grid: Optional[List[float]] = None,
    scoring="neg_mean_absolute_error",
    n_jobs=-1,
    error_score="raise"
) -> TrainedModel:
    if alpha_grid is None:
        alpha_grid = [0.001, 0.003, 0.01, 0.03, 0.1, 0.3, 1.0]  # avoid ultra-small alphas initially
    if l1_ratio_grid is None:
        l1_ratio_grid = [0.1, 0.3, 0.5, 0.7, 0.9, 1.0]  # avoid 0.0 (pure ridge) for ElasticNet

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=test_size, random_state=random_state
    )

    pipe, _, _ = build_elasticnet_pipeline(X_train)

    param_grid = {
        "model__alpha": alpha_grid,
        "model__l1_ratio": l1_ratio_grid
    }

    cv = KFold(n_splits=cv_splits, shuffle=True, random_state=random_state)

    search = GridSearchCV(
        estimator=pipe,
        param_grid=param_grid,
        scoring=scoring,
        cv=cv,
        n_jobs=n_jobs,
        refit=True,
        return_train_score=True,
        error_score=error_score
    )

    search.fit(X_train, y_train)

    best_model = search.best_estimator_
    test_metrics = evaluate_regression(best_model, X_test, y_test)
    cv_results = pd.DataFrame(search.cv_results_).sort_values("rank_test_score")

    return TrainedModel(
        best_estimator=best_model,
        best_params=search.best_params_,
        cv_results=cv_results,
        test_metrics=test_metrics,
        feature_columns=list(X.columns)
    )


def evaluate_regression(model: Pipeline, X: pd.DataFrame, y_true: pd.Series) -> Dict[str, float]:
    y_pred = model.predict(X)

    mae = mean_absolute_error(y_true, y_pred)
    rmse = float(np.sqrt(mean_squared_error(y_true, y_pred)))
    r2 = r2_score(y_true, y_pred)

    return {"mae": float(mae), "rmse": rmse, "r2": float(r2)}



def predict_one(model: Pipeline, expected_columns: List[str], payload: Dict[str, Any]) -> float:
    """
    payload: dict containing raw features (same names as training X columns)
    Unknown categorical levels are safely ignored by OneHotEncoder(handle_unknown="ignore").
    Missing columns are added as NaN.
    Extra columns are ignored.
    """
    # Keep only expected keys; add missing keys as NaN
    row = {col: payload.get(col, np.nan) for col in expected_columns}
    X_input = pd.DataFrame([row])

    pred = model.predict(X_input)[0]
    return float(pred)



