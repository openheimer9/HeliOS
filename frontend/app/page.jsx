"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "./components/Navbar";
import InputForm from "./components/InputForm";
import Dashboard from "./components/Dashboard";

export default function Home() {
  const [results, setResults] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleResults = (data) => {
    setResults(data);
    setHasSearched(true);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!hasSearched ? (
          <div className="max-w-4xl mx-auto">
            <InputForm onResults={handleResults} />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-6xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 flex items-center justify-between p-6 bg-gradient-to-r from-primary/5 via-cyan-400/5 to-primary/5 rounded-2xl border border-primary/20 backdrop-blur-sm"
            >
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent">
                  Analysis Results
                </h2>
                <p className="text-sm text-muted-foreground mt-1">Your brand visibility insights</p>
              </div>
              <motion.button
                onClick={() => {
                  setResults(null);
                  setHasSearched(false);
                }}
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(79, 209, 197, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-primary to-cyan-400 text-primary-foreground font-semibold rounded-xl hover:from-primary/90 hover:to-cyan-400/90 transition-all glow relative overflow-hidden"
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
                <span className="relative z-10">New Analysis</span>
              </motion.button>
            </motion.div>
            <Dashboard data={results} />
          </motion.div>
        )}
      </main>
      <footer className="border-t border-primary/20 mt-16 py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-muted-foreground">
            Powered by <span className="text-primary font-semibold">HELIOS</span> | AEO Visibility Engine
          </p>
        </div>
      </footer>
    </div>
  );
}

