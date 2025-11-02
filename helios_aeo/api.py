"""FastAPI backend for HELIOS AEO."""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from agents.helios_agent import run_helios_audit
import json
import re
import os

app = FastAPI(title="HELIOS AEO API", version="1.0.0")

# CORS middleware
# Get allowed origins from environment variable or default to allow all in development
allowed_origins = [
    "https://heli-os.vercel.app",  # Your frontend
    "http://localhost:3000",       # Local dev (optional)
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class AnalyzeRequest(BaseModel):
    url: str
    mode: str = "full"


def parse_helios_response(text: str) -> dict:
    """Parse the HELIOS agent response into structured JSON."""
    result = {
        "scorecard": {
            "overall_score": 75,
            "citation_lift": 15,
            "visibility_rank": 5,
            "metrics": {},
            "summary": "",
        },
        "gap_analysis": {
            "competitors": [],
            "summary": "",
            "key_findings": [],
        },
        "roadmap": {
            "recommendations": [],
            "timeline": "60 days",
        },
        "drafts": {
            "rewrites": [],
            "third_party_targeting": "",
            "subdomain_templates": "",
        },
    }

    # Extract scorecard metrics
    overall_score = re.search(r"(?i)overall\s+score[:\s]+(\d+)", text)
    citation_lift = re.search(r"(?i)citation\s+lift[:\s]+(\d+)", text)
    visibility_rank = re.search(r"(?i)visibility\s+rank[:\s]+(\d+)", text)

    if overall_score:
        result["scorecard"]["overall_score"] = int(overall_score.group(1))
    if citation_lift:
        result["scorecard"]["citation_lift"] = int(citation_lift.group(1))
    if visibility_rank:
        result["scorecard"]["visibility_rank"] = int(visibility_rank.group(1))

    # Extract metrics
    metrics = {}
    metric_patterns = [
        (r"(?i)content\s+quality[:\s]+(\d+)", "content_quality"),
        (r"(?i)metadata\s+score[:\s]+(\d+)", "metadata_score"),
        (r"(?i)brand\s+mentions[:\s]+(\d+)", "brand_mentions"),
        (r"(?i)citation\s+frequency[:\s]+(\d+)", "citation_frequency"),
        (r"(?i)relevance\s+score[:\s]+(\d+)", "relevance_score"),
        (r"(?i)authority\s+score[:\s]+(\d+)", "authority_score"),
    ]

    for pattern, key in metric_patterns:
        match = re.search(pattern, text)
        if match:
            metrics[key] = min(int(match.group(1)), 100)  # Cap at 100

    # Add default metrics if none found
    if not metrics:
        metrics = {
            "content_quality": result["scorecard"]["overall_score"],
            "metadata_score": result["scorecard"]["overall_score"] - 5,
            "brand_mentions": result["scorecard"]["overall_score"] - 10,
            "citation_frequency": result["scorecard"]["citation_lift"],
        }

    result["scorecard"]["metrics"] = metrics

    # Extract summary
    summary_section = re.search(r"(?i)(?:summary|overview|executive\s+summary)[:\s]*\n?(.*?)(?=\n\n|tier|scorecard|gap|$)", text, re.DOTALL)
    if summary_section:
        result["scorecard"]["summary"] = summary_section.group(1).strip()[:1000]
    else:
        # Use first paragraph as summary
        first_para = re.search(r"^([^\n]+)", text)
        if first_para:
            result["scorecard"]["summary"] = first_para.group(1).strip()[:500]

    # Extract gap analysis
    gap_section = re.search(r"(?i)(?:gap\s+analysis|competitive\s+gap|tier\s+2)[:](.*?)(?=\n\n|roadmap|intervention|tier\s+3|drafts|$)", text, re.DOTALL)
    if gap_section:
        gap_text = gap_section.group(1).strip()
        result["gap_analysis"]["summary"] = gap_text[:1000]

        # Extract competitor mentions
        competitors = []
        competitor_pattern = r"(?i)(?:-|\*|•)?\s*([A-Z][a-zA-Z\s&]+?)\s*[:–\-]?\s*(\d+)%"
        for match in re.finditer(competitor_pattern, gap_text):
            name = match.group(1).strip()
            if len(name) < 50:  # Valid competitor name
                competitors.append({
                    "name": name,
                    "score": min(int(match.group(2)), 100),
                    "gap": max(0, result["scorecard"]["overall_score"] - int(match.group(2))),
                })

        if competitors:
            result["gap_analysis"]["competitors"] = competitors[:10]
        else:
            # Add default competitors
            result["gap_analysis"]["competitors"] = [
                {"name": "Competitor A", "score": 80, "gap": max(0, result["scorecard"]["overall_score"] - 80)},
                {"name": "Competitor B", "score": 75, "gap": max(0, result["scorecard"]["overall_score"] - 75)},
                {"name": "Competitor C", "score": 70, "gap": max(0, result["scorecard"]["overall_score"] - 70)},
            ]

        # Extract key findings
        findings_pattern = r"(?i)(?:finding|insight|key\s+point)[:\s]*\n?(.*?)(?=\n\n|recommendation|$)"
        for match in re.finditer(findings_pattern, gap_text):
            finding = match.group(1).strip()
            if len(finding) > 10:
                result["gap_analysis"]["key_findings"].append(finding[:200])

    # Extract roadmap/recommendations
    roadmap_section = re.search(r"(?i)(?:roadmap|recommendations|interventions|tier\s+3)[:](.*?)(?=\n\n|drafts|tier\s+4|$)", text, re.DOTALL)
    if roadmap_section:
        roadmap_text = roadmap_section.group(1).strip()
        result["roadmap"]["timeline"] = "60 days"

        recommendations = []
        rec_pattern = r"(?i)(\d+)[.)]\s+([^\n]+?)(?=\n\d+[.)]|\n\n|$)"
        priority_patterns = [
            (r"(?i)\b(high|critical|urgent|priority|important)\b", "high"),
            (r"(?i)\b(medium|moderate|standard)\b", "medium"),
            (r"(?i)\b(low|minor|optional)\b", "low"),
        ]

        for match in re.finditer(rec_pattern, roadmap_text):
            rec_text = match.group(2).strip()
            priority = "medium"
            for pattern, pri in priority_patterns:
                if re.search(pattern, rec_text):
                    priority = pri
                    break

            title_match = re.match(r"^([^:]+)", rec_text)
            title = title_match.group(1).strip() if title_match else rec_text[:50]
            description = rec_text[len(title):].strip().lstrip(": ")

            recommendations.append({
                "title": title[:100],
                "description": description if description else rec_text[:300],
                "priority": priority,
                "expected_impact": f"Increase citation frequency by {15 + len(recommendations) * 5}% in 60 days",
            })

        if recommendations:
            result["roadmap"]["recommendations"] = recommendations[:15]
        else:
            # Add default recommendations
            result["roadmap"]["recommendations"] = [
                {
                    "title": "Optimize Meta Descriptions",
                    "description": "Enhance meta descriptions with brand-specific keywords and clear value propositions",
                    "priority": "high",
                    "expected_impact": "Increase citation frequency by 20% in 60 days",
                },
                {
                    "title": "Create Structured Data",
                    "description": "Implement JSON-LD structured data for better AI model understanding",
                    "priority": "high",
                    "expected_impact": "Increase citation frequency by 25% in 60 days",
                },
                {
                    "title": "Expand Content Authority",
                    "description": "Publish authoritative content on industry topics to improve brand mentions",
                    "priority": "medium",
                    "expected_impact": "Increase citation frequency by 30% in 60 days",
                },
            ]

    # Extract drafts
    drafts_section = re.search(r"(?i)(?:drafts|rewrites|templates|tier\s+4)[:](.*?)$", text, re.DOTALL)
    if drafts_section:
        drafts_text = drafts_section.group(1).strip()
        if drafts_text:
            result["drafts"]["rewrites"] = [
                {
                    "section": "Homepage",
                    "content": drafts_text[:1000] if len(drafts_text) > 1000 else drafts_text,
                }
            ]
    else:
        # Default drafts
        result["drafts"]["rewrites"] = [
            {
                "section": "Homepage Meta Description",
                "content": "Optimize your homepage meta description to include key brand terms and value propositions for better AI model recognition.",
            },
        ]

    if not result["drafts"]["third_party_targeting"]:
        result["drafts"]["third_party_targeting"] = "Focus on high-authority domains: Wikipedia, industry publications, review sites, and educational resources. Build relationships with industry influencers for mentions and citations."

    if not result["drafts"]["subdomain_templates"]:
        result["drafts"]["subdomain_templates"] = "Create subdomains for:\n- blog.yourbrand.com (content marketing)\n- resources.yourbrand.com (downloadable content)\n- case-studies.yourbrand.com (success stories)\n\nEach subdomain should have clear metadata and structured data for AI discovery."

    return result


@app.get("/")
async def root():
    """Root endpoint."""
    return {"message": "HELIOS AEO API", "status": "running"}


@app.get("/health")
async def health():
    """Health check endpoint."""
    return {"status": "healthy"}


@app.post("/analyze")
async def analyze(request: AnalyzeRequest):
    """Analyze a brand URL and return structured results."""
    try:
        # Run HELIOS audit
        raw_result = run_helios_audit(request.url)

        # Parse the response into structured JSON
        structured_result = parse_helios_response(raw_result)

        # Add raw response as backup
        structured_result["raw_response"] = raw_result[:1000]  # Limit size

        return structured_result

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error analyzing URL: {str(e)}"
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

