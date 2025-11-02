"""Web scraping utility for HELIOS AEO."""
import requests
from bs4 import BeautifulSoup


def scrape_site(url: str) -> str:
    """Fetch visible text & meta description from a webpage."""
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
    }
    try:
        resp = requests.get(url, headers=headers, timeout=15, allow_redirects=True)
        resp.raise_for_status()
        
        # Ensure we're working with text/html
        if 'text/html' not in resp.headers.get('Content-Type', ''):
            return f"URL {url} does not return HTML content."
        
        soup = BeautifulSoup(resp.text, "html.parser")
        
        # Remove script and style elements
        for script in soup(["script", "style", "nav", "footer", "header"]):
            script.decompose()
        
        # Extract title
        title = soup.find("title")
        title_text = title.get_text(strip=True) if title else ""
        
        # Extract meta description
        meta_desc = soup.find("meta", attrs={"name": "description"})
        meta_content = meta_desc.get("content", "") if meta_desc else ""
        
        # Extract main content
        parts = []
        if title_text:
            parts.append(f"Title: {title_text}")
        if meta_content:
            parts.append(f"Meta Description: {meta_content}")
        
        # Extract headings and paragraphs
        for tag in soup.find_all(["h1", "h2", "h3", "h4", "p", "li"]):
            text = tag.get_text(" ", strip=True)
            if text and len(text) > 10:  # Filter out very short text
                parts.append(text)
        
        # Combine all text
        text = " ".join(parts)
        
        if len(text.strip()) < 50:
            return f"URL {url} returned minimal content. The page may be mostly JavaScript-based or empty."
        
        # Limit to 15000 characters to avoid token limits
        return text[:15000]
    except requests.exceptions.RequestException as e:
        raise Exception(f"Failed to fetch {url}: {str(e)}")

