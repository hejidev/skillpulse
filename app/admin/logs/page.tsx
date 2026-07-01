// app/admin/security-logs/page.tsx
"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ShieldAlert,
  Eye,
  Activity,
} from "lucide-react";
import { toast } from "sonner";

interface SecurityLogItem {
  id: string;
  userId?: string;
  userName: string;
  userEmail?: string;
  action: string;
  ip?: string;
  device?: string;
  deviceHash?: string;
  severity: "info" | "warning" | "danger";
  createdAt: string;
}

interface ThreatSummary {
  total: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
}

interface ThreatFeedItem {
  title: string;
  severity: "low" | "medium" | "high" | "critical";
}

interface BlockedIpItem {
  _id: string;
  ip: string;
  reason?: string;
  createdAt: string;
}

interface TrustedDeviceItem {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  deviceHash: string;
  ip: string;
  device: string;
  lastUsed: string;
}

export default function SecurityLogsOS() {
  const [logs, setLogs] = useState<SecurityLogItem[]>([]);
  const [selected, setSelected] = useState<SecurityLogItem | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [threatSummary, setThreatSummary] = useState<ThreatSummary | null>(null);
  const [threats, setThreats] = useState<ThreatFeedItem[]>([]);

  const [blockedIps, setBlockedIps] = useState<BlockedIpItem[]>([]);
  const [trustedDevices, setTrustedDevices] = useState<TrustedDeviceItem[]>([]);

  const [severityFilter, setSeverityFilter] = useState<"" | "info" | "warning" | "danger">("");
  const [dateRange, setDateRange] = useState<{ from?: string; to?: string }>({});

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [logsRes, threatRes, blockedRes, trustedRes] = await Promise.all([
          API.get("/admin/security/logs", {
            params: {
              ...(search ? { search } : {}),
              ...(severityFilter ? { severity: severityFilter } : {}),
              ...(dateRange.from ? { from: dateRange.from } : {}),
              ...(dateRange.to ? { to: dateRange.to } : {}),
            },
          }),
          API.get("/admin/security/threat-feed"),
          API.get("/admin/security/blocked-ips"),
          API.get("/admin/security/trusted-devices"),
        ]);

        setLogs(logsRes.data.data);
        if (logsRes.data.data.length > 0) {
          setSelected(logsRes.data.data[0]);
        } else {
          setSelected(null);
        }

        setThreats(threatRes.data.threats);
        setThreatSummary(threatRes.data.summary);
        setBlockedIps(blockedRes.data.data);
        setTrustedDevices(trustedRes.data.data);
      } catch (err) {
        console.error("Admin security logs load error:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [search]);

  const handleBlockIp = async () => {
    if (!selected?.ip) {
      toast.error("No IP available for this event");
      return;
    }
    try {
      await API.post("/admin/security/actions/block-ip", { ip: selected.ip });
      toast.success(`IP ${selected.ip} blocked`);
      const blockedRes = await API.get("/admin/security/blocked-ips");
      setBlockedIps(blockedRes.data.data);
    } catch (err: any) {
      console.error("Block IP error:", err);
      toast.error(err.response?.data?.message || "Failed to block IP");
    }
  };

  const handleTrustDevice = async () => {
    if (!selected?.userId || !selected?.deviceHash) {
      toast.error("User or device information missing");
      return;
    }
    try {
      await API.post("/admin/security/actions/trust-device", {
        userId: selected.userId,
        deviceHash: selected.deviceHash,
        device: selected.device,
        ip: selected.ip,
      });
      toast.success("Device marked as trusted");
      const trustedRes = await API.get("/admin/security/trusted-devices");
      setTrustedDevices(trustedRes.data.data);
    } catch (err: any) {
      console.error("Trust device error:", err);
      toast.error(err.response?.data?.message || "Failed to trust device");
    }
  };

  return (
    <div className="grid lg:grid-cols-12 gap-6 h-[90vh]">
      {/* LEFT: LIVE FEED */}
      <Card className="lg:col-span-5 p-4 bg-card/40 backdrop-blur-xl flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <ShieldAlert className="text-red-400" />
          <h2 className="font-semibold">Security Event Stream</h2>
        </div>

        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Search IP, user, or action..."
            className="flex-1"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="border rounded px-2 text-xs"
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value as any)}
          >
            <option value="">All</option>
            <option value="danger">Danger</option>
            <option value="warning">Warning</option>
            <option value="info">Info</option>
          </select>
        </div>

        <div className="space-y-3 overflow-auto">
          {loading && <p className="text-xs text-muted-foreground">Loading logs…</p>}
          {!loading && logs.length === 0 && (
            <p className="text-xs text-muted-foreground">
              No security events found.
            </p>
          )}

          {logs.map((log) => (
            <div
              key={log.id}
              onClick={() => setSelected(log)}
              className={`p-3 border rounded-xl cursor-pointer transition hover:bg-accent ${selected?.id === log.id ? "border-primary bg-primary/10" : ""
                }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-sm">
                    {log.userName || "Unknown user"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {log.action}
                  </p>
                </div>
                <SeverityBadge severity={log.severity} />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {log.ip || "Unknown IP"} • {log.device || "Unknown device"}
              </p>
              <p className="text-[10px] text-muted-foreground mt-1">
                {new Date(log.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* MIDDLE: DETAILS */}
      <Card className="lg:col-span-4 p-5 bg-card/40 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <Eye />
          <h2 className="font-semibold">Security Inspection</h2>
        </div>

        {selected ? (
          <div className="mt-5 space-y-4">
            <Detail label="User" value={selected.userName} />
            {selected.userEmail && (
              <Detail label="Email" value={selected.userEmail} />
            )}
            <Detail label="Action" value={selected.action} />
            <Detail label="IP Address" value={selected.ip || "Unknown"} />
            <Detail label="Device" value={selected.device || "Unknown"} />
            <Detail label="Severity" value={selected.severity} />
            <Detail
              label="Date"
              value={new Date(selected.createdAt).toLocaleString()}
            />
          </div>
        ) : (
          <p className="mt-5 text-xs text-muted-foreground">
            Select an event from the left to inspect details.
          </p>
        )}

        <div className="flex gap-2 mt-6 justify-center">
          <Button
            variant="outline"
            className="w-30"
            disabled={!selected?.ip}
            onClick={handleBlockIp}
          >
            Block IP
          </Button>
          <Button
            className="w-30"
            disabled={!selected?.userId || !selected?.deviceHash}
            onClick={handleTrustDevice}
          >
            Trust Device
          </Button>
        </div>
      </Card>

      {/* RIGHT: SECURITY CONTROL + THREATS */}
      <div className="lg:col-span-3 space-y-4">
        {/* REAL-TIME STATUS */}
        <Card className="p-4 bg-card/40 backdrop-blur-xl">
          <div className="flex items-center gap-2 text-green-400">
            <Activity />
            <p className="text-sm">Live Security Monitoring</p>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            SOC monitor & anomaly detection active.
          </p>
        </Card>

        {/* BLOCKED IPS */}
        <Card className="p-4 bg-card/40 backdrop-blur-xl space-y-2">
          <h3 className="font-semibold">Blocked IPs</h3>
          <div className="space-y-1 max-h-44 overflow-auto">
            {blockedIps.map((b) => (
              <div key={b._id} className="flex justify-between text-xs">
                <span className="text-muted-foreground truncate max-w-30">
                  {b.ip}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {new Date(b.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
            {!blockedIps.length && (
              <p className="text-[11px] text-muted-foreground">
                No IPs blocked.
              </p>
            )}
          </div>

          {blockedIps.map((b) => (
            <div key={b._id} className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground truncate max-w-30">
                {b.ip}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground">
                  {new Date(b.createdAt).toLocaleDateString()}
                </span>
                <Button
                  variant="ghost"
                  size="xs"
                  className="text-[10px]"
                  onClick={async () => {
                    await API.post("/admin/security/actions/unblock-ip", { ip: b.ip });
                    const blockedRes = await API.get("/admin/security/blocked-ips");
                    setBlockedIps(blockedRes.data.data);
                  }}
                >
                  Unblock
                </Button>
              </div>
            </div>
          ))}
        </Card>

        {/* TRUSTED DEVICES */}
        <Card className="p-4 bg-card/40 backdrop-blur-xl space-y-2">
          <h3 className="font-semibold">Trusted Devices</h3>
          <div className="space-y-1 max-h-44 overflow-auto">
            {trustedDevices.map((d) => (
              <div key={d.id} className="text-xs space-y-0.5">
                <p className="font-medium">{d.userName}</p>
                <p className="text-muted-foreground truncate">
                  {d.device} • {d.ip}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  Last used {new Date(d.lastUsed).toLocaleString()}
                </p>
              </div>
            ))}
            {!trustedDevices.length && (
              <p className="text-[11px] text-muted-foreground">
                No trusted devices.
              </p>
            )}
          </div>

          {trustedDevices.map((d) => (
            <div key={d.id} className="text-xs space-y-0.5">
              <div className="flex justify-between items-center">
                <p className="font-medium">{d.userName}</p>
                <Button
                  variant="ghost"
                  size="xs"
                  className="text-[10px]"
                  onClick={async () => {
                    await API.post("/admin/security/actions/revoke-device", {
                      userId: d.userId,
                      deviceHash: d.deviceHash,
                    });
                    const trustedRes = await API.get("/admin/security/trusted-devices");
                    setTrustedDevices(trustedRes.data.data);
                  }}
                >
                  Revoke
                </Button>
              </div>
              <p className="text-muted-foreground truncate">
                {d.device} • {d.ip}
              </p>
              <p className="text-[10px] text-muted-foreground">
                Last used {new Date(d.lastUsed).toLocaleString()}
              </p>
            </div>
          ))}
        </Card>

        {/* THREAT SUMMARY */}
        <Card className="p-4 bg-card/40 backdrop-blur-xl space-y-2">
          <h3 className="font-semibold">Threat Summary</h3>
          <Metric
            label="Total Events"
            value={threatSummary?.total?.toString() ?? "0"}
          />
          <Metric
            label="Critical"
            value={threatSummary?.critical?.toString() ?? "0"}
          />
          <Metric
            label="High"
            value={threatSummary?.high?.toString() ?? "0"}
          />
          <Metric
            label="Medium"
            value={threatSummary?.medium?.toString() ?? "0"}
          />
          <Metric
            label="Low"
            value={threatSummary?.low?.toString() ?? "0"}
          />
        </Card>

        {/* Threat feed list */}
        <Card className="p-4 bg-card/40 backdrop-blur-xl space-y-2">
          <h3 className="font-semibold">Recent Threats</h3>
          <div className="space-y-1 max-h-44 overflow-auto">
            {threats.map((t, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground truncate max-w-37.5">
                  {t.title}
                </span>
                <ThreatSeverity severity={t.severity} />
              </div>
            ))}
            {!threats.length && (
              <p className="text-[11px] text-muted-foreground">
                No recent threats detected.
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ===== helper components ===== */

function SeverityBadge({ severity }: { severity: "info" | "warning" | "danger" }) {
  const color =
    severity === "danger"
      ? "text-red-400"
      : severity === "warning"
        ? "text-orange-400"
        : "text-sky-400";
  return <span className={`text-[11px] ${color}`}>{severity}</span>;
}

function ThreatSeverity({
  severity,
}: {
  severity: "low" | "medium" | "high" | "critical";
}) {
  const map: Record<string, string> = {
    critical: "text-red-400",
    high: "text-orange-400",
    medium: "text-yellow-400",
    low: "text-emerald-400",
  };
  return (
    <span className={`text-[11px] font-medium ${map[severity] || ""}`}>
      {severity}
    </span>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium break-all">{value}</p>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}