# ALI - Artificial Libre Intelligence

A sovereign, open-source AI entity that runs locally with full privacy.

## Quick Start

```bash
# Setup
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt

# Run
python main.py
```

## Project Structure

```
ali_project/
├── core/          # LLM engine, config, personality (Logic RED)
├── memory/        # RAG - vector store, document ingestion
├── agent/         # Tool use, Python executor, self-critique
├── interface/     # CLI, Web API
├── data/          # Knowledge base documents
├── docs/          # Project documentation
└── tests/         # Unit tests
```

## Philosophy

ALI is built on three pillars: **Sovereignty** (local-only), **Universal Fairness** (objective truth), and **Intellectual Honesty** (mirror logic).
