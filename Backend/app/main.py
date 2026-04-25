from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from loguru import logger
from contextlib import asynccontextmanager
from app.db.mongo import mongo
from app.api.routes import auth, crop, disease, irrigation, market, subsidy, copilot, simulation, alerts, planner
from app.tasks.scheduler import start_scheduler, stop_scheduler
from app.config import settings

DEV_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting KrishiSutra AI Backend...")
    await mongo.connect()
    start_scheduler()
    yield
    stop_scheduler()
    await mongo.close()
    logger.info("Shutting down KrishiSutra AI Backend...")

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Multi-Agent Autonomous Farming Intelligence System",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=DEV_ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(crop.router, prefix="/crop", tags=["Crop Intelligence"])
app.include_router(disease.router, prefix="/disease", tags=["Disease Diagnosis"])
app.include_router(irrigation.router, prefix="/irrigation", tags=["Irrigation"])
app.include_router(market.router, prefix="/market", tags=["Market Forecast"])
app.include_router(subsidy.router, prefix="/subsidy", tags=["Subsidies & Schemes"])
app.include_router(copilot.router, prefix="/copilot", tags=["Farm Copilot"])
app.include_router(simulation.router, prefix="/simulation", tags=["Digital Twin"])
app.include_router(alerts.router, prefix="/alerts", tags=["Alerts"])
app.include_router(planner.router, prefix="/planner", tags=["LangGraph Planner"])

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": settings.APP_NAME, "version": settings.APP_VERSION}
