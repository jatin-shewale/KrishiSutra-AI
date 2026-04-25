from typing import Dict, List
from datetime import datetime
from app.services.ollama_service import generate_text_async

BASE_YIELDS = {"rice": 28, "wheat": 30, "cotton": 18, "maize": 32, "sugarcane": 350}
PRICES = {"rice": 2100, "wheat": 2200, "cotton": 6500, "maize": 1900, "sugarcane": 350}

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

    ai_recommendation = None
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
            timeout=60,
        )
    except Exception:
        ai_recommendation = (
            f"Projected yield is {projected_yield} with a {risk} risk profile. "
            f"Revenue change is {round(revenue_change, 2)}, so follow this scenario only if irrigation and fertilizer inputs can be maintained consistently."
        )

    return {
        "base_crop": base_crop, "new_crop": new_crop, "area_acres": area_acres,
        "yield_impact": round(yield_impact, 2), "projected_yield": projected_yield, "revenue_change": round(revenue_change, 2),
        "irrigation_change_pct": irrigation_change_pct, "fertilizer_change_pct": fertilizer_change_pct,
        "risk_level": risk, "scenario": scenario, "timestamp": datetime.utcnow().isoformat(),
        "ai_recommendation": ai_recommendation,
    }

async def compare_scenarios(base_crop: str, area: float, scenarios: List[Dict]) -> List[Dict]:
    results = []
    for s in scenarios:
        res = await simulate_farm_scenario(base_crop, area, s.get("scenario", {}), s.get("irrigation_change_pct", 0), s.get("fertilizer_change_pct", 0))
        results.append(res)
    results.sort(key=lambda x: x["revenue_change"], reverse=True)
    return results
