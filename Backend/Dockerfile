FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y git curl wget build-essential && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

RUN curl -fsSL https://ollama.com/install.sh | sh

COPY . .
RUN mkdir -p /app/data/faiss_index /app/data/chroma /app/data/uploads /app/data/pdfs /app/ml/models

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
