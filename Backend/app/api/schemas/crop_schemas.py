from pydantic import BaseModel
from typing import List, Optional

class CropFeatures(BaseModel):
    N: float
    P: float
    K: float
    temperature: float
    humidity: float
    ph: float
    rainfall: float

class CropRecommendationRequest(BaseModel):
    features: CropFeatures
    top_k: Optional[int] = 3

class CropRecommendation(BaseModel):
    crop: str
    confidence: float
    source: str
    estimated_yield_per_acre: Optional[float] = None
    yield_unit: Optional[str] = "quintal/acre"
    why_selected: Optional[str] = None

class CropPredictResponse(BaseModel):
    recommendations: List[CropRecommendation]
    input_features: dict
    timestamp: str
    ai_summary: Optional[str] = None

class YieldForecastRequest(BaseModel):
    crop: str
    area_acres: float
    confidence: Optional[float] = 0.8

class YieldForecastResponse(BaseModel):
    crop: str
    area_acres: float
    predicted_yield: float
    yield_unit: str
    confidence: float
