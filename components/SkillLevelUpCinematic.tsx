"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

export default function SkillLevelUpCinematic({
  open,
  skill,
  level,
  xpGained = 0,
  onClose,
}: any) {
  useEffect(() => {
    if (!open) return;

    const timer = setTimeout(() => {
      onClose?.();
    }, 3500); // auto close after cinematic

    return () => clearTimeout(timer);
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-99 flex items-center justify-center bg-black/90 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* 🌌 background glow */}
          <div className="absolute inset-0 bg-linear-to-br from-purple-900/30 via-black to-black" />

          {/* ✨ animated pulses */}
          <div className="absolute w-150 h-150 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute w-100 h-100 bg-blue-500/20 rounded-full blur-2xl animate-ping" />

          {/* 🎬 content */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ type: "spring", stiffness: 120 }}
            className="text-center text-white relative z-10"
          >
            {/* LEVEL UP TEXT */}
            <motion.h1
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-7xl font-extrabold tracking-widest text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-pink-500"
            >
              LEVEL UP
            </motion.h1>

            {/* SKILL NAME */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-4 text-2xl md:text-3xl font-semibold"
            >
              {skill?.name}
            </motion.p>

            {/* LEVEL INFO */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.7, type: "spring" }}
              className="mt-6 inline-block px-6 py-3 rounded-xl bg-white/10 border border-white/20"
            >
              <p className="text-lg">
                New Level:{" "}
                <span className="font-bold text-green-400">
                  {level}
                </span>
              </p>

              {xpGained > 0 && (
                <p className="text-sm text-gray-300 mt-1">
                  +{xpGained} XP gained
                </p>
              )}
            </motion.div>

            {/* 🎆 fake particles */}
            <div className="absolute inset-0 pointer-events-none">
              {Array.from({ length: 12 }).map((_, i) => (
                <span
                  key={i}
                  className="absolute w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}