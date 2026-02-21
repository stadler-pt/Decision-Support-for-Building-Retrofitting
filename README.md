# Home Energy Efficiency Advisor

## Link to Website: https://green-home-score-production.up.railway.app/

## 🌍 Project Overview

This project proposes a machine-learning-based decision support tool that helps homeowners identify the most impactful measures to improve the energy efficiency of their homes.
The tool contributes to climate mitigation and sustainable development by addressing a key leverage point: the building sector. Buildings account for a substantial share of global energy use and emissions, yet many households lack accessible, trustworthy guidance to make informed retrofit decisions.

Beyond climate mitigation, the tool directly responds to the **energy price crisis and cost-of-living pressures** triggered by the post-pandemic economic recovery and the 2022 Russian invasion of Ukraine. The resulting surge in global energy prices led to historically high inflation rates and sharply rising household utility bills. This energy-driven inflation has significantly increased the risk of energy poverty and deepened existing inequalities across Europe and globally. Improving building energy efficiency is widely recognized as one of the most effective strategies to reduce energy consumption and shield households from future price volatility.

By combining open housing and energy data with predictive modeling, the tool generates personalized retrofit recommendations that help households reduce long-term energy demand, protect themselves against market volatility, and alleviate financial strain.

---

## 🎯 Problem Statement

Achieving the Sustainable Development Goals (SDGs) requires integrated progress across energy, cities, and climate action. In particular:

- **SDG 7** (Affordable and Clean Energy)
- **SDG 11** (Sustainable Cities and Communities)
- **SDG 13** (Climate Action)

are deeply interconnected.

Despite improvements in renewable energy and efficiency, global progress remains too slow to meet climate targets. The buildings sector plays a central role, yet:

- Energy efficiency improvements are insufficient.
- Housing affordability and resilience remain major challenges.
- Energy prices have surged dramatically since 2022.
- Many households struggle to understand retrofit options and their impacts.
- Energy literacy and financial constraints complicate decision-making.

The recent energy crisis has demonstrated how vulnerable households are to global price shocks. Rising energy bills have intensified the cost-of-living crisis and substantially increased the risk of energy poverty. In this context, improving building energy efficiency is not only a climate strategy but also a **social protection mechanism**.

This creates a **decision gap**: homeowners face complex and fragmented information when trying to improve building performance.

---

## 💡 Solution Concept

The project introduces a **web-based ML-powered decision support tool** that:

1. Predicts a home's current energy performance.
2. Simulates common retrofit measures.
3. Ranks interventions by estimated efficiency impact.

The goal is not radical technological innovation, but **accessible, data-driven guidance** that empowers individuals to align personal decisions with broader sustainability and economic resilience goals.

By providing personalized, ranked retrofit recommendations—combined with indicative cost ranges and potential energy bill savings—the tool enables households to make cost-effective upgrades. This reduces long-term energy demand, shields consumers from future energy price volatility, and mitigates the financial strain caused by soaring utility costs.

---

## 🗂 Data Foundation

The system is built on open data from the **Carbon & Place project** about Domestic Energy Performance Certificate (EPC) summaries for Great Britain.

From these data, the model learns how combinations of dwelling characteristics relate to energy performance.

---

## 🤖 Machine Learning Approach

### Two-Stage Modeling Strategy

1. **Baseline Model**  
   - Regularized linear regression (Ridge or Lasso)  
   - Transparent benchmark  
   - Predicts EPC-aligned energy performance proxy  

2. **Advanced Model**  
   - XGBoost regressor  
   - Captures non-linear feature interactions  
   - Provides higher predictive accuracy for building energy performance  

The advanced model is used for final predictions and retrofit simulations.

---

## 🏗 System Architecture

### Frontend
- Web application interface
- User inputs:
  - Dwelling type
  - Floor area
  - Construction period
  - Heating system
  - Other core descriptors

### Backend
- FastAPI service
- Workflow:
  1. Preprocess input
  2. Predict baseline energy performance
  3. Calculate energy performance of predefined retrofit scenarios
  4. Rank measures by relative impact
  5. Return explanation and results as JSON

---

## 📊 Output to Users

The system provides:

- Predicted current energy rating (EPC-style band)
- Ranked list of retrofit measures
- Impact of each retrofit measure
- Short explanation of key performance drivers

---

## 🚀 Future Enhancements

Potential extensions include:

- Retraining with expanded EPC datasets
- Integration of user energy bills or smart meter data
- Interactive SHAP explanations
- “What-if” sliders for parameter exploration
- Integration of policy incentives and local retrofit programs
- Dynamic tariff scenarios to model energy price volatility impacts

---

## 🌱 Contribution to Sustainable Development & Economic Resilience

By addressing the building-level decision gap, this project contributes to:

- Decarbonization of the housing sector  
- Improved energy affordability  
- Reduced exposure to energy price volatility  
- Lower risk of energy poverty  
- Increased energy literacy  
- Alignment of household decisions with SDG-oriented strategies  

It operationalizes climate action and economic resilience in a concrete, high-leverage domain: residential buildings.

---

## For a more detailed description and a list of sources see the document 'Problem Description and Product Idea'
