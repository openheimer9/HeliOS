import axios from "axios";

// Get base URL - ensure it works in both server and client
// IMPORTANT: Remove trailing slash to prevent double slashes in URLs
const getBaseURL = () => {
  let url;
  // In browser/client-side, use window location if env var not set
  if (typeof window !== 'undefined') {
    url = process.env.NEXT_PUBLIC_API_URL;
    if (!url) {
      // Fallback for development
      return "http://127.0.0.1:8000";
    }
  } else {
    // Server-side
    url = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  }
  
  // Remove trailing slash if present
  return url.replace(/\/+$/, '');
};

const baseURL = getBaseURL();

const api = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
  timeout: 120000, // 120 seconds for OpenAI API calls
  withCredentials: false,
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`Making request to: ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Response interceptor error:", error);
    return Promise.reject(error);
  }
);

// Test backend connectivity first
export const testBackendConnection = async () => {
  try {
    const response = await api.get("/health");
    console.log("Backend health check:", response.data);
    return true;
  } catch (error) {
    console.error("Backend health check failed:", error);
    return false;
  }
};

export const runAudit = async (url, mode = "full") => {
  try {
    // Test backend connectivity first (optional - doesn't block)
    const isBackendUp = await testBackendConnection();
    if (!isBackendUp) {
      console.warn("Backend health check failed, but continuing with request...");
    }
    
    // Ensure we're using the correct endpoint path (no double slashes)
    const endpoint = "/analyze";
    const fullUrl = `${baseURL}${endpoint}`;
    
    console.log(`Attempting to connect to: ${fullUrl}`);
    console.log(`Base URL: ${baseURL}`);
    
    const response = await api.post(endpoint, { url, mode });
    console.log("Successfully received response from backend");
    return response.data;
  } catch (error) {
    // Enhanced error logging with specific messages
    if (error.response) {
      // Server responded with error status (400, 500, etc.)
      const status = error.response.status;
      const detail = error.response.data?.detail || error.response.data?.message || `Server error: ${status}`;
      console.error(`API Error ${status}:`, detail);
      throw new Error(detail);
    } else if (error.request) {
      // Request made but no response received (network/CORS/backend down)
      console.error("Network Error:", error.message);
      console.error("Backend URL configured:", baseURL);
      console.error("Full endpoint URL:", `${baseURL}/analyze`);
      console.error("Error code:", error.code);
      console.error("Request status:", error.request?.status);
      
      // Check if it's a CORS error specifically
      const isCorsError = error.message.includes('CORS') || 
                         error.code === 'ERR_NETWORK' ||
                         (error.request && error.request.status === 0);
      
      let errorMsg = `Cannot connect to backend at ${baseURL}/analyze.\n\n`;
      
      if (isCorsError) {
        errorMsg += "🔴 CORS Error Detected!\n";
        errorMsg += "Fix: Update ALLOWED_ORIGINS in Render to include your Vercel URL.\n";
        errorMsg += `Your Vercel URL: ${typeof window !== 'undefined' ? window.location.origin : 'unknown'}\n\n`;
      }
      
      errorMsg += "Possible causes:\n";
      errorMsg += "1. Backend is not running or down\n";
      errorMsg += "2. CORS is not configured correctly in Render\n";
      errorMsg += "3. Wrong backend URL in Vercel environment variables (check for trailing slash!)\n";
      errorMsg += `4. Check backend health: ${baseURL}/health\n\n`;
      errorMsg += "Quick fix:\n";
      errorMsg += "1. Go to Render → Your Service → Environment\n";
      errorMsg += "2. Set ALLOWED_ORIGINS to your Vercel URL (or * for testing)\n";
      errorMsg += "3. Go to Vercel → Settings → Environment Variables\n";
      errorMsg += `4. Set NEXT_PUBLIC_API_URL to: ${baseURL} (NO trailing slash!)`;
      
      throw new Error(errorMsg);
    } else {
      // Request setup error
      console.error("Request setup error:", error.message);
      throw new Error(`Request error: ${error.message}`);
    }
  }
};

export default api;

