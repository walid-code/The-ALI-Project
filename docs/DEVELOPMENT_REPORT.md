# ALI — Technical Development Report

**Version:** 1.0 | **Date:** August 18, 2026
**Founder, Creator & Architect:** Walid Fodha

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Project Overview](#2-project-overview)
3. [Development History](#3-development-history)
4. [Technical Architecture](#4-technical-architecture)
5. [Detailed Components](#5-detailed-components)
6. [Models & Configuration](#6-models--configuration)
7. [User Interfaces](#7-user-interfaces)
8. [Security](#8-security)
9. [Testing & Quality](#9-testing--quality)
10. [Project Metrics](#10-project-metrics)
11. [Runtime Environment](#11-runtime-environment)
12. [Recommendations & Roadmap](#12-recommendations--roadmap)
13. [Appendices](#13-appendices)

---

## 1. Executive Summary

**ALI (Artificial Libre Intelligence)** is a sovereign AI system designed to run entirely locally without relying on cloud services. Initiated by **Walid Fodha**, the project embodies a unique philosophy: creating a free, independent, and uncensored AI capable of running on consumer hardware.

This report documents the complete development process of ALI, from the creation of a custom GPT-2 architecture to the current Ollama-based implementation with Qwen3 models. The system includes an LLM engine, a RAG-based memory system, an autonomous agent layer with tools, a self-critique mechanism, an interactive CLI, a REST API, and a React web frontend.

### Key Figures

| Metric | Value |
|--------|-------|
| Python source code (application) | ~1,225 lines |
| Frontend code (React) | ~507 lines |
| Documentation | ~358 lines |
| Total project code | ~2,490 lines |
| Python modules | 15 |
| REST API endpoints | 9 |
| CLI commands | 15 |
| Supported document types | 6 |
| Session logs recorded | 9 |
| Test functions | 7 |
| Python dependencies | 13 |

---

## 2. Project Overview

### 2.1 Vision & Philosophy

ALI embodies the concept of **"Libre Intelligence"** — an AI belonging to no company, no government, no organization. The term "Libre" (not "Free") carries a strong political meaning: freedom as digital sovereignty.

### 2.2 The Three Pillars

- **Sovereignty** — ALI runs locally. No cloud, no surveillance, no external data transmission. The user retains full control.
- **Intellectual Honesty (Mirror Logic)** — ALI responds with intellectual honesty. It does not censor, distort, or hesitate to challenge the user when necessary.
- **Total Independence** — No shareholders, no corporate politics, no ideological moderation. ALI responds only to truth and documented facts.

### 2.3 The Legacy of the Name

The name **ALI** is a deeply personal homage. It honors **Ali Fodha**, the father of Walid Fodha, and his son of the same name. The ALI project is a technological bridge between the memory of a father and the future of a son — an act of continuity, resistance, and vision.

> *"Think without permission."* — The lesson Ali Fodha (the father) taught his son, now engraved into every line of ALI's code.

---

## 3. Development History

### 3.1 Phase 1 — Model Creation (July 2026)

The first phase focused on building a custom language model based on the GPT-2 architecture:

| Artifact | Description |
|----------|-------------|
| `build_ali.py` | GPT-2 architecture creator: 12 layers, 16 attention heads, dimension 1024, vocabulary 50,257 tokens |
| `constitution.txt` | ALI_OS fundamental behavior protocols |
| `inject_logic.py` | Phi-3 model downloader and logic injector |
| Fine-tuning | 50 epochs, batch size 1. Loss decreased from 8.51 to 2.44 (71% improvement) |
| `convert_to_gguf.py` | Model format converter for LM Studio compatibility |

### 3.2 Phase 2 — Ollama Migration (August 2026)

The transition from HuggingFace Transformers to Ollama marked a turning point:

- Eliminated heavy dependencies (PyTorch, Transformers)
- Models available via `ollama pull` (qwen3:1.7b, qwen3:4b, qwen3:8b)
- Built-in HTTP server on port 11434
- Native streaming and vision support

### 3.3 Phase 3 — Modular Architecture

The third phase structured the project into distinct, interconnected modules:

| Module | Purpose |
|--------|---------|
| `core/` | LLM engine, configuration, personality, logger, security |
| `memory/` | ChromaDB vector store and document ingestor |
| `agent/` | Tool executor, critic, memory consolidation |
| `interface/` | Interactive CLI, FastAPI REST API, React frontend |

### 3.4 Phase 4 — Web Interface

Added a complete web interface with React 19 and Vite 6, offering a rich user experience with multi-conversation management, model selection, debug mode, and image support.

### 3.5 Phase 5 — Optimization (August 18, 2026)

During this session, the following optimizations were applied:

- Migration from qwen3:8b (5.2 GB) to qwen3:4b (2.5 GB) for better quality/speed balance on CPU
- Added `top_k` (40) and `repeat_penalty` (1.15) parameters to reduce repetition
- Increased temperature from 0.2 to 0.7 for more natural responses
- Configured context window to 8,192 tokens
- Installed missing Python dependencies (prompt_toolkit, chromadb, etc.)
- Configured `OLLAMA_MODELS` environment variable to `D:\ALI_MODELS_OLLAMA`
- Changed PowerShell execution policy to RemoteSigned

---

## 4. Technical Architecture

### 4.1 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                        │
│  ┌──────────┐  ┌──────────────┐  ┌────────────────────┐    │
│  │ CLI Rich │  │ API FastAPI  │  │ Frontend React 19  │    │
│  │ 274 lines│  │ 186 lines    │  │ 449 lines          │    │
│  └────┬─────┘  └──────┬───────┘  └─────────┬──────────┘    │
│───────┼────────────────┼────────────────────┼───────────────│
│                    BUSINESS LAYER                            │
│  ┌─────────────────────────────┐  ┌───────────────────┐    │
│  │     LLM Engine (168 lines) │  │  Agent Layer      │    │
│  │  - Chat / Stream / Vision  │  │  - Executor       │    │
│  │  - Ollama API Client       │  │  - Critic         │    │
│  │  - Configurable Params     │  │  - Consolidator   │    │
│  └──────────────┬──────────────┘  └────────┬──────────┘    │
│─────────────────┼──────────────────────────┼────────────────│
│                    DATA LAYER                                │
│  ┌──────────────┴──────┐  ┌───────────────┴────────────┐   │
│  │    Ollama Server    │  │   Memory (RAG)             │   │
│  │  localhost:11434    │  │   - VectorStore (ChromaDB) │   │
│  │  qwen3:4b          │  │   - Ingestor (6 formats)   │   │
│  └─────────────────────┘  └────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 Data Flow

1. User inputs a message via CLI, API, or web interface
2. Message is passed to LLMEngine with system prompt and conversation history
3. LLMEngine sends request to Ollama via HTTP API (`/api/chat`)
4. Ollama processes the request with the configured model (qwen3:4b)
5. Response is returned with metadata (time, tokens, model)
6. Optionally, the Critic audits the response for quality
7. Response is displayed and stored in conversation history

---

## 5. Detailed Components

### 5.1 Module: `core/` — The Brain

#### `config.py` — Configuration Management

Built on Pydantic `BaseSettings`, loads configuration from environment variables (prefix `ALI_`) or a `.env` file.

| Parameter | Default | Env Variable | Description |
|-----------|---------|--------------|-------------|
| `model_name` | `qwen3:4b` | `ALI_MODEL_NAME` | Ollama model to use |
| `ollama_host` | `http://localhost:11434` | `ALI_OLLAMA_HOST` | Ollama server URL |
| `temperature` | `0.7` | `ALI_TEMPERATURE` | Response creativity |
| `top_p` | `0.9` | `ALI_TOP_P` | Nucleus sampling |
| `top_k` | `40` | `ALI_TOP_K` | Token candidate pool |
| `repeat_penalty` | `1.15` | `ALI_REPEAT_PENALTY` | Repetition penalty |
| `max_tokens` | `4096` | `ALI_MAX_TOKENS` | Max output tokens |
| `context_window` | `8192` | `ALI_CONTEXT_WINDOW` | Context size |
| `chroma_db_path` | `memory/chromadb` | `ALI_CHROMA_DB_PATH` | ChromaDB path |
| `data_dir` | `data` | `ALI_DATA_DIR` | Data directory |
| `log_level` | `INFO` | `ALI_LOG_LEVEL` | Log level |

#### `engine.py` — LLM Engine

The core of the system. Communicates with Ollama via HTTP (httpx) and manages conversations, streaming, image analysis, and performance tracking.

**Features:**
- Standard chat with system prompt injection
- Vision support (base64 image encoding, capability detection)
- Streaming mode for real-time responses
- Configurable parameters (temperature, top_p, top_k, repeat_penalty)
- Execution time tracking and token metadata
- Ollama server health check
- Available model listing

#### `personality.py` — ALI Identity

The `SYSTEM_PROMPT` defines ALI's complete identity in 70 lines: personal project history, "Libre" philosophy, behavioral modes (Logic at temp 0.2, Brainstorm at temp 0.8), available tools, and response directives. The prompt is multilingual (English, French, Arabic).

#### `logger.py` — Session Logging

Records each session in JSONL format in `data/logs/`. Tracks events (session start/end, user messages, assistant responses, errors, ingestions) and generates detailed reports with metrics.

#### `security.py` — Security Audit

The `BlackBox` class performs comprehensive security audits: network isolation checks, environment variable scanning for secrets, file permission validation, Ollama configuration verification, and a scoring system (100 base points, -20 per issue, -10 per warning).

### 5.2 Module: `memory/` — The Memory

#### `vector_store.py` — Vector Store

Wrapper around ChromaDB with persistent storage. Uses cosine similarity (HNSW). Supports add, search, count, delete, and list operations.

#### `ingestor.py` — Document Ingestion

Ingestion pipeline supporting 6 formats: PDF (PyPDF2), DOCX (python-docx), TXT/MD/CSV (raw read), XLSX (openpyxl). Text is chunked (1000 characters, 200 overlap) with metadata (source path, type, chunk index).

### 5.3 Module: `agent/` — Agentic Layer

#### `tools.py` — Code Executor

Executes Python code via `exec()` with stdout/stderr capture. Defines tool schemas (`python_execute`, `rag_search`) in OpenAI function calling format.

#### `critic.py` — Self-Critique

Implements dual-instance self-audit. Uses a separate LLM call with a `CRITIC_PROMPT` to evaluate responses for: factual accuracy, logical consistency, intellectual honesty, and clarity. If issues are found, triggers a refinement call. Operates at temperature 0.1 (audit) and 0.2 (refinement).

#### `consolidation.py` — Memory Consolidation

Logs conversations to JSON, then uses an LLM call to generate structured summaries (topics, facts, decisions, actions) stored back into the vector store for future retrieval.

### 5.4 Module: `interface/` — The Interface

#### `cli.py` — Interactive CLI

Full interactive CLI with: custom banner, 15 slash commands, persistent history (`~/.ali_history`), Rich syntax highlighting, and image support.

**Available Commands:**

| Command | Description |
|---------|------------|
| `/help` | Show help |
| `/exit` | Exit ALI |
| `/clear` | Clear conversation history |
| `/memory` | Show memory statistics |
| `/ingest <path>` | Ingest document into RAG |
| `/search <query>` | Search knowledge base |
| `/models` | List available models |
| `/model <name>` | Switch model |
| `/critique` | Toggle self-critique |
| `/debug` | Toggle debug mode |
| `/report` | Show session report |
| `/consolidate` | Consolidate session into memory |
| `/log` | Session log summary |
| `/export <path>` | Export session log |
| `/image <path> [question]` | Analyze an image |

#### `api.py` — REST API

FastAPI API exposing 9 REST endpoints + 1 catch-all for the frontend. Supports CORS, streaming, and routing to the built React frontend.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/models` | List Ollama models |
| `GET` | `/api/health` | Health check |
| `POST` | `/api/chat` | Chat with ALI |
| `POST` | `/api/ingest` | Ingest document |
| `POST` | `/api/search` | RAG search |
| `POST` | `/api/execute` | Execute Python code |
| `GET` | `/api/memory/stats` | Memory statistics |
| `GET` | `/api/log/summary` | Session log summary |
| `GET` | `/api/report` | Detailed session report |
| `GET` | `/{path}` | React SPA frontend |

#### `frontend/` — React Application

Single-file React 19 application (449 lines) with:
- Multi-conversation sidebar (localStorage)
- Model selector dropdown
- Temperature slider
- Debug mode (model, tokens, speed per message)
- Session report modal
- Image attachment (base64 upload)
- Markdown rendering with code blocks (copy button)
- Copy message button
- Dark theme (black/green "$RED" aesthetic)
- Status indicator (READY / NO OLLAMA / OFFLINE)
- Typing animation
- Vite dev proxy to localhost:8000

---

## 6. Models & Configuration

### 6.1 Available Models

| Model | Size | RAM Required | CPU Speed | Quality |
|-------|------|-------------|-----------|---------|
| qwen3:1.7b | 1.4 GB | ~4 GB | Fast | Basic |
| qwen3:4b | 2.5 GB | ~6 GB | Medium | Good |
| qwen3:8b | 5.2 GB | ~10 GB | Slow | Excellent |

### 6.2 Active Model

The currently configured model is **qwen3:4b**, offering the best quality/performance balance on an Intel CPU (integrated GPU only). Configuration has been optimized with:
- Temperature: 0.7 (creativity/coherence balance)
- Top_p: 0.9 (diverse word selection)
- Top_k: 40 (expanded candidate pool)
- Repeat_penalty: 1.15 (repetition reduction)
- Context window: 8,192 tokens (extended conversational memory)
- Max tokens: 4,096 (detailed responses)

### 6.3 Model History

| Model | Status | Notes |
|-------|--------|-------|
| Custom GPT-2 | Retired | First trained model, 12 layers, 134M params. Insufficient performance. |
| Phi-3 (HuggingFace) | Retired | Temporary model before Ollama migration. |
| qwen3:8b (Ollama) | Available | Too slow on CPU (5.2 GB), slow responses. |
| qwen3:1.7b (Ollama) | Available | Too small, repetitive and illogical responses. |
| qwen3:4b (Ollama) | **Active** | Best quality/speed balance for CPU. |

---

## 7. User Interfaces

### 7.1 Interactive CLI (`cli.py`)

Rich terminal experience with: custom banner, 15 slash commands, persistent history, syntax highlighting, and image support.

### 7.2 REST API (`api.py`)

FastAPI API with 9 endpoints supporting CORS, streaming, and frontend routing. Runs on Uvicorn (port 8000).

### 7.3 Web Frontend (`App.jsx`)

React 19 SPA with dark theme, multi-conversation management, model selection, debug metrics, markdown rendering, and image upload. Built with Vite 6.

---

## 8. Security

The `BlackBox` security module (`core/security.py`) implements four audit checks:

| Check | Description |
|-------|-------------|
| Network Isolation | Verifies local IP is in private range (127.x, 192.168.x, 10.x) |
| Environment Variables | Scans for sensitive names (API_KEY, SECRET, PASSWORD, TOKEN) |
| File Permissions | Validates data directory exists and is accessible |
| Ollama Configuration | Ensures Ollama is bound to localhost |

**Scoring:** 100 base points, -20 per issue, -10 per warning.

**Note:** No `.env` or `.env.example` files currently exist. Secrets are never stored in source code. `.gitignore` excludes `.env`, ChromaDB databases, and data documents.

---

## 9. Testing & Quality

### 9.1 Test Suite

| Test File | Functions | What It Tests |
|-----------|-----------|---------------|
| `test_engine.py` | 2 | Config defaults, system prompt import |
| `test_memory.py` | 3 | Text chunking, vector store, TXT extraction |
| `test_tools.py` | 3 | Code execution, stdout capture, error handling |

### 9.2 Coverage

Current test coverage is limited to core components. Interface modules (CLI, API, frontend) and agent modules (critic, consolidation) do not yet have dedicated unit tests.

---

## 10. Project Metrics

### 10.1 Code Inventory

| Category | Files | Lines |
|----------|-------|-------|
| Python (application) | 15 | ~1,225 |
| Python (tests) | 4 | ~59 |
| Python (legacy/utilities) | 7 | ~238 |
| Frontend (React/Vite) | 5 | ~507 |
| Documentation | 4 | ~358 |
| Infrastructure (PS1, gitignore) | 3 | ~138 |
| **Total** | **38** | **~2,490** |

### 10.2 Dependencies

| Category | Package | Usage |
|----------|---------|-------|
| Core | httpx | HTTP client for Ollama |
| Core | pydantic | Data validation |
| Core | pydantic-settings | Configuration management |
| RAG | chromadb | Vector database |
| Ingestion | PyPDF2 | PDF text extraction |
| Ingestion | python-docx | DOCX text extraction |
| Ingestion | openpyxl | XLSX text extraction |
| CLI | rich | Terminal formatting |
| CLI | prompt_toolkit | Interactive prompt with history |
| Web | fastapi | REST API framework |
| Web | uvicorn | ASGI server |
| Web | websockets | WebSocket support |
| Test | pytest | Test framework |

### 10.3 Session Logs

9 sessions recorded in `data/logs/`:

| Session ID | Date | Model | Events |
|------------|------|-------|--------|
| 20260730_014006 | Jul 30 | — | Initial session |
| 20260730_022719 | Jul 30 | — | Initial session |
| 20260730_025338 | Jul 30 | — | Initial session |
| 20260730_124511 | Jul 30 | — | Initial session |
| 20260812_162324 | Aug 12 | — | 4 events (web API testing) |
| 20260818_020944 | Aug 18 | — | Session |
| 20260818_024050 | Aug 18 | qwen3:8b | 17 events (FR/EN) |
| 20260818_223320 | Aug 18 | qwen3:1.7b | 16 events (identity questions) |
| 20260818_225708 | Aug 18 | qwen3:4b | 3 events |

---

## 11. Runtime Environment

| Component | Detail |
|-----------|--------|
| Operating System | Windows (win32) |
| Shell | PowerShell 5.1 |
| Python | 3.13.14 |
| Node.js | v24 |
| Ollama | v0.32.14 |
| GPU | Intel integrated only (no NVIDIA) |
| RAM | 16 GB |
| Model Storage | `D:\ALI_MODELS_OLLAMA` |
| HuggingFace Cache | `D:\ALI_MODELS_CACHE` |
| Project | `D:\ALI_PROJECT` |

---

## 12. Recommendations & Roadmap

### 12.1 Short-Term Improvements

- Initialize a Git repository for versioning *(completed August 18, 2026)*
- Create `.env.example` documenting available variables
- Add unit tests for interface and agent modules
- Implement streaming support in React frontend
- Add rate limiting for the REST API

### 12.2 Medium-Term Improvements

- Multi-model support with automatic switching
- Extensible plugin/tool system
- API authentication (JWT or API key)
- Web admin dashboard
- Automatic session consolidation

### 12.3 Long-Term Improvements

- Migration to dedicated GPU for larger models (8b+)
- ALI_OS implementation (sovereign AI operating system)
- Multi-user support with session isolation
- Advanced vision model integration
- Community model marketplace

---

## 13. Appendices

### Appendix A — Directory Structure

```
D:\ALI_PROJECT/
├── main.py                    (10 lines)    Entry point
├── requirements.txt           (28 lines)    Python dependencies
├── start.ps1                  (80 lines)    PowerShell launcher
├── constitution.txt           (24 lines)    ALI_OS protocols
├── build_ali.py               (39 lines)    GPT-2 architecture builder
├── chat_phi3.py               (50 lines)    Direct Phi-3 chat
├── chat_with_ali.py           (71 lines)    Custom model chat
├── inject_logic.py            (34 lines)    Logic injection
├── convert_to_gguf.py         (22 lines)    GGUF conversion
├── test_ali.py                (22 lines)    Legacy model test
│
├── core/
│   ├── config.py              (23 lines)    Configuration
│   ├── engine.py              (168 lines)   LLM engine
│   ├── personality.py         (70 lines)    System prompt
│   ├── logger.py              (58 lines)    Session logging
│   └── security.py            (92 lines)    Security audit
│
├── memory/
│   ├── vector_store.py        (43 lines)    Vector store
│   ├── ingestor.py            (74 lines)    Document ingestion
│   └── chromadb/                              ChromaDB database
│
├── agent/
│   ├── tools.py               (62 lines)    Code executor
│   ├── executor.py            (23 lines)    Tool dispatcher
│   ├── critic.py              (61 lines)    Self-critique
│   └── consolidation.py       (72 lines)    Memory consolidation
│
├── interface/
│   ├── cli.py                 (274 lines)   Interactive CLI
│   ├── api.py                 (186 lines)   REST API
│   └── frontend/
│       ├── src/App.jsx        (449 lines)   React app
│       └── dist/                              Production build
│
├── tests/
│   ├── test_engine.py         (12 lines)    Config tests
│   ├── test_memory.py         (28 lines)    Memory tests
│   └── test_tools.py          (19 lines)    Tool tests
│
├── data/logs/                                 JSONL session logs (9)
├── docs/                                      Documentation
├── ALI_CORE_RAW/                              Raw GPT-2 model
├── ALI_READY_FOR_STUDIO/                      LM Studio model
└── ALI_BRAIN_DEVELOPMENT/checkpoint-50/        Training checkpoint
```

### Appendix B — Training History (GPT-2 Model)

| Step | Epoch | Loss | Learning Rate |
|------|-------|------|---------------|
| 10 | 10 | 8.51 | 4.1e-5 |
| 20 | 20 | 5.89 | 3.1e-5 |
| 30 | 30 | 3.99 | 2.1e-5 |
| 40 | 40 | 2.93 | 1.1e-5 |
| 50 | 50 | 2.44 | 1.0e-6 |

**Total FLOPs:** 13,785,494,323,200 (~13.8 TFLOPs)
**Loss reduction:** 71% over 50 epochs

---

**Founder, Creator & Architect:** Walid Fodha
**Logic:** $RED | **Status:** SOVEREIGN
