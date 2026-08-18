from pathlib import Path
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from core.engine import LLMEngine
from core.config import settings
from memory.vector_store import VectorStore
from memory.ingestor import ingest_and_chunk
from agent.tools import execute_python
from agent.critic import Critic
from core.logger import ALILogger

app = FastAPI(title="ALI API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

engine = LLMEngine()
memory = VectorStore()
critic = Critic()
logger = ALILogger()

FRONTEND_DIR = Path(__file__).parent / "frontend" / "dist"
FRONTEND_INDEX = FRONTEND_DIR / "index.html"


class ChatRequest(BaseModel):
    message: str
    stream: bool = False
    critique: bool = False
    images: list[str] = []
    model: str | None = None
    temperature: float | None = None
    debug: bool = False


class ChatResponse(BaseModel):
    reply: str
    critique: str | None = None
    debug: dict | None = None


class IngestRequest(BaseModel):
    path: str


class SearchRequest(BaseModel):
    query: str
    n_results: int = 5


class ExecuteRequest(BaseModel):
    code: str


@app.get("/api/models")
def list_models():
    try:
        models = engine.list_models()
        return {"models": [m["name"] for m in models]}
    except Exception as e:
        return {"models": [], "error": str(e)}


@app.get("/api/health")
def health():
    ollama_ok = engine.check_health()
    return {
        "status": "ok" if ollama_ok else "degraded",
        "ollama": ollama_ok,
        "model": engine.model,
    }


@app.post("/api/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    if not engine.check_health():
        raise HTTPException(status_code=503, detail="Ollama is not running")
    try:
        kwargs = {}
        if req.model:
            kwargs["model"] = req.model
        if req.temperature is not None:
            kwargs["temperature"] = req.temperature

        if req.images:
            resp = engine.chat_with_images(req.message, req.images, **kwargs)
        else:
            resp = engine.chat(req.message, **kwargs)
        reply = resp["message"]["content"]
        critique_result = None
        debug_info = None

        if req.debug:
            debug_info = {
                "model": resp.get("_request_model", engine.model),
                "temperature": resp.get("_temperature", settings.temperature),
                "wall_time_s": resp.get("_wall_time_s"),
                "prompt_eval_count": resp.get("prompt_eval_count"),
                "eval_count": resp.get("eval_count"),
                "prompt_eval_duration_s": round(resp.get("prompt_eval_duration", 0) / 1e9, 3) if resp.get("prompt_eval_duration") else None,
                "eval_duration_s": round(resp.get("eval_duration", 0) / 1e9, 3) if resp.get("eval_duration") else None,
                "total_duration_s": round(resp.get("total_duration", 0) / 1e9, 3) if resp.get("total_duration") else None,
                "tokens_per_second": round(resp.get("eval_count", 0) / (resp.get("eval_duration", 1) / 1e9), 1) if resp.get("eval_duration") and resp.get("eval_count") else None,
                "has_images": len(req.images) > 0,
                "critique": False,
            }

        if req.critique:
            audit = critic.audit(req.message, reply)
            critique_result = audit["critique"]
            if req.debug and debug_info:
                debug_info["critique"] = True
                debug_info["critique_passed"] = audit["passed"]
                debug_info["critique_revised"] = audit["should_revise"]
            if audit["should_revise"]:
                reply = critic.refine(req.message, reply, audit["critique"])

        logger.log("chat", {"message": req.message[:100], "critique": req.critique, "debug": req.debug})
        return ChatResponse(reply=reply, critique=critique_result, debug=debug_info)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/ingest")
def ingest(req: IngestRequest):
    try:
        chunks = ingest_and_chunk(req.path)
        texts = [c["text"] for c in chunks]
        metadatas = [c["metadata"] for c in chunks]
        memory.add_documents(texts, metadatas)
        logger.log("ingest", {"path": req.path, "chunks": len(chunks)})
        return {"status": "ok", "chunks": len(chunks)}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/api/search")
def search(req: SearchRequest):
    results = memory.search(req.query, req.n_results)
    return {"results": results}


@app.get("/api/memory/stats")
def memory_stats():
    return {
        "collection": memory.collection_name,
        "documents": memory.count(),
        "collections": memory.list_collections(),
    }


@app.post("/api/execute")
def execute(req: ExecuteRequest):
    logger.log("execute", {"code": req.code[:100]})
    return execute_python(req.code)


@app.get("/api/log/summary")
def log_summary():
    return logger.get_session_summary()


@app.get("/api/report")
def session_report():
    return logger.generate_report()

# Serve frontend static assets
if FRONTEND_DIR.exists():
    app.mount("/assets", StaticFiles(directory=str(FRONTEND_DIR / "assets")), name="assets")

    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        if FRONTEND_INDEX.exists():
            return HTMLResponse(FRONTEND_INDEX.read_text(encoding="utf-8"))
        raise HTTPException(status_code=404, detail="Frontend not built")
