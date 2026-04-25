from fastapi import APIRouter, Depends
from app.langgraph.planner_graph import run_planner
from app.api.routes.auth import get_current_user
from pydantic import BaseModel

router = APIRouter()

class PlannerRequest(BaseModel):
    query: str
    farm_context: dict = {}

class PlannerResponse(BaseModel):
    query: str
    decision: dict
    confidence: float
    reasoning_trace: list
    errors: list

@router.post("/ask", response_model=PlannerResponse)
async def ask_planner(req: PlannerRequest, user=Depends(get_current_user)):
    result = await run_planner(req.query, str(user["_id"]), req.farm_context)
    return result
