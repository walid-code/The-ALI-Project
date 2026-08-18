import json
import logging
from datetime import datetime
from pathlib import Path

LOG_DIR = Path(__file__).parent.parent / "data" / "logs"
LOG_DIR.mkdir(parents=True, exist_ok=True)


class ALILogger:
    def __init__(self):
        self.session_id = datetime.now().strftime("%Y%m%d_%H%M%S")
        self.log_file = LOG_DIR / f"ali_session_{self.session_id}.jsonl"
        self.session_log = []

    def log(self, event: str, details: dict | None = None):
        entry = {
            "timestamp": datetime.now().isoformat(),
            "session": self.session_id,
            "event": event,
            "details": details or {},
        }
        self.session_log.append(entry)
        with open(self.log_file, "a", encoding="utf-8") as f:
            f.write(json.dumps(entry, ensure_ascii=False) + "\n")

    def get_session_summary(self) -> dict:
        return {
            "session_id": self.session_id,
            "events": len(self.session_log),
            "start": self.session_log[0]["timestamp"] if self.session_log else None,
            "end": self.session_log[-1]["timestamp"] if self.session_log else None,
        }

    def generate_report(self) -> dict:
        chat_events = [e for e in self.session_log if e["event"] in ("chat", "user_message", "assistant_response")]
        user_msgs = [e for e in self.session_log if e["event"] == "user_message"]
        asst_msgs = [e for e in self.session_log if e["event"] == "assistant_response"]
        errors = [e for e in self.session_log if e["event"] == "error"]
        ingests = [e for e in self.session_log if e["event"] == "ingest"]

        return {
            "session_id": self.session_id,
            "start": self.session_log[0]["timestamp"] if self.session_log else None,
            "end": self.session_log[-1]["timestamp"] if self.session_log else None,
            "total_events": len(self.session_log),
            "user_messages": len(user_msgs),
            "assistant_responses": len(asst_msgs),
            "errors": len(errors),
            "documents_ingested": len(ingests),
            "logs_file": str(self.log_file),
        }

    def export(self, path: str | None = None):
        dest = Path(path) if path else LOG_DIR / f"ali_export_{self.session_id}.json"
        with open(dest, "w", encoding="utf-8") as f:
            json.dump(self.session_log, f, indent=2, ensure_ascii=False)
        return str(dest)
