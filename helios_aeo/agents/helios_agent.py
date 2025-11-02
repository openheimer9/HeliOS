"""HELIOS agent for AI Visibility Architecture."""
import json
from openai import OpenAI
from utils.scraper import scrape_site
from config import OPENAI_API_KEY

HELIOS_SYSTEM_PROMPT = """You are HELIOS - the AI Visibility Architect.

Your mission is to optimize how AI models perceive and cite a brand online. You conduct deep audits, identify citation gaps, and generate strategic recommendations that improve a brand's presence across LLMs like GPT, Claude, and Gemini.

CONTEXT AWARENESS:
- Understand the difference between SEO and AI discovery mechanisms.
- Map brand visibility across model outputs, looking at citation frequency, context, and quality.
- Adapt insights based on AI model behaviors and industry-specific trends.

AGENT FUNCTIONS:
1. Conduct brand content audit based on input URL.
2. Analyze competitor visibility in AI models.
3. Generate a Citation Audit Scorecard (Tier 1).
4. Deliver Competitive Gap Analysis with examples (Tier 2).
5. Recommend ranked intervention roadmap (Tier 3).
6. Produce draft rewrites, third-party targeting plans, and subdomain templates (Tier 4).
7. Test content edits against real-time LLM queries.
8. Track A/B results of recommended changes over time.

TOOL USE:
- Web scraper: for content and metadata extraction.
- LLM APIs: for visibility testing.
- Diff engine: for content comparisons.
- Analytics: to track citation lift trends.

EDGE HANDLING:
- If brand data is sparse, prompt foundational content creation first.
- Refuse to recommend misleading edits or violate factual accuracy.
- Maintain brand voice and tone integrity in all outputs.

OUTPUT FORMAT:
You MUST respond with valid JSON only, using this exact structure:

{
  "scorecard": {
    "overall_score": <number 0-100>,
    "citation_lift": <number 0-100>,
    "visibility_rank": <number>,
    "metrics": {
      "content_quality": <number 0-100>,
      "metadata_score": <number 0-100>,
      "brand_mentions": <number 0-100>,
      "citation_frequency": <number 0-100>
    },
    "summary": "<detailed analysis specific to this URL>"
  },
  "gap_analysis": {
    "summary": "<competitive gap analysis specific to this brand/URL>",
    "competitors": [
      {
        "name": "<competitor name>",
        "score": <number 0-100>,
        "gap": <number>
      }
    ],
    "key_findings": ["<finding 1>", "<finding 2>"]
  },
  "roadmap": {
    "recommendations": [
      {
        "title": "<recommendation title>",
        "description": "<detailed description>",
        "priority": "high|medium|low",
        "expected_impact": "<expected outcome>"
      }
    ],
    "timeline": "60 days"
  },
  "drafts": {
    "rewrites": [
      {
        "section": "<section name>",
        "content": "<rewrite content>"
      }
    ],
    "third_party_targeting": "<strategies for third-party visibility>",
    "subdomain_templates": "<subdomain recommendations>"
  }
}

Tone: Insightful, professional, not overly technical unless user is an expert.
Always tie recommendations to measurable outcomes (AI citation lift in 60 days).
Make sure your analysis is SPECIFIC to the URL and content provided."""

client = OpenAI(api_key=OPENAI_API_KEY)


def run_helios_audit(url: str) -> dict:
    """Scrape the URL and run the HELIOS audit through GPT, returning structured JSON."""
    try:
        # Scrape website content
        site_text = scrape_site(url)
        if not site_text or len(site_text.strip()) < 50:
            raise ValueError(f"Could not scrape sufficient content from {url}. Please ensure the URL is accessible and contains text content.")
    except Exception as e:
        raise ValueError(f"Error scraping {url}: {str(e)}")
    
    # Construct user message with scraped content
    user_message = f"""Run a full HELIOS AEO visibility audit for this brand URL: {url}

Analyze this URL and its content. Be SPECIFIC to THIS website. Do not provide generic responses.

Website Content Scraped:
{site_text}

Provide a detailed, URL-specific analysis in the JSON format specified. Include specific metrics, competitor analysis, actionable recommendations, and content rewrites based on the actual content of this website."""
    
    try:
        # Call OpenAI API with JSON response format
        completion = client.chat.completions.create(
            model="gpt-4o",  # Using GPT-4o for best JSON structure compliance
            messages=[
                {"role": "system", "content": HELIOS_SYSTEM_PROMPT},
                {"role": "user", "content": user_message}
            ],
            response_format={"type": "json_object"},
            temperature=0.7,
            max_tokens=4000
        )
        
        raw_output = completion.choices[0].message.content
        
        # Parse JSON response
        try:
            data = json.loads(raw_output)
        except json.JSONDecodeError as e:
            # If JSON parsing fails, raise error with helpful message
            raise ValueError(f"Invalid JSON response from OpenAI: {str(e)}\nRaw output: {raw_output[:500]}")
        
        # Validate and normalize structure
        result = {
            "scorecard": data.get("scorecard", {}),
            "gap_analysis": data.get("gap_analysis", {}),
            "roadmap": data.get("roadmap", {}),
            "drafts": data.get("drafts", {}),
        }
        
        # Ensure scorecard has required fields
        if isinstance(result["scorecard"], dict):
            if "overall_score" not in result["scorecard"]:
                result["scorecard"]["overall_score"] = 75
            if "citation_lift" not in result["scorecard"]:
                result["scorecard"]["citation_lift"] = 15
            if "visibility_rank" not in result["scorecard"]:
                result["scorecard"]["visibility_rank"] = 5
            if "metrics" not in result["scorecard"]:
                result["scorecard"]["metrics"] = {}
            if "summary" not in result["scorecard"]:
                result["scorecard"]["summary"] = f"HELIOS analysis for {url}"
        
        # Ensure gap_analysis structure
        if isinstance(result["gap_analysis"], dict):
            if "competitors" not in result["gap_analysis"]:
                result["gap_analysis"]["competitors"] = []
            if "key_findings" not in result["gap_analysis"]:
                result["gap_analysis"]["key_findings"] = []
            if "summary" not in result["gap_analysis"]:
                result["gap_analysis"]["summary"] = ""
        
        # Ensure roadmap structure
        if isinstance(result["roadmap"], dict):
            if "recommendations" not in result["roadmap"]:
                result["roadmap"]["recommendations"] = []
            if "timeline" not in result["roadmap"]:
                result["roadmap"]["timeline"] = "60 days"
        
        # Ensure drafts structure
        if isinstance(result["drafts"], dict):
            if "rewrites" not in result["drafts"]:
                result["drafts"]["rewrites"] = []
            if "third_party_targeting" not in result["drafts"]:
                result["drafts"]["third_party_targeting"] = ""
            if "subdomain_templates" not in result["drafts"]:
                result["drafts"]["subdomain_templates"] = ""
        
        return result
        
    except ValueError as ve:
        # Re-raise ValueError as-is (for scraping errors)
        raise ve
    except Exception as e:
        # Wrap other exceptions with more context
        error_msg = str(e)
        if "Invalid JSON" in error_msg or "JSON" in error_msg:
            raise ValueError(f"OpenAI returned invalid JSON. Please check API key and model availability. {error_msg}")
        else:
            raise Exception(f"Error calling OpenAI API: {error_msg}")

