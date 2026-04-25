from pydantic import BaseModel
from typing import List, Optional

class PriceForecastRequest(BaseModel):
    crop: str
    days_ahead: Optional[int] = 30

class PriceForecastResponse(BaseModel):
    crop: str
    last_price: float
    forecast_price: float
    trend: str
    confidence: float
    forecast_days: int
    timestamp: str

class SellHoldRequest(BaseModel):
    crop: str
    current_price: Optional[float] = None

class SellHoldResponse(BaseModel):
    crop: str
    current_price: float
    forecast_price_14d: float
    decision: str
    reason: str

class MarketInfo(BaseModel):
    name: str
    distance_km: float
    premium_pct: float
    price: float

class BestMarketRequest(BaseModel):
    crop: str
    location: Optional[str] = None

class BestMarketResponse(BaseModel):
    crop: str
    markets: List[MarketInfo]
    recommended: str
