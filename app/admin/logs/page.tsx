"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ShieldAlert,
  Globe,
  Smartphone,
  Laptop,
  KeyRound,
  Activity,
  AlertTriangle,
  Lock,
  Eye,
} from "lucide-react";

/* ================= MOCK SECURITY EVENTS ================= */
const logs = [
  {
    id: 1,
    user: "John Doe",
    event: "Login Success",
    ip: "102.89.21.11",
    location: "Lagos, Nigeria",
    device: "Chrome / Windows",
    risk: 12,
    time: "2 min ago",
  },
  {
    id: 2,
    user: "Sarah Johnson",
    event: "Failed Login Attempt",
    ip: "185.22.91.44",
    location: "Unknown (VPN)",
    device: "Unknown Device",
    risk: 78,
    time: "5 min ago",
  },
  {
    id: 3,
    user: "Mike Lee",
    event: "Password Reset",
    ip: "102.89.21.11",
    location: "Ibadan, Nigeria",
    device: "iPhone Safari",
    risk: 35,
    time: "1 hr ago",
  },
];

export default function SecurityLogsOS() {
  const [selected, setSelected] = useState(logs[0]);

  return (
    <div className="grid lg:grid-cols-12 gap-6 h-[90vh]">

      {/* ================= LEFT: LIVE FEED ================= */}
      <Card className="lg:col-span-5 p-4 bg-card/40 backdrop-blur-xl flex flex-col">

        <div className="flex items-center gap-2 mb-4">
          <ShieldAlert className="text-red-400" />
          <h2 className="font-semibold">Security Event Stream</h2>
        </div>

        <Input placeholder="Search IP, user, or event..." className="mb-4" />

        <div className="space-y-3 overflow-auto">

          {logs.map((log) => (
            <div
              key={log.id}
              onClick={() => setSelected(log)}
              className={`p-3 border rounded-xl cursor-pointer transition hover:bg-accent
                ${selected.id === log.id ? "border-primary bg-primary/10" : ""}`}
            >

              <div className="flex justify-between">
                <p className="font-medium text-sm">{log.user}</p>
                <RiskBadge risk={log.risk} />
              </div>

              <p className="text-xs text-muted-foreground">
                {log.event}
              </p>

              <p className="text-xs text-muted-foreground mt-1">
                {log.ip} • {log.location}
              </p>

            </div>
          ))}

        </div>
      </Card>

      {/* ================= MIDDLE: DETAILS ================= */}
      <Card className="lg:col-span-4 p-5 bg-card/40 backdrop-blur-xl">

        <div className="flex items-center gap-2">
          <Eye />
          <h2 className="font-semibold">Security Inspection</h2>
        </div>

        <div className="mt-5 space-y-4">

          <Detail label="User" value={selected.user} />
          <Detail label="Event" value={selected.event} />
          <Detail label="IP Address" value={selected.ip} />
          <Detail label="Location" value={selected.location} />
          <Detail label="Device" value={selected.device} />

          <div>
            <p className="text-sm text-muted-foreground">Risk Score</p>
            <RiskBar risk={selected.risk} />
          </div>

        </div>

        <div className="flex gap-2 mt-6 justify-center">

          <Button variant="outline" className="w-30">
            Block IP
          </Button>

          <Button className="w-30">
            Trust Device
          </Button>

        </div>

      </Card>

      {/* ================= RIGHT: SECURITY CONTROL ================= */}
      <div className="lg:col-span-3 space-y-4">

        {/* REAL-TIME STATUS */}
        <Card className="p-4 bg-card/40 backdrop-blur-xl">

          <div className="flex items-center gap-2 text-green-400">
            <Activity />
            <p className="text-sm">Live Security Monitoring</p>
          </div>

          <p className="text-xs text-muted-foreground mt-2">
            WebSocket anomaly detection active
          </p>

        </Card>

        {/* THREAT SUMMARY */}
        <Card className="p-4 bg-card/40 backdrop-blur-xl space-y-2">

          <h3 className="font-semibold">Threat Summary</h3>

          <Metric label="High Risk Events" value="3" />
          <Metric label="Blocked IPs" value="12" />
          <Metric label="Failed Logins" value="41" />
          <Metric label="Trusted Devices" value="87" />

        </Card>

        {/* SECURITY ACTIONS */}
        <Card className="p-4 bg-card/40 backdrop-blur-xl space-y-2">

          <h3 className="font-semibold">Quick Actions</h3>

          <Button variant="outline" className="w-full">
            Lock Account
          </Button>

          <Button variant="outline" className="w-full">
            Force Logout All Sessions
          </Button>

          <Button variant="outline" className="w-full">
            Enable Strict Mode
          </Button>

        </Card>

      </div>

    </div>
  );
}

/* ================= COMPONENTS ================= */

function RiskBadge({ risk }: any) {
  const color =
    risk > 70
      ? "text-red-400"
      : risk > 40
      ? "text-orange-400"
      : "text-green-400";

  return <span className={`text-xs ${color}`}>{risk}% risk</span>;
}

function RiskBar({ risk }: any) {
  return (
    <div className="w-full bg-background border rounded-xl h-2 mt-2 overflow-hidden">
      <div
        className="h-full bg-red-400"
        style={{ width: `${risk}%` }}
      />
    </div>
  );
}

function Detail({ label, value }: any) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}

function Metric({ label, value }: any) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}