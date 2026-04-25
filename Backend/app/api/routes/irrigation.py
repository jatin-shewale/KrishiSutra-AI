from fastapi import APIRouter, Depends
from app.api.schemas.irrigation_schemas import *
from app.services.irrigation_service import calculate_irrigation, water_simulation
from app.api.routes.auth import get_current_user
import random

router = APIRouter()

@router.post("/irrigation-plan", response_model=IrrigationResponse)
async def irrigation_plan(req: IrrigationRequest, user=Depends(get_current_user)):
    return calculate_irrigation(req.crop, req.area_acres, req.soil_moisture, req.rainfall_mm, req.temperature)

@router.post("/water-simulation", response_model=WaterSimulationResponse)
async def water_sim(req: WaterSimulationRequest, user=Depends(get_current_user)):
    rain = req.rain_pattern or [random.uniform(0, 5) for _ in range(req.days)]
    return await water_simulation(req.crop, req.area_acres, req.days, req.soil_moisture_start, rain)
