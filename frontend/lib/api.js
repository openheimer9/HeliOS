import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://helios-aeo-backend.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

export const runAudit = async (url, mode = "full") => {
  try {
    const response = await api.post("/analyze", { url, mode });
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export default api;

