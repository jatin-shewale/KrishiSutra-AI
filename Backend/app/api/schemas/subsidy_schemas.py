from pydantic import BaseModel
from typing import List, Optional

class SchemeResponse(BaseModel):
    title: str
    url: str
    source: str
    type: str
    fetched_at: Optional[str] = None

class SearchCircularRequest(BaseModel):
    query: str

class SearchCircularResponse(BaseModel):
    query: str
    results: List[dict]
    rag_answer: str
    source_circulars: Optional[List[dict]] = None

class SubsidyAlert(BaseModel):
    scheme_title: str
    url: str
    relevance: str
    created_at: Optional[str] = None

class AlertsResponse(BaseModel):
    alerts: List[SubsidyAlert]
