"use client";

import { motion, AnimatePresence } from "framer-motion";

export default function XPFloatingText({ xp }: any) {
  return (
    <AnimatePresence>
      {xp && (
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: -50 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="fixed bottom-20 right-10 text-green-400 font-bold text-lg z-50"
        >
          +{xp} XP
        </motion.div>
      )}
    </AnimatePresence>
  );
}