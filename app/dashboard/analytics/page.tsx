"use client";

import { useState } from "react";

import XPChart from "@/components/XPChart";
import WeeklyAnalytics from "@/components/analytics/WeeklyAnalytics";
import AnalyticsChart from "@/components/analytics-chart";
import { ProgressFilters } from "@/components/ProgressFilters";
import { Card } from "@/components/ui/card";
import Trends from "@/components/Trends";
import { useProgressData } from "@/hooks/useProgressData";

export default function AnalyticsPage() {
const { progress, isLoading } = useProgressData();

  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  if (isLoading) return <p>Loading analytics...</p>;

  const filtered =
  selectedSkill && selectedSkill !== "all"
    ? progress.filter((p: any) => p.skillId === selectedSkill)
    : progress;

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground text-sm">
          Understand your performance and growth 🚀
        </p>
      </div>

      {/* FILTER (lightweight) */}
      <div className="flex justify-end">
        <ProgressFilters setFilter={setSelectedSkill} />
      </div>

      {/* KPI INSIGHTS */}
      <Insights data={filtered} />

      {/* CHART GRID */}
      <div className="grid lg:grid-cols-2 gap-6">

        <Card title="XP Growth">
          <XPChart data={filtered} />
        </Card>

        <Card title="Weekly Activity">
          <WeeklyAnalytics skillId={selectedSkill ?? ""} />
        </Card>

      </div>

      {/* DEEP ANALYTICS */}
      {selectedSkill && (
        <Card title="Skill Breakdown">
          <AnalyticsChart skillId={selectedSkill} />
        </Card>
      )}

      {/* HEATMAP (optional but 🔥) */}
      <Heatmap data={filtered} />

      <Trends data={filtered} />

    </div>
  );
}

function Insights({ data }: any) {
  const safeData = Array.isArray(data) ? data : [];

  const totalHours = safeData.reduce(
    (acc: number, d: any) => acc + Number(d.hours || 0),
    0
  );

  const avg =
    safeData.length > 0 ? totalHours / safeData.length : 0;

  const best = [...safeData].sort(
    (a, b) => b.hours - a.hours
  )[0];

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <KPICard title="Total Hours" value={`${totalHours} hrs`} />
      <KPICard title="Daily Avg" value={`${avg.toFixed(1)} hrs`} />
      <KPICard
        title="Best Session"
        value={best ? `${best.hours} hrs` : "—"}
      />
    </div>
  );
}

function KPICard({ title, value }: any) {
  return (
    <div className="p-6 rounded-2xl border border-border/20 bg-card">
      <p className="text-xs text-muted-foreground">{title}</p>
      <h2 className="text-xl font-bold mt-2">{value}</h2>
    </div>
  );
}

function Heatmap({ data }: any) {
  const last30 = Array.from({ length: 30 }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);

    return data.filter(
      (p: any) =>
        new Date(p.createdAt).toDateString() === date.toDateString()
    ).length;
  });

  return (
    <div>
      <p className="text-sm text-muted-foreground mb-2">
        Consistency
      </p>

      <div className="grid grid-cols-10 gap-2">
        {last30.map((count, i) => (
          <div
            key={i}
            className={`h-5 rounded ${count > 3
                ? "bg-green-600"
                : count > 1
                  ? "bg-green-400"
                  : count > 0
                    ? "bg-green-200"
                    : "bg-muted"
              }`}
          />
        ))}
      </div>
    </div>
  );
}