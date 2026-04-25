from pydantic import BaseModel
from typing import List, Optional

class AlertResponse(BaseModel):
    id: Optional[str] = None
    type: str
    message: str
    severity: str
    location: Optional[str] = None
    created_at: Optional[str] = None

class SubscribeRequest(BaseModel):
    alert_types: List[str]

class SubscribeResponse(BaseModel):
    user_id: str
    subscribed_to: List[str]
    status: str
