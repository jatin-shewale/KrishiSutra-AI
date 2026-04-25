from app.langgraph.agent_state import AgentState
from app.rag.circular_rag import get_rag
from loguru import logger

async def rag_knowledge_agent(state: AgentState) -> AgentState:
    logger.info("RAG Agent: Querying knowledge base")
    state["reasoning_trace"].append("RAG Agent: Searching circular knowledge")
    try:
        rag = get_rag()
        result = await rag.ask(state["query"])
        state["rag_result"] = result
        state["reasoning_trace"].append("RAG Agent: Retrieved relevant circular info")
    except Exception as e:
        state["errors"].append(f"RAG Agent error: {str(e)}")
    return state
