"use client";

import { motion, AnimatePresence } from "framer-motion";

export default function SkillLevelUpPopup({
  skill,
  level,
  onClose,
}: any) {
  return (
    <AnimatePresence>
      {skill && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 50 }}
          className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50"
        >
          <div className="bg-black/90 border border-purple-500 text-white px-6 py-4 rounded-2xl shadow-xl text-center">
            <p className="text-lg font-bold">
              🔥 {skill.name} just leveled up!
            </p>
            <p className="text-purple-300 text-sm mt-1">
              Level {level}
            </p>

            <button
              onClick={onClose}
              className="mt-3 text-xs text-gray-400 hover:text-white border border-gray-400 hover:border-white rounded-full px-3 py-1 transition"
            >
              close
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}