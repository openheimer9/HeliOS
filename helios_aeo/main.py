"""Main entry point for HELIOS AEO."""
import sys
from agents.helios_agent import run_helios_audit
from utils.report import save_report


def main():
    """Main function to run HELIOS AEO audit."""
    if len(sys.argv) < 2:
        print("Usage: python main.py <url>")
        sys.exit(1)
    url = sys.argv[1]
    print(f"🔍 Running HELIOS AEO audit for: {url}")
    result = run_helios_audit(url)
    print("\n─────────────── RESULT ───────────────\n")
    print(result)
    save_report(url, result)


if __name__ == "__main__":
    main()

