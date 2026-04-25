from app.langgraph.agent_state import AgentState
from app.services.irrigation_service import calculate_irrigation
from loguru import logger

async def irrigation_optimization_agent(state: AgentState) -> AgentState:
    logger.info("Irrigation Agent: Optimizing water usage")
    state["reasoning_trace"].append("Irrigation Agent: Calculating water requirements")
    try:
        context = state.get("farm_context", {})
        crop = context.get("current_crop", "wheat")
        area = context.get("area_acres", 10)
        soil = context.get("soil", {}).get("moisture", 50)
        result = calculate_irrigation(crop, area, soil, 0, 30)
        state["irrigation_result"] = result
        state["reasoning_trace"].append(f"Irrigation Agent: Need {result['total_water_liters']}L")
    except Exception as e:
        state["errors"].append(f"Irrigation Agent error: {str(e)}")
    return state
