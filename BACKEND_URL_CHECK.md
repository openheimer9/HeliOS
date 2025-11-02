# 🔍 Backend URL Verification

## Current Issue
The frontend cannot connect to the backend, even though the URL looks correct:
```
https://helios-aeo-backend.onrender.com
```

## ✅ Step-by-Step Verification

### Step 1: Verify Backend URL in Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Find your backend service (might be named differently!)
3. Look at the service URL in the dashboard
4. **Common Render URLs look like:**
   - `https://helios-aeo-backend.onrender.com` ✅ (if service name is `helios-aeo-backend`)
   - `https://your-service-name.onrender.com` (varies by service name)

**Important:** The service name in Render might be different from what you think. Check the actual URL in Render dashboard.

---

### Step 2: Test Backend Directly

Open these URLs in your browser:

1. **Health Check:**
   ```
   https://helios-aeo-backend.onrender.com/health
   ```
   **Expected:** `{"status":"healthy"}`

2. **Root Endpoint:**
   ```
   https://helios-aeo-backend.onrender.com/
   ```
   **Expected:** `{"message":"HELIOS AEO API","status":"running"}`

**If these don't work:**
- ❌ Backend is not deployed or service name is wrong
- ❌ Backend service is down or crashed
- ❌ Check Render logs for errors

---

### Step 3: Check Render Service Status

1. Go to Render Dashboard
2. Select your backend service
3. Check **Status**: Should be "Live" (green)
4. If it's not "Live":
   - Service might be spinning up (wait 30 seconds)
   - Service might have crashed (check logs)
   - Service might not be deployed yet

---

### Step 4: Verify Backend Service Name

The URL in Vercel must match **exactly** the URL in Render:

1. **Render Dashboard** → Your Service → Look at the URL shown
2. **Vercel** → Settings → Environment Variables → `NEXT_PUBLIC_API_URL`
3. **Must match exactly!** (no trailing slash)

**Example:**
- Render shows: `https://helios-aeo-backend.onrender.com`
- Vercel should have: `https://helios-aeo-backend.onrender.com` ✅

---

### Step 5: Check Render Logs

1. Render Dashboard → Your Service → **Logs** tab
2. Look for:
   - ✅ "Application is live"
   - ✅ "Listening on port..."
   - ✅ "CORS configured with allowed_origins..."
   - ❌ Python errors
   - ❌ Import errors
   - ❌ "OPENAI_API_KEY not set"

**Common errors:**
- Missing `OPENAI_API_KEY` → Add it in Render Environment
- Import errors → Check `requirements.txt`
- Port errors → Check `Procfile`

---

### Step 6: Verify CORS Configuration

1. **Render Dashboard** → Your Service → **Environment** tab
2. Check `ALLOWED_ORIGINS`:
   - Should be: `https://your-vercel-app.vercel.app`
   - OR: `*` (for testing)

3. **If not set:** Add it:
   ```
   ALLOWED_ORIGINS=https://your-vercel-app.vercel.app
   ```
   Or for testing:
   ```
   ALLOWED_ORIGINS=*
   ```

4. **Render will auto-restart** after saving

---

## 🔧 Quick Fix Checklist

- [ ] Backend service exists in Render dashboard
- [ ] Backend service status is "Live"
- [ ] Backend URL matches between Render and Vercel
- [ ] `/health` endpoint works when opened in browser
- [ ] `ALLOWED_ORIGINS` is set in Render Environment
- [ ] `OPENAI_API_KEY` is set in Render Environment
- [ ] `NEXT_PUBLIC_API_URL` in Vercel has NO trailing slash
- [ ] Frontend has been redeployed after env var changes
- [ ] Backend has restarted after CORS changes

---

## 🆘 Common Issues

### Issue 1: Backend URL Not Found (404)

**Problem:** Backend service doesn't exist or wrong URL

**Fix:**
1. Check Render dashboard for actual service URL
2. Update Vercel `NEXT_PUBLIC_API_URL` to match
3. Redeploy frontend

---

### Issue 2: CORS Error

**Problem:** `ALLOWED_ORIGINS` not configured

**Fix:**
1. Go to Render → Environment
2. Set `ALLOWED_ORIGINS` to your Vercel URL (or `*`)
3. Wait for auto-restart (30 seconds)
4. Try again

---

### Issue 3: Backend Down/Crashed

**Problem:** Service not running

**Fix:**
1. Check Render logs for errors
2. Verify `OPENAI_API_KEY` is set
3. Check `Procfile` and `requirements.txt`
4. Restart service in Render dashboard

---

### Issue 4: Network Error (No Response)

**Problem:** Can't reach backend at all

**Possible causes:**
1. Wrong backend URL in Vercel
2. Backend service not deployed
3. Network/firewall issue
4. Backend crashed on startup

**Fix:**
1. Test backend URL directly in browser (`/health`)
2. If it works → CORS issue
3. If it doesn't work → Backend is down or wrong URL

---

## 📝 Action Items

1. **First:** Test `https://helios-aeo-backend.onrender.com/health` in browser
2. **If it works:** Update CORS in Render
3. **If it doesn't work:** Check Render service status and logs
4. **Update:** Vercel environment variable with correct URL
5. **Redeploy:** Both frontend and backend if needed

