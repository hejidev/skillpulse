"use client";

import { motion } from "framer-motion";

export default function EvolutionModal({
  achievement,
  onClose,
}: any) {
  return (
    <motion.div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      {/* CARD */}
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-[420px] p-8 rounded-2xl bg-gradient-to-br from-indigo-900 to-purple-900 border border-white/10 text-center"
      >
        {/* PARTICLES */}
        <motion.div
          className="absolute inset-0 bg-purple-500/10 blur-3xl"
          animate={{ opacity: [0.2, 0.6, 0.2] }}
          transition={{ repeat: Infinity, duration: 2 }}
        />

        {/* TITLE */}
        <h2 className="text-2xl font-bold mb-2">
          🎉 Achievement Unlocked!
        </h2>

        <p className="text-indigo-200 mb-4">
          {achievement.title}
        </p>

        {/* RANK EVOLUTION */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1.2 }}
          transition={{ type: "spring" }}
          className="text-5xl font-bold text-yellow-300"
        >
          {achievement.level.toUpperCase()}
        </motion.div>

        <p className="text-sm text-gray-300 mt-4">
          {achievement.description}
        </p>

        {/* XP REWARD */}
        <div className="mt-6 text-green-400 font-bold">
          +{achievement.xpReward} XP gained
        </div>

        {/* BUTTON */}
        <button
          onClick={onClose}
          className="mt-6 px-4 py-2 bg-white/10 rounded-xl hover:bg-white/20"
        >
          Continue
        </button>
      </motion.div>
    </motion.div>
  );
}