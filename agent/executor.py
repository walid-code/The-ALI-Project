from agent.tools import execute_python, TOOL_DEFINITIONS
from memory.vector_store import VectorStore


class AgentExecutor:
    def __init__(self):
        self.memory = VectorStore()

    def run_tool(self, tool_name: str, **kwargs) -> dict:
        match tool_name:
            case "python_execute":
                return execute_python(kwargs.get("code", ""))
            case "rag_search":
                results = self.memory.search(
                    kwargs.get("query", ""),
                    n_results=kwargs.get("n_results", 5),
                )
                return {"success": True, "results": results}
            case _:
                return {"success": False, "error": f"Unknown tool: {tool_name}"}

    def get_tool_definitions(self) -> list[dict]:
        return TOOL_DEFINITIONS
