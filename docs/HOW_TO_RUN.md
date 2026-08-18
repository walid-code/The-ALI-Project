# How to Run ALI Locally

ALI can be launched in two ways: via the **PowerShell CLI** (terminal) or via the **Web Interface** (browser). Both methods require the same prerequisites.

---

## Prerequisites

Before running ALI, make sure you have:

| Software | Version | Check Command |
|----------|---------|---------------|
| Python | 3.13+ | `python --version` |
| Ollama | Latest | `ollama --version` |
| Node.js | 18+ (for frontend) | `node --version` |

### Step 1: Install Ollama

1. Download Ollama from [https://ollama.com](https://ollama.com)
2. Install it on your machine
3. Start Ollama (it runs automatically on `http://localhost:11434`)

### Step 2: Pull a Model

Open PowerShell and run:

```powershell
ollama pull qwen3:4b
```

This downloads the Qwen3 4B model (~2.5 GB). You only need to do this once.

### Step 3: Set Model Storage Location (Optional)

If you want to store models on a different drive (e.g., `D:\ALI_MODELS_OLLAMA`):

```powershell
[System.Environment]::SetEnvironmentVariable("OLLAMA_MODELS", "D:\ALI_MODELS_OLLAMA", "User")
```

Then restart your terminal.

### Step 4: Install Python Dependencies

Navigate to the project folder and install requirements:

```powershell
cd D:\ALI_PROJECT
pip install -r requirements.txt
```

---

## Method 1: PowerShell CLI

The CLI (Command Line Interface) runs directly in your terminal. It is the simplest and fastest way to use ALI.

### Launch

```powershell
cd D:\ALI_PROJECT
python main.py
```

You will see:

```
┌─────────────────────────────────────────┐
│  ALI - Artificial Libre Intelligence    │
│  Logic: $RED  |  Status: SOVEREIGN      │
└─────────────────────────────────────────┘

Model: qwen3:4b

ALI >
```

### Usage

Simply type your message and press Enter:

```
ALI > What is the meaning of sovereignty in AI?
```

ALI will think and respond directly in the terminal.

### CLI Commands

| Command | Description |
|---------|------------|
| `/help` | Show all available commands |
| `/exit` | Exit ALI (saves your session automatically) |
| `/clear` | Clear conversation history |
| `/memory` | Show memory statistics |
| `/ingest <path>` | Add a document to ALI's memory |
| `/search <query>` | Search your knowledge base |
| `/models` | List available Ollama models |
| `/model <name>` | Switch to a different model |
| `/critique` | Toggle self-critique mode (ALI audits its own answers) |
| `/debug` | Toggle debug info (tokens, speed, latency) |
| `/report` | Show session report |
| `/consolidate` | Save session learnings to memory |
| `/image <path>` | Analyze an image |

### Exit

Type `/exit` or press `Ctrl+C` to quit. ALI will automatically consolidate your session (save important learnings to memory).

---

## Method 2: Web Interface

The web interface provides a rich, browser-based experience with a dark theme, conversation management, and visual debugging.

### Step 1: Start the Backend API

Open a PowerShell terminal and run:

```powershell
cd D:\ALI_PROJECT
uvicorn interface.api:app --host 0.0.0.0 --port 8000
```

You will see:

```
INFO:     Started server process [12345]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### Step 2: Open the Web Interface

Open your browser and go to:

```
http://localhost:8000
```

The React frontend will load automatically.

### Step 3: (Optional) Build the Frontend from Source

If you want to modify the frontend or build it fresh:

```powershell
cd D:\ALI_PROJECT\interface\frontend
npm install
npm run build
```

The built files will be placed in `dist/` and served automatically by the API.

### Step 4: (Optional) Run Frontend in Dev Mode

For development with hot-reload:

```powershell
cd D:\ALI_PROJECT\interface\frontend
npm run dev
```

This starts a Vite dev server on `http://localhost:5173` that proxies API calls to `http://localhost:8000`.

---

## Web Interface Features

| Feature | Description |
|---------|-------------|
| Multi-conversations | Create and switch between multiple chat sessions |
| Model selector | Choose which Ollama model to use |
| Temperature slider | Adjust creativity in real-time |
| Debug mode | See model name, tokens, speed per message |
| Image upload | Attach images for vision-capable models |
| Markdown rendering | Rich text with code blocks and copy buttons |
| Session report | View detailed session statistics |
| Dark theme | Black/green "$RED" aesthetic |

---

## Troubleshooting

### "Ollama is not running"

```powershell
# Start Ollama manually
ollama serve
```

Then try launching ALI again.

### "No module named 'prompt_toolkit'"

```powershell
pip install -r requirements.txt
```

### "Model not found"

```powershell
# Check available models
ollama list

# Pull the model if missing
ollama pull qwen3:4b
```

### Port 8000 already in use

```powershell
# Find what's using port 8000
netstat -ano | findstr :8000

# Kill the process (replace PID)
taskkill /PID <PID> /F
```

### Slow responses

ALI runs on CPU if you don't have an NVIDIA GPU. Responses may take a few seconds. Use `qwen3:4b` for the best balance of speed and quality on CPU.

---

## Quick Reference

### CLI Mode (Terminal)

```powershell
cd D:\ALI_PROJECT
python main.py
```

### Web Mode (Browser)

```powershell
# Terminal 1: Start API
cd D:\ALI_PROJECT
uvicorn interface.api:app --host 0.0.0.0 --port 8000

# Browser: Open http://localhost:8000
```

### Both Modes

```powershell
cd D:\ALI_PROJECT
$env:OLLAMA_MODELS = "D:\ALI_MODELS_OLLAMA"  # Optional
python main.py                                 # CLI
# OR
uvicorn interface.api:app --host 0.0.0.0 --port 8000  # Web
```

---

**Need help?** Run `/help` inside the CLI or check the [README](../README.md).
