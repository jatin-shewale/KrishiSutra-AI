from app.scrapers.gov_circular_scraper import GovCircularScraper
from app.rag.circular_rag import get_rag
from app.db.mongo import mongo
from datetime import datetime, UTC
from loguru import logger
from typing import List, Dict

def _serialize_datetime(value):
    if isinstance(value, datetime):
        if value.tzinfo is None:
            value = value.replace(tzinfo=UTC)
        return value.isoformat()
    return value

def _serialize_scheme(doc: Dict) -> Dict:
    serialized = dict(doc)
    serialized.pop("_id", None)
    if "fetched_at" in serialized:
        serialized["fetched_at"] = _serialize_datetime(serialized["fetched_at"])
    if "created_at" in serialized:
        serialized["created_at"] = _serialize_datetime(serialized["created_at"])
    return serialized

async def fetch_latest_schemes() -> List[Dict]:
    scraper = GovCircularScraper()
    items = scraper.run_all()
    db = await mongo.get_or_connect_db()
    rag = get_rag()
    for item in items:
        item["fetched_at"] = datetime.now(UTC)
        await db.gov_circulars.update_one({"url": item["url"]}, {"$set": item}, upsert=True)
        text_parts = [item.get("title", ""), item.get("summary", ""), item.get("content", "")]
        doc_text = "\n".join(part for part in text_parts if part)
        if doc_text.strip():
            rag.add_document(doc_text, metadata={"url": item.get("url"), "title": item.get("title"), "source": item.get("source")})
    return items

async def fetch_latest_schemes_with_report() -> Dict:
    scraper = GovCircularScraper()
    items = scraper.run_all()
    db = await mongo.get_or_connect_db()
    rag = get_rag()
    for item in items:
        item["fetched_at"] = datetime.now(UTC)
        await db.gov_circulars.update_one({"url": item["url"]}, {"$set": item}, upsert=True)
        text_parts = [item.get("title", ""), item.get("summary", ""), item.get("content", "")]
        doc_text = "\n".join(part for part in text_parts if part)
        if doc_text.strip():
            rag.add_document(doc_text, metadata={"url": item.get("url"), "title": item.get("title"), "source": item.get("source")})
    logger.info(
        f"Fetch schemes completed with {len(items)} items and "
        f"{scraper.last_run_report['failed_sources']} source failures"
    )
    return {
        "items": [_serialize_scheme(item) for item in items],
        "report": scraper.last_run_report,
    }

async def get_schemes_from_db(limit: int = 20):
    db = await mongo.get_or_connect_db()
    cursor = db.gov_circulars.find().sort("fetched_at", -1).limit(limit)
    return [_serialize_scheme(doc) async for doc in cursor]

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
            "created_at": _serialize_datetime(s.get("fetched_at"))
        })
    return alerts
