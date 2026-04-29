"use client";

import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";

import { useAllProgress } from "@/hooks/useAllProgress";
import API from "@/lib/api";

import AnalyticsChart from "@/components/analytics-chart";
import WeeklyAnalytics from "@/components/analytics/WeeklyAnalytics";
import { ProgressFilters } from "@/components/ProgressFilters";
import { ProgressStats } from "@/components/ProgressStats";
import { RecentActivity } from "@/components/RecentActivity";
import XPChart from "@/components/XPChart";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ProgressPage() {
  const { data: allProgress = [], isLoading } = useAllProgress();

  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [liveItem, setLiveItem] = useState<any>(null);

  const queryClient = useQueryClient();

  // ===============================
  // 🔌 SOCKET SETUP (SAFE)
  // ===============================
  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL as string);

    socket.on("connect", () => {
      console.log("Socket connected 🔥");
    });

    socket.on("new-progress", (newItem) => {
      queryClient.setQueryData(["all-progress"], (old: any = []) => [
        newItem,
        ...old,
      ]);

      setLiveItem(newItem);
    });

    return () => {
      socket.disconnect();
    };
  }, [queryClient]);

  // ===============================
  // ⏳ LOADING STATE
  // ===============================
  if (isLoading) {
    return <p className="m-auto text-gray-400 text-lg">Loading...</p>;
  }

  // ===============================
  // 🔍 FILTER LOGIC
  // ===============================
  const filtered = selectedSkill
    ? allProgress.filter((p: any) => p.skillId === selectedSkill)
    : allProgress;

  // ===============================
  // ⚡ QUICK LOG HANDLER
  // ===============================
  const handleQuickLog = async () => {
    try {
      const skillToUse =
        selectedSkill || allProgress?.[0]?.skillId;

      if (!skillToUse) {
        toast.error("No skill available to log progress");
        return;
      }

      await API.post("/progress", {
        skillId: skillToUse,
        hours: 1,
        note: "Quick log ⚡",
      });

      // refresh UI instantly
      queryClient.invalidateQueries({ queryKey: ["all-progress"] });
    } catch (err) {
      console.log(err);
    }
  };

  // ===============================
  // 📦 UI
  // ===============================
  return (
    <div className="space-y-8 py-26 px-40">

      <h1 className="text-3xl font-bold">Progress Tracker</h1>

      {/* ⚡ QUICK LOG */}
      {/* <AddProgress skillId={selectedSkill || ""} /> */}
      <Button onClick={handleQuickLog}>
        + Quick Log
      </Button>

      {/* STATS */}
      <ProgressStats data={filtered} />

      {/* XP CHART */}
      <XPChart data={filtered} />

      {/* FILTER */}
      <ProgressFilters setFilter={setSelectedSkill} />

      {/* ANALYTICS */}
      {selectedSkill ? (
        <>
          <AnalyticsChart skillId={selectedSkill} />
          <WeeklyAnalytics skillId={selectedSkill} />
        </>
      ) : (
        <p className="text-gray-400 text-sm">
          Select a skill to view analytics
        </p>
      )}

      {/* LIVE ACTIVITY */}
      <RecentActivity
        recentActivity={filtered}
        paginated
        liveItem={liveItem}
      />

    </div>
  );
}