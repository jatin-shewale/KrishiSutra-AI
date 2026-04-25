from app.ml.crop_recommender import CropRecommender
from datetime import datetime
from app.services.ollama_service import generate_text_async

BASE_YIELD_PER_ACRE = {"rice": 28, "wheat": 30, "cotton": 18, "maize": 32, "sugarcane": 350}

_recommender = None

def get_recommender() -> CropRecommender:
    global _recommender
    if _recommender is None:
        _recommender = CropRecommender()
        _recommender.load()
    return _recommender

async def predict_crop(features: dict, top_k: int = 3):
    recommender = get_recommender()
    results = recommender.predict(features, top_k)
    enriched_results = []

    for item in results:
        crop_name = item.get("crop", "")
        crop_key = crop_name.lower()
        confidence = item.get("confidence", 0)
        confidence_pct = confidence * 100 if confidence <= 1 else confidence
        enriched_results.append({
            **item,
            "estimated_yield_per_acre": BASE_YIELD_PER_ACRE.get(crop_key, 25),
            "yield_unit": "quintal/acre",
            "why_selected": (
                f"{crop_name} matches the current NPK balance, pH {features.get('ph')}, "
                f"rainfall {features.get('rainfall')} mm, and humidity {features.get('humidity')}% "
                f"with model confidence around {round(confidence_pct, 1)}%."
            ),
        })

    ai_summary = None
    if enriched_results:
      try:
        summary_lines = "\n".join(
            f"- {item['crop']}: confidence={round((item['confidence'] * 100) if item['confidence'] <= 1 else item['confidence'], 1)}%, "
            f"estimated_yield={item['estimated_yield_per_acre']} {item['yield_unit']}"
            for item in enriched_results
        )
        ai_summary = await generate_text_async(
            prompt=(
                "A farmer needs a practical crop recommendation explanation.\n"
                f"Soil and weather features: {features}\n"
                f"Model recommendations:\n{summary_lines}\n\n"
                "Explain why the top crop is suitable, mention yield expectations, and compare it briefly with the next best options. "
                "Keep it useful for a farmer."
            ),
            system="You are an agricultural advisor. Give direct, practical crop guidance.",
            timeout=60,
        )
      except Exception:
        top_crop = enriched_results[0]
        ai_summary = (
            f"{top_crop['crop']} is the strongest match for the current soil and weather profile. "
            f"Expected yield is about {top_crop['estimated_yield_per_acre']} {top_crop['yield_unit']} if farm conditions remain stable."
        )

    return {
        "recommendations": enriched_results,
        "input_features": features,
        "timestamp": datetime.utcnow().isoformat(),
        "ai_summary": ai_summary,
    }

async def yield_forecast(crop: str, area_acres: float, features: dict):
    base_yield = {"rice": 28, "wheat": 30, "cotton": 18, "maize": 32, "sugarcane": 350}
    by = base_yield.get(crop.lower(), 25)
    conf = features.get("confidence", 0.8)
    predicted = round(by * area_acres * conf, 2)
    return {
        "crop": crop,
        "area_acres": area_acres,
        "predicted_yield": predicted,
        "yield_unit": "quintal",
        "confidence": conf
    }
