"use client";

import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import API from "@/lib/api";

interface StreamLogItem {
  id: string;
  action: string;
  ip?: string;
  severity: "info" | "warning" | "danger";
}

export default function SecurityStream() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-security-stream"],
    queryFn: () =>
      API.get("/admin/security/logs", {
        params: { limit: 10 },
      }).then(
        (r) =>
          r.data.data as {
            id: string;
            action: string;
            ip?: string;
            severity: "info" | "warning" | "danger";
          }[]
      ),
  });

  const items = data ?? [];

  return (
    <Card className="p-6 bg-card/40 backdrop-blur-xl border">
      <h2 className="text-lg font-semibold mb-4">Security Event Firehose</h2>

      <div className="space-y-3 font-mono text-xs">
        {isLoading && (
          <p className="text-xs text-muted-foreground">Loading events…</p>
        )}

        {!isLoading && !items.length && (
          <p className="text-xs text-muted-foreground">
            No recent security events.
          </p>
        )}

        {items.map((log) => (
          <Event
            key={log.id}
            type={
              log.severity === "danger"
                ? "BLOCKED"
                : log.severity === "warning"
                ? "ALERT"
                : "INFO"
            }
            msg={log.action}
            ip={log.ip || "Unknown IP"}
          />
        ))}
      </div>
    </Card>
  );
}

function Event({ type, msg, ip }: any) {
  const color =
    type === "BLOCKED"
      ? "text-red-400"
      : type === "ALERT"
      ? "text-orange-400"
      : "text-blue-400";

  return (
    <div className="flex justify-between border-b border-border pb-2">
      <div>
        <p className={`${color} font-semibold`}>{type}</p>
        <p className="text-muted-foreground">{msg}</p>
      </div>

      <p className="text-muted-foreground">{ip}</p>
    </div>
  );
}