from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.config import settings
import logging

logger = logging.getLogger(__name__)

class MongoClient:
    client: AsyncIOMotorClient = None
    db: AsyncIOMotorDatabase = None

    async def connect(self):
        if self.client is not None and self.db is not None:
            return self.db
        self.client = AsyncIOMotorClient(settings.MONGO_URI)
        self.db = self.client[settings.MONGO_DB_NAME]
        logger.info(f"Connected to MongoDB: {settings.MONGO_DB_NAME}")
        return self.db

    async def get_or_connect_db(self) -> AsyncIOMotorDatabase:
        if self.db is None:
            await self.connect()
        return self.db

    async def close(self):
        if self.client:
            self.client.close()
            logger.info("MongoDB connection closed")

    def get_db(self) -> AsyncIOMotorDatabase:
        if self.db is None:
            raise RuntimeError("MongoDB not initialized")
        return self.db

mongo = MongoClient()
