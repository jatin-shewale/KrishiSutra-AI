"""
Tool definitions for each specialized agent.
Each tool is a structured function that agents can invoke.
"""
from typing import Optional, List, Dict
import loguru
import asyncio

# ------------------- Crop Agent Tools -------------------
def crop_model_tool(
    N: float, P: float, K: float,
    temperature: float, humidity: float, ph: float, rainfall: float,
    top_k: int = 3
) -> Dict:
    """Predict top crops using ensemble ML model (RandomForest + XGBoost)."""
    from app.services.crop_service import get_recommender
    try:
        recommender = get_recommender()
        features = {"N": N, "P": P, "K": K, "temperature": temperature,
                    "humidity": humidity, "ph": ph, "rainfall": rainfall}
        results = recommender.predict(features, top_k)
        conf = sum(r["confidence"] for r in results) / len(results) if results else 0.0
        return {"status": "success", "recommendations": results, "confidence": conf}
    except Exception as e:
        loguru.logger.error(f"crop_model_tool error: {e}")
        return {"status": "error", "message": str(e), "fallback": ["rice", "wheat"]}

def yield_tool(crop: str, area_acres: float, confidence: float = 0.8) -> Dict:
    """Forecast yield for a given crop and area."""
    from app.services.crop_service import yield_forecast
    try:
        loop = asyncio.get_event_loop()
        result = loop.run_until_complete(yield_forecast(crop, area_acres, {"confidence": confidence}))
        return {"status": "success", **result}
    except Exception as e:
        return {"status": "error", "message": str(e)}

# ------------------- Disease Agent Tools -------------------
def disease_detect_tool(image_path: str) -> Dict:
    """Detect plant disease from leaf image using EfficientNet."""
    from app.services.disease_service import diagnose_disease
    try:
        loop = asyncio.get_event_loop()
        result = loop.run_until_complete(diagnose_disease(image_path))
        return {"status": "success", **result}
    except Exception as e:
        return {"status": "error", "message": str(e)}

def disease_risk_tool(crop: str, weather_conditions: Optional[Dict] = None) -> Dict:
    """Assess disease risk for a crop given weather conditions."""
    risks = []
    if crop.lower() == "cotton":
        risks.append({"disease": "bollworm", "risk": "high", "crop": "cotton"})
    if crop.lower() == "rice":
        risks.append({"disease": "blast", "risk": "medium", "crop": "rice"})
    return {"crop": crop, "risks": risks, "weather": weather_conditions}

# ------------------- Irrigation Agent Tools -------------------
def irrigation_calc_tool(
    crop: str, area_acres: float, soil_moisture: float,
    rainfall_mm: float = 0.0, temperature: float = 30.0
) -> Dict:
    """Calculate irrigation plan."""
    from app.services.irrigation_service import calculate_irrigation
    try:
        result = calculate_irrigation(crop, area_acres, soil_moisture, rainfall_mm, temperature)
        return {"status": "success", **result}
    except Exception as e:
        return {"status": "error", "message": str(e)}

def water_sim_tool(crop: str, area: float, days: int, start_moisture: float, rain_pattern: Optional[List[float]] = None) -> Dict:
    """Simulate water requirements over time."""
    from app.services.irrigation_service import water_simulation
    import random
    try:
        rain = rain_pattern or [random.uniform(0,5) for _ in range(days)]
        loop = asyncio.get_event_loop()
        result = loop.run_until_complete(water_simulation(crop, area, days, start_moisture, rain))
        return {"status": "success", **result}
    except Exception as e:
        return {"status": "error", "message": str(e)}

# ------------------- Market Agent Tools -------------------
def price_forecast_tool(crop: str, days_ahead: int = 30) -> Dict:
    """Forecast crop prices using Prophet."""
    from app.services.market_service import price_forecast
    try:
        loop = asyncio.get_event_loop()
        result = loop.run_until_complete(price_forecast(crop, days_ahead))
        return {"status": "success", **result}
    except Exception as e:
        return {"status": "error", "message": str(e)}

def sell_hold_tool(crop: str, current_price: Optional[float] = None) -> Dict:
    """Decide whether to sell or hold based on forecast."""
    from app.services.market_service import sell_or_hold
    try:
        loop = asyncio.get_event_loop()
        result = loop.run_until_complete(sell_or_hold(crop, current_price))
        return {"status": "success", **result}
    except Exception as e:
        return {"status": "error", "message": str(e)}

# ------------------- Circular Scraping Tools -------------------
def web_scraper_tool(url: str, source_name: str) -> Dict:
    """Scrape HTML content from a government portal."""
    from app.scrapers.gov_circular_scraper import GovCircularScraper
    try:
        scraper = GovCircularScraper()
        items = scraper.scrape_html({"name": source_name, "url": url, "type": "html"})
        return {"status": "success", "items": items, "count": len(items)}
    except Exception as e:
        return {"status": "error", "message": str(e)}

def pdf_parser_tool(pdf_url: str) -> Dict:
    """Download and extract text from a government PDF circular."""
    from app.scrapers.gov_circular_scraper import GovCircularScraper
    try:
        scraper = GovCircularScraper()
        text = scraper.extract_pdf_text(pdf_url)
        return {"status": "success", "text": text[:2000], "length": len(text)}
    except Exception as e:
        return {"status": "error", "message": str(e)}

def embedding_tool(texts: List[str], metadatas: Optional[List[Dict]] = None) -> Dict:
    """Create embeddings and store in vector DB."""
    from app.rag.circular_rag import get_rag
    try:
        rag = get_rag()
        for text in texts:
            rag.add_document(text)
        return {"status": "success", "indexed": len(texts)}
    except Exception as e:
        return {"status": "error", "message": str(e)}

def vector_search_tool(query: str, k: int = 5) -> Dict:
    """Search vector DB for relevant circular chunks."""
    from app.rag.circular_rag import get_rag
    try:
        rag = get_rag()
        loop = asyncio.get_event_loop()
        result = loop.run_until_complete(rag.ask(query))
        return {"status": "success", "answer": result.get("answer"), "sources": result.get("sources", [])}
    except Exception as e:
        return {"status": "error", "message": str(e)}

# ------------------- Subsidy Eligibility Tool -------------------
def eligibility_check_tool(farmer_profile: Dict, scheme: Dict) -> Dict:
    """Check if farmer is eligible for a scheme."""
    location = farmer_profile.get("location", "").lower()
    scheme_title = scheme.get("title", "").lower()
    eligible = True
    reasons = []
    if location and location not in scheme_title:
        eligible = False
        reasons.append("Location mismatch")
    return {"eligible": eligible, "scheme": scheme.get("title"), "reasons": reasons}

# Tool registry per agent
CROP_TOOLS = [crop_model_tool, yield_tool]
DISEASE_TOOLS = [disease_detect_tool, disease_risk_tool]
IRRIGATION_TOOLS = [irrigation_calc_tool, water_sim_tool]
MARKET_TOOLS = [price_forecast_tool, sell_hold_tool]
CIRCULAR_TOOLS = [web_scraper_tool, pdf_parser_tool, embedding_tool, vector_search_tool]
SUBSIDY_TOOLS = [eligibility_check_tool, vector_search_tool]
RAG_TOOLS = [vector_search_tool]
ALERT_TOOLS = [price_forecast_tool, disease_risk_tool]
