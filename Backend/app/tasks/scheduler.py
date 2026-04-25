from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger
from app.scrapers.gov_circular_scraper import GovCircularScraper
from app.rag.circular_rag import get_rag
from app.db.mongo import mongo
from loguru import logger
from datetime import datetime, UTC

scheduler = AsyncIOScheduler()

async def scrape_task():
    logger.info("Scheduled: Scraping government circulars")
    try:
        scraper = GovCircularScraper()
        items = scraper.run_all()
        db = await mongo.get_or_connect_db()
        for item in items:
            item["fetched_at"] = datetime.now(UTC)
            await db.gov_circulars.update_one({"url": item["url"]}, {"$set": item}, upsert=True)
        if items:
            rag = get_rag()
            for item in items:
                text_parts = [item.get("title", ""), item.get("summary", ""), item.get("content", "")]
                doc_text = "\n".join(part for part in text_parts if part)
                if doc_text.strip():
                    rag.add_document(doc_text, metadata={"url": item.get("url"), "title": item.get("title"), "source": item.get("source")})
        logger.info(f"Scheduled scrape completed: {len(items)} items")
    except Exception as e:
        logger.error(f"Scheduled scrape failed: {e}")

def start_scheduler():
    from app.config import settings
    if settings.ENABLE_SCHEDULER:
        scheduler.add_job(scrape_task, IntervalTrigger(hours=settings.SCRAPE_INTERVAL_HOURS), id="scrape_circulars")
        scheduler.start()
        logger.info("APScheduler started")

def stop_scheduler():
    scheduler.shutdown()
    logger.info("APScheduler stopped")
