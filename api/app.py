import json
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

import numpy as np
import pandas as pd
import joblib
from fastapi import FastAPI
from pydantic import BaseModel, Field


# Load model + columns once
BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_DIR = BASE_DIR / "models"

MODEL_PATH = MODEL_DIR / "xgboost_ee_model.joblib"
COLS_PATH = MODEL_DIR / "feature_columns.json"

model = joblib.load(MODEL_PATH)

with open(COLS_PATH, "r", encoding="utf-8") as f:
    EXPECTED_COLUMNS: List[str] = json.load(f)

app = FastAPI(title="EPC EE API", version="1.0")


# Helpers
def make_X(payload: Dict[str, Any]) -> pd.DataFrame:
    """
    Turn partial user input into a DataFrame with EXACTLY the training columns.
    Missing fields become NaN -> your pipeline imputers handle them.
    """
    row = {col: payload.get(col, np.nan) for col in EXPECTED_COLUMNS}
    return pd.DataFrame([row])

def predict_ee(payload: Dict[str, Any]) -> float:
    X = make_X(payload)
    return float(model.predict(X)[0])

def apply_changes(base: Dict[str, Any], changes: Dict[str, Any]) -> Dict[str, Any]:
    out = dict(base)
    out.update(changes)
    return out

def as_str(x: Any) -> str:
    if x is None:
        return ""
    if isinstance(x, float) and np.isnan(x):
        return ""
    return str(x)

def as_float(x: Any) -> float:
    try:
        return float(x)
    except Exception:
        return np.nan

def as_int(x: Any) -> int:
    try:
        return int(x)
    except Exception:
        return 0


# -------------------------
# Upgrade scenarios
# -------------------------
def scenario_library(user: Dict[str, Any]):
    """
    Predefined upgrades.
    Scenarios can be added or removed.
    """

    def roof_accessible(u: Dict[str, Any]) -> bool:
        rb = as_str(u.get("roof_boundary")).lower()
        # if unknown, assume accessible (simple)
        if rb == "":
            return True
        return rb not in {"dwelling_above", "(another dwelling above)", "other_premises_above"}

    def controls_good(u: Dict[str, Any]) -> bool:
        return (
            as_int(u.get("has_time_control")) == 1
            and as_int(u.get("has_temp_control")) == 1
            and as_int(u.get("has_room_control")) == 1
        )

    def has_pv(u: Dict[str, Any]) -> bool:
        return as_str(u.get("pv")).lower() in {"yes", "true", "1"}

    def has_solar_hot_water(u: Dict[str, Any]) -> bool:
        return as_str(u.get("sol_wat")).lower() in {"yes", "true", "1"}

    def wall_type(u: Dict[str, Any]) -> str:
        wt = as_str(u.get("wall_type")).lower()
        if "cavity" in wt:
            return "cavity"
        if "solid" in wt:
            return "solid"
        return "unknown"

    scenarios = []

    # 1) Loft insulation to 300mm
    def s_loft_app(u):
        if not roof_accessible(u):
            return False, "Roof not accessible (dwelling above)."
        mm = as_float(u.get("roof_insulation_mm"))
        if np.isnan(mm):
            return True, "Roof insulation unknown; simulating 300mm."
        if mm >= 300:
            return False, "Already ~300mm or more."
        return True, f"Current loft insulation {mm:.0f}mm."

    def s_loft_changes(u):
        return {
            "roof_insulation_type": "loft",
            "roof_insulation_mm": 300.0,
            "roof_ee": 5,
        }

    scenarios.append(("loft_to_300", "Increase loft insulation to 300mm", s_loft_app, s_loft_changes))

    # 2) Improve walls (simple)
    def s_wall_app(u):
        w_ee = as_int(u.get("wall_ee"))
        if w_ee >= 4:
            return False, "Walls already good/very good."
        return True, f"Wall type: {wall_type(u)}."

    def s_wall_changes(u):
        wt = wall_type(u)
        if wt == "cavity":
            return {"wall_type": "cavity", "wall_insulation": "filled_cavity", "wall_ee": 5}
        if wt == "solid":
            # generic improvement label
            return {"wall_type": "solid", "wall_insulation": "internal_or_external", "wall_ee": 4}
        return {"wall_ee": 4}

    scenarios.append(("improve_walls", "Improve wall insulation", s_wall_app, s_wall_changes))

    # 3) Improve heating controls
    def s_controls_app(u):
        if controls_good(u):
            return False, "Controls already good."
        return True, "Simulating best-practice controls."

    def s_controls_changes(u):
        return {
            "has_time_control": 1,
            "has_temp_control": 1,
            "has_room_control": 1,
            "con_ee": 5,
        }

    scenarios.append(("better_controls", "Upgrade heating controls", s_controls_app, s_controls_changes))

    # 4) Add PV
    def s_pv_app(u):
        if has_pv(u):
            return False, "PV already present."
        return True, "Simulating PV installation."

    def s_pv_changes(u):
        return {"pv": "yes"}

    scenarios.append(("add_pv", "Add solar PV", s_pv_app, s_pv_changes))

    # 5) Add solar hot water
    def s_sw_app(u):
        if has_solar_hot_water(u):
            return False, "Solar hot water already present."
        return True, "Simulating solar hot water."

    def s_sw_changes(u):
        return {"sol_wat": "yes", "dhw_has_solar": 1}

    scenarios.append(("add_solar_hot_water", "Add solar hot water", s_sw_app, s_sw_changes))

    return scenarios


# -------------------------
# API request/response
# -------------------------
class AnalyzeRequest(BaseModel):
    features: Dict[str, Any] = Field(..., description="Partial user input allowed.")

class ScenarioResult(BaseModel):
    key: str
    label: str
    applicable: bool
    reason: str
    ee_after: Optional[float] = None
    uplift: Optional[float] = None
    applied_changes: Optional[Dict[str, Any]] = None

class AnalyzeResponse(BaseModel):
    ee_now: float
    scenarios: List[ScenarioResult]
    top_recommendations: List[ScenarioResult]


# -------------------------
# One-click endpoint
# -------------------------
@app.post("/analyze", response_model=AnalyzeResponse)
def analyze(req: AnalyzeRequest):
    user = req.features

    ee_now = predict_ee(user)

    scenario_results: List[ScenarioResult] = []

    for key, label, applicable_fn, changes_fn in scenario_library(user):
        ok, reason = applicable_fn(user)

        if not ok:
            scenario_results.append(ScenarioResult(
                key=key,
                label=label,
                applicable=False,
                reason=reason
            ))
            continue

        changes = changes_fn(user)
        upgraded_payload = apply_changes(user, changes)

        ee_after = predict_ee(upgraded_payload)
        uplift = ee_after - ee_now

        scenario_results.append(ScenarioResult(
            key=key,
            label=label,
            applicable=True,
            reason=reason,
            ee_after=float(ee_after),
            uplift=float(uplift),
            applied_changes=changes
        ))

    # Top 3: biggest positive uplift
    applicable = [r for r in scenario_results if r.applicable and r.uplift is not None]
    applicable_sorted = sorted(applicable, key=lambda r: r.uplift, reverse=True)
    top = [r for r in applicable_sorted if r.uplift > 0][:3]

    return AnalyzeResponse(
        ee_now=float(ee_now),
        scenarios=scenario_results,
        top_recommendations=top
    )