"use client";

import { motion } from "framer-motion";

export function AchievementPopup({ achievement }: any) {
  if (!achievement) return null;

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 20, opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed top-4 right-4 z-50 bg-black border border-white/10 rounded-xl p-4 shadow-xl"
    >
      <p className="text-sm">
        {achievement.icon} Achievement Unlocked!
      </p>
      <h3 className="font-bold">{achievement.title}</h3>
    </motion.div>
  );
}