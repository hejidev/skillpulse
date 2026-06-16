"use client";

import { getLevel } from "@/lib/utils/xp";
import { motion } from "framer-motion";

type Props = {
  achievement: any;
  index: number;
};

export default function AchievementCard({ achievement, index }: Props) {
  const level = getLevel(achievement.progress || 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`relative p-6 rounded-2xl border transition overflow-hidden`}
    >
      {/* GLOW */}
      {achievement.unlocked && (
        <div className="absolute inset-0 blur-2xl opacity-30 bg-white" />
      )}

      {/* HEADER */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs uppercase opacity-70">
          {level}
        </span>

        <span className="text-xs font-semibold">
          {achievement.xpReward ? `+${achievement.xpReward} XP` : ""}
        </span>
      </div>

      {/* TITLE */}
      <h2 className="font-bold text-lg">
        {achievement.title}
      </h2>

      {/* DESC */}
      <p className="text-sm opacity-80 mt-1">
        {achievement.description}
      </p>

      {/* PROGRESS */}
      <div className="mt-4">
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-white/40 transition-all"
            style={{ width: `${achievement.progress || 0}%` }}
          />
        </div>

        <div className="flex justify-between text-xs mt-1 opacity-70">
          <span>{(achievement.progress || 0)}</span>
          <span>{achievement.progress || 0}%</span>
        </div>
      </div>

      {/* STATUS */}
      <div className="mt-4 text-xs font-semibold">
        {achievement.unlocked ? "🏆 Unlocked" : "🔒 Locked"}
      </div>
    </motion.div>
  );
}