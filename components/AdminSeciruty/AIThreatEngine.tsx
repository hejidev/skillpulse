"use client";

import { Card } from "@/components/ui/card";
import { Bot } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import API from "@/lib/api";

interface ThreatSummary {
  total: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
}

export default function AIThreatEngine() {
  const { data } = useQuery({
    queryKey: ["threat-feed-summary"],
    queryFn: () =>
      API.get("/admin/security/threat-feed").then(
        (r) => r.data as { summary: ThreatSummary }
      ),
  });

  const summary = data?.summary;

  return (
    <Card className="p-6 bg-card/40 backdrop-blur-xl border">
      <div className="flex items-center gap-2">
        <Bot className="text-primary" />
        <h2 className="text-lg font-semibold">AI Threat Correlation Engine</h2>
      </div>

      <div className="mt-4 space-y-2 text-sm text-muted-foreground">
        <p>
          • Total events analyzed: {summary?.total ?? 0}
        </p>
        <p>• Critical: {summary?.critical ?? 0}</p>
        <p>• High: {summary?.high ?? 0}</p>
        <p>• Medium: {summary?.medium ?? 0}</p>
        <p>• Low: {summary?.low ?? 0}</p>
      </div>

      <div className="mt-4 p-3 border rounded-xl bg-background/20 text-sm">
        🔮 Prediction: System is{" "}
        {summary && summary.critical > 0 ? "at elevated risk" : "stable"} based
        on current anomalies.
      </div>
    </Card>
  );
}