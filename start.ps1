param(
    [string]$Command = "cli"
)

$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ProjectRoot

if (-not (Test-Path ".venv")) {
    Write-Host "[!] Creating virtual environment..." -ForegroundColor Yellow
    python -m venv .venv
}

& ".venv\Scripts\Activate.ps1"

$ollamaRunning = $false
try {
    $resp = Invoke-WebRequest -Uri "http://localhost:11434/api/tags" -Method Get -UseBasicParsing -TimeoutSec 5
    $ollamaRunning = $resp.StatusCode -eq 200
} catch {
    Write-Host "[!] Ollama is not running." -ForegroundColor Yellow
    Write-Host "[!] Start it with: ollama serve (in another terminal)" -ForegroundColor Yellow
}

switch ($Command) {
    "cli" {
        if (-not $ollamaRunning) { return }
        python main.py
    }
    "api" {
        if (-not $ollamaRunning) {
            Write-Host "[!] API will start but /chat will fail without Ollama" -ForegroundColor Yellow
        }
        python -m uvicorn interface.api:app --host 0.0.0.0 --port 8000
    }
    "web" {
        Write-Host "[+] Starting ALI Web UI..." -ForegroundColor Green
        Write-Host "[+] Open http://localhost:8000 in your browser" -ForegroundColor Cyan
        if (-not $ollamaRunning) {
            Write-Host "[!] Ollama is not running. Start it with: ollama serve" -ForegroundColor Yellow
        }
        python -m uvicorn interface.api:app --host 0.0.0.0 --port 8000
    }
    "frontend" {
        Write-Host "[+] Building frontend..." -ForegroundColor Yellow
        cmd /c "set PATH=C:\Program Files\nodejs;%PATH% && cd /d $ProjectRoot\interface\frontend && npm run build"
        Write-Host "[+] Frontend built. Run '.\start.ps1 web' to serve." -ForegroundColor Green
    }
    "test" {
        python -m pytest tests/ -v
    }
    "install" {
        pip install -r requirements.txt
    }
    "status" {
        if ($ollamaRunning) {
            Write-Host "[+] Ollama: RUNNING" -ForegroundColor Green
        } else {
            Write-Host "[!] Ollama: NOT RUNNING" -ForegroundColor Yellow
        }
        $models = python -c "from core.engine import LLMEngine; e=LLMEngine(); print('\n'.join(m['name'] for m in e.list_models()))" 2>$null
        if ($models) {
            Write-Host "[+] Models:" -ForegroundColor Cyan
            $models.Split("`n") | ForEach-Object { Write-Host "    - $_" }
        }
        Write-Host "[+] Git: $(git log --oneline -1 2>$null)" -ForegroundColor Cyan
    }
    default {
        Write-Host "Usage: .\start.ps1 [command]" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Commands:"
        Write-Host "  cli       Start ALI CLI (requires Ollama)"
        Write-Host "  web       Start ALI Web UI (API + frontend)"
        Write-Host "  api       Start API server only"
        Write-Host "  frontend  Build the React frontend"
        Write-Host "  test      Run unit tests"
        Write-Host "  install   Install Python dependencies"
        Write-Host "  status    Show system status"
    }
}
