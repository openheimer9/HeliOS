# 🚀 Deployment Guide - HELIOS AEO

**For quick step-by-step instructions, see [DEPLOYMENT_STEPS.md](./DEPLOYMENT_STEPS.md)**

Complete guide for deploying the frontend to Vercel and backend to Render via GitHub.

---

## 📋 Prerequisites

1. **GitHub Account** - Create a free account at [github.com](https://github.com)
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
3. **Render Account** - Sign up at [render.com](https://render.com)
4. **OpenAI API Key** - Get from [platform.openai.com](https://platform.openai.com)

---

## 📦 Step 1: Prepare Your Repository

### 1.1 Initialize Git (if not already done)

```bash
# In your project root directory
git init
git add .
git commit -m "Initial commit: HELIOS AEO project"
```

### 1.2 Create GitHub Repository

1. Go to [GitHub](https://github.com/new)
2. Create a new repository (e.g., `helios-aeo`)
3. **DO NOT** initialize with README, .gitignore, or license (we already have files)
4. Copy the repository URL

### 1.3 Push to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/helios-aeo.git
git branch -M main
git push -u origin main
```

---

## 🔧 Step 2: Deploy Backend to Render

### 2.1 Create New Web Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub account and select your repository
4. Configure the service:
   - **Name**: `helios-aeo-backend` (or your preferred name)
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `helios_aeo` (important!)
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn api:app --bind 0.0.0.0:$PORT --workers 2 --timeout 120`

### 2.2 Set Environment Variables in Render

In the Render dashboard, go to **Environment** tab and add:

```
OPENAI_API_KEY=sk-proj-your-actual-key-here
ALLOWED_ORIGINS=https://your-frontend.vercel.app
```

**Important Notes:**
- Replace `your-actual-key-here` with your real OpenAI API key
- Replace `your-frontend.vercel.app` with your actual Vercel URL (we'll update this after deploying frontend)
- Initially, you can set `ALLOWED_ORIGINS=*` for testing, but update it later for security

### 2.3 Deploy Backend

1. Click **"Create Web Service"**
2. Render will automatically:
   - Install dependencies
   - Build your application
   - Start the service
3. Wait for deployment to complete (~5-10 minutes)
4. Copy your backend URL (e.g., `https://helios-aeo-backend.onrender.com`)

### 2.4 Test Backend

Visit: `https://your-backend-url.onrender.com/health`

You should see: `{"status":"healthy"}`

---

## 🎨 Step 3: Deploy Frontend to Vercel

### 3.1 Import Project to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend` (important!)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

### 3.2 Set Environment Variables in Vercel

In the Vercel project settings, go to **Environment Variables** and add:

```
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
```

**Replace** `your-backend-url.onrender.com` with your actual Render backend URL from Step 2.3

### 3.3 Deploy Frontend

1. Click **"Deploy"**
2. Vercel will automatically:
   - Install dependencies
   - Build the Next.js app
   - Deploy to production
3. Wait for deployment (~2-5 minutes)
4. Copy your frontend URL (e.g., `https://helios-aeo.vercel.app`)

### 3.4 Update Backend CORS (Important!)

1. Go back to Render dashboard
2. Update the `ALLOWED_ORIGINS` environment variable:
   ```
   ALLOWED_ORIGINS=https://your-frontend.vercel.app
   ```
   (Replace with your actual Vercel URL)
3. Render will automatically restart the service

---

## ✅ Step 4: Verify Deployment

### 4.1 Test Frontend
- Visit your Vercel URL
- You should see the HELIOS AEO interface
- Try entering a URL and running an audit

### 4.2 Test API Connection
- Open browser console (F12)
- Run an audit
- Check Network tab to ensure API calls are going to Render backend

### 4.3 Test Backend Directly
- Visit: `https://your-backend.onrender.com/`
- Should show: `{"message":"HELIOS AEO API","status":"running"}`

---

## 🔄 Step 5: Continuous Deployment Setup

Both Render and Vercel automatically deploy when you push to GitHub:

1. **Make changes** to your code
2. **Commit and push**:
   ```bash
   git add .
   git commit -m "Your changes"
   git push origin main
   ```
3. **Automatic deployment**:
   - Render will detect changes and redeploy backend
   - Vercel will detect changes and redeploy frontend
4. **Monitor**:
   - Check Render dashboard for backend logs
   - Check Vercel dashboard for frontend logs

---

## 🔒 Step 6: Security Best Practices

### Update Backend CORS (Production)

1. In Render, set `ALLOWED_ORIGINS` to only your frontend URL:
   ```
   ALLOWED_ORIGINS=https://helios-aeo.vercel.app
   ```

2. Remove wildcard `*` in production for security

### Environment Variables

- **Never commit** `.env` files to GitHub
- **Always use** environment variables in deployment platforms
- **Rotate** API keys regularly

---

## 🐛 Troubleshooting

### Backend Issues

**Problem**: Backend not starting
- **Solution**: Check Render logs, verify `Start Command` is correct
- **Solution**: Ensure `Procfile` exists in `helios_aeo/` directory

**Problem**: CORS errors
- **Solution**: Verify `ALLOWED_ORIGINS` includes your Vercel URL
- **Solution**: Check that backend URL is correct in frontend env vars

**Problem**: API key not working
- **Solution**: Verify `OPENAI_API_KEY` is set correctly in Render
- **Solution**: Check that API key has proper permissions and credits

### Frontend Issues

**Problem**: Build fails
- **Solution**: Check Vercel build logs
- **Solution**: Ensure `Root Directory` is set to `frontend`
- **Solution**: Verify all dependencies are in `package.json`

**Problem**: API calls failing
- **Solution**: Verify `NEXT_PUBLIC_API_URL` is set correctly
- **Solution**: Check browser console for CORS errors
- **Solution**: Ensure backend URL includes `https://` protocol

---

## 📊 Monitoring

### Render Monitoring
- View logs: Render Dashboard → Your Service → Logs
- Monitor uptime: Render Dashboard → Your Service
- View metrics: Render Dashboard → Your Service → Metrics

### Vercel Monitoring
- View logs: Vercel Dashboard → Your Project → Deployments → Click deployment
- Monitor performance: Vercel Dashboard → Analytics
- View errors: Vercel Dashboard → Your Project → Logs

---

## 💰 Cost Considerations

### Render
- **Free Tier**: 
  - 750 hours/month free
  - Services spin down after 15 minutes of inactivity
  - First spin-up takes ~30 seconds (cold start)
- **Paid Plans**: Start at $7/month for always-on services

### Vercel
- **Free Tier**: 
  - Unlimited deployments
  - 100GB bandwidth/month
  - Perfect for most projects

---

## 🎉 You're All Set!

Your HELIOS AEO application is now live:
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-backend.onrender.com`

Both will automatically redeploy on every Git push to your main branch.

---

## 📝 Quick Reference

**Backend URL**: `https://your-backend.onrender.com`
**Frontend URL**: `https://your-app.vercel.app`

**Update Backend CORS**: Render → Environment → `ALLOWED_ORIGINS`
**Update Frontend API**: Vercel → Settings → Environment Variables → `NEXT_PUBLIC_API_URL`

