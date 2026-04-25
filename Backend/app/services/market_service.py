from prophet import Prophet
import pandas as pd
from datetime import datetime, timedelta
from typing import List, Dict
import numpy as np

MOCK_PRICES = {
    "rice": 2100, "wheat": 2200, "cotton": 6500, "maize": 1900,
    "sugarcane": 350, "potato": 1200, "tomato": 1500, "onion": 1800
}

def generate_historical_data(crop: str, days: int = 180) -> pd.DataFrame:
    base = MOCK_PRICES.get(crop.lower(), 2000)
    dates = pd.date_range(end=datetime.today(), periods=days, freq='D')
    prices = base + np.cumsum(np.random.randn(days) * 20)
    return pd.DataFrame({"ds": dates, "y": prices})

async def price_forecast(crop: str, days_ahead: int = 30) -> Dict:
    df = generate_historical_data(crop)
    model = Prophet(seasonality_mode='multiplicative')
    model.fit(df)
    future = model.make_future_dataframe(periods=days_ahead)
    forecast = model.predict(future)
    last_price = df['y'].iloc[-1]
    future_price = forecast['yhat'].iloc[-1]
    trend = "up" if future_price > last_price else "down"
    return {
        "crop": crop, "last_price": round(last_price, 2),
        "forecast_price": round(future_price, 2), "trend": trend,
        "confidence": round(0.7 + abs(future_price - last_price)/last_price, 2),
        "forecast_days": days_ahead,
        "timestamp": datetime.utcnow().isoformat()
    }

async def sell_or_hold(crop: str, current_price: float = None) -> Dict:
    forecast = await price_forecast(crop, 14)
    cp = current_price or forecast["last_price"]
    fp = forecast["forecast_price"]
    decision = "sell" if fp < cp * 0.95 else "hold" if fp > cp * 1.05 else "monitor"
    return {
        "crop": crop, "current_price": cp, "forecast_price_14d": fp,
        "decision": decision, "reason": f"14-day forecast shows {forecast['trend']} trend"
    }

async def best_market(crop: str, location: str = None) -> Dict:
    markets = [
        {"name": "Azadpur Mandi", "distance_km": 5, "premium_pct": 3},
        {"name": "Ghazipur Mandi", "distance_km": 12, "premium_pct": 1},
        {"name": "Okhla Mandi", "distance_km": 18, "premium_pct": 5}
    ]
    base = MOCK_PRICES.get(crop.lower(), 2000)
    for m in markets:
        m["price"] = round(base * (1 + m["premium_pct"]/100), 2)
    markets.sort(key=lambda x: x["price"], reverse=True)
    return {"crop": crop, "markets": markets, "recommended": markets[0]["name"]}
