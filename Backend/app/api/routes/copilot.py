from fastapi import APIRouter, Depends
from app.agents.copilot_agent import ask_copilot
from app.api.routes.auth import get_current_user
from pydantic import BaseModel

router = APIRouter()

class CopilotRequest(BaseModel):
    query: str
    language: str = "en"

class CopilotResponse(BaseModel):
    query: str
    language: str
    response: str

@router.post("/ask-farm-copilot", response_model=CopilotResponse)
async def ask_copilot_endpoint(req: CopilotRequest, user=Depends(get_current_user)):
    return await ask_copilot(req.query, req.language)
