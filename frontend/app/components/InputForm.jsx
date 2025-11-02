"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Sparkles } from "lucide-react";
import { runAudit } from "../../lib/api";
import Loader from "./Loader";

export default function InputForm({ onResults }) {
  const [url, setUrl] = useState("");
  const [mode, setMode] = useState("full");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim()) {
      setError("Please enter a valid URL");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const results = await runAudit(url, mode);
      onResults(results);
    } catch (err) {
      // Handle different error types
      let errorMessage = "Failed to analyze. Please check your backend connection.";
      
      if (err.message) {
        errorMessage = err.message;
      } else if (err.response?.data?.detail) {
        errorMessage = err.response.data.detail;
      } else       if (err.code === "ERR_NETWORK" || err.message?.includes("Cannot connect")) {
        errorMessage = err.message || `Cannot connect to backend. Please check:\n1. Backend is running\n2. CORS is configured\n3. Backend URL is correct in Vercel environment variables`;
      }
      
      setError(errorMessage);
      console.error("Full error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto"
    >
      <div className="text-center mb-10">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 200,
            damping: 15,
            delay: 0.2
          }}
          className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 via-primary/10 to-cyan-400/20 mb-6 glow-strong relative overflow-hidden"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent"
          />
          <Sparkles className="h-12 w-12 text-primary relative z-10" />
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-5xl font-bold mb-3 bg-gradient-to-r from-primary via-cyan-400 to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-[shimmer_3s_ease-in-out_infinite]"
        >
          Analyze Brand Visibility
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-muted-foreground text-lg"
        >
          Discover how AI models perceive your brand
        </motion.p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="url" className="text-sm font-medium text-foreground">
            Brand URL
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <motion.input
              id="url"
              type="url"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setError(null);
              }}
              placeholder="https://example.com"
              whileFocus={{ scale: 1.01 }}
              className="w-full pl-10 pr-4 py-4 bg-secondary/30 backdrop-blur-sm border border-primary/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-foreground placeholder:text-muted-foreground shadow-lg hover:border-primary/40"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="mode" className="text-sm font-medium text-foreground">
            Analysis Type
          </label>
          <select
            id="mode"
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="w-full px-4 py-4 bg-secondary/30 backdrop-blur-sm border border-primary/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 focus:scale-[1.01] transition-all text-foreground shadow-lg hover:border-primary/40 cursor-pointer"
          >
            <option value="full">Full Analysis</option>
            <option value="quick">Quick Analysis</option>
          </select>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm"
          >
            {error}
          </motion.div>
        )}

        <motion.button
          type="submit"
          whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(79, 209, 197, 0.5)" }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 bg-gradient-to-r from-primary to-cyan-400 text-primary-foreground font-semibold rounded-xl hover:from-primary/90 hover:to-cyan-400/90 transition-all glow-strong relative overflow-hidden group"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          <span className="relative z-10 flex items-center justify-center gap-2">
            <Sparkles className="h-5 w-5" />
            Run Audit
          </span>
        </motion.button>
      </form>
    </motion.div>
  );
}

