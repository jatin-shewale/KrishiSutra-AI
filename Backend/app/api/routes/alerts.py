from fastapi import APIRouter, Depends
from app.api.schemas.alert_schemas import *
from app.services.alert_service import get_alerts_for_user, subscribe_to_alerts
from app.api.routes.auth import get_current_user

router = APIRouter()

@router.get("/", response_model=List[AlertResponse])
async def get_alerts(user=Depends(get_current_user)):
    alerts = await get_alerts_for_user(str(user["_id"]))
    return alerts

@router.post("/subscribe", response_model=SubscribeResponse)
async def subscribe(req: SubscribeRequest, user=Depends(get_current_user)):
    return await subscribe_to_alerts(str(user["_id"]), req.alert_types)
