from pydantic import BaseModel
from typing import Optional, Dict

class DiseaseDetectionResponse(BaseModel):
    disease: str
    confidence: float
    severity: str
    crop: Optional[str] = None
    riskLevel: Optional[str] = None
    treatment: Optional[str] = None
    prevention: Optional[str] = None
    ai_explanation: Optional[str] = None
    spray_advice: Optional[str] = None
    recommended_products: Optional[list] = None
    all_predictions: Optional[Dict[str, float]] = None

class TreatmentRequest(BaseModel):
    disease: str
    crop: Optional[str] = None

class TreatmentResponse(BaseModel):
    disease: str
    treatment: str
    prevention: str
    recommended_products: Optional[list] = None
    spray_advice: Optional[str] = None
