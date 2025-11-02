# 🚀 Deployment Steps - Render & Vercel

Quick step-by-step guide to deploy HELIOS AEO.

---

## 📋 Prerequisites

✅ **GitHub repository** with your code (already done!)  
✅ **OpenAI API Key** from [platform.openai.com](https://platform.openai.com)  
✅ **Render account** at [render.com](https://render.com)  
✅ **Vercel account** at [vercel.com](https://vercel.com)

---

## 🔧 PART 1: Deploy Backend to Render

### Step 1: Create Render Account & Connect GitHub

1. Go to **[render.com](https://dashboard.render.com)**
2. Click **"Get Started for Free"** or **"Sign Up"**
3. Sign in with **GitHub** (recommended)
4. Authorize Render to access your GitHub repositories

### Step 2: Create Web Service

1. In Render Dashboard, click **"New +"** button (top right)
2. Select **"Web Service"**
3. Click **"Connect account"** if you haven't connected GitHub
4. Find and select your repository: **`HeliOS`** (or your repo name)
5. Click **"Connect"**

### Step 3: Configure Backend Service

Fill in the following settings:

#### Basic Settings:
- **Name**: `helios-aeo-backend` (or any name you prefer)
- **Region**: Choose closest to you (e.g., `Oregon (US West)` or `Frankfurt (EU)`)
- **Branch**: `main`

#### Build & Deploy:
- **Root Directory**: `helios_aeo` ⚠️ **IMPORTANT!**
- **Environment**: `Python 3`
- **Build Command**: 
  ```bash
  pip install -r requirements.txt
  ```
- **Start Command**: 
  ```bash
  gunicorn api:app --bind 0.0.0.0:$PORT --workers 2 --timeout 120
  ```

### Step 4: Set Environment Variables

Click on **"Environment"** tab and add:

1. **OPENAI_API_KEY**
   - **Key**: `OPENAI_API_KEY`
   - **Value**: Your OpenAI API key (starts with `sk-proj-` or `sk-`)
   - Click **"Add"**

2. **ALLOWED_ORIGINS** (temporarily for setup)
   - **Key**: `ALLOWED_ORIGINS`
   - **Value**: `*` (we'll update this after deploying frontend)
   - Click **"Add"**

### Step 5: Deploy Backend

1. Scroll down and click **"Create Web Service"**
2. Render will start building (takes 5-10 minutes)
3. Wait for deployment to complete - you'll see **"Live"** status
4. **Copy your service URL** (e.g., `https://helios-aeo-backend.onrender.com`)

### Step 6: Test Backend

1. Open your backend URL in browser
2. Add `/health` to the end: `https://your-backend.onrender.com/health`
3. You should see: `{"status":"healthy"}`
4. ✅ **Backend is working!**

---

## 🎨 PART 2: Deploy Frontend to Vercel

### Step 7: Create Vercel Account & Connect GitHub

1. Go to **[vercel.com](https://vercel.com)**
2. Click **"Sign Up"** or **"Log In"**
3. Sign in with **GitHub**
4. Authorize Vercel to access your GitHub repositories

### Step 8: Import Project

1. In Vercel Dashboard, click **"Add New..."** button
2. Select **"Project"**
3. Find and select your repository: **`HeliOS`**
4. Click **"Import"**

### Step 9: Configure Frontend Project

Fill in the following settings:

#### Project Settings:
- **Project Name**: `helios-aeo` (or any name)
- **Framework Preset**: `Next.js` (auto-detected)
- **Root Directory**: `frontend` ⚠️ **IMPORTANT!** (click "Edit" to change)

#### Build Settings:
- **Build Command**: `npm run build` (default)
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install` (default)

### Step 10: Set Environment Variable

In the **"Environment Variables"** section:

1. Add new variable:
   - **Key**: `NEXT_PUBLIC_API_URL`
   - **Value**: Your Render backend URL from Step 5
     - Example: `https://helios-aeo-backend.onrender.com`
   - Click **"Add"**

### Step 11: Deploy Frontend

1. Click **"Deploy"** button
2. Vercel will start building (takes 2-5 minutes)
3. Wait for deployment to complete
4. **Copy your frontend URL** (e.g., `https://helios-aeo.vercel.app`)
5. ✅ **Frontend is deployed!**

---

## 🔗 PART 3: Connect Frontend & Backend

### Step 12: Update Backend CORS

1. Go back to **Render Dashboard**
2. Select your backend service
3. Go to **"Environment"** tab
4. Find `ALLOWED_ORIGINS` variable
5. Click **"Edit"** (pencil icon)
6. **Update the value** to your Vercel URL:
   ```
   https://your-app.vercel.app
   ```
   (Replace with your actual Vercel URL from Step 11)
7. Click **"Save Changes"**
8. Render will automatically restart the service

### Step 13: Verify Connection

1. Go to your **Vercel frontend URL**
2. You should see the HELIOS AEO interface
3. Enter a URL (e.g., `https://example.com`)
4. Click **"Run Audit"**
5. If it works, ✅ **Everything is connected!**

---

## ✅ Quick Verification Checklist

### Backend (Render):
- [ ] Service status is **"Live"**
- [ ] `/health` endpoint returns `{"status":"healthy"}`
- [ ] Environment variable `OPENAI_API_KEY` is set
- [ ] Environment variable `ALLOWED_ORIGINS` has your Vercel URL

### Frontend (Vercel):
- [ ] Deployment status is **"Ready"**
- [ ] Environment variable `NEXT_PUBLIC_API_URL` is set to Render URL
- [ ] Frontend loads without errors
- [ ] Can run an audit successfully

---

## 🔄 Updating Your Deployment

### After Making Code Changes:

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Your changes"
   git push origin main
   ```

2. **Automatic Deployment**:
   - **Render** automatically deploys backend on push
   - **Vercel** automatically deploys frontend on push
   - Check deployment status in respective dashboards

---

## 🐛 Troubleshooting

### Backend Not Starting?
- ✅ Check Render **Logs** tab for errors
- ✅ Verify `Root Directory` is `helios_aeo`
- ✅ Verify `Start Command` is correct
- ✅ Check that `OPENAI_API_KEY` is set correctly

### Frontend Build Failing?
- ✅ Check Vercel build logs
- ✅ Verify `Root Directory` is `frontend`
- ✅ Check that `NEXT_PUBLIC_API_URL` is set correctly
- ✅ Ensure all dependencies are in `package.json`

### API Calls Not Working?
- ✅ Verify `NEXT_PUBLIC_API_URL` points to Render backend
- ✅ Check browser console for CORS errors
- ✅ Verify `ALLOWED_ORIGINS` includes your Vercel URL
- ✅ Test backend URL directly: `https://your-backend.onrender.com/health`

### CORS Errors?
- ✅ Update `ALLOWED_ORIGINS` in Render with exact Vercel URL
- ✅ Include `https://` protocol in URL
- ✅ Restart Render service after updating

---

## 📊 Useful Links

- **Render Dashboard**: [dashboard.render.com](https://dashboard.render.com)
- **Vercel Dashboard**: [vercel.com/dashboard](https://vercel.com/dashboard)
- **GitHub Repository**: Your repo URL
- **Backend Health Check**: `https://your-backend.onrender.com/health`
- **Backend API Docs**: `https://your-backend.onrender.com/docs` (Swagger UI)
- **Frontend URL**: `https://your-app.vercel.app`

---

## 💡 Tips

1. **Keep URLs Handy**: Save your Render and Vercel URLs in a notes file
2. **Monitor Deployments**: Check both dashboards after pushing code
3. **Check Logs**: Both platforms provide detailed logs for debugging
4. **Free Tier Limits**:
   - Render: Services spin down after 15 min inactivity (cold start ~30s)
   - Vercel: Unlimited deployments on free tier
5. **Environment Variables**: Never commit API keys - always use env vars

---

## 🎉 You're Done!

Your HELIOS AEO application is now live:
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-backend.onrender.com`

Both will automatically update when you push to GitHub! 🚀

