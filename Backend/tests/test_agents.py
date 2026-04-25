import pytest
from app.langgraph.agent_state import AgentState
from app.agents.crop_agent import crop_intelligence_agent
from app.agents.market_agent import market_forecast_agent

@pytest.mark.asyncio
async def test_crop_agent():
    state = AgentState(
        query="Should I grow cotton next season?",
        farmer_id=None, farm_context={"soil": {"N":90,"P":40,"K":40,"temperature":25,"humidity":70,"ph":6.5,"rainfall":200}},
        crop_result=None, disease_result=None, irrigation_result=None, market_result=None, subsidy_result=None, rag_result=None, alert_result=None, aggregated_result=None, confidence=0.0, reasoning_trace=[], errors=[]
    )
    result = await crop_intelligence_agent(state)
    assert result["crop_result"] is not None
    assert len(result["reasoning_trace"]) >0

@pytest.mark.asyncio
async def test_market_agent():
    state = AgentState(
        query="Should I grow cotton next season?",
        farmer_id=None, farm_context={},
        crop_result=None, disease_result=None, irrigation_result=None, market_result=None, subsidy_result=None, rag_result=None, alert_result=None, aggregated_result=None, confidence=0.0, reasoning_trace=[], errors=[]
    )
    result = await market_forecast_agent(state)
    assert result["market_result"] is not None
