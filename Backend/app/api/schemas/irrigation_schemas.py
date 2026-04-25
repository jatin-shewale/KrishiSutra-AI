from pydantic import BaseModel
from typing import List, Optional

class IrrigationRequest(BaseModel):
    crop: str
    area_acres: float
    soil_moisture: float
    rainfall_mm: float = 0.0
    temperature: float = 30.0

class IrrigationResponse(BaseModel):
    crop: str
    area_acres: float
    total_water_liters: float
    rainfall_offset_liters: float
    irrigation_frequency: str
    soil_moisture: float
    recommendation: str

class WaterSimulationRequest(BaseModel):
    crop: str
    area_acres: float
    days: int = 30
    soil_moisture_start: float = 50.0
    rain_pattern: Optional[List[float]] = None

class WaterSimulationDay(BaseModel):
    day: int
    soil_moisture: float
    water_liters: float

class WaterSimulationResponse(BaseModel):
    simulation_days: int
    crop: str
    area_acres: float
    daily_data: List[WaterSimulationDay]
