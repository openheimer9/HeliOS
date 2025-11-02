"""FastAPI backend for HELIOS AEO."""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from agents.helios_agent import run_helios_audit
import os

app = FastAPI(title="HELIOS AEO API", version="1.0.0")

# CORS middleware
# Get allowed origins from environment variable or default to allow all in development
allowed_origins_env = os.getenv("ALLOWED_ORIGINS", "")
if allowed_origins_env and allowed_origins_env != "*":
    allowed_origins = [origin.strip() for origin in allowed_origins_env.split(",") if origin.strip()]
else:
    # Default: allow all (useful for development and initial testing)
    # For production, set ALLOWED_ORIGINS environment variable with specific frontend URL
    allowed_origins = ["*"]

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


# Note: parse_helios_response function removed - OpenAI now returns structured JSON directly
# The agent (helios_agent.py) handles all parsing and structure validation

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
    """Analyze a brand URL and return structured results from OpenAI."""
    try:
        # Validate URL
        if not request.url or not request.url.startswith(('http://', 'https://')):
            raise HTTPException(
                status_code=400,
                detail="Invalid URL. Please provide a valid URL starting with http:// or https://"
            )
        
        # Run HELIOS audit (now returns structured dict directly)
        structured_result = run_helios_audit(request.url)
        
        # Validate structure and ensure all required keys exist
        required_keys = ["scorecard", "gap_analysis", "roadmap", "drafts"]
        for key in required_keys:
            if key not in structured_result:
                structured_result[key] = {}
        
        # Ensure nested structures exist
        if "scorecard" in structured_result and not isinstance(structured_result["scorecard"], dict):
            structured_result["scorecard"] = {"summary": str(structured_result["scorecard"])}
        
        if "gap_analysis" in structured_result and not isinstance(structured_result["gap_analysis"], dict):
            structured_result["gap_analysis"] = {"summary": str(structured_result["gap_analysis"])}
        
        if "roadmap" in structured_result and not isinstance(structured_result["roadmap"], dict):
            structured_result["roadmap"] = {"recommendations": [], "timeline": "60 days"}
        
        if "drafts" in structured_result and not isinstance(structured_result["drafts"], dict):
            structured_result["drafts"] = {"rewrites": [], "third_party_targeting": "", "subdomain_templates": ""}
        
        # Add metadata
        structured_result["url_analyzed"] = request.url
        structured_result["analysis_mode"] = request.mode

        return structured_result

    except ValueError as e:
        # Handle validation errors (scraping, URL issues)
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )
    except HTTPException:
        raise
    except Exception as e:
        # Log the error for debugging
        import traceback
        error_trace = traceback.format_exc()
        print(f"Error in analyze endpoint: {error_trace}")
        raise HTTPException(
            status_code=500,
            detail=f"Error analyzing URL: {str(e)}"
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

