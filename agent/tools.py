import sys
import io
import contextlib


def execute_python(code: str) -> dict:
    """Execute Python code and return stdout, stderr, and result."""
    stdout = io.StringIO()
    stderr = io.StringIO()
    result = None

    namespace = {}

    try:
        with contextlib.redirect_stdout(stdout), contextlib.redirect_stderr(stderr):
            exec(code, namespace)
        success = True
    except Exception as e:
        stderr.write(f"{type(e).__name__}: {e}")
        success = False

    return {
        "success": success,
        "stdout": stdout.getvalue(),
        "stderr": stderr.getvalue(),
    }


TOOL_DEFINITIONS = [
    {
        "name": "python_execute",
        "description": "Execute Python code and return the output. Use for calculations, data analysis, and automation.",
        "parameters": {
            "type": "object",
            "properties": {
                "code": {
                    "type": "string",
                    "description": "The Python code to execute",
                }
            },
            "required": ["code"],
        },
    },
    {
        "name": "rag_search",
        "description": "Search the local knowledge base (RAG) for relevant information.",
        "parameters": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "The search query",
                },
                "n_results": {
                    "type": "integer",
                    "description": "Number of results to return (default 5)",
                },
            },
            "required": ["query"],
        },
    },
]
