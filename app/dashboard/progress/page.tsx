"use client";

import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";

import { useAllProgress } from "@/hooks/useAllProgress";
import API from "@/lib/api";

import AnalyticsChart from "@/components/analytics-chart";
import { ProgressFilters } from "@/components/ProgressFilters";
import { RecentActivity } from "@/components/RecentActivity";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ProgressPage() {
  const { data, isLoading } = useAllProgress();

  const allProgress = data?.progress || [];
  const streak = data?.streak || 0;
  const freezeCount = data?.freezeCount || 0;

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
      queryClient.setQueryData(["all-progress"], (old: any) => ({
        ...old,
        progress: [newItem.progress, ...(old?.progress || [])],
        streak: newItem.streak ?? old?.streak,
        freezeCount: newItem.freezeCount ?? old?.freezeCount,
      }));

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
  const filtered =
    selectedSkill && selectedSkill !== "all"
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
    <div className="space-y-10">

      {/* ================= CONTROL HEADER ================= */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Control Center</h1>
          <p className="text-muted-foreground text-sm">
            Manage your learning system in real-time ⚡
          </p>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleQuickLog}>
            + Quick Log
          </Button>
        </div>
      </div>

      {/* ================= FILTER + ACTIONS ================= */}
      <div className="flex items-center justify-between">
        <ProgressFilters setFilter={setSelectedSkill} />
      </div>

      {/* ================= LIVE KPI STRIP ================= */}
      <ControlKPIs data={filtered} />

      {/* ================= ANALYTICS GRID ================= */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* <div className="p-6 rounded-2xl border border-white/10 bg-white/5">
          <h2 className="text-sm text-muted-foreground mb-4">
            XP Growth
          </h2>
          <XPChart data={filtered} />
        </div>

        <div className="p-6 rounded-2xl border border-white/10 bg-white/5">
          <h2 className="text-sm text-muted-foreground mb-4">
            Weekly Activity
          </h2>
          <WeeklyAnalytics skillId={selectedSkill ?? ""} />
        </div> */}

      </div>

      {/* ================= SKILL DEEP DIVE ================= */}
      {selectedSkill && (
        <div className="p-6 rounded-2xl border border-white/10 bg-white/5">
          <AnalyticsChart skillId={selectedSkill} />
        </div>
      )}

      {/* ================= REAL-TIME FEED ================= */}
      <LiveFeed data={filtered} liveItem={liveItem} />

      {/* ================= LOG HISTORY ================= */}
      <RecentActivity
        recentActivity={filtered}
        paginated
        liveItem={liveItem}
      />

    </div>
  );
}

function ControlKPIs({ data = [] }: any) {
  if (!Array.isArray(data)) return null;

  const totalHours = data.reduce(
    (acc: number, d: any) => acc + Number(d.hours || 0),
    0
  );

  const xp = totalHours * 10;

  const activeDays = new Set(
    data.map((d: any) =>
      new Date(d.createdAt).toDateString()
    )
  ).size;

  const avg = totalHours / (activeDays || 1);

  return (
    <div className="grid md:grid-cols-4 gap-4">
      <MiniCard label="Total Hours" value={`${totalHours}h`} />
      <MiniCard label="XP Earned" value={xp} />
      <MiniCard label="Active Days" value={activeDays} />
      <MiniCard label="Daily Avg" value={`${avg.toFixed(1)}h`} />
    </div>
  );
}

function MiniCard({ label, value }: any) {
  return (
    <div className="p-4 rounded-xl border border-white/10 bg-white/5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <h3 className="text-lg font-bold mt-1">{value}</h3>
    </div>
  );
}

function LiveFeed({ liveItem }: any) {
  if (!liveItem) return null;

  return (
    <div className="p-4 rounded-xl border border-green-500/30 bg-green-500/10">
      <p className="text-sm">
        ⚡ New activity logged:
      </p>

      <p className="font-bold">
        {liveItem.hours} hrs on {liveItem.skillName}
      </p>
    </div>
  );
}

function Card({ title, value }: any) {
  return (
    <div className="p-6 rounded-2xl border border-white/10 bg-white/5">
      <p className="text-xs text-muted-foreground">{title}</p>
      <h2 className="text-xl font-bold mt-2">{value}</h2>
    </div>
  );
}