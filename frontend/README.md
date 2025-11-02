# HELIOS AEO — Frontend

AI Visibility Architect frontend built with Next.js 14, TailwindCSS, and ShadCN/UI.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
Create a `.env.local` file in the `frontend/` directory:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

For production, update with your deployed backend URL:
```env
NEXT_PUBLIC_API_URL=https://your-backend.vercel.app
```

3. Run development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Build for Production

```bash
npm run build
npm start
```

## 🚢 Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add environment variable:
   - `NEXT_PUBLIC_API_URL`: Your backend API URL
4. Deploy!

Vercel will automatically detect Next.js and configure the build settings.

## 🏗️ Project Structure

```
frontend/
├── app/
│   ├── components/      # React components
│   ├── page.jsx         # Main page
│   ├── layout.jsx       # Root layout
│   └── globals.css      # Global styles
├── lib/
│   ├── api.js          # API client
│   └── utils.js        # Utility functions
└── public/             # Static assets
```

## 🔌 API Integration

The frontend expects the backend to have a `/analyze` endpoint that accepts:

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

## 🎨 Features

- **Dark Theme**: Modern dark UI with cyan accents
- **Animations**: Smooth transitions with Framer Motion
- **Responsive**: Mobile, tablet, and desktop support
- **Interactive Dashboard**: 4-tier report visualization
- **Charts**: Data visualization with Recharts

## 🛠️ Tech Stack

- **Next.js 14**: React framework with App Router
- **TailwindCSS**: Utility-first CSS
- **ShadCN/UI**: Component library
- **Framer Motion**: Animation library
- **Recharts**: Chart library
- **Axios**: HTTP client

## 📝 License

MIT

