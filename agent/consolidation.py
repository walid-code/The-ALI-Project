import json
from datetime import datetime, timedelta
from pathlib import Path
from core.engine import LLMEngine
from memory.vector_store import VectorStore

CONSOLIDATION_DIR = Path(__file__).parent.parent / "data" / "logs"
CONSOLIDATION_PROMPT = """You are ALI's Memory Consolidation system.

Review the following conversation log and produce a concise summary of:
1. Key topics discussed
2. Important facts learned
3. Decisions or conclusions reached
4. Action items or follow-ups needed

Conversation log:
---
{log}
---

Produce a structured summary in 3-5 sentences."""


class Consolidator:
    def __init__(self):
        self.engine = LLMEngine()
        self.memory = VectorStore()
        CONSOLIDATION_DIR.mkdir(parents=True, exist_ok=True)

    def log_conversation(self, conversation: list[dict]):
        timestamp = datetime.now().isoformat()
        log_entry = {
            "timestamp": timestamp,
            "messages": conversation,
        }
        log_file = CONSOLIDATION_DIR / f"session_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(log_file, "w", encoding="utf-8") as f:
            json.dump(log_entry, f, indent=2, ensure_ascii=False)

    def consolidate_session(self, conversation: list[dict]):
        if not conversation:
            return

        log_text = "\n".join(
            f"{m['role']}: {m['content'][:2000]}"
            for m in conversation
        )

        summary = self.engine.chat(
            CONSOLIDATION_PROMPT.format(log=log_text),
            temperature=0.2,
        )
        summary_text = summary["message"]["content"]

        self.memory.add_documents(
            [summary_text],
            [{"type": "consolidation", "timestamp": datetime.now().isoformat()}],
        )

        return summary_text

    def get_recent_consolidations(self, hours: int = 24) -> list[str]:
        cutoff = (datetime.now() - timedelta(hours=hours)).isoformat()
        results = self.memory.search(
            "recent ALI sessions and learnings",
            n_results=20,
        )
        return [
            r["text"]
            for r in results
            if r["metadata"].get("type") == "consolidation"
        ]
