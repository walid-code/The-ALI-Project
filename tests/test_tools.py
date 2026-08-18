from agent.tools import execute_python


def test_execute_python_success():
    result = execute_python("x = 2 + 2")
    assert result["success"] is True
    assert "print" not in result["stdout"]


def test_execute_python_with_output():
    result = execute_python("print('hello')")
    assert result["success"] is True
    assert "hello" in result["stdout"]


def test_execute_python_error():
    result = execute_python("1/0")
    assert result["success"] is False
    assert "ZeroDivisionError: division by zero" in result["stderr"]
