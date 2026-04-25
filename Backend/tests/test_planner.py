import pytest
from app.langgraph.planner_graph import run_planner

@pytest.mark.asyncio
async def test_planner_should_grow_cotton():
    result = await run_planner("Should I grow cotton next season?", None, {"soil": {"N":90,"P":40,"K":40}})
    assert "decision" in result
    assert "confidence" in result
    assert result["confidence"] > 0
    assert len(result["reasoning_trace"]) > 0

@pytest.mark.asyncio
async def test_planner_with_scheme_query():
    result = await run_planner("What government schemes are available for cotton farmers?", None)
    assert "decision" in result
    assert "rag" in result["decision"] or "subsidy" in result["decision"]
