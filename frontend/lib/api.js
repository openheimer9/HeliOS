import axios from "axios";

// Get base URL - ensure it works in both server and client
const getBaseURL = () => {
  // In browser/client-side, use window location if env var not set
  if (typeof window !== 'undefined') {
    const envURL = process.env.NEXT_PUBLIC_API_URL;
    if (envURL) return envURL;
    // Fallback for development
    return "http://127.0.0.1:8000";
  }
  // Server-side
  return process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
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

export const runAudit = async (url, mode = "full") => {
  try {
    const response = await api.post("/analyze", { url, mode });
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
      console.error("Error code:", error.code);
      
      let errorMsg = `Cannot connect to backend at ${baseURL}. `;
      errorMsg += "Possible causes:\n";
      errorMsg += "1. Backend is not running or down\n";
      errorMsg += "2. CORS is not configured correctly\n";
      errorMsg += "3. Wrong backend URL in environment variables\n";
      errorMsg += `Check: Is ${baseURL} accessible?`;
      
      throw new Error(errorMsg);
    } else {
      // Request setup error
      console.error("Request setup error:", error.message);
      throw new Error(`Request error: ${error.message}`);
    }
  }
};

export default api;

