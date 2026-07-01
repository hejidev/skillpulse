"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

type ApiUsageLog = {
  _id: string;
  userId?: string;
  ip?: string;
  device?: string;
  action: string;
  severity: "info" | "warning" | "danger";
  createdAt: string;
};

export default function AdminApiUsage() {
  const [logs, setLogs] = useState<ApiUsageLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterUserId, setFilterUserId] = useState("");
  const [limit, setLimit] = useState(50);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const params: any = { limit };
      if (filterUserId) params.userId = filterUserId;
      const res = await API.get("/admin/api-usage", { params });
      setLogs(res.data.items || []);
    } catch (err: any) {
      console.error("Failed to load API usage", err);
      toast.error(err.response?.data?.message || "Failed to load API usage.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, [limit]);

  return (
    <Card className="p-6 bg-card/40 backdrop-blur-xl border border-border">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold">API Usage</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Monitor API key activity across all users and integrations.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={loadLogs} disabled={loading}>
          {loading ? "Refreshing…" : "Refresh"}
        </Button>
      </div>

      <div className="flex gap-3 mb-4">
        <Input
          placeholder="Filter by userId (optional)"
          value={filterUserId}
          onChange={(e) => setFilterUserId(e.target.value)}
          className="max-w-xs"
        />
        <Input
          type="number"
          min={10}
          max={200}
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value) || 50)}
          className="w-24"
        />
      </div>

      <div className="space-y-2 max-h-[480px] overflow-auto text-xs">
        {loading ? (
          <p className="text-muted-foreground text-xs">Loading logs…</p>
        ) : logs.length === 0 ? (
          <p className="text-muted-foreground text-xs">
            No API usage recorded yet.
          </p>
        ) : (
          logs.map((log) => (
            <div
              key={log._id}
              className="flex items-start justify-between border rounded-lg bg-background/60 px-3 py-2"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px]">{log.action}</span>
                  <Badge
                    variant={
                      log.severity === "danger"
                        ? "destructive"
                        : log.severity === "warning"
                        ? "outline"
                        : "secondary"
                    }
                    className="text-[10px]"
                  >
                    {log.severity}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-2 text-[10px] text-muted-foreground">
                  {log.userId && <span>User: {log.userId}</span>}
                  {log.ip && <span>IP: {log.ip}</span>}
                  <span>
                    At: {new Date(log.createdAt).toLocaleString()}
                  </span>
                  {log.device && <span>Device: {log.device}</span>}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}