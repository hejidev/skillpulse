"use client";

import { useQuery } from "@tanstack/react-query";
import API from "@/lib/api";
import { useMemo } from "react";
import { differenceInDays } from "date-fns";
import { calculateStreak } from "@/lib/utils/streak";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type ProgressEntry = {
  hours: number;
  createdAt: string;
};

export default function AICoach({ skill }: any) {
  if (!skill?._id) return null;

  // ================= PROGRESS =================
  const { data: progress = [] } = useQuery<ProgressEntry[]>({
    queryKey: ["progress", skill._id],
    queryFn: async () => {
      const res = await API.get(`/progress/${skill._id}`);
      return res.data;
    },
    enabled: !!skill?._id,
  });

  // ================= METRICS =================
  const metrics = useMemo(() => {
    if (!progress.length) return null;

    const last7 = progress.slice(-7);

    const activeDays = last7.filter((d: ProgressEntry) => d.hours > 0).length;

    const lastEntry = progress.at(-1);

    return {
      bestDay: "N/A",
      worstDay: "N/A",
      consistencyScore: (activeDays / 7) * 100,
      lastActiveDaysAgo: lastEntry
        ? differenceInDays(new Date(), new Date(lastEntry.createdAt))
        : 0,
      streak: calculateStreak(progress),
      weeklyHours: last7.reduce((a: number, b: ProgressEntry) => a + b.hours, 0),
      goalPercent: (skill.totalHours / skill.targetHours) * 100,
    };
  }, [progress, skill]);

  // ================= AI =================
  const { data: aiMessage, isLoading } = useQuery({
    queryKey: ["ai-coach", skill._id, metrics?.streak],
    queryFn: async () => {
      const res = await API.post("/coach", {
        skillId: skill._id,
        skillName: skill.name,
        ...metrics,
      });

      return res.data;
    },
    enabled: !!metrics,
  });

  return (
    <Card className="p-5 space-y-3 border bg-emerald-500/10 backdrop-blur-xl">
      <p className="text-xs text-muted-foreground">AI Insight</p>

      {isLoading ? (
        <Skeleton className="h-5 w-full" />
      ) : (
        <p className="text-sm font-medium">
          {aiMessage?.text || "Keep building consistency 🚀"}
        </p>
      )}
    </Card>
  );
}