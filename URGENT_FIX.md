# 🚨 URGENT FIX - Network Error

## Problem
The backend URL has a **trailing slash** in Vercel environment variable:
```
https://helios-aeo-backend.onrender.com/  ❌ (wrong - has trailing slash)
```

## ✅ IMMEDIATE FIX (Do This Now!)

### Step 1: Fix Vercel Environment Variable

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Find `NEXT_PUBLIC_API_URL`
5. **Change it to** (remove trailing slash):
   ```
   https://helios-aeo-backend.onrender.com
   ```
   **NO trailing slash!**
6. **Save** and **Redeploy** your frontend

### Step 2: Fix Render CORS

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Select your backend service: `helios-aeo-backend`
3. Go to **Environment** tab
4. Find or add `ALLOWED_ORIGINS`
5. Set value to:
   ```
   https://your-frontend.vercel.app
   ```
   Replace `your-frontend` with your actual Vercel app name, OR use:
   ```
   *
   ```
   (for testing - allows all origins)
6. Render will **auto-restart** after saving

### Step 3: Verify Backend is Running

Open in browser:
```
https://helios-aeo-backend.onrender.com/health
```

Should show: `{"status":"healthy"}`

If not:
- Backend might be spinning up (wait 30 seconds)
- Check Render logs for errors
- Verify service status is "Live"

---

## ✅ After Making Changes

1. **Wait 30 seconds** for Render to restart
2. **Redeploy frontend** in Vercel (or wait for auto-deploy)
3. **Hard refresh** browser: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
4. **Try again**

---

## 🔍 Verify It's Fixed

Open browser console (F12) and look for:
- ✅ `Making request to: https://helios-aeo-backend.onrender.com/analyze`
- ❌ Should NOT see trailing slash in URL
- ✅ Request should complete successfully

---

## 📋 Configuration Checklist

- [ ] `NEXT_PUBLIC_API_URL` in Vercel = `https://helios-aeo-backend.onrender.com` (NO trailing slash)
- [ ] `ALLOWED_ORIGINS` in Render = Your Vercel URL OR `*`
- [ ] `OPENAI_API_KEY` is set in Render
- [ ] Backend service is "Live" in Render
- [ ] Frontend is "Ready" in Vercel
- [ ] `/health` endpoint works: `https://helios-aeo-backend.onrender.com/health`

---

## 🆘 Still Not Working?

1. Check browser console for exact error
2. Check Render logs for backend errors
3. Check Vercel deployment logs for build errors
4. Verify backend URL is correct (no trailing slash)
5. Verify CORS includes your frontend URL

