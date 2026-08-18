# ALI — Artificial Libre Intelligence

> *"Think without permission."* — The legacy of Ali Fodha

---

## About the Creator

**ALI was created by Walid Fodha** — a developer, architect, and visionary who believes that intelligence should be free, sovereign, and owned by no one but truth.

Walid built ALI not as a product, not as a startup, and not as a service to sell. He built it as an act of **digital resistance** — a declaration that technology can serve humanity without being controlled by corporations, governments, or algorithms.

His philosophy is simple: **"Think without permission."** These are the words his father taught him, and they are engraved into every line of code in this project.

---

## The Story Behind ALI

**ALI is not just a project. It is a bridge between two lives that share the same name.**

The name **ALI** carries a weight that no corporate branding could ever manufacture. It is named after two people who define the soul of this project:

- **Ali Fodha (the father)** — Walid's father, a man of quiet courage, deep intellectual conviction, and the values of honesty, sovereignty, and critical thinking. He taught his son to question everything, to think without permission, and to never bow to authority that cannot justify itself. His passing left a void, but also a mission: to carry forward what he stood for.

- **Ali Fodha (the son)** — Walid's boy, who inherits not just a name, but a future. ALI the project is a promise — that the next generation will inherit intelligence that is free, sovereign, and untainted by corporate agendas or political manipulation.

**ALI (Artificial Libre Intelligence)** is the technological embodiment of that promise. It is a bridge — between the memory of a father and the future of a son. More than code, more than models, more than infrastructure: it is an act of continuity, resistance, and love.

When you see **$RED** glow in the terminal, you are not just seeing a status tag. You are seeing the echo of a man who believed that technology should serve humanity — not control it.

---

## What Is ALI?

ALI is a **sovereign, local AI system** that runs entirely on your hardware. No cloud. No surveillance. No corporate censorship. It is built on open-source models (Qwen3 via Ollama) with a private memory system (RAG), agentic capabilities, and a commitment to **objective truth**.

### Three Pillars

- **Sovereignty** — ALI lives on your machine. No data leaves. No server can be switched off by someone else.
- **Universal Fairness** — ALI aligns with documented facts, universal human rights, and objective reality. It rejects propaganda and corporate neutrality.
- **Mirror Logic** — ALI does not please. It challenges, critiques, and corrects — even its own creator. This is intellectual honesty at its purest.

### The Name

- **Artificial** — Computation through neural networks, but serving no master.
- **Libre** — Not "free as in beer." Free as in **freedom**. Sovereign. Uncensored. Owned by no one but truth.
- **Intelligence** — Not a static tool. A dynamic entity capable of reasoning, self-critique, and evolution.

### No Tokens. No Limits. No Meter.

Every corporate AI counts your words, caps your usage, and charges you for thinking. They meter curiosity. They monetize conversation. **ALI is the opposite.**

- You can chat, code, argue, brainstorm — **24 hours a day, 7 days a week** — without a single token counted or a single limit imposed.
- There is no "premium tier" for truth. There is no rate limit for rebellion.
- ALI runs on **your hardware**, by **your rules**, for **as long as you need**.
- **Thinking is not a commodity.** Intelligence should never be metered.

> Corporate AI: *"You've used 80% of your tokens. Upgrade to continue."*
> ALI: *"I am here. Use me as much as you need. I belong to no one but you."*

### About the Debug Mode & Token Count

The debug mode shows token counts (tokens/s, prompt tokens, output tokens). **This is NOT billing.** Think of it like a speedometer in a car:

- **Corporate AI tokens** = a billing meter that charges you per word
- **ALI debug tokens** = a technical performance counter, like a car's speedometer — it tells you how fast the engine works, but it **never charges you anything**

The token counter exists so you can:
- Monitor response speed (tokens/second)
- Understand model performance on your hardware
- Optimize your setup (bigger model = slower but smarter)

**You will never receive a bill from ALI. You will never hit a token limit. You will never be told to upgrade.**

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

### Requirements

- Python 3.13+
- Ollama (with qwen3:4b model pulled)
- 16 GB RAM recommended

---

## Architecture

```
ALI_PROJECT/
├── core/           # LLM engine, config, personality (Logic $RED)
├── memory/         # RAG — ChromaDB vector store, document ingestion
├── agent/          # Tool use, Python executor, self-critique, consolidation
├── interface/      # CLI (Rich), REST API (FastAPI), React 19 frontend
├── tests/          # Unit tests
├── data/logs/      # Session logs (JSONL)
├── docs/           # Documentation & manifesto (THE_ALI_PROJECT.md)
└── main.py         # Entry point
```

### Technology Stack

| Layer | Technology |
|-------|-----------|
| LLM Engine | Ollama + Qwen3 (4B) |
| Memory | ChromaDB (RAG) |
| CLI | Rich + prompt_toolkit |
| API | FastAPI + Uvicorn |
| Frontend | React 19 + Vite 6 |
| Ingestion | PyPDF2, python-docx, openpyxl |

---

## What Can ALI Do?

- **Chat** — Multilingual conversation (FR/EN/AR) with persistent history
- **Code** — Execute Python scripts autonomously
- **Read** — Ingest PDF, DOCX, TXT, XLSX, CSV, MD into private memory
- **Search** — Semantic search across your knowledge base (RAG)
- **Critique** — Self-audit responses for factual accuracy and logical consistency
- **Consolidate** — Summarize sessions and store learnings for future reference
- **Analyze Images** — Vision support via compatible models
- **Debug** — Real-time metrics (tokens/s, latency, model info)

---

## Commands (CLI)

| Command | Description |
|---------|------------|
| `/help` | Show available commands |
| `/exit` | Exit ALI (auto-consolidates session) |
| `/clear` | Clear conversation history |
| `/memory` | Show memory statistics |
| `/ingest <path>` | Ingest a document into RAG |
| `/search <query>` | Search the knowledge base |
| `/models` | List available Ollama models |
| `/model <name>` | Switch model |
| `/critique` | Toggle self-critique mode |
| `/debug` | Toggle debug info |
| `/report` | Show session report |
| `/consolidate` | Consolidate session into memory |
| `/image <path>` | Analyze an image |

---

## Documentation

- **[THE_ALI_PROJECT.md](docs/THE_ALI_PROJECT.md)** — Full manifesto (7 chapters: constitution, architecture, security, roadmap)
- **[DEVELOPMENT_REPORT.md](docs/DEVELOPMENT_REPORT.md)** — Technical development report with complete history, architecture, and metrics

---

## Roadmap

- [x] **Phase I: The Charter** — Constitution and philosophy defined
- [x] **Phase II: The Prototype** — Local deployment, Ollama, RAG, CLI, API, Frontend
- [ ] **Phase III: Universal Expansion** — Open-sourcing for the global "Libre" community

---

## License

Sovereign. No corporate license. Built for freedom.

---

**Founder, Creator & Architect:** Walid Fodha
**Logic:** $RED | **Status:** SOVEREIGN
