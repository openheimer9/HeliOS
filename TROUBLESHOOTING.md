# 🔧 Troubleshooting Guide - Network Errors

## Common Issues & Solutions

### Issue: "Network Error" or "ERR_NETWORK"

This usually means the frontend cannot connect to the backend. Here are the most common causes and fixes:

---

## 🔍 Step 1: Check Backend URL Configuration

### In Vercel (Frontend):
1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Check `NEXT_PUBLIC_API_URL`:
   - Should be: `https://your-backend.onrender.com`
   - Must include `https://`
   - Must NOT have trailing slash: ❌ `https://backend.com/` ✅ `https://backend.com`

### Quick Fix:
Update your Vercel environment variable:
```
NEXT_PUBLIC_API_URL=https://your-actual-backend-url.onrender.com
```

Then **redeploy** the frontend (Vercel will auto-deploy or you can manually trigger).

---

## 🔍 Step 2: Check Backend CORS Configuration

### In Render (Backend):
1. Go to your Render service dashboard
2. Navigate to **Environment** tab
3. Check `ALLOWED_ORIGINS`:
   - Should include your Vercel URL: `https://your-app.vercel.app`
   - Can be comma-separated: `https://app1.vercel.app,https://app2.vercel.app`
   - OR set to `*` for testing (not recommended for production)

### Quick Fix:
Update Render environment variable:
```
ALLOWED_ORIGINS=https://your-frontend.vercel.app
```

Render will automatically restart after updating.

---

## 🔍 Step 3: Verify Backend is Running

### Test Backend Directly:
1. Open browser and visit: `https://your-backend.onrender.com/health`
2. Should see: `{"status":"healthy"}`
3. If you see an error or timeout:
   - Backend might be spinning up (free tier takes ~30 seconds)
   - Backend might have crashed - check Render logs
   - Backend might not be deployed yet

### Check Render Logs:
1. Go to Render dashboard → Your Service → **Logs** tab
2. Look for:
   - ✅ "Application is live"
   - ❌ Python errors
   - ❌ Import errors
   - ❌ Missing environment variables

---

## 🔍 Step 4: Common Backend Issues

### Missing OPENAI_API_KEY:
**Symptom**: Backend starts but `/analyze` returns 500 error

**Fix**: 
1. Go to Render → Environment
2. Add: `OPENAI_API_KEY=sk-proj-your-key-here`
3. Restart service

### Backend Crashed After Upgrade:
**Symptom**: Backend won't start, logs show import errors

**Fix**:
1. Check `requirements.txt` has all dependencies
2. Verify `Procfile` has correct start command:
   ```
   gunicorn api:app --bind 0.0.0.0:$PORT --workers 2 --timeout 120
   ```
3. Check `Root Directory` is set to `helios_aeo`

---

## 🔍 Step 5: Browser Console Debugging

### Check Network Tab:
1. Open browser DevTools (F12)
2. Go to **Network** tab
3. Try running an analysis
4. Look for the request to `/analyze`:
   - **Status**: Should be 200 (success) or specific error code
   - **Preview**: See response data
   - **Headers**: Check if CORS headers are present

### Common Network Tab Findings:

**Status: (failed) or ERR_NETWORK**
- Backend is down or unreachable
- Wrong backend URL
- CORS blocking the request

**Status: 404**
- Endpoint not found
- Check backend URL includes `/analyze`

**Status: 500**
- Backend server error
- Check Render logs for Python errors

**Status: 200 but empty response**
- Backend returned but response is malformed
- Check backend logs

---

## 🛠️ Quick Debugging Steps

### 1. Test Backend Endpoints:
```bash
# Health check
curl https://your-backend.onrender.com/health

# Root endpoint
curl https://your-backend.onrender.com/

# Analyze endpoint (should fail without proper data, but shouldn't be network error)
curl -X POST https://your-backend.onrender.com/analyze \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'
```

### 2. Check Frontend Environment:
In browser console, run:
```javascript
console.log(process.env.NEXT_PUBLIC_API_URL)
```
Should show your backend URL (or undefined if not set).

### 3. Test from Browser:
Open: `https://your-backend.onrender.com/health`
- If it works: Backend is running, issue is CORS or frontend config
- If it fails: Backend is down, check Render

---

## ✅ Verification Checklist

- [ ] Backend health endpoint works: `https://backend.onrender.com/health`
- [ ] `NEXT_PUBLIC_API_URL` in Vercel matches your Render URL
- [ ] `ALLOWED_ORIGINS` in Render includes your Vercel URL
- [ ] `OPENAI_API_KEY` is set in Render
- [ ] No errors in Render logs
- [ ] Frontend shows correct backend URL in console

---

## 🚨 Still Not Working?

1. **Check Render Service Status**: Is it "Live"?
2. **Check Vercel Deployment**: Is it "Ready"?
3. **Test with curl/Postman**: Verify backend works independently
4. **Check browser console**: Look for CORS errors specifically
5. **Clear browser cache**: Hard refresh (Ctrl+Shift+R)

If still having issues, check:
- Backend logs in Render
- Frontend build logs in Vercel
- Browser Network tab for specific error codes

