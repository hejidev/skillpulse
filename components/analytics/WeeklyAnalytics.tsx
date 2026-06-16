"use client";

import { useQuery } from "@tanstack/react-query";
import API from "@/lib/api";
import { startOfWeek, endOfWeek, isWithinInterval } from "date-fns";

export default function WeeklyAnalytics({ skillId }: { skillId: string | null }) {
  const { data = [], isLoading } = useQuery({
    queryKey: ["progress", skillId],
    enabled: !!skillId, // 🚀 key fix
    queryFn: async () => {
      const res = await API.get(`/progress/${skillId}`);
      return res.data;
    },
  });

  const safeData = Array.isArray(data) ? data : [];

  const now = new Date();

  const weekData = safeData.filter((item: any) =>
    isWithinInterval(new Date(item.createdAt), {
      start: startOfWeek(now),
      end: endOfWeek(now),
    })
  );

  const total = weekData.reduce(
    (acc: number, item: any) => acc + item.hours,
    0
  );

  const avg = total / (weekData.length || 1);

  return (
    <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10">
      <h4 className="text-sm text-gray-400 mb-2">Weekly Analytics</h4>

      <p className="text-sm">
        ⏱ Total: <span className="font-semibold">{total} hrs</span>
      </p>

      <p className="text-sm">
        📊 Avg: {avg.toFixed(1)} hrs/day
      </p>

      <p className="text-xs text-green-400 mt-2">
        {total > 10 ? "🔥 Strong week!" : "⚡ Try to stay consistent"}
      </p>
    </div>
  );
}