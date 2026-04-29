"use client";

import { motion } from "framer-motion";

export default function RankBadge({ rank }: { rank: string }) {
  return (
    <motion.div
      key={rank}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200 }}
      className={`
        px-3 py-1 rounded-full text-sm font-bold
        ${
          rank === "Diamond"
            ? "bg-blue-500"
            : rank === "Gold"
            ? "bg-yellow-500"
            : rank === "Silver"
            ? "bg-gray-400"
            : "bg-orange-500"
        }
      `}
    >
      {rank}
    </motion.div>
  );
}