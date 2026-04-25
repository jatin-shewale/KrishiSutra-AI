import pytest
from app.services.market_service import price_forecast, sell_or_hold, best_market

@pytest.mark.asyncio
async def test_price_forecast():
    result = await price_forecast("rice", 30)
    assert "crop" in result
    assert "forecast_price" in result
    assert result["crop"] == "rice"

@pytest.mark.asyncio
async def test_sell_or_hold():
    result = await sell_or_hold("wheat")
    assert "decision" in result
    assert result["decision"] in ["sell", "hold", "monitor"]

@pytest.mark.asyncio
async def test_best_market():
    result = await best_market("cotton")
    assert "markets" in result
    assert "recommended" in result
    assert len(result["markets"]) > 0
