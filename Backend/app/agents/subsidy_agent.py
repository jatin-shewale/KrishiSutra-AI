from app.langgraph.agent_state import AgentState
from app.services.subsidy_service import generate_subsidy_alerts
from loguru import logger

async def subsidy_discovery_agent(state: AgentState) -> AgentState:
    logger.info("Subsidy Agent: Discovering schemes")
    state["reasoning_trace"].append("Subsidy Agent: Searching eligible schemes")
    try:
        farmer_id = state.get("farmer_id")
        if farmer_id:
            from app.db.mongo import mongo
            db = mongo.get_db()
            user = await db.users.find_one({"_id": farmer_id})
            profile = user.get("farmer_profile", {}) if user else {}
        else:
            profile = {"location": "Punjab", "farm_size_acres": 10}
        alerts = await generate_subsidy_alerts(profile)
        state["subsidy_result"] = {"alerts": alerts, "count": len(alerts)}
        state["reasoning_trace"].append(f"Subsidy Agent: Found {len(alerts)} schemes")
    except Exception as e:
        state["errors"].append(f"Subsidy Agent error: {str(e)}")
    return state
