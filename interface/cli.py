from rich.console import Console
from rich.panel import Panel
from rich.markdown import Markdown
from rich.table import Table
from rich.columns import Columns
from prompt_toolkit import PromptSession
from prompt_toolkit.history import FileHistory
from prompt_toolkit.auto_suggest import AutoSuggestFromHistory
from pathlib import Path

from core.engine import LLMEngine, IMAGE_EXTENSIONS
from core.config import settings
from core.logger import ALILogger
from memory.vector_store import VectorStore
from memory.ingestor import ingest_and_chunk
from agent.critic import Critic
from agent.consolidation import Consolidator

console = Console()


class ALIShell:
    def __init__(self):
        self.engine = LLMEngine()
        self.memory = VectorStore()
        self.logger = ALILogger()
        self.critic = Critic()
        self.consolidator = Consolidator()
        self.conversation_history: list[dict] = []
        self.session = PromptSession(history=FileHistory(Path.home() / ".ali_history"))

    def print_banner(self):
        banner = """
    ALI - Artificial Libre Intelligence
    Logic: $RED  |  Status: SOVEREIGN
        """
        console.print(Panel(banner, style="bold green"))

    def show_help(self):
        table = Table(title="ALI Commands")
        table.add_column("Command", style="cyan")
        table.add_column("Description", style="white")
        table.add_row("/help", "Show this help")
        table.add_row("/exit", "Exit ALI")
        table.add_row("/clear", "Clear conversation history")
        table.add_row("/memory", "Show memory stats")
        table.add_row("/ingest <path>", "Ingest a document into RAG")
        table.add_row("/search <query>", "Search the knowledge base")
        table.add_row("/models", "List available models")
        table.add_row("/model <name>", "Switch model")
        table.add_row("/critique", "Toggle self-critique mode (on/off)")
        table.add_row("/debug", "Toggle debug mode (tokens, timing, model)")
        table.add_row("/report", "Show session report")
        table.add_row("/consolidate", "Consolidate this session into memory")
        table.add_row("/log", "Show session log summary")
        table.add_row("/export <path>", "Export session log")
        console.print(table)

    def cmd_ingest(self, path: str):
        console.print(f"[yellow]Ingesting: {path}")
        try:
            chunks = ingest_and_chunk(path)
            texts = [c["text"] for c in chunks]
            metadatas = [c["metadata"] for c in chunks]
            self.memory.add_documents(texts, metadatas)
            self.logger.log("ingest", {"path": path, "chunks": len(chunks)})
            console.print(f"[green]Ingested {len(chunks)} chunks from {path}")
        except Exception as e:
            console.print(f"[red]Error: {e}")

    def cmd_search(self, query: str):
        results = self.memory.search(query)
        if not results:
            console.print("[yellow]No results found.")
            return
        for r in results:
            panel = Panel(
                Markdown(r["text"][:500]),
                title=f"[bold]{r['metadata'].get('source', 'unknown')} (chunk {r['metadata'].get('chunk', '?')})",
                subtitle=f"Distance: {r['distance']:.4f}",
            )
            console.print(panel)

    def cmd_memory(self):
        count = self.memory.count()
        cols = self.memory.list_collections()
        console.print(f"[green]Collections: {cols}")
        console.print(f"[green]Documents in '{self.memory.collection_name}': {count}")

    def cmd_models(self):
        models = self.engine.list_models()
        table = Table(title="Available Models")
        table.add_column("Name", style="cyan")
        table.add_column("Size", style="white")
        for m in models:
            size_gb = m.get("size", 0) / 1e9
            table.add_row(m["name"], f"{size_gb:.1f} GB")
        console.print(table)

    def run(self):
        self.print_banner()
        self.logger.log("session_start", {"model": settings.model_name})

        if not self.engine.check_health():
            console.print("[red][!] Ollama is not running.")
            console.print("[yellow]Start it with: ollama serve")
            console.print("[yellow]Then pull a model: ollama pull qwen2.5:7b")
            return

        console.print(f"[green]Model: {settings.model_name}")
        console.print()

        critique_mode = False
        debug_mode = False

        while True:
            try:
                text = self.session.prompt("ALI > ", auto_suggest=AutoSuggestFromHistory())
                if not text.strip():
                    continue

                if text.startswith("/"):
                    cmd = text.split()
                    match cmd[0]:
                        case "/exit":
                            self.logger.log("session_end", {})
                            if self.conversation_history:
                                summary = self.consolidator.consolidate_session(self.conversation_history)
                                if summary:
                                    console.print(f"[dim]Session consolidated.[/dim]")
                            console.print("[green]Shutting down. Stay sovereign.")
                            break
                        case "/help":
                            self.show_help()
                        case "/clear":
                            self.conversation_history.clear()
                            console.print("[green]History cleared.")
                        case "/memory":
                            self.cmd_memory()
                        case "/ingest":
                            if len(cmd) < 2:
                                console.print("[yellow]Usage: /ingest <filepath>")
                            else:
                                self.cmd_ingest(" ".join(cmd[1:]))
                        case "/search":
                            if len(cmd) < 2:
                                console.print("[yellow]Usage: /search <query>")
                            else:
                                self.cmd_search(" ".join(cmd[1:]))
                        case "/models":
                            self.cmd_models()
                        case "/model":
                            if len(cmd) < 2:
                                console.print("[yellow]Usage: /model <name>")
                            else:
                                settings.model_name = cmd[1]
                                console.print(f"[green]Switched to model: {cmd[1]}")
                        case "/critique":
                            critique_mode = not critique_mode
                            console.print(f"[green]Critique mode: {'ON' if critique_mode else 'OFF'}")
                        case "/debug":
                            debug_mode = not debug_mode
                            console.print(f"[green]Debug mode: {'ON' if debug_mode else 'OFF'}")
                        case "/report":
                            report = self.logger.generate_report()
                            from rich.table import Table as RichTable
                            t = RichTable(title=f"Session Report [{report['session_id']}]")
                            t.add_column("Metric", style="cyan")
                            t.add_column("Value", style="white")
                            t.add_row("Start", report.get("start", "N/A"))
                            t.add_row("End", report.get("end", "N/A"))
                            t.add_row("User Messages", str(report.get("user_messages", 0)))
                            t.add_row("Assistant Responses", str(report.get("assistant_responses", 0)))
                            t.add_row("Errors", str(report.get("errors", 0)))
                            t.add_row("Documents Ingested", str(report.get("documents_ingested", 0)))
                            t.add_row("Log File", report.get("logs_file", "N/A"))
                            console.print(t)
                        case "/consolidate":
                            if self.conversation_history:
                                summary = self.consolidator.consolidate_session(self.conversation_history)
                                console.print(Panel(Markdown(summary), title="Consolidation"))
                            else:
                                console.print("[yellow]No conversation to consolidate.")
                        case "/log":
                            summary = self.logger.get_session_summary()
                            console.print(f"[green]Session: {summary['session_id']}")
                            console.print(f"[green]Events: {summary['events']}")
                        case "/export":
                            path = cmd[1] if len(cmd) > 1 else None
                            exported = self.logger.export(path)
                            console.print(f"[green]Exported to: {exported}")
                        case "/image":
                            if len(cmd) < 2:
                                console.print("[yellow]Usage: /image <filepath> [question]")
                            else:
                                img_path = cmd[1]
                                question = " ".join(cmd[2:]) if len(cmd) > 2 else "Describe this image"
                                self.logger.log("user_image", {"path": img_path, "text": question[:100]})
                                with console.status("[bold green]ALI is analyzing image..."):
                                    try:
                                        response = self.engine.chat_with_images(
                                            question, [img_path], context=self.conversation_history
                                        )
                                        reply = response["message"]["content"]
                                        self.conversation_history.append({"role": "user", "content": f"[Image: {img_path}] {question}"})
                                        self.conversation_history.append({"role": "assistant", "content": reply})
                                        self.logger.log("assistant_response", {"text": reply[:100]})
                                        console.print(Panel(Markdown(reply), style="green"))
                                    except ValueError as e:
                                        console.print(f"[red]Error: {e}")
                            continue
                        case _:
                            console.print(f"[red]Unknown command: {cmd[0]}")
                    continue

                self.logger.log("user_message", {"text": text[:100]})

                clean_text, image_paths = self.engine._extract_image_paths(text)

                with console.status("[bold green]ALI is thinking..."):
                    if image_paths:
                        try:
                            response = self.engine.chat_with_images(
                                clean_text, image_paths, context=self.conversation_history
                            )
                        except ValueError as e:
                            console.print(f"[red]Error: {e}")
                            continue
                    else:
                        response = self.engine.chat(text, context=self.conversation_history)

                reply = response["message"]["content"]

                if debug_mode:
                    dbg = Table(title="Debug Info", show_header=False)
                    dbg.add_column("Key", style="cyan")
                    dbg.add_column("Value", style="white")
                    dbg.add_row("Model", response.get("_request_model", settings.model_name))
                    dbg.add_row("Temperature", str(response.get("_temperature", settings.temperature)))
                    dbg.add_row("Wall Time", f'{response.get("_wall_time_s", 0):.2f}s')
                    dbg.add_row("Prompt Tokens", str(response.get("prompt_eval_count", "?")))
                    dbg.add_row("Output Tokens", str(response.get("eval_count", "?")))
                    if response.get("eval_duration"):
                        tok_s = round(response["eval_count"] / (response["eval_duration"] / 1e9), 1) if response.get("eval_count") else "?"
                        dbg.add_row("Tokens/s", str(tok_s))
                    if response.get("total_duration"):
                        dbg.add_row("Total Duration", f'{response["total_duration"]/1e9:.2f}s')
                    if response.get("_wall_time_s") and response.get("eval_count"):
                        dbg.add_row("Has Images", str(bool(image_paths)))
                    console.print(dbg)

                if critique_mode:
                    with console.status("[yellow]Critic is auditing..."):
                        audit = self.critic.audit(text, reply)
                    if audit["should_revise"]:
                        console.print("[yellow]Critic found issues. Revising...")
                        with console.status("[bold green]Revising..."):
                            reply = self.critic.refine(text, reply, audit["critique"])
                        console.print("[dim]Critique applied.[/dim]")
                    else:
                        console.print("[dim]Critique passed.[/dim]")

                self.conversation_history.append({"role": "user", "content": text})
                self.conversation_history.append({"role": "assistant", "content": reply})

                self.logger.log("assistant_response", {"text": reply[:100]})

                console.print(Panel(Markdown(reply), style="green"))

            except KeyboardInterrupt:
                console.print("\n[green]Shutting down. Stay sovereign.")
                break
            except Exception as e:
                console.print(f"[red]Error: {e}")
