from fastapi import APIRouter, Depends
from app.api.schemas.simulation_schemas import *
from app.services.simulation_service import simulate_farm_scenario, compare_scenarios
from app.api.routes.auth import get_current_user

router = APIRouter()

@router.post("/simulate-farm", response_model=SimulationResponse)
async def simulate(req: SimulationRequest, user=Depends(get_current_user)):
    return await simulate_farm_scenario(
        req.base_crop, req.area_acres, req.scenario or {},
        req.irrigation_change_pct, req.fertilizer_change_pct
    )

@router.post("/compare-scenarios", response_model=List[SimulationResponse])
async def compare(req: CompareRequest, user=Depends(get_current_user)):
    scenarios = [s.model_dump() for s in req.scenarios]
    return await compare_scenarios(req.base_crop, req.area_acres, scenarios)
