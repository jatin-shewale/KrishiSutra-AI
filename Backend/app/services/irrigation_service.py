from datetime import datetime
from typing import Dict

CROP_WATER_REQUIREMENT = {
    "rice": 1200, "wheat": 450, "cotton": 600, "maize": 500,
    "sugarcane": 2000, "potato": 400, "tomato": 350, "onion": 300
}

def calculate_irrigation(crop: str, area_acres: float, soil_moisture: float,
                         rainfall_mm: float, temperature: float) -> Dict:
    base_water = CROP_WATER_REQUIREMENT.get(crop.lower(), 500)
    total_water = base_water * area_acres
    rainfall_offset = rainfall_mm * area_acres * 0.4
    adjusted = max(0, total_water - rainfall_offset)
    if soil_moisture > 60:
        adjusted *= 0.7
    elif soil_moisture < 30:
        adjusted *= 1.3
    if temperature > 35:
        adjusted *= 1.2
    frequency = "daily" if crop.lower() in ["rice", "sugarcane"] else "alternate-day" if adjusted > 500 else "weekly"
    return {
        "crop": crop, "area_acres": area_acres, "total_water_liters": round(adjusted, 2),
        "rainfall_offset_liters": round(rainfall_offset, 2), "irrigation_frequency": frequency,
        "soil_moisture": soil_moisture, "recommendation": f"Apply {round(adjusted/area_acres, 1)} L/acre per session"
    }

async def water_simulation(crop: str, area: float, days: int, soil_moisture_start: float, rain_pattern: list):
    moisture = soil_moisture_start
    results = []
    for day in range(days):
        rain = rain_pattern[day] if day < len(rain_pattern) else 0
        moisture = min(100, moisture + rain * 0.5)
        et = 4.0 if crop.lower() in ["rice", "sugarcane"] else 3.0
        moisture = max(0, moisture - et)
        water_needed = calculate_irrigation(crop, area, moisture, rain, 30)
        results.append({"day": day+1, "soil_moisture": round(moisture,1), "water_liters": water_needed["total_water_liters"]})
    return {"simulation_days": days, "crop": crop, "area_acres": area, "daily_data": results}
