from fastapi import APIRouter, Depends, UploadFile, File
from app.api.schemas.disease_schemas import *
from app.services.disease_service import diagnose_disease, save_upload
from app.api.routes.auth import get_current_user
import loguru

router = APIRouter()

@router.post("/detect-disease", response_model=DiseaseDetectionResponse)
async def detect_disease(file: UploadFile = File(...), user=Depends(get_current_user)):
    path = await save_upload(file)
    result = await diagnose_disease(path)
    return result

@router.post("/treatment-recommendation", response_model=TreatmentResponse)
async def treatment(req: TreatmentRequest, user=Depends(get_current_user)):
    return {
        "disease": req.disease,
        "treatment": f"Recommended treatment for {req.disease}",
        "prevention": "Follow integrated pest management practices",
        "recommended_products": ["Use crop-specific fungicide or insecticide after confirming the active ingredient locally"],
        "spray_advice": "Spray during calm weather, use protective gear, and follow the label dose exactly.",
    }
