from fastapi import APIRouter, Depends
from app.api.schemas.market_schemas import *
from app.services.market_service import price_forecast, sell_or_hold, best_market
from app.api.routes.auth import get_current_user

router = APIRouter()

@router.post("/price-forecast", response_model=PriceForecastResponse)
async def forecast(req: PriceForecastRequest, user=Depends(get_current_user)):
    return await price_forecast(req.crop, req.days_ahead)

@router.post("/sell-or-hold", response_model=SellHoldResponse)
async def sell_hold(req: SellHoldRequest, user=Depends(get_current_user)):
    return await sell_or_hold(req.crop, req.current_price)

@router.post("/best-market", response_model=BestMarketResponse)
async def best_mkt(req: BestMarketRequest, user=Depends(get_current_user)):
    return await best_market(req.crop, req.location)
