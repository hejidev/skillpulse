"use client";

import { useQuery } from "@tanstack/react-query";
import API from "@/lib/api";
import { calculateStreak } from "@/lib/utils/streak";

export default function SkillInsights({ skillId, skill }: any) {
  const { data = [] } = useQuery({
    queryKey: ["progress", skillId],
    queryFn: async () => {
      const res = await API.get(`/progress/${skillId}`);
      return res.data;
    },
  });

  if (!data.length) {
    return (
      <p className="text-sm text-gray-400 mt-3">
        No progress yet 🚀
      </p>
    );
  }

  const totalHours = data.reduce(
    (acc: number, item: any) => acc + item.hours,
    0
  );

  const streak = calculateStreak(data);

  const goalPercent = Math.min(
    100,
    (totalHours / skill.targetHours) * 100
  );

  return (
    <div className="mt-4 p-3 rounded-lg bg-white/5 border border-white/10 space-y-2">

      <p className="text-xs text-gray-400">Insights</p>

      <p className="text-sm">
        🔥 Streak: <span className="font-semibold">{streak} days</span>
      </p>

      <p className="text-sm">
        ⏱ {totalHours} / {skill.targetHours} hrs
      </p>

      {/* 🎯 PROGRESS BAR */}
      <div className="w-full h-2 bg-white/10 rounded-full">
        <div
          className="h-2 bg-green-500 rounded-full"
          style={{ width: `${goalPercent}%` }}
        />
      </div>

      <p className="text-xs text-green-400">
        {goalPercent >= 80
          ? "🔥 Almost there!"
          : "🚀 Keep building consistency"}
      </p>
    </div>
  );
}