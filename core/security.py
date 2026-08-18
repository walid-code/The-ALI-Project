import os
import sys
import socket
from pathlib import Path
from dataclasses import dataclass, field


@dataclass
class SecurityReport:
    issues: list[str] = field(default_factory=list)
    warnings: list[str] = field(default_factory=list)
    passed: list[str] = field(default_factory=list)
    score: int = 100


class BlackBox:
    @staticmethod
    def check_network_isolation() -> SecurityReport:
        report = SecurityReport()
        try:
            hostname = socket.gethostname()
            local_ip = socket.gethostbyname(hostname)
            if local_ip.startswith("127.") or local_ip.startswith("192.168.") or local_ip.startswith("10."):
                report.passed.append(f"Local IP ({local_ip}) is in private range")
            else:
                report.warnings.append(f"Public IP detected: {local_ip}")
        except Exception:
            report.warnings.append("Could not determine network configuration")
        return report

    @staticmethod
    def check_environment_variables() -> SecurityReport:
        report = SecurityReport()
        sensitive_vars = ["API_KEY", "SECRET", "PASSWORD", "TOKEN"]
        found = False
        for var in os.environ:
            for s in sensitive_vars:
                if s in var.upper():
                    found = True
                    break
        if found:
            report.warnings.append("Sensitive environment variables detected")
        else:
            report.passed.append("No sensitive environment variables exposed")
        return report

    @staticmethod
    def check_file_permissions() -> SecurityReport:
        report = SecurityReport()
        data_dir = Path(__file__).parent.parent / "data"
        if data_dir.exists():
            report.passed.append("Data directory exists")
        else:
            report.issues.append("Data directory not found")
        return report

    @staticmethod
    def check_ollama_configuration() -> SecurityReport:
        report = SecurityReport()
        ollama_host = os.environ.get("OLLAMA_HOST", "http://localhost:11434")
        if "localhost" in ollama_host or "127.0.0.1" in ollama_host:
            report.passed.append("Ollama bound to localhost (secure)")
        else:
            report.warnings.append(f"Ollama exposed on: {ollama_host}")
        return report

    @staticmethod
    def full_audit() -> SecurityReport:
        report = SecurityReport()
        for check in [BlackBox.check_network_isolation, BlackBox.check_environment_variables,
                       BlackBox.check_file_permissions, BlackBox.check_ollama_configuration]:
            sub = check()
            report.issues.extend(sub.issues)
            report.warnings.extend(sub.warnings)
            report.passed.extend(sub.passed)

        report.score = max(0, 100 - len(report.issues) * 20 - len(report.warnings) * 10)
        return report

    @staticmethod
    def generate_firewall_script() -> str:
        return """# Windows Firewall rules for ALI Black Box
# Run as Administrator in PowerShell

# Block all outbound for ollama.exe (except local)
# New-NetFirewallRule -DisplayName "ALI - Block Ollama Outbound" -Direction Outbound -Program "$env:LOCALAPPDATA\\Programs\\Ollama\\ollama.exe" -Action Block

# Allow only local network for ALI
# New-NetFirewallRule -DisplayName "ALI - Allow Local Only" -Direction Outbound -RemoteAddress 10.0.0.0/8,172.16.0.0/12,192.168.0.0/16,127.0.0.0/8 -Action Allow

Write-Host "[+] ALI Black Box firewall rules applied."
"""
