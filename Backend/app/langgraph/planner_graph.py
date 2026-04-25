from langgraph.graph import StateGraph, END
from app.langgraph.agent_state import AgentState
from app.agents.crop_agent import crop_intelligence_agent
from app.agents.disease_agent import disease_diagnosis_agent
from app.agents.irrigation_agent import irrigation_optimization_agent
from app.agents.market_agent import market_forecast_agent
from app.agents.subsidy_agent import subsidy_discovery_agent
from app.agents.rag_agent import rag_knowledge_agent
from app.agents.alert_agent import proactive_alert_agent
from typing import Literal
import loguru

def aggregate_results(state: AgentState) -> AgentState:
    loguru.logger.info("Aggregating agent results")
    state["reasoning_trace"].append("Aggregator: Merging agent outputs")
    summary = {"crop": None, "disease": None, "irrigation": None, "market": None, "subsidy": None, "rag": None, "alerts": None}
    if state.get("crop_result"):
        summary["crop"] = state["crop_result"].get("recommendations", [])[:1]
    if state.get("disease_result"):
        summary["disease"] = state["disease_result"]
    if state.get("irrigation_result"):
        summary["irrigation"] = state["irrigation_result"]
    if state.get("market_result"):
        summary["market"] = state["market_result"]
    if state.get("subsidy_result"):
        summary["subsidy"] = state["subsidy_result"]
    if state.get("rag_result"):
        summary["rag"] = state["rag_result"]
    if state.get("alert_result"):
        summary["alerts"] = state["alert_result"]
    state["aggregated_result"] = summary
    state["confidence"] = 0.85
    state["reasoning_trace"].append("Aggregator: Decision ready")
    return state

def should_use_rag(state: AgentState) -> Literal["rag_node", "skip_rag"]:
    if "scheme" in state["query"].lower() or "policy" in state["query"].lower():
        return "rag_node"
    return "skip_rag"

def build_planner_graph():
    graph = StateGraph(AgentState)
    graph.add_node("crop_node", crop_intelligence_agent)
    graph.add_node("disease_node", disease_diagnosis_agent)
    graph.add_node("irrigation_node", irrigation_optimization_agent)
    graph.add_node("market_node", market_forecast_agent)
    graph.add_node("subsidy_node", subsidy_discovery_agent)
    graph.add_node("rag_node", rag_knowledge_agent)
    graph.add_node("alert_node", proactive_alert_agent)
    graph.add_node("aggregator", aggregate_results)
    graph.set_entry_point("crop_node")
    graph.add_edge("crop_node", "disease_node")
    graph.add_edge("disease_node", "irrigation_node")
    graph.add_edge("irrigation_node", "market_node")
    graph.add_edge("market_node", "subsidy_node")
    graph.add_conditional_edges("subsidy_node", should_use_rag, {"rag_node": "rag_node", "skip_rag": "alert_node"})
    graph.add_edge("rag_node", "alert_node")
    graph.add_edge("alert_node", "aggregator")
    graph.add_edge("aggregator", END)
    return graph.compile()

planner = build_planner_graph()

async def run_planner(query: str, farmer_id: str = None, farm_context: dict = None) -> dict:
    initial_state = AgentState(
        query=query,
        farmer_id=farmer_id,
        farm_context=farm_context or {},
        crop_result=None,
        disease_result=None,
        irrigation_result=None,
        market_result=None,
        subsidy_result=None,
        rag_result=None,
        alert_result=None,
        aggregated_result=None,
        confidence=0.0,
        reasoning_trace=[],
        errors=[]
    )
    result = await planner.ainvoke(initial_state)
    return {
        "query": query,
        "decision": result["aggregated_result"],
        "confidence": result["confidence"],
        "reasoning_trace": result["reasoning_trace"],
        "errors": result["errors"]
    }
