"use client";

import { motion } from "framer-motion";
import { Sparkles, Brain, Zap } from "lucide-react";
import { useState, useEffect } from "react";

const loadingMessages = [
  "Scraping website content...",
  "Analyzing brand visibility...",
  "Processing AI models...",
  "Generating insights...",
  "Creating scorecard...",
  "Finalizing report...",
];

export default function Loader() {
  const [currentMessage, setCurrentMessage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % loadingMessages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-[500px] gap-6 relative"
    >
      {/* Animated background circles */}
      <div className="absolute inset-0 flex items-center justify-center">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-64 h-64 rounded-full border border-primary/20"
            animate={{
              scale: [1, 1.2 + i * 0.2, 1],
              opacity: [0.3, 0.1, 0.3],
            }}
            transition={{
              duration: 2 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              borderRadius: "50%",
            }}
          />
        ))}
      </div>

      {/* Main loader icon */}
      <div className="relative z-10">
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
          }}
          className="relative"
        >
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-cyan-400/20 flex items-center justify-center border-2 border-primary/30 glow-strong">
            <Brain className="h-12 w-12 text-primary" />
          </div>
          {/* Orbiting icons */}
          {[
            { icon: Sparkles, delay: 0 },
            { icon: Zap, delay: 0.5 },
            { icon: Brain, delay: 1 },
          ].map(({ icon: Icon, delay }, i) => (
            <motion.div
              key={i}
              className="absolute inset-0"
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
                delay,
              }}
            >
              <motion.div
                className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.6, 1, 0.6],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Icon className="h-6 w-6 text-primary" />
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Loading message */}
      <motion.div
        key={currentMessage}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="text-center space-y-2 relative z-10"
      >
        <motion.p
          className="text-lg font-semibold text-primary"
          animate={{
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {loadingMessages[currentMessage]}
        </motion.p>
      </motion.div>

      {/* Progress bar */}
      <div className="w-80 max-w-full relative z-10">
        <div className="h-2 bg-primary/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary via-cyan-400 to-primary rounded-full relative"
            animate={{
              width: ["0%", "100%"],
              x: ["-100%", "100%"],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              backgroundSize: "200% 100%",
            }}
          />
        </div>
        {/* Animated dots */}
        <div className="flex justify-center gap-2 mt-4">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-primary"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

