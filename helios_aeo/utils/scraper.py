"""Web scraping utility for HELIOS AEO."""
import requests
from bs4 import BeautifulSoup


def scrape_site(url: str) -> str:
    """Fetch visible text & meta description from a webpage."""
    headers = {"User-Agent": "Mozilla/5.0 (compatible; HELIOSbot/1.0)"}
    resp = requests.get(url, headers=headers, timeout=15)
    resp.raise_for_status()
    soup = BeautifulSoup(resp.text, "html.parser")
    parts = [t.get_text(" ", strip=True) for t in soup.find_all(["p", "h1", "h2", "h3"])]
    meta_desc = soup.find("meta", attrs={"name": "description"})
    if meta_desc and meta_desc.get("content"):
        parts.append(meta_desc["content"])
    text = " ".join(parts)
    return text[:15000]  # limit tokens

