from fastapi import APIRouter, Depends
from app.api.schemas.subsidy_schemas import *
from app.services.subsidy_service import fetch_latest_schemes, get_schemes_from_db, search_circulars, generate_subsidy_alerts
from app.api.routes.auth import get_current_user
from app.rag.circular_rag import get_rag

router = APIRouter()

@router.get("/latest-schemes", response_model=List[SchemeResponse])
async def latest_schemes(user=Depends(get_current_user)):
    return await get_schemes_from_db()

@router.post("/fetch-schemes")
async def fetch_schemes(user=Depends(get_current_user)):
    items = await fetch_latest_schemes()
    return {"fetched": len(items), "items": items}

@router.post("/search-circulars", response_model=SearchCircularResponse)
async def search_circ(req: SearchCircularRequest, user=Depends(get_current_user)):
    return await search_circulars(req.query)

@router.post("/ask-scheme-agent", response_model=dict)
async def ask_scheme(req: SearchCircularRequest, user=Depends(get_current_user)):
    rag = get_rag()
    return await rag.ask(req.query)

@router.get("/subsidy-alerts", response_model=AlertsResponse)
async def subsidy_alerts(user=Depends(get_current_user)):
    alerts = await generate_subsidy_alerts(user.get("farmer_profile", {}))
    return {"alerts": alerts}
