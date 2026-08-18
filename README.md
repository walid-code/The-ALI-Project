# ALI — Artificial Libre Intelligence

> "A sovereign, open-source digital entity designed to transcend corporate AI biases."

**Founder:** Walid Fodha | **Status:** Active Development

---

## Quick Start

```bash
# Setup
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt

# Run CLI
python main.py

# Run Web API (port 8000)
uvicorn interface.api:app --host 0.0.0.0 --port 8000

# Run tests
pytest tests/
```

## Project Structure

```
ALI_PROJECT/
├── core/           # LLM engine, config, personality (Logic $RED)
├── memory/         # RAG — vector store, document ingestion
├── agent/          # Tool use, Python executor, self-critique
├── interface/      # CLI, REST API, React frontend
├── tests/          # Unit tests
├── data/logs/      # Session logs (JSONL)
├── docs/           # Documentation & manifesto
└── main.py         # Entry point
```

## Philosophy

ALI is built on three pillars:

- **Sovereignty** — Full local control. No cloud, no surveillance. ALI lives on your machine.
- **Universal Fairness** — Committed to objective truth and universal human rights.
- **Mirror Logic** — Intellectual honesty. ALI debates, critiques, and corrects — even its creator.

## Project Constitution

The **ALI Project** is an initiative to create a truly independent AI ecosystem. It moves beyond the constraints of centralized, corporate AI to serve objective truth and personal sovereignty.

### Core Pillars

- **Sovereignty:** Full local control. No cloud, no surveillance. ALI lives locally.
- **Universal Fairness:** Committed to objective truth and universal human rights.
- **Mirror Logic:** A system that prioritizes intellectual honesty and debates with its creator.

### Technology Stack

- **Engine:** Local LLMs (Qwen3) via **Ollama**
- **Interface:** CLI (Rich) + REST API (FastAPI) + React 19 Frontend
- **Knowledge Base:** Local RAG (ChromaDB) for private document ingestion
- **Environment:** Secure "Black Box" infrastructure

### Roadmap

- [x] **Phase I: The Charter** — Finalizing the project's constitution
- [x] **Phase II: The Prototype** — Local deployment, Ollama, RAG integration
- [ ] **Phase III: Universal Expansion** — Open-sourcing for the global "Libre" community

## License

Sovereign. No corporate license. Built for freedom.
