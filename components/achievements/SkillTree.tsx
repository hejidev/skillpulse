"use client";

import { motion } from "framer-motion";

type Node = {
  id: string;
  title: string;
  unlocked: boolean;
  xpRequired: number;
  description: string;
  x: number;
  y: number;
};

const nodes: Node[] = [
  {
    id: "start",
    title: "Beginner",
    unlocked: true,
    xpRequired: 0,
    description: "Start your journey",
    x: 50,
    y: 300,
  },
  {
    id: "focus",
    title: "Focus Control",
    unlocked: true,
    xpRequired: 100,
    description: "Improve attention span",
    x: 200,
    y: 200,
  },
  {
    id: "consistency",
    title: "Consistency",
    unlocked: false,
    xpRequired: 300,
    description: "Build daily habit",
    x: 400,
    y: 150,
  },
  {
    id: "deepwork",
    title: "Deep Work Master",
    unlocked: false,
    xpRequired: 600,
    description: "2+ hour sessions",
    x: 600,
    y: 250,
  },
  {
    id: "legend",
    title: "Legend Mode",
    unlocked: false,
    xpRequired: 1000,
    description: "Elite performance",
    x: 800,
    y: 180,
  },
];

export default function SkillTree() {
  return (
    <div className="relative w-full h-[500px] bg-black/30 rounded-2xl overflow-hidden border border-white/10">

      {/* CONNECTION LINES */}
      <svg className="absolute w-full h-full">
        {nodes.map((node, i) => {
          if (i === 0) return null;

          const prev = nodes[i - 1];

          return (
            <line
              key={node.id}
              x1={prev.x}
              y1={prev.y}
              x2={node.x}
              y2={node.y}
              stroke="rgba(99,102,241,0.4)"
              strokeWidth="2"
            />
          );
        })}
      </svg>

      {/* NODES */}
      {nodes.map((node) => (
        <motion.div
          key={node.id}
          className={`absolute w-32 p-3 rounded-xl text-center border
            ${
              node.unlocked
                ? "bg-indigo-500/20 border-indigo-500"
                : "bg-white/5 border-white/10 opacity-60"
            }`}
          style={{ left: node.x, top: node.y }}
          whileHover={{ scale: 1.1 }}
        >
          <p className="text-xs font-bold">{node.title}</p>
          <p className="text-[10px] text-muted-foreground">
            {node.xpRequired} XP
          </p>
        </motion.div>
      ))}
    </div>
  );
}