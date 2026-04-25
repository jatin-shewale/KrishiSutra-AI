from pydantic import BaseModel
from typing import List, Dict, Optional

class ScenarioInput(BaseModel):
    scenario: Optional[Dict] = None
    irrigation_change_pct: float = 0
    fertilizer_change_pct: float = 0

class SimulationRequest(BaseModel):
    base_crop: str
    area_acres: float
    scenario: Optional[Dict] = None
    irrigation_change_pct: float = 0
    fertilizer_change_pct: float = 0

class SimulationResponse(BaseModel):
    base_crop: str
    new_crop: str
    area_acres: float
    yield_impact: float
    projected_yield: float
    revenue_change: float
    irrigation_change_pct: float
    fertilizer_change_pct: float
    risk_level: str
    scenario: Dict
    timestamp: str
    ai_recommendation: Optional[str] = None

class CompareRequest(BaseModel):
    base_crop: str
    area_acres: float
    scenarios: List[ScenarioInput]
