"use client";

import { motion } from "framer-motion";
import { Sparkles, Zap } from "lucide-react";

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="border-b border-primary/20 bg-background/90 backdrop-blur-xl sticky top-0 z-50 shadow-lg shadow-primary/5"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <motion.div
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <motion.div
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-cyan-400/20 rounded-full blur-xl" />
              <Sparkles className="h-7 w-7 text-primary relative z-10" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-cyan-400 to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-[shimmer_3s_ease-in-out_infinite]">
                HELIOS
              </h1>
              <span className="text-xs text-muted-foreground block -mt-1">AI Visibility Architect</span>
            </div>
          </motion.div>
          <div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-lg bg-primary/5 border border-primary/10">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium text-foreground">GPT-4 Turbo</span>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}

