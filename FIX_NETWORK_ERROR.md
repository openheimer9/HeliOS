# 🔧 Fix Network Error - Quick Guide

## The Problem
You're seeing `ERR_NETWORK` or "Network Error" when trying to analyze a URL.

## ✅ Quick Fixes

### 1. Check Vercel Environment Variable (MOST IMPORTANT)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: **helios-aeo** (or your project name)
3. Go to **Settings** → **Environment Variables**
4. Find or add: `NEXT_PUBLIC_API_URL`
5. **Update value** to your actual Render backend URL:
   ```
   https://your-backend-name.onrender.com
   ```
   (Replace with your actual Render URL - no trailing slash!)
6. **Redeploy** frontend:
   - Go to **Deployments** tab
   - Click **⋯** (three dots) on latest deployment
   - Click **Redeploy**
   - Or push to GitHub to auto-redeploy

### 2. Check Render CORS Configuration

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Select your backend service
3. Go to **Environment** tab
4. Check `ALLOWED_ORIGINS`:
   - Should be: `https://your-frontend.vercel.app`
   - Or set to: `*` (for testing - update later for security)
5. If changed, Render will auto-restart

### 3. Verify Backend is Running

Test directly in browser:
```
https://your-backend.onrender.com/health
```
Should show: `{"status":"healthy"}`

If it doesn't load:
- Backend might be spinning up (wait 30 seconds)
- Check Render logs for errors
- Verify backend is "Live" status

### 4. Check Backend Logs in Render

1. Render Dashboard → Your Service
2. Click **Logs** tab
3. Look for:
   - ✅ "Application is live"
   - ❌ Python errors
   - ❌ Import errors
   - ❌ Missing environment variables

---

## 🔍 Debugging Steps

### Step 1: Check Frontend Environment Variable

In browser console, run:
```javascript
console.log(process.env.NEXT_PUBLIC_API_URL)
```

**Expected**: Your Render backend URL
**If undefined**: Environment variable not set in Vercel

### Step 2: Test Backend Health

Open in new tab:
```
https://your-backend.onrender.com/health
```

**Should return**: `{"status":"healthy"}`
**If error**: Backend is down or misconfigured

### Step 3: Check CORS

1. Open browser DevTools (F12)
2. Go to **Network** tab
3. Try running an analysis
4. Look for the `/analyze` request:
   - **Status**: Should be 200 (or specific error code)
   - **Headers**: Look for `Access-Control-Allow-Origin`
   - **CORS Error**: If you see CORS error, update `ALLOWED_ORIGINS` in Render

---

## 🎯 Most Common Solutions

### Solution 1: Update Vercel Environment Variable
```bash
# In Vercel Dashboard:
NEXT_PUBLIC_API_URL=https://your-actual-backend.onrender.com
```
Then redeploy.

### Solution 2: Update Render CORS
```bash
# In Render Dashboard Environment:
ALLOWED_ORIGINS=https://your-frontend.vercel.app
```
Render will auto-restart.

### Solution 3: Verify Backend Deployment
- Check Render service is "Live"
- Check `OPENAI_API_KEY` is set
- Check logs for startup errors

---

## ⚡ Quick Test

After making changes:

1. **Wait 30 seconds** (for Render to restart if changed CORS)
2. **Redeploy frontend** in Vercel (if changed env var)
3. **Hard refresh** browser (Ctrl+Shift+R)
4. **Try again**

---

## 📝 Configuration Checklist

- [ ] `NEXT_PUBLIC_API_URL` in Vercel = Your Render backend URL
- [ ] `ALLOWED_ORIGINS` in Render = Your Vercel frontend URL (or `*`)
- [ ] `OPENAI_API_KEY` in Render = Your OpenAI API key
- [ ] Backend service is "Live" in Render
- [ ] Frontend is "Ready" in Vercel
- [ ] No errors in Render logs
- [ ] No errors in Vercel build logs

---

## 🆘 Still Not Working?

1. Share the exact backend URL from Render
2. Share the exact frontend URL from Vercel
3. Check browser console for specific error
4. Check Render logs for Python errors
5. Verify `OPENAI_API_KEY` is valid and has credits

