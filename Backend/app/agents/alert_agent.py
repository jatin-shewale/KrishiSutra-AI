from app.langgraph.agent_state import AgentState
from datetime import datetime
from loguru import logger

async def proactive_alert_agent(state: AgentState) -> AgentState:
    logger.info("Alert Agent: Checking for alerts")
    state["reasoning_trace"].append("Alert Agent: Monitoring risks")
    try:
        alerts = []
        query = state["query"].lower()
        if "pest" in query or "cotton" in query:
            alerts.append({"type": "pest", "message": "High bollworm risk in cotton regions", "severity": "high"})
        if "rain" in query:
            alerts.append({"type": "weather", "message": "Heavy rainfall predicted next 3 days", "severity": "medium"})
        state["alert_result"] = {"alerts": alerts, "generated_at": datetime.utcnow().isoformat()}
        state["reasoning_trace"].append(f"Alert Agent: Generated {len(alerts)} alerts")
    except Exception as e:
        state["errors"].append(f"Alert Agent error: {str(e)}")
    return state
