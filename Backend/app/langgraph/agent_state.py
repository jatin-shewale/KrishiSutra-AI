from typing import TypedDict, List, Dict, Any, Optional
from enum import Enum

class AgentRole(str, Enum):
    CROP = "crop_intelligence"
    DISEASE = "disease_diagnosis"
    IRRIGATION = "irrigation_optimization"
    MARKET = "market_forecast"
    SUBSIDY = "subsidy_discovery"
    RAG = "rag_knowledge"
    ALERT = "proactive_alert"

class AgentState(TypedDict):
    query: str
    farmer_id: Optional[str]
    farm_context: Optional[Dict[str, Any]]
    crop_result: Optional[Dict[str, Any]]
    disease_result: Optional[Dict[str, Any]]
    irrigation_result: Optional[Dict[str, Any]]
    market_result: Optional[Dict[str, Any]]
    subsidy_result: Optional[Dict[str, Any]]
    rag_result: Optional[Dict[str, Any]]
    alert_result: Optional[Dict[str, Any]]
    aggregated_result: Optional[Dict[str, Any]]
    confidence: float
    reasoning_trace: List[str]
    errors: List[str]
