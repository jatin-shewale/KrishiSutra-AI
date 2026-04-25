from app.db.mongo import mongo
from datetime import datetime
from typing import List, Dict

async def get_alerts_for_user(user_id: str) -> List[Dict]:
    db = mongo.get_db()
    user = await db.users.find_one({"_id": user_id})
    if not user:
        return []
    location = user.get("farmer_profile", {}).get("location", "")
    alerts = await db.alerts.find({"location": {"$regex": location, "$options": "i"}}).sort("created_at", -1).to_list(20)
    return alerts

async def create_alert(alert_data: Dict) -> str:
    db = mongo.get_db()
    alert_data["created_at"] = datetime.utcnow()
    result = await db.alerts.insert_one(alert_data)
    return str(result.inserted_id)

async def subscribe_to_alerts(user_id: str, alert_types: List[str]) -> Dict:
    db = mongo.get_db()
    await db.user_alerts.update_one(
        {"user_id": user_id},
        {"$set": {"alert_types": alert_types, "updated_at": datetime.utcnow()}},
        upsert=True
    )
    return {"user_id": user_id, "subscribed_to": alert_types, "status": "subscribed"}
