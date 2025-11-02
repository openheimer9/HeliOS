"""Configuration file for HELIOS AEO.
API keys should be set via environment variables for security.
Never commit actual API keys to the repository.
"""
import os
from dotenv import load_dotenv

# Load environment variables from .env file (for local development)
load_dotenv()

# Get API keys from environment variables (required in production)
# Set these in your deployment platform (Render) or .env file (local)
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
CLAUDE_API_KEY = os.getenv("CLAUDE_API_KEY", "")

# Validate that OpenAI API key is set
if not OPENAI_API_KEY or OPENAI_API_KEY == "":
    raise ValueError(
        "OPENAI_API_KEY not set! Please set it as an environment variable or in .env file. "
        "For production, set it in your deployment platform's environment variables."
    )
