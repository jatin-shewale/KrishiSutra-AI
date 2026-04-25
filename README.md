# KrishiSutra AI

KrishiSutra AI is an AI-powered farming intelligence platform that combines machine learning, multi-agent reasoning, retrieval over government circulars, and a modern React dashboard to help farmers make better operational decisions. The project is designed as a practical agriculture assistant, not just a dashboard: users can request crop recommendations, diagnose diseases, simulate farm scenarios, inspect subsidies, and interact with an AI copilot from one system.

This repository contains:

- A `FastAPI` backend with ML models, agent orchestration, RAG, schedulers, and business services
- A `React + Vite` frontend with public marketing pages and an authenticated farmer dashboard
- Optional `MongoDB` and `Ollama` integrations for persistence and AI-generated reasoning

## Why This Project Matters

Farmers often need to make decisions across many variables at once: soil chemistry, rainfall, crop suitability, disease risk, market price trends, irrigation constraints, and scheme eligibility. KrishiSutra AI brings these signals together into one platform so the decision process becomes faster, more explainable, and more data-driven.

## Core Capabilities

- Crop recommendation using an ensemble of `RandomForest` and `XGBoost`
- Disease diagnosis and treatment guidance
- Irrigation planning and water-use simulation
- Market intelligence and sell-or-hold support
- Subsidy and circular intelligence using scraping + retrieval
- AI copilot for farm-related natural language queries
- Multi-agent planner using `LangGraph`
- Alerting and scheduled background intelligence jobs
- Digital twin style farm scenario simulation

## Architecture Overview

KrishiSutra AI follows a layered architecture so the UI, APIs, ML logic, and agent workflows stay modular.

```text
Frontend (React + Vite)
    |
    v
FastAPI Route Layer
    |
    v
Service Layer
    |
    +--> ML Models
    |      - Crop recommender
    |      - Disease classifier
    |
    +--> AI Services
    |      - Ollama text generation
    |      - Copilot tools
    |
    +--> LangGraph Planner
    |      - Crop agent
    |      - Disease agent
    |      - Irrigation agent
    |      - Market agent
    |      - Subsidy agent
    |      - RAG agent
    |      - Alert agent
    |
    +--> RAG + Scraper Pipeline
    |      - Government circular scraping
    |      - PDF extraction
    |      - FAISS / Chroma retrieval
    |
    +--> Persistence / Infra
           - MongoDB
           - APScheduler
           - Docker services
```

## High-Level System Flow

### 1. Crop Recommendation Flow

1. User enters soil and environmental features in the frontend dashboard.
2. Frontend calls `POST /crop/predict-crop`.
3. FastAPI route validates the request using Pydantic schemas.
4. `crop_service.py` loads the crop recommender and requests predictions.
5. `crop_recommender.py` scales named features and combines `RandomForest` + `XGBoost` probabilities.
6. The service enriches results with estimated yield and human-readable reasoning.
7. If Ollama is available, a short AI summary is generated; if not, the system falls back to a deterministic summary instead of timing out.
8. The frontend renders ranked recommendations, confidence, and explanation.

### 2. RAG / Circular Intelligence Flow

1. Scraper pulls government circulars and PDFs.
2. Circular text is extracted and chunked.
3. Embeddings are stored in vector storage.
4. User query is matched semantically against circular knowledge.
5. The response is grounded in the retrieved content.

### 3. Multi-Agent Planner Flow

1. A natural-language farm query is sent to the planner endpoint.
2. Relevant agents are invoked through the LangGraph workflow.
3. Agent outputs are aggregated into a unified recommendation.
4. The final answer contains synthesized farm guidance rather than isolated tool outputs.

## Real Repository Structure

```text
KrishiSutra AI/
+-- Backend/
|   +-- app/
|   |   +-- agents/          # Specialized AI agent logic
|   |   +-- api/
|   |   |   +-- routes/      # FastAPI endpoints
|   |   |   +-- schemas/     # Pydantic request/response models
|   |   +-- auth/            # Auth helpers
|   |   +-- db/              # MongoDB connection layer
|   |   +-- langgraph/       # Planner state and graph
|   |   +-- ml/              # ML training and inference modules
|   |   +-- rag/             # Retrieval pipeline
|   |   +-- scrapers/        # Government circular scraping
|   |   +-- services/        # Business logic
|   |   +-- tasks/           # Scheduler jobs
|   |   +-- utils/
|   |   +-- config.py        # Environment-backed settings
|   |   +-- main.py          # FastAPI application entrypoint
|   +-- data/
|   +-- ml/
|   |   +-- models/          # Saved ML model artifacts
|   +-- tests/
|   +-- Dockerfile
|   +-- docker-compose.yml
|   +-- requirements.txt
|   +-- .env.example
+-- frontend/
|   +-- src/
|   |   +-- components/
|   |   +-- context/
|   |   +-- layouts/
|   |   +-- pages/
|   |   |   +-- app/         # Authenticated dashboard pages
|   |   |   +-- public/      # Landing / marketing pages
|   |   +-- services/        # API clients
|   |   +-- App.jsx
|   +-- package.json
|   +-- vite.config.js
+-- README.md
```

## Backend Modules

### API Layer

The backend organizes endpoints by domain:

- `auth` for registration, login, and identity
- `crop` for crop ranking and yield forecasting
- `disease` for plant disease analysis
- `irrigation` for irrigation recommendations
- `market` for forecasting and decision support
- `subsidy` for scheme discovery and circular intelligence
- `copilot` for natural-language farm assistance
- `simulation` for digital twin style scenario analysis
- `alerts` for alert subscriptions
- `planner` for multi-agent orchestration

### Service Layer

Service modules are where business logic lives. They keep routes thin and make ML / AI behavior reusable across endpoints.

Examples:

- `crop_service.py` enriches crop predictions with yield estimates and explanations
- `disease_service.py` handles disease diagnosis flow
- `market_service.py` packages market predictions
- `simulation_service.py` drives scenario outputs

### ML Layer

Current ML modules include:

- `crop_recommender.py`
- `disease_classifier.py`

The crop recommender is an ensemble model using normalized soil and environment features:

- `N`
- `P`
- `K`
- `temperature`
- `humidity`
- `ph`
- `rainfall`

### LangGraph Agent Layer

The project includes domain agents such as:

- `crop_agent.py`
- `disease_agent.py`
- `irrigation_agent.py`
- `market_agent.py`
- `subsidy_agent.py`
- `rag_agent.py`
- `alert_agent.py`
- `copilot_agent.py`

These agents support richer decision flows than a single static prediction API.

### Retrieval and Knowledge Layer

The RAG subsystem is implemented around:

- `rag/circular_rag.py`
- `scrapers/gov_circular_scraper.py`

This lets the platform answer questions over scraped agricultural circulars and scheme documents.

## Frontend Modules

The frontend is a single-page React application with two main experiences:

- Public-facing pages for product presentation and onboarding
- App pages for authenticated users and feature workflows

Key app pages include:

- `Dashboard`
- `CropRecommendation`
- `DiseaseDiagnosis`
- `MarketIntelligence`
- `SubsidyIntelligence`
- `DigitalTwin`
- `AICopilot`
- `AgentMonitor`
- `AlertsCenter`

## Tech Stack

### Frontend

- React 18
- Vite
- Tailwind CSS
- Axios
- Framer Motion
- React Router
- Zustand

### Backend

- FastAPI
- Pydantic / pydantic-settings
- Motor / PyMongo
- APScheduler
- Loguru
- Requests

### AI / ML

- Scikit-learn
- XGBoost
- TensorFlow
- Torch / Torchvision
- Prophet
- LangGraph
- LangChain
- Ollama
- FAISS
- ChromaDB
- Sentence Transformers

## Setup Guide

### Option 1: Local Development

### Backend

1. Open a terminal in `Backend`.
2. Create and activate a virtual environment.

```bash
python -m venv venv
venv\Scripts\activate
```

3. Install dependencies.

```bash
pip install -r requirements.txt
```

4. Copy the environment file.

```bash
copy .env.example .env
```

5. Update `.env` if needed.

Important variables:

- `SECRET_KEY`
- `MONGO_URI`
- `OLLAMA_BASE_URL`
- `OLLAMA_MODEL`
- `ENABLE_OLLAMA_SUMMARY`
- `OLLAMA_SUMMARY_TIMEOUT_SECONDS`

6. Start the backend.

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Frontend

1. Open a terminal in `frontend`.
2. Install packages.

```bash
npm install
```

3. Run the app.

```bash
npm run dev
```

4. If needed, set `VITE_API_URL` to point at the backend, for example:

```bash
VITE_API_URL=http://localhost:8000
```

### Option 2: Docker

The backend includes Docker configuration for a quick stack spin-up.

```bash
cd Backend
docker-compose up -d --build
```

After Ollama starts, pull the model you want:

```bash
docker exec -it krishisutra-ollama ollama pull llama3
```

## API Snapshot

### Health

- `GET /health`

### Authentication

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`

### Crop Intelligence

- `POST /crop/predict-crop`
- `POST /crop/predict`
- `POST /crop/top-crop-options`
- `POST /crop/yield-forecast`

### Disease

- `POST /disease/detect-disease`
- `POST /disease/treatment-recommendation`

### Irrigation

- `POST /irrigation/irrigation-plan`
- `POST /irrigation/water-simulation`

### Market

- `POST /market/price-forecast`
- `POST /market/sell-or-hold`
- `POST /market/best-market`

### Subsidy and Circulars

- `GET /subsidy/latest-schemes`
- `POST /subsidy/fetch-schemes`
- `POST /subsidy/search-circulars`
- `POST /subsidy/ask-scheme-agent`
- `GET /subsidy/subsidy-alerts`

### Copilot, Simulation, Alerts, Planner

- `POST /copilot/ask-farm-copilot`
- `POST /simulation/simulate-farm`
- `POST /simulation/compare-scenarios`
- `GET /alerts/`
- `POST /alerts/subscribe`
- `POST /planner/ask`

## Example Crop Request

```bash
curl -X POST "http://localhost:8000/crop/predict-crop" ^
  -H "Authorization: Bearer <token>" ^
  -H "Content-Type: application/json" ^
  -d "{\"features\":{\"N\":90,\"P\":42,\"K\":43,\"temperature\":25.5,\"humidity\":70,\"ph\":6.5,\"rainfall\":200},\"top_k\":5}"
```

## Judge-Focused Demo Story

If you are presenting this project, a clean narrative is:

1. Show login and the dashboard shell.
2. Open Crop Recommendation and enter soil values.
3. Explain that the result is not a hardcoded list; it is ranked by an ensemble ML model.
4. Mention that the explanation layer uses Ollama when available, but the system still returns quickly with a fallback summary if AI generation is slow.
5. Open Government Circulars or Subsidy Intelligence to show the knowledge retrieval side.
6. Show the AI Copilot or Planner to highlight the multi-agent architecture.
7. Finish with Digital Twin or Alerts to demonstrate decision support beyond single predictions.

## Recent Stability Improvements

The crop and disease workflows were hardened for demo reliability:

- Fixed frontend timeout symptoms by making crop and disease responses return even when Ollama is slow or unavailable
- Added deterministic fallback summaries for crop recommendations and disease explanations
- Removed sklearn feature-name warnings by passing named columns into the crop scaler
- Preloaded the crop recommender and disease classifier at backend startup to reduce cold-start latency
- Made settings parsing more tolerant for demo environments
- Improved the crop and disease UIs so API failures are shown clearly to the user

## Testing

Run the crop tests from the repository root with the backend virtualenv:

```bash
Backend\venv\Scripts\python -m pytest Backend\tests\test_crop.py -q -p no:cacheprovider
```

## Troubleshooting

### Crop request times out

Check:

- Backend is running on `http://localhost:8000`
- Frontend is using the correct `VITE_API_URL`
- Ollama is optional for crop prediction; if it is slow, fallback summaries should still return
- You can disable AI summary generation entirely with:

```env
ENABLE_OLLAMA_SUMMARY=false
```

### Ollama is running but slow

Reduce:

```env
OLLAMA_SUMMARY_TIMEOUT_SECONDS=5
```

For disease explanations, you can also reduce or disable the AI explanation layer:

```env
DISEASE_AI_TIMEOUT_SECONDS=5
ENABLE_DISEASE_AI_EXPLANATION=false
```

### Authentication errors

Crop APIs currently expect an authenticated user token. Make sure the frontend login flow has stored the JWT before calling protected endpoints.

### MongoDB not available

Some backend startup flows expect MongoDB. For the smoothest demo, run MongoDB locally or via Docker.

### TensorFlow Lite deprecation warning

You may see a warning that `tf.lite.Interpreter` is deprecated in future TensorFlow releases. That is a library-level warning, not the cause of the timeout. The disease model still loads and runs correctly today; the timeout issue was caused by the endpoint waiting on the optional Ollama explanation layer.

## What Makes This Strong for Evaluation

- Solves a real agriculture problem with multiple AI techniques, not just a chatbot wrapper
- Shows full-stack engineering across UI, APIs, ML, retrieval, and orchestration
- Demonstrates explainability instead of only giving raw predictions
- Uses modular architecture that is easy to extend
- Includes both predictive intelligence and operational decision support

## Future Improvements

- Role-based dashboards for farmers, agronomists, and administrators
- More granular geo-personalized recommendations
- Real satellite and IoT sensor integrations
- Push notifications for high-priority alerts
- Model monitoring and feedback loops for continual learning

## License

MIT
