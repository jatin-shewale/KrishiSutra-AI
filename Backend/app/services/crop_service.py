from app.ml.crop_recommender import CropRecommender
from datetime import datetime, UTC
from app.services.ollama_service import generate_text_async
from app.config import settings
from loguru import logger

BASE_YIELD_PER_ACRE = {"rice": 28, "wheat": 30, "cotton": 18, "maize": 32, "sugarcane": 350}

_recommender = None

def get_recommender() -> CropRecommender:
    global _recommender
    if _recommender is None:
        _recommender = CropRecommender()
        _recommender.load()
    return _recommender

def _fallback_summary(features: dict, enriched_results: list[dict]) -> str | None:
    if not enriched_results:
        return None

    top_crop = enriched_results[0]
    alternatives = enriched_results[1:3]
    alternatives_text = (
        " Next best options are "
        + ", ".join(
            f"{item['crop']} ({round((item['confidence'] * 100) if item['confidence'] <= 1 else item['confidence'], 1)}% confidence)"
            for item in alternatives
        )
        + "."
        if alternatives
        else ""
    )
    nutrient_story = (
        f"The current profile shows N={features.get('N')}, P={features.get('P')}, K={features.get('K')}, "
        f"temperature={features.get('temperature')} C, humidity={features.get('humidity')}%, "
        f"pH={features.get('ph')}, and rainfall={features.get('rainfall')} mm."
    )
    return (
        f"{top_crop['crop']} is the strongest recommendation for this field. {nutrient_story} "
        f"The model estimates about {top_crop['estimated_yield_per_acre']} {top_crop['yield_unit']} "
        f"with confidence around {round((top_crop['confidence'] * 100) if top_crop['confidence'] <= 1 else top_crop['confidence'], 1)}%. "
        f"This suggests the crop is a good match for the current soil balance and moisture conditions. "
        f"Use this as the primary option, then compare seed availability, irrigation capacity, local market demand, and crop duration before final selection."
        f"{alternatives_text}"
    )

async def _build_ai_summary(features: dict, enriched_results: list[dict]) -> str | None:
    fallback = _fallback_summary(features, enriched_results)
    if not enriched_results or not settings.ENABLE_OLLAMA_SUMMARY:
        return fallback

    try:
        summary_lines = "\n".join(
            f"- {item['crop']}: confidence={round((item['confidence'] * 100) if item['confidence'] <= 1 else item['confidence'], 1)}%, "
            f"estimated_yield={item['estimated_yield_per_acre']} {item['yield_unit']}"
            for item in enriched_results
        )
        return await generate_text_async(
            prompt=(
                "A farmer needs a practical crop recommendation explanation.\n"
                f"Soil and weather features: {features}\n"
                f"Model recommendations:\n{summary_lines}\n\n"
                "Explain why the top crop is suitable, mention yield expectations, and compare it briefly with the next best options. "
                "Keep it useful for a farmer."
            ),
            system="You are an agricultural advisor. Give direct, practical crop guidance.",
            timeout=settings.OLLAMA_SUMMARY_TIMEOUT_SECONDS,
        )
    except Exception as exc:
        logger.warning(f"Falling back to deterministic crop summary: {exc}")
        return fallback

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

    ai_summary = await _build_ai_summary(features, enriched_results)

    return {
        "recommendations": enriched_results,
        "input_features": features,
        "timestamp": datetime.now(UTC).isoformat(),
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
