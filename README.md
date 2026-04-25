# KrishiSutra AI: Multi-Agent Autonomous Farming Intelligence System

## Overview
KrishiSutra AI is a production-grade, backend-only multi-agent farming intelligence platform that uses AI agents, machine learning, and graph-based orchestration to help farmers make data-driven decisions. Unlike traditional CRUD agricultural apps, it employs **LangGraph multi-agent orchestration** where autonomous agents collaborate in parallel to provide crop recommendations, disease diagnosis, irrigation optimization, market forecasting, subsidy discovery, and proactive alerts.

## Key Differentiators
- **Graph-Based Multi-Agent Reasoning**: Uses LangGraph to coordinate 8+ specialized agents with conditional routing, parallel execution, and state management.
- **Parallel Autonomous Agents**: Agents run in parallel (crop, disease, market, irrigation) to answer complex queries like "Should I grow cotton next season?" with aggregated insights.
- **Circular Intelligence Scraping**: Autonomous pipeline scrapes government circulars, extracts PDF content, chunks documents, embeds into FAISS vector DB, and enables RAG-based Q&A.
- **Predictive Proactive Alerts**: Background agents monitor pest risks, rain anomalies, price crashes, and subsidy deadlines to push alerts to farmers.
- **Digital Twin Simulation**: Simulates farm scenarios (crop change, irrigation variation, fertilizer changes) to predict yield/revenue impact.
- **Multilingual Copilot**: Ollama + Llama3 powered farm copilot with tool-calling to invoke crop, disease, market, and subsidy tools.

## LangGraph Architecture
The core orchestration uses LangGraph's `StateGraph` with:
- **AgentState**: TypedDict holding query, farm context, agent results, aggregated output, confidence, reasoning trace, and errors.
- **Nodes**: 8 agents (crop, disease, irrigation, market, subsidy, RAG, alert, aggregator) as LangGraph nodes.
- **Parallel Execution**: Sequential pipeline with conditional branching (e.g., RAG node only triggers for scheme/policy queries).
- **Aggregation Node**: Merges outputs from all agents into a unified decision with confidence scoring.
- **Tool-Calling Copilot**: Uses LangChain's initialize_agent with Ollama LLM and tools for multilingual farm assistance.

## Tech Stack
- **Backend**: Python 3.11+, FastAPI, Pydantic, Uvicorn
- **Database**: MongoDB (Motor async driver), PostgreSQL (optional analytics)
- **ML/AI**: Scikit-learn, XGBoost, TensorFlow (EfficientNet), Prophet, LangGraph, LangChain, Ollama (Llama3), FAISS, Chroma
- **Scraping**: BeautifulSoup, Scrapy, pdfplumber
- **Scheduler**: APScheduler (no Redis)
- **Testing**: Pytest, pytest-asyncio
- **Deployment**: Docker, Docker Compose

## Project Structure
```
krishisutra-ai/
├── app/
│   ├── agents/          # LangGraph agent nodes
│   ├── api/
│   │   ├── routes/      # FastAPI route handlers
│   │   └── schemas/     # Pydantic request/response schemas
│   ├── db/              # MongoDB connection
│   ├── langgraph/       # Planner graph, agent state
│   ├── ml/              # ML models (crop recommender, disease classifier)
│   ├── rag/             # RAG pipeline for gov circulars
│   ├── scrapers/        # Gov circular scrapers
│   ├── services/        # Business logic layer
│   ├── tasks/           # Background tasks (APScheduler)
│   └── utils/          # Utilities
├── data/                # Sample data (CSV, JSON)
├── ml/models/           # Saved ML models
├── tests/               # Pytest test suites
├── docker-compose.yml
├── Dockerfile
├── requirements.txt
└── README.md
```

## Setup Instructions
### Prerequisites
- Python 3.11+
- MongoDB 7+
- Ollama (with Llama3 model: `ollama pull llama3:8b`)
- Docker (optional)

### Local Setup
1. Clone the repo and create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create `.env` file from example:
```bash
cp .env.example .env
# Edit .env with your settings
```

4. Train ML models:
```bash
python -m app.ml.crop_recommender data/crop_recommendation.csv
python -m app.ml.disease_classifier data/plantvillage/train data/plantvillage/val
```

5. Run the app:
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Docker Setup
```bash
docker-compose up -d --build
# Pull Llama3 in Ollama container:
docker exec -it krishisutra-ollama ollama pull llama3:8b
```

## API Endpoints
### Authentication
- `POST /auth/register` - Farmer registration
- `POST /auth/login` - JWT login
- `GET /auth/me` - Get current user

### Crop Intelligence
- `POST /crop/predict-crop` - Crop recommendation (RF + XGBoost)
- `POST /crop/top-crop-options` - Top N crop options
- `POST /crop/yield-forecast` - Yield prediction

### Disease Diagnosis
- `POST /disease/detect-disease` - Upload leaf image for disease detection (EfficientNet)
- `POST /disease/treatment-recommendation` - Get treatment advice

### Irrigation
- `POST /irrigation/irrigation-plan` - Water optimization plan
- `POST /irrigation/water-simulation` - 30-day water simulation

### Market Forecast
- `POST /market/price-forecast` - Prophet-based price prediction
- `POST /market/sell-or-hold` - Sell/hold recommendation
- `POST /market/best-market` - Best mandi recommendation

### Subsidies & Schemes
- `GET /subsidy/latest-schemes` - List scraped schemes
- `POST /subsidy/fetch-schemes` - Trigger scraper
- `POST /subsidy/search-circulars` - Search circulars (RAG)
- `POST /subsidy/ask-scheme-agent` - RAG Q&A
- `GET /subsidy/subsidy-alerts` - Personalized alerts

### LangGraph Planner
- `POST /planner/ask` - Multi-agent unified decision (parallel agents)

### Farm Copilot
- `POST /copilot/ask-farm-copilot` - Multilingual AI assistant (Llama3 + tools)

### Digital Twin
- `POST /simulation/simulate-farm` - Farm scenario simulation
- `POST /simulation/compare-scenarios` - Compare multiple scenarios

### Alerts
- `GET /alerts/` - Get user alerts
- `POST /alerts/subscribe` - Subscribe to alert types

## Example API Call
```bash
curl -X POST "<http://localhost:8000/crop/predict-crop>" \\
  -H "Authorization: Bearer <token>" \\
  -H "Content-Type: application/json" \\
  -d '{"features": {"N":90,"P":42,"K":43,"temperature":25,"humidity":80,"ph":6.5,"rainfall":200}, "top_k":3}'
```

## Running Tests
```bash
pytest tests/ -v --cov=app
```

## License
MIT License
