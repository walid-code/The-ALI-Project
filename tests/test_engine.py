from core.config import settings


def test_settings():
    assert settings.model_name is not None
    assert settings.ollama_host == "http://localhost:11434"


def test_personality_import():
    from core.personality import SYSTEM_PROMPT
    assert "ALI" in SYSTEM_PROMPT
    assert "$RED" in SYSTEM_PROMPT
