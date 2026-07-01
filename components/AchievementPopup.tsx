"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export function AchievementPopup({ achievement }: any) {
  if (!achievement) return null;

  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => setExpanded((prev) => !prev);

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 20, opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed top-12 right-4 z-50"
    >
      {/* Collapsed state: just icon */}
      {!expanded && (
        <button
          onClick={handleToggle}
          className="
            flex items-center justify-center
            w-10 h-10 rounded-full
            bg-background border border-border
            shadow-xl text-lg
          "
          aria-label="Show achievement"
        >
          {achievement.icon}
        </button>
      )}

      {/* Expanded state: full text card */}
      {expanded && (
        <button
          onClick={handleToggle}
          className="
            bg-background border border-border rounded-xl
            px-2 py-1 shadow-xl text-left
            flex flex-col gap-1 min-w-40
          "
        >
          <p className="text-xs">
            {achievement.icon} Achievement Unlocked!
          </p>
          <h3 className="font-bold text-xs">{achievement.title}</h3>
          {achievement.description && (
            <p className="text-[11px] text-muted-foreground">
              {achievement.description}
            </p>
          )}
          <span className="mt-1 text-[10px] text-primary underline">
            Tap to hide
          </span>
        </button>
      )}
    </motion.div>
  );
}