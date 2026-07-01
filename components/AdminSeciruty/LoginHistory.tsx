"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import API from "@/lib/api";

interface LoginHistoryItem {
  event: string;
  ip: string;
  createdAt: string;
  status: "safe" | "warning";
}

export default function LoginHistory() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-login-history"],
    queryFn: () =>
      API.get("/admin/security/login-history").then(
        (r) => r.data as { items: LoginHistoryItem[] }
      ),
  });

  const logs = data?.items ?? [];

  return (
    <Card className="p-6 bg-card/40 backdrop-blur-xl border space-y-4">
      <h2 className="font-semibold">Login History</h2>

      {isLoading && (
        <p className="text-xs text-muted-foreground">Loading login history…</p>
      )}

      {!isLoading && !logs.length && (
        <p className="text-xs text-muted-foreground">No recent login events.</p>
      )}

      {logs.map((l, i) => (
        <div
          key={i}
          className="flex justify-between items-center border p-3 rounded-xl"
        >
          <div>
            <p className="text-sm font-medium">{l.event}</p>
            <p className="text-xs text-muted-foreground">IP: {l.ip}</p>
          </div>

          <div className="flex items-center gap-2">
            <Clock size={14} className="text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {new Date(l.createdAt).toLocaleString()}
            </span>

            <Badge
              className={
                l.status === "warning"
                  ? "bg-red-500/10 text-red-400"
                  : "bg-green-500/10 text-green-400"
              }
            >
              {l.status}
            </Badge>
          </div>
        </div>
      ))}
    </Card>
  );
}