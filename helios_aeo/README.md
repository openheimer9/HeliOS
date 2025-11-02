# HELIOS AEO Backend

FastAPI backend for HELIOS AI Visibility Architect.

## Local Development

```bash
# Install dependencies
pip install -r requirements.txt

# Set environment variables (or edit config.py)
export OPENAI_API_KEY=your-key-here

# Run development server
python start_server.py
# or
uvicorn api:app --reload --host 0.0.0.0 --port 8000
```

## Production Deployment (Render)

The backend is configured for Render deployment with:
- `Procfile` - Defines the web service command
- `requirements.txt` - Python dependencies
- `runtime.txt` - Python version

### Environment Variables (Render)

Set these in Render dashboard:
- `OPENAI_API_KEY` - Your OpenAI API key
- `ALLOWED_ORIGINS` - Comma-separated list of allowed frontend URLs (e.g., `https://your-app.vercel.app`)

## API Documentation

Once deployed, visit:
- `/docs` - Swagger UI documentation
- `/redoc` - ReDoc documentation

