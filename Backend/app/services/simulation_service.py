from typing import Dict, List
from datetime import datetime, UTC
from app.services.ollama_service import generate_text_async
from app.config import settings

BASE_YIELDS = {"rice": 28, "wheat": 30, "cotton": 18, "maize": 32, "sugarcane": 350}
PRICES = {"rice": 2100, "wheat": 2200, "cotton": 6500, "maize": 1900, "sugarcane": 350}

def _fallback_simulation_recommendation(
    base_crop: str,
    new_crop: str,
    projected_yield: float,
    revenue_change: float,
    risk: str,
    irrigation_change_pct: float,
    fertilizer_change_pct: float,
) -> str:
    direction = "improves" if revenue_change >= 0 else "reduces"
    decision = "worth considering" if revenue_change >= 0 and risk != "high" else "should be adopted carefully"
    return (
        f"This scenario is {decision}. Projected yield is {projected_yield}, and the revenue impact {direction} farm returns by {round(revenue_change, 2)}. "
        f"Risk is {risk}. The main operational drivers are irrigation change of {irrigation_change_pct}% and fertilizer change of {fertilizer_change_pct}%. "
        f"If you keep {new_crop} as the target crop, verify water availability, input cost, and expected local market price before implementing it at scale."
    )

async def simulate_farm_scenario(
    base_crop: str,
    area_acres: float,
    scenario: Dict,
    irrigation_change_pct: float = 0,
    fertilizer_change_pct: float = 0
) -> Dict:
    base_yield = BASE_YIELDS.get(base_crop.lower(), 25)
    base_price = PRICES.get(base_crop.lower(), 2000)
    new_crop = scenario.get("new_crop", base_crop)
    new_yield = BASE_YIELDS.get(new_crop.lower(), 25)
    irr_factor = 1 + irrigation_change_pct / 100
    fert_factor = 1 + fertilizer_change_pct / 100
    yield_impact = (new_yield * irr_factor * fert_factor) - (base_yield * 1 * 1)
    base_revenue = base_yield * area_acres * base_price
    new_revenue = new_yield * irr_factor * fert_factor * area_acres * PRICES.get(new_crop.lower(), 2000)
    revenue_change = new_revenue - base_revenue
    projected_yield = round(new_yield * irr_factor * fert_factor * area_acres, 2)
    risk = "low"
    if yield_impact < -5:
        risk = "high"
    elif yield_impact < 0:
        risk = "medium"

    ai_recommendation = _fallback_simulation_recommendation(
        base_crop,
        new_crop,
        projected_yield,
        revenue_change,
        risk,
        irrigation_change_pct,
        fertilizer_change_pct,
    )
    if settings.ENABLE_SIMULATION_AI:
        try:
            ai_recommendation = await generate_text_async(
                prompt=(
                    "Give a practical digital twin farming recommendation.\n"
                    f"Base crop: {base_crop}\n"
                    f"New crop: {new_crop}\n"
                    f"Area: {area_acres} acres\n"
                    f"Irrigation change: {irrigation_change_pct}%\n"
                    f"Fertilizer change: {fertilizer_change_pct}%\n"
                    f"Projected yield: {projected_yield}\n"
                    f"Revenue change: {round(revenue_change, 2)}\n"
                    f"Risk level: {risk}\n"
                    "Explain whether the farmer should follow this scenario and what operational adjustments matter most."
                ),
                system="You are an agricultural simulation advisor. Be specific and practical.",
                timeout=settings.SIMULATION_AI_TIMEOUT_SECONDS,
            )
        except Exception:
            pass

    return {
        "base_crop": base_crop, "new_crop": new_crop, "area_acres": area_acres,
        "yield_impact": round(yield_impact, 2), "projected_yield": projected_yield, "revenue_change": round(revenue_change, 2),
        "irrigation_change_pct": irrigation_change_pct, "fertilizer_change_pct": fertilizer_change_pct,
        "risk_level": risk, "scenario": scenario, "timestamp": datetime.now(UTC).isoformat(),
        "ai_recommendation": ai_recommendation,
    }

async def compare_scenarios(base_crop: str, area: float, scenarios: List[Dict]) -> List[Dict]:
    results = []
    for s in scenarios:
        res = await simulate_farm_scenario(base_crop, area, s.get("scenario", {}), s.get("irrigation_change_pct", 0), s.get("fertilizer_change_pct", 0))
        results.append(res)
    results.sort(key=lambda x: x["revenue_change"], reverse=True)
    return results
