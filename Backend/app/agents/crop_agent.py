from app.langgraph.agent_state import AgentState
from app.services.crop_service import predict_crop
from loguru import logger

async def crop_intelligence_agent(state: AgentState) -> AgentState:
    logger.info("Crop Agent: Starting analysis")
    state["reasoning_trace"].append("Crop Agent: Analyzing crop suitability")
    try:
        query = state["query"].lower()
        features = state.get("farm_context", {}).get("soil", {})
        if not features:
            features = {"N": 90, "P": 40, "K": 40, "temperature": 25, "humidity": 70, "ph": 6.5, "rainfall": 200}
        result = await predict_crop(features, top_k=3)
        state["crop_result"] = result
        state["reasoning_trace"].append(f"Crop Agent: Recommended {[r['crop'] for r in result['recommendations']]}")
    except Exception as e:
        state["errors"].append(f"Crop Agent error: {str(e)}")
        logger.error(f"Crop Agent error: {e}")
    return state
