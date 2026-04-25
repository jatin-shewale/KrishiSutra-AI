from app.scrapers.gov_circular_scraper import GovCircularScraper
from app.rag.circular_rag import get_rag
from app.db.mongo import mongo
from datetime import datetime
from loguru import logger
from typing import List, Dict

async def fetch_latest_schemes() -> List[Dict]:
    scraper = GovCircularScraper()
    items = scraper.run_all()
    db = await mongo.get_or_connect_db()
    rag = get_rag()
    for item in items:
        item["fetched_at"] = datetime.utcnow()
        await db.gov_circulars.update_one({"url": item["url"]}, {"$set": item}, upsert=True)
        text_parts = [item.get("title", ""), item.get("summary", ""), item.get("content", "")]
        doc_text = "\n".join(part for part in text_parts if part)
        if doc_text.strip():
            rag.add_document(doc_text, metadata={"url": item.get("url"), "title": item.get("title"), "source": item.get("source")})
    return items

async def get_schemes_from_db(limit: int = 20):
    db = await mongo.get_or_connect_db()
    cursor = db.gov_circulars.find().sort("fetched_at", -1).limit(limit)
    return [doc async for doc in cursor]

async def search_circulars(query: str) -> Dict:
    rag = get_rag()
    db = await mongo.get_or_connect_db()
    results = await db.gov_circulars.find({"title": {"$regex": query, "$options": "i"}}).to_list(5)
    rag_result = await rag.ask(query)
    return {
        "query": query,
        "results": results,
        "rag_answer": rag_result["answer"],
        "source_circulars": rag_result.get("sources", []),
    }

async def generate_subsidy_alerts(farmer_profile: dict) -> List[Dict]:
    db = await mongo.get_or_connect_db()
    location = farmer_profile.get("location", "")
    schemes = await db.gov_circulars.find({"title": {"$regex": location, "$options": "i"}}).to_list(10)
    alerts = []
    for s in schemes:
        alerts.append({
            "scheme_title": s.get("title"),
            "url": s.get("url"),
            "relevance": "high" if location.lower() in s.get("title", "").lower() else "medium",
            "created_at": s.get("fetched_at")
        })
    return alerts
