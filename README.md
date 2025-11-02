# 🌟 HELIOS AEO — AI Visibility Architect

Complete end-to-end system for analyzing brand visibility in AI models (LLMs).

## 🚀 Quick Start

### Local Development

#### Backend Setup

```bash
cd helios_aeo
pip install -r requirements.txt
# Edit config.py with your OpenAI API key
python start_server.py
# Backend runs on http://127.0.0.1:8000
```

#### Frontend Setup

```bash
cd frontend
npm install
# Create .env.local with NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
npm run dev
# Frontend runs on http://localhost:3000
```

## 📦 Deployment

For deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

- **Frontend**: Deploy to Vercel
- **Backend**: Deploy to Render
- Both deploy automatically via GitHub

## 🏗️ Project Structure

```
HeliOS AEO/
├── helios_aeo/          # Backend (Python 3.12.7 + FastAPI)
│   ├── api.py          # FastAPI server
│   ├── start_server.py # Development server
│   ├── Procfile        # Render deployment config
│   ├── agents/         # HELIOS agent
│   └── utils/          # Utilities
└── frontend/           # Frontend (Next.js 14)
    ├── app/            # Next.js app directory
    └── lib/            # API client
```

## 🔌 API Endpoints

### POST `/analyze`

Analyzes a brand URL and returns structured results.

**Request:**
```json
{
  "url": "https://example.com",
  "mode": "full"
}
```

**Response:**
```json
{
  "scorecard": { ... },
  "gap_analysis": { ... },
  "roadmap": { ... },
  "drafts": { ... }
}
```

### GET `/health`

Health check endpoint.

### GET `/`

Root endpoint with API information.

## 🛠️ Tech Stack

### Backend
- Python 3.12.7
- FastAPI
- OpenAI GPT-4 Turbo
- BeautifulSoup4
- Gunicorn (production)

### Frontend
- Next.js 14 (App Router)
- TailwindCSS
- Framer Motion
- Recharts
- Axios

## 📝 License

MIT

## 🆘 Support

For deployment help, see [DEPLOYMENT.md](./DEPLOYMENT.md)
