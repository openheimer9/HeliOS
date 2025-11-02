# ⚡ Quick Start - Deployment in 15 Minutes

## 🎯 Quick Steps

### 1️⃣ Deploy Backend (Render) - ~10 minutes

1. Go to [render.com](https://dashboard.render.com) → Sign up with GitHub
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repo: **`HeliOS`**
4. Configure:
   - **Name**: `helios-aeo-backend`
   - **Root Directory**: `helios_aeo` ⚠️
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn api:app --bind 0.0.0.0:$PORT --workers 2 --timeout 120`
5. Add Environment Variables:
   - `OPENAI_API_KEY` = your OpenAI key
   - `ALLOWED_ORIGINS` = `*` (update after frontend deploy)
6. Click **"Create Web Service"**
7. Wait for "Live" status → **Copy your backend URL**

### 2️⃣ Deploy Frontend (Vercel) - ~5 minutes

1. Go to [vercel.com](https://vercel.com) → Sign up with GitHub
2. Click **"Add New..."** → **"Project"**
3. Import your repo: **`HeliOS`**
4. Configure:
   - **Root Directory**: `frontend` ⚠️
   - **Framework**: `Next.js` (auto-detected)
5. Add Environment Variable:
   - `NEXT_PUBLIC_API_URL` = your Render backend URL
6. Click **"Deploy"**
7. Wait for "Ready" → **Copy your frontend URL**

### 3️⃣ Connect Them - ~2 minutes

1. Go back to **Render Dashboard**
2. Edit `ALLOWED_ORIGINS` environment variable
3. Change value to your **Vercel URL**: `https://your-app.vercel.app`
4. Save → Render restarts automatically
5. ✅ **Done!**

---

## 🔗 Your URLs

- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-backend.onrender.com`
- **Backend Health**: `https://your-backend.onrender.com/health`

---

## 📚 Need More Details?

- **Step-by-step guide**: [DEPLOYMENT_STEPS.md](./DEPLOYMENT_STEPS.md)
- **Full guide**: [DEPLOYMENT.md](./DEPLOYMENT.md)

