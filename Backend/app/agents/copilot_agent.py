from loguru import logger

from app.services.crop_service import predict_crop
from app.services.market_service import price_forecast, sell_or_hold
from app.services.ollama_service import generate_text_async
from app.services.subsidy_service import search_circulars
from app.config import settings


async def build_context(query: str) -> str:
    lowered = query.lower()
    context_sections = []

    if any(keyword in lowered for keyword in ["crop", "soil", "seed", "grow", "cultivate"]):
        crop_result = await predict_crop(
            {"N": 90, "P": 40, "K": 40, "temperature": 25, "humidity": 70, "ph": 6.5, "rainfall": 200},
            3,
        )
        recommendations = ", ".join(
            f"{item['crop']} ({round(item['confidence'], 2)} confidence)"
            for item in crop_result.get("recommendations", [])
        )
        context_sections.append(f"Crop intelligence: {recommendations}")

    if any(keyword in lowered for keyword in ["market", "price", "sell", "mandi", "rate"]):
        crop_name = "cotton" if "cotton" in lowered else "wheat" if "wheat" in lowered else "rice"
        forecast = await price_forecast(crop_name, 14)
        recommendation = await sell_or_hold(crop_name)
        context_sections.append(
            f"Market intelligence for {crop_name}: current price {forecast.get('last_price')}, "
            f"forecast {forecast.get('forecast_price')}, trend {forecast.get('trend')}, "
            f"decision {recommendation.get('decision')} because {recommendation.get('reason')}"
        )

    if any(keyword in lowered for keyword in ["scheme", "subsidy", "policy", "circular", "pm kisan", "eligib"]):
        circular_result = await search_circulars(query)
        top_titles = ", ".join(item.get("title", "") for item in circular_result.get("results", [])[:3])
        context_sections.append(
            f"Policy intelligence: {circular_result.get('rag_answer')} "
            f"Relevant circulars: {top_titles or 'No direct circular titles found'}"
        )

    return "\n".join(section for section in context_sections if section)

def _fallback_copilot_response(query: str, context: str, language: str) -> str:
    intro = "Here is a practical farm guidance summary." if language == "en" else "Here is a practical farm guidance summary."
    if context:
        return (
            f"{intro}\n\n"
            f"Question: {query}\n"
            f"Available farm intelligence:\n{context}\n\n"
            "The AI language layer is currently unavailable, so this answer is based on the latest tool outputs already collected by the system. "
            "Use this as the working recommendation and verify scheme deadlines or market conditions before acting."
        )
    return (
        f"{intro}\n\n"
        f"Question: {query}\n"
        "The copilot could not reach the language model right now. Please try again shortly, or ask a more specific crop, disease, market, or subsidy question."
    )


async def ask_copilot(query: str, language: str = "en") -> dict:
    try:
        context = await build_context(query)
        if not settings.ENABLE_COPILOT_OLLAMA:
            return {"query": query, "language": language, "response": _fallback_copilot_response(query, context, language)}
        language_instruction = f"Answer in {language}. " if language != "en" else ""
        prompt = (
            f"{language_instruction}"
            "You are KrishiSutra AI, a practical farming copilot. "
            "Give a clear answer, mention any uncertainty, and use the supplied farm intelligence when relevant.\n\n"
            f"Context:\n{context or 'No extra tool context available.'}\n\n"
            f"User question: {query}"
        )
        response = await generate_text_async(
            prompt=prompt,
            system="You are KrishiSutra AI, a multilingual farm copilot. Give direct, practical farming guidance.",
            timeout=settings.COPILOT_TIMEOUT_SECONDS,
        )
        return {"query": query, "language": language, "response": response}
    except Exception as exc:
        logger.warning(f"Copilot falling back to deterministic response: {exc}")
        return {
            "query": query,
            "language": language,
            "response": _fallback_copilot_response(query, context if 'context' in locals() else "", language),
        }
