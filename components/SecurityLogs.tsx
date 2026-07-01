"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import API from "@/lib/api";
import {
  Shield,
  Laptop,
  Globe,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { formatDistanceToNow, isToday, isYesterday } from "date-fns";
import { useState } from "react";

// ================= GROUPING =================
function groupLogs(logs: any[]) {
  return {
    today: logs.filter((l) => isToday(new Date(l.createdAt))),
    yesterday: logs.filter((l) => isYesterday(new Date(l.createdAt))),
    older: logs.filter(
      (l) =>
        !isToday(new Date(l.createdAt)) &&
        !isYesterday(new Date(l.createdAt))
    ),
  };
}

function getSeverityConfig(severity: string) {
  switch (severity) {
    case "danger":
      return {
        color: "text-red-400",
        bg: "bg-red-500/10 border-red-500/20",
        label: "High Risk",
      };
    case "warning":
      return {
        color: "text-yellow-400",
        bg: "bg-yellow-500/10 border-yellow-500/20",
        label: "Warning",
      };
    default:
      return {
        color: "text-green-400",
        bg: "bg-green-500/10 border-green-500/20",
        label: "Safe",
      };
  }
}

export default function SecurityLogs() {
  const [selectedLog, setSelectedLog] = useState<any>(null);

  const { data = [], isLoading, refetch } = useQuery({
    queryKey: ["security-logs"],
    queryFn: async () => {
      const res = await API.get("/settings/security-logs");
      return res.data;
    },
  });

  const logoutDevice = useMutation({
    mutationFn: async (deviceHash: string) => {
      await API.post("/auth/logout-device", { deviceHash });
    },
    onSuccess: () => refetch(),
  });

  const grouped = groupLogs(data);

  return (
    <div className="p-3 rounded-2xl bg-card/5 backdrop-blur-xl space-y-6">

      {/* HEADER */}
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-white/10">
          <Shield />
        </div>
        <div>
          <h2 className="text-[16px] sm:text-xl font-semibold">Security Center</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Track devices, logins & suspicious activity
          </p>
        </div>
      </div>

      {isLoading && <SecuritySkeleton />}

      {!isLoading && data.length === 0 && (
        <p className="text-center text-muted-foreground py-10">
          No activity yet
        </p>
      )}

      {!isLoading && (
        <>
          <LogGroup title="Today" logs={grouped.today} {...{ setSelectedLog, logoutDevice }} />
          <LogGroup title="Yesterday" logs={grouped.yesterday} {...{ setSelectedLog, logoutDevice }} />
          <LogGroup title="Older" logs={grouped.older} {...{ setSelectedLog, logoutDevice }} />
        </>
      )}

      {selectedLog && (
        <DetailsModal log={selectedLog} onClose={() => setSelectedLog(null)} />
      )}
    </div>
  );
}

// ================= GROUP COMPONENT =================
function LogGroup({ title, logs, setSelectedLog, logoutDevice }: any) {
  if (logs.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-xs sm:text-sm text-muted-foreground">{title}</h3>

      {logs.map((log: any) => {
        const config = getSeverityConfig(log.severity);

        return (
          <div
            key={log._id}
            className={`p-4 rounded-xl border border-border/30 ${config.bg}`}
          >
            <div className="flex justify-between items-start gap-2">

              <div>
                <p className="font-medium text-xs sm:text-lg">{log.action}</p>

                <p className="text-xs flex gap-2 items-center text-muted-foreground">
                  <Laptop size={14} /> {log.device}
                </p>

                <p className="text-xs flex gap-2 items-center text-muted-foreground">
                  <Globe size={14} /> {log.ip}
                </p>

                <div className="flex gap-3 mt-2">
                  <button
                    onClick={() => setSelectedLog(log)}
                    className="text-[11px] sm:text-xs text-brand hover:underline cursor-pointer"
                  >
                    View Details
                  </button>

                  <button
                    onClick={() =>
                      logoutDevice.mutate(log.deviceHash)
                    }
                    className="text-[11px] sm:text-xs text-red-400 hover:underline cursor-pointer"
                  >
                    Log out device
                  </button>
                </div>
              </div>

              <span className="text-[9px] sm:text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(log.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ================= MODAL =================
function DetailsModal({ log, onClose }: any) {
  return (
    <div className="fixed inset-0 bg-card/70 flex items-center justify-center z-50">
      <div className="bg-background p-6 rounded-xl w-full max-w-lg space-y-4 border">

        <h3 className="text-lg font-semibold">Device Details</h3>

        <p><strong>Action:</strong> {log.action}</p>
        <p><strong>Device:</strong> {log.device}</p>
        <p><strong>IP:</strong> {log.ip}</p>

        {/* 🌍 MAP */}
        <iframe
          src={`https://maps.google.com/maps?q=${log.ip}&output=embed`}
          className="w-full h-48 rounded"
        />

        <button
          onClick={onClose}
          className="mt-4 w-full py-2 bg-white/10 rounded cursor-pointer"
        >
          Close
        </button>
      </div>
    </div>
  );
}

// ================= SKELETON =================
function SecuritySkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="p-4 rounded-xl border animate-pulse bg-white/5">
          <div className="h-4 w-40 bg-white/10 rounded mb-2" />
          <div className="h-3 w-60 bg-white/10 rounded mb-2" />
          <div className="h-3 w-32 bg-white/10 rounded" />
        </div>
      ))}
    </div>
  );
}