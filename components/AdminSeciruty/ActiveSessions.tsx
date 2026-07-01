"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Monitor, Smartphone, LogOut } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "@/lib/api";

interface SessionItem {
  deviceHash: string;
  device: string;
  ip: string;
  location: string;
  lastUsed: string;
  current: boolean;
}

export default function ActiveSessions() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-sessions"],
    queryFn: () =>
      API.get("/admin/security/sessions").then((r) => r.data as { sessions: SessionItem[] }),
  });

  const logoutDevice = useMutation({
  mutationFn: (deviceHash: string) =>
    API.post("/admin/security/sessions/logout", { deviceHash }),
  onSuccess: () =>
    queryClient.invalidateQueries({ queryKey: ["admin-sessions"] }),
});

const logoutAll = useMutation({
  mutationFn: () => API.post("/admin/security/sessions/logout-all"),
  onSuccess: () =>
    queryClient.invalidateQueries({ queryKey: ["admin-sessions"] }),
});

  const sessions = data?.sessions ?? [];

  return (
    <Card className="p-6 bg-card/40 backdrop-blur-xl border space-y-5">
      <h2 className="text-xl font-semibold">Active Sessions</h2>

      {isLoading && <p className="text-sm text-muted-foreground">Loading sessions…</p>}

      <div className="space-y-3">
        {sessions.map((s) => (
          <div
            key={s.deviceHash}
            className="flex items-center justify-between p-3 border rounded-xl"
          >
            <div className="flex items-center gap-3">
              {s.device.toLowerCase().includes("iphone") ||
              s.device.toLowerCase().includes("android") ? (
                <Smartphone size={16} />
              ) : (
                <Monitor size={16} />
              )}

              <div>
                <p className="text-sm font-medium">
                  {s.device} {s.current && "(This device)"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {s.location} • {s.ip}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
                active
              </Badge>

              {!s.current && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => logoutDevice.mutate(s.deviceHash)}
                  disabled={logoutDevice.isPending}
                >
                  <LogOut size={14} />
                </Button>
              )}
            </div>
          </div>
        ))}

        {!isLoading && sessions.length === 0 && (
          <p className="text-xs text-muted-foreground">No active sessions.</p>
        )}
      </div>

      <Button
        variant="destructive"
        className="w-full"
        onClick={() => logoutAll.mutate()}
        disabled={logoutAll.isPending}
      >
        Logout All Devices
      </Button>
    </Card>
  );
}