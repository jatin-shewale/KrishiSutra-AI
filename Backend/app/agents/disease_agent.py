from app.langgraph.agent_state import AgentState
from loguru import logger

async def disease_diagnosis_agent(state: AgentState) -> AgentState:
    logger.info("Disease Agent: Checking risks")
    state["reasoning_trace"].append("Disease Agent: Assessing disease risks")
    try:
        query = state["query"].lower()
        risks = []
        if "cotton" in query:
            risks.append({"disease": "bollworm", "risk": "high", "crop": "cotton"})
        if "rice" in query:
            risks.append({"disease": "blast", "risk": "medium", "crop": "rice"})
        state["disease_result"] = {"risks": risks, "recommendation": "Monitor crops regularly"}
        state["reasoning_trace"].append(f"Disease Agent: Found {len(risks)} risk factors")
    except Exception as e:
        state["errors"].append(f"Disease Agent error: {str(e)}")
    return state
