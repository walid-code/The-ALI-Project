from memory.vector_store import VectorStore
from memory.ingestor import chunk_text, extract_text_from_txt


def test_chunk_text():
    text = "Hello world. " * 100
    chunks = chunk_text(text, chunk_size=100, overlap=20)
    assert len(chunks) > 1
    assert all(len(c) <= 100 for c in chunks)


def test_vector_store():
    store = VectorStore("test_collection")
    store.add_documents(
        ["ALI is a sovereign AI.", "Ollama runs local LLMs."],
        [{"source": "test1"}, {"source": "test2"}],
        ["test1", "test2"],
    )
    results = store.search("AI", n_results=1)
    assert len(results) > 0
    store.delete_collection()


def test_txt_extraction(tmp_path):
    f = tmp_path / "test.txt"
    f.write_text("Hello ALI", encoding="utf-8")
    text = extract_text_from_txt(str(f))
    assert "Hello ALI" in text
