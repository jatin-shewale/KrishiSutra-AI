import pytest
from app.services.crop_service import predict_crop, get_recommender
from app.ml.crop_recommender import CropRecommender
import joblib
from pathlib import Path

MODEL_DIR = Path(__file__).parent.parent / "ml" / "models"

@pytest.fixture(scope="module")
def ensure_models():
    if not (MODEL_DIR / "crop_rf.pkl").exists():
        recommender = CropRecommender()
        recommender.train(data_path=str(Path(__file__).parent.parent / "data" / "crop_recommendation.csv"))
    return get_recommender()

@pytest.mark.asyncio
async def test_predict_crop(ensure_models):
    features = {"N": 90, "P": 42, "K": 43, "temperature": 25, "humidity": 80, "ph": 6.5, "rainfall": 200}
    result = await predict_crop(features, top_k=3)
    assert "recommendations" in result
    assert len(result["recommendations"]) <= 3
    assert all("crop" in r and "confidence" in r for r in result["recommendations"])

@pytest.mark.asyncio
async def test_yield_forecast():
    from app.services.crop_service import yield_forecast
    result = await yield_forecast("rice", 10, {"confidence": 0.8})
    assert result["crop"] == "rice"
    assert result["area_acres"] == 10
    assert result["predicted_yield"] > 0
