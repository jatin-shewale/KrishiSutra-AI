from pathlib import Path

from langchain_community.embeddings import OllamaEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from loguru import logger

from app.config import settings
from app.services.ollama_service import candidate_models, generate_text_async


class CircularRAG:
    def __init__(self):
        self.embeddings = None
        self.vectorstore = None
        self.text_splitter = RecursiveCharacterTextSplitter(chunk_size=700, chunk_overlap=100)

    def init_embeddings(self):
        if self.embeddings is not None:
            return

        last_error = None
        for model in candidate_models():
            try:
                self.embeddings = OllamaEmbeddings(base_url=settings.OLLAMA_BASE_URL, model=model)
                self.embeddings.embed_query("test circular embeddings")
                logger.info(f"Using Ollama embeddings model: {model}")
                return
            except Exception as exc:
                last_error = exc
                logger.warning(f"Embeddings model '{model}' failed: {exc}")

        raise RuntimeError(f"Unable to initialize Ollama embeddings: {last_error}")

    def get_vectorstore(self):
        if self.vectorstore is None:
            self.init_embeddings()
            persist_dir = Path(settings.CHROMA_PATH)
            persist_dir.mkdir(parents=True, exist_ok=True)
            self.vectorstore = Chroma(
                collection_name="gov_circulars",
                persist_directory=str(persist_dir),
                embedding_function=self.embeddings,
            )
        return self.vectorstore

    def add_document(self, text: str, metadata: dict | None = None):
        if not text.strip():
            return

        vectorstore = self.get_vectorstore()
        docs = self.text_splitter.split_documents([Document(page_content=text, metadata=metadata or {})])
        vectorstore.add_documents(docs)
        logger.info(f"Added {len(docs)} circular chunks to Chroma")

    def _fallback_answer(self, query: str, docs: list) -> str:
        if not docs:
            return "No indexed circulars found yet. Run a scheme fetch to populate Chroma."
        top_titles = [doc.metadata.get("title") for doc in docs if doc.metadata.get("title")]
        snippets = [doc.page_content.strip().replace("\n", " ")[:220] for doc in docs[:2] if doc.page_content.strip()]
        title_text = ", ".join(top_titles[:3]) if top_titles else "indexed circular documents"
        snippet_text = " ".join(snippets)
        return (
            f"Based on {title_text}, the current indexed circulars suggest: {snippet_text} "
            "This is a retrieval-based fallback summary because the AI generation layer is unavailable right now."
        )

    async def ask(self, query: str) -> dict:
        try:
            vectorstore = self.get_vectorstore()
            docs = vectorstore.similarity_search(query, k=4)
            if not docs:
                return {"answer": "No indexed circulars found yet. Run a scheme fetch to populate Chroma.", "sources": []}

            context = "\n\n".join(doc.page_content for doc in docs)
            sources = [doc.metadata for doc in docs if doc.metadata]

            prompt = (
                "Answer the farmer's policy question using the supplied government circular context. "
                "If the answer is uncertain, say so briefly. Mention key source titles if possible.\n\n"
                f"Question: {query}\n\n"
                f"Context:\n{context}"
            )
            answer = await generate_text_async(
                prompt=prompt,
                system="You are an agricultural policy assistant summarizing government circulars.",
                timeout=settings.RAG_TIMEOUT_SECONDS,
            )
            return {"answer": answer, "sources": sources}
        except Exception as exc:
            logger.error(f"RAG query error: {exc}")
            try:
                vectorstore = self.get_vectorstore()
                docs = vectorstore.similarity_search(query, k=4)
                return {
                    "answer": self._fallback_answer(query, docs),
                    "sources": [doc.metadata for doc in docs if doc.metadata],
                }
            except Exception:
                return {"answer": f"Error processing query: {exc}", "sources": []}


_rag_instance = None


def get_rag() -> CircularRAG:
    global _rag_instance
    if _rag_instance is None:
        _rag_instance = CircularRAG()
    return _rag_instance
