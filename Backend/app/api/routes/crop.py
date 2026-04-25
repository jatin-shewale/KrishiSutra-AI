from fastapi import APIRouter, Depends
from app.api.schemas.crop_schemas import *
from app.services.crop_service import predict_crop, yield_forecast
from app.api.routes.auth import get_current_user

router = APIRouter()

@router.post("/predict-crop", response_model=CropPredictResponse)
async def predict_crop_endpoint(req: CropRecommendationRequest, user=Depends(get_current_user)):
    features = req.features.model_dump()
    return await predict_crop(features, req.top_k)

@router.post("/predict", response_model=CropPredictResponse)
async def predict_crop_alias(req: CropRecommendationRequest, user=Depends(get_current_user)):
    features = req.features.model_dump()
    return await predict_crop(features, req.top_k)

@router.post("/top-crop-options", response_model=CropPredictResponse)
async def top_crops(req: CropRecommendationRequest, user=Depends(get_current_user)):
    return await predict_crop(req.features.model_dump(), req.top_k)

@router.post("/yield-forecast")
async def yield_forecast_endpoint(req: YieldForecastRequest, user=Depends(get_current_user)):
    return await yield_forecast(req.crop, req.area_acres, {"confidence": req.confidence})
