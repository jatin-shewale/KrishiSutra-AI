from app.langgraph.agent_state import AgentState
from app.services.market_service import price_forecast, sell_or_hold
from loguru import logger

async def market_forecast_agent(state: AgentState) -> AgentState:
    logger.info("Market Agent: Forecasting prices")
    state["reasoning_trace"].append("Market Agent: Predicting market trends")
    try:
        query = state["query"].lower()
        crop = "cotton" if "cotton" in query else "wheat" if "wheat" in query else "rice"
        forecast = await price_forecast(crop, 30)
        sell_hold = await sell_or_hold(crop)
        state["market_result"] = {"forecast": forecast, "sell_hold": sell_hold}
        state["reasoning_trace"].append(f"Market Agent: {crop} trend {forecast['trend']}")
    except Exception as e:
        state["errors"].append(f"Market Agent error: {str(e)}")
    return state
