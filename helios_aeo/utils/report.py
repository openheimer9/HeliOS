"""Report saving utility for HELIOS AEO."""
from pathlib import Path
from urllib.parse import urlparse


def save_report(domain_url: str, content: str):
    """Save the HELIOS audit report to a file."""
    domain = urlparse(domain_url).netloc.replace("www.", "")
    Path("reports").mkdir(exist_ok=True)
    file = Path("reports") / f"report_{domain}.txt"
    file.write_text(content, encoding="utf-8")
    print(f"✅  Report saved to {file.resolve()}")

