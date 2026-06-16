"use client";

import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import API from "@/lib/api";
import { ProgressFilters } from "@/components/ProgressFilters";
import { SessionCard } from "@/components/SessionCard";
import FocusTrendChart from "@/components/FocusTrendChart";
import { io } from "socket.io-client";
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";

type Session = {
  totalHours?: number;
  focusScore?: number;
  start?: string;
  [key: string]: any;
};

type Intelligence = {
  behavior: {
    state: string;
    risk: string;
    score: number;
  };
  adaptive: {
    suggestedHoursToday: number;
    suggestedTime: number;
    adaptiveGoal: number;
    state: string;
  };
};

type Notification = {
  message: string;
  read?: boolean;
};

export default function SessionsPage() {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  // =========================
  // 📦 FETCH SKILLS
  // =========================
  const { data: skills = [] } = useQuery({
    queryKey: ["skills"],
    queryFn: async () => (await API.get("/skills")).data,
  });

  useEffect(() => {
    if (skills.length && !selectedSkill) {
      setSelectedSkill(skills[0]._id);
    }
  }, [skills, selectedSkill]);

  // =========================
  // 📊 FETCH SESSIONS
  // =========================
  const { data: sessions = [] } = useQuery<Session[]>({
    queryKey: ["sessions", selectedSkill],
    queryFn: async () => {
      if (!selectedSkill) return [];
      return (await API.get(`/progress/sessions/${selectedSkill}`)).data;
    },
    enabled: !!selectedSkill,
  });

  // =========================
  // 🧠 FETCH INTELLIGENCE
  // =========================
  const { data: intelligence } = useQuery<Intelligence>({
    queryKey: ["intelligence", selectedSkill],
    queryFn: async () =>
      (await API.get(`/progress/intelligence/${selectedSkill}`)).data,
    enabled: !!selectedSkill,
  });

  // =========================
  // 🔔 FETCH NOTIFICATIONS
  // =========================
  const { data: notifications = [] } = useQuery<Notification[]>({
    queryKey: ["notifications"],
    queryFn: async () =>
      (await API.get("/settings/notifications")).data,
  });

  // =========================
  // ⚡ REALTIME SOCKET
  // =========================
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const decoded: any = jwtDecode(token);
    const userId = decoded.id;

    const socket = io("http://localhost:5000");

    socket.emit("register", userId);

    socket.on("notification", (data) => {
      toast.success(data.message);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // =========================
  // 📊 INSIGHTS
  // =========================
  const insights = useMemo(() => {
    if (!sessions.length) return null;

    const totalHours = sessions.reduce(
      (a, s) => a + (s.totalHours || 0),
      0
    );

    const avgSession = totalHours / sessions.length;

    const bestSession = [...sessions].sort(
      (a, b) => (b.focusScore || 0) - (a.focusScore || 0)
    )[0];

    return {
      totalHours,
      avgSession,
      bestSession,
    };
  }, [sessions]);

  return (
    <div className="space-y-10">

      {/* HEADER */}
      <div className="flex justify-between">
        <div>
          <h1 className="text-3xl font-bold">Autonomous Sessions</h1>
          <p className="text-muted-foreground text-sm">
            Self-learning productivity engine ⚙️
          </p>
        </div>

        <ProgressFilters setFilter={setSelectedSkill} />
      </div>

      {/* 🔔 ALERTS */}
      {notifications.length > 0 && (
        <div className="p-4 border rounded-xl bg-yellow-500/10 space-y-1">
          {notifications.slice(0, 5).map((n, i) => (
            <p key={i} className="text-sm">
              {n.message}
            </p>
          ))}
        </div>
      )}

      {/* 🧠 SYSTEM STATE */}
      {intelligence?.behavior && (
        <div className="p-6 border rounded-2xl bg-white/5">
          <p className="text-sm text-muted-foreground">System State</p>

          <h2 className="text-xl font-bold">
            {intelligence.behavior.state} • Risk:{" "}
            {intelligence.behavior.risk}
          </h2>

          <p className="text-sm mt-2">
            Score: {intelligence.behavior.score}
          </p>
        </div>
      )}

      {/* 🎯 ADAPTIVE ENGINE */}
      {intelligence?.adaptive && (
        <div className="p-6 rounded-2xl border bg-gradient-to-br from-indigo-500/10 to-purple-500/10">
          <p className="text-sm text-muted-foreground">
            Adaptive Engine
          </p>

          <h2 className="text-2xl font-bold mt-2">
            {intelligence.adaptive.suggestedHoursToday}h @{" "}
            {intelligence.adaptive.suggestedTime}:00
          </h2>

          <p className="text-sm mt-2">
            {intelligence.adaptive.state}
          </p>
        </div>
      )}

      {/* 📊 INSIGHTS */}
      {insights && (
        <div className="grid md:grid-cols-3 gap-6">
          <Stat title="Total Hours" value={`${insights.totalHours}h`} />
          <Stat
            title="Avg Session"
            value={`${insights.avgSession.toFixed(1)}h`}
          />
          <Stat
            title="Best Session"
            value={`${insights.bestSession?.totalHours || 0}h`}
          />
        </div>
      )}

      {/* 📚 SESSIONS */}
      <div className="space-y-4">
        {sessions.map((s, i) => (
          <SessionCard key={i} session={s} />
        ))}
      </div>

      {/* 📈 CHART */}
      <FocusTrendChart sessions={sessions} />

    </div>
  );
}

// =========================
// 📊 STAT COMPONENT
// =========================
function Stat({ title, value }: { title: string; value: string }) {
  return (
    <div className="p-5 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition">
      <p className="text-xs text-muted-foreground">{title}</p>
      <h2 className="text-2xl font-bold mt-2">{value}</h2>
    </div>
  );
}