"use client";

import { useEffect, useRef } from "react";

export function LevelCard({ xp = 0 }: { xp: number }) {
  const safeXP = Number(xp) || 0;

  const level = Math.floor(0.1 * Math.sqrt(safeXP));

  const currentXP = Math.pow(level / 0.1, 2);
  const nextXP = Math.pow((level + 1) / 0.1, 2);

  const prevLevelRef = useRef(level);

  const progress =
    nextXP > currentXP
      ? ((safeXP - currentXP) / (nextXP - currentXP)) * 100
      : 0;

  // 🔥 LEVEL UP SOUND
  useEffect(() => {
    if (prevLevelRef.current !== level) {
      const audio = new Audio("/sounds/level-up.mp3");
      audio.volume = 0.6;

      audio.play().catch(() => {
        console.log("Autoplay blocked");
      });

      prevLevelRef.current = level;
    }
  }, [level]);

  return (
    <div className="p-6 rounded-2xl border border-white/10 bg-white/5 space-y-3">

      <div className="flex justify-between">
        <h2 className="text-sm text-gray-400">Level</h2>
        <p className="text-xs text-gray-500">{safeXP} XP</p>
      </div>

      <h1 className="text-3xl font-bold">Lv. {level}</h1>

      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-linear-to-r from-indigo-500 to-purple-600 transition-all"
          style={{ width: `${Math.max(0, Math.min(progress, 100))}%` }}
        />
      </div>

      <p className="text-xs text-gray-400">
        {Math.max(0, Math.ceil(nextXP - safeXP))} XP to next level
      </p>

    </div>
  );
}