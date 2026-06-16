"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  Ticket,
  CheckCircle2,
  AlertTriangle,
  Bot,
  Clock,
  Palette,
  Settings2,
} from "lucide-react";

export default function AdminDashboardHome() {
  return (
    <div className="space-y-10 mt-15">

      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight">
          Admin Intelligence Center
        </h1>
        <p className="text-muted-foreground mt-2">
          Real-time system analytics, support engine & control dashboard
        </p>
      </div>

      {/* ================= KPI STRIP ================= */}
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

        <KpiCard
          title="Total Users"
          value="24,892"
          icon={<Users />}
          trend="+12.4%"
          glow="from-cyan-500/20"
        />

        <KpiCard
          title="Active Tickets"
          value="128"
          icon={<Ticket />}
          trend="+3.2%"
          glow="from-orange-500/20"
        />

        <KpiCard
          title="Resolved Cases"
          value="1,942"
          icon={<CheckCircle2 />}
          trend="+18.1%"
          glow="from-green-500/20"
        />

        <KpiCard
          title="System Alerts"
          value="4"
          icon={<AlertTriangle />}
          trend="-2"
          glow="from-red-500/20"
        />

      </div>

      {/* ================= MAIN GRID ================= */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* LEFT PANEL */}
        {/* LEFT PANEL */}
<div className="lg:col-span-2 space-y-6">

  {/* TICKET OVERVIEW */}
  <Card className="p-6 bg-card/40 backdrop-blur-xl border border-border hover:shadow-lg transition">
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-semibold">Ticket Overview</h2>
      <Badge className="bg-primary/10 text-primary border-primary/20">
        Live Feed
      </Badge>
    </div>

    <div className="grid grid-cols-3 mt-6 gap-4 text-center">
      <TicketStat label="Open" value={42} color="text-orange-400" />
      <TicketStat label="Pending" value={61} color="text-yellow-400" />
      <TicketStat label="Resolved" value={325} color="text-green-400" />
    </div>
  </Card>

  {/* LIVE ACTIVITY STREAM (UPGRADED) */}
  <Card className="p-6 bg-card/40 backdrop-blur-xl border border-border">

    <div className="flex items-center justify-between">
      <h2 className="text-xl font-semibold">
        Live Activity Stream
      </h2>

      <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
        Real-time
      </Badge>
    </div>

    <div className="mt-6 space-y-5">

      <ActivityItem
        title="New user onboarded"
        desc="Sarah Johnson created account"
        time="2 min ago"
      />

      <ActivityItem
        title="Ticket resolved"
        desc="Authentication bug fixed (#4412)"
        time="10 min ago"
      />

      <ActivityItem
        title="System optimization"
        desc="Database cache improved performance"
        time="1 hr ago"
      />

    </div>

    {/* ⚡ NEW: SYSTEM COMMAND FEED (THIS IS THE UPGRADE) */}
    <div className="mt-6 pt-6 border-t border-border">

      <h3 className="text-sm font-semibold text-muted-foreground mb-4">
        System Intelligence Feed
      </h3>

      <div className="grid md:grid-cols-2 gap-3">

        <MiniCommand
          title="Auto Ticket Routing"
          desc="AI assigned 14 tickets to support agents"
        />

        <MiniCommand
          title="Security Scan"
          desc="No anomalies detected in last 24h"
        />

        <MiniCommand
          title="Performance Boost"
          desc="API latency reduced by 18%"
        />

        <MiniCommand
          title="User Behavior Spike"
          desc="Signup surge detected (+22%)"
        />

      </div>

    </div>

  </Card>

  {/* ⚡ NEW: CONTROL CENTER (THIS IS WHAT WAS MISSING) */}
  <Card className="p-6 bg-card/40 backdrop-blur-xl border border-border">

    <h2 className="text-xl font-semibold mb-5">
      Admin Control Center
    </h2>

    <div className="grid md:grid-cols-3 gap-4">

      <ControlTile title="User Management" desc="Suspend, verify, edit users" />
      <ControlTile title="Ticket Engine" desc="Assign & resolve issues" />
      <ControlTile title="System Logs" desc="Full audit tracking" />

      <ControlTile title="AI Rules" desc="Adjust automation logic" />
      <ControlTile title="Notifications" desc="Push + email system" />
      <ControlTile title="Security Layer" desc="Firewall & access control" />

    </div>

  </Card>

</div>

        {/* RIGHT PANEL */}
        <div className="space-y-6">

          {/* AI INSIGHT */}
          <Card className="p-6 bg-card/40 backdrop-blur-xl border border-border">

            <div className="flex items-center gap-2">
              <Bot className="text-primary" />
              <h2 className="text-lg font-semibold">AI Intelligence</h2>
            </div>

            <div className="mt-4 space-y-3 text-sm text-muted-foreground">

              <p>
                • Ticket spike detected in authentication system (+18%)
              </p>

              <p>
                • 3 urgent issues require immediate attention
              </p>

              <p>
                • Suggest scaling support queue routing
              </p>

            </div>

            <Button className="w-full mt-5">
              Generate Full Report
            </Button>

          </Card>

          {/* SYSTEM HEALTH */}
          <Card className="p-6 bg-card/40 backdrop-blur-xl border border-border">

            <h2 className="text-lg font-semibold mb-4">
              System Health Monitor
            </h2>

            <HealthBar label="API Performance" value={92} />
            <HealthBar label="Database Load" value={78} />
            <HealthBar label="Server Uptime" value={99} />

          </Card>

          {/* PRIORITY TICKETS */}
          <Card className="p-6 bg-card/40 backdrop-blur-xl border border-border">

            <h2 className="text-lg font-semibold mb-4">
              Priority Queue
            </h2>

            <div className="space-y-3">

              <PriorityTicket title="Payment gateway failure" level="urgent" />
              <PriorityTicket title="Login authentication error" level="high" />
              <PriorityTicket title="Feature request overflow" level="medium" />

            </div>

          </Card>

          {/* THEME SETTINGS (IMPORTANT ADDITION) */}
          <Card className="p-6 bg-card/40 backdrop-blur-xl border border-border">

            <div className="flex items-center gap-2">
              <Palette className="text-primary" />
              <h2 className="text-lg font-semibold">
                Theme Control Panel
              </h2>
            </div>

            <p className="text-sm text-muted-foreground mt-3">
              Adjust system appearance & UI experience
            </p>

            <div className="mt-5 space-y-3">

              <ThemeOption label="Dark Mode (Default)" active />
              <ThemeOption label="Light Mode" />
              <ThemeOption label="System Auto Sync" />

            </div>

            <Button variant="outline" className="w-full mt-5">
              Advanced Theme Settings
            </Button>

          </Card>

        </div>

      </div>

    </div>
  );
}

/* ================= COMPONENTS ================= */

function KpiCard({ title, value, icon, trend, glow }: any) {
  return (
    <Card className="relative overflow-hidden p-5 bg-card/40 backdrop-blur-xl border border-border transition hover:scale-[1.02]">

      <div className={`absolute inset-0 bg-linear-to-br ${glow} opacity-40`} />

      <div className="relative flex items-center justify-between">
        <div className="text-muted-foreground">{icon}</div>
        <span className="text-xs text-green-400">{trend}</span>
      </div>

      <h2 className="relative text-2xl font-bold mt-4">{value}</h2>
      <p className="relative text-sm text-muted-foreground">{title}</p>

    </Card>
  );
}

function TicketStat({ label, value, color }: any) {
  return (
    <div>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function ActivityItem({ title, desc, time }: any) {
  return (
    <div className="flex justify-between">
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </div>
      <span className="text-xs text-muted-foreground flex items-center gap-1">
        <Clock size={12} /> {time}
      </span>
    </div>
  );
}

function HealthBar({ label, value }: any) {
  return (
    <div className="space-y-1 mb-4">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <Progress value={value} />
    </div>
  );
}

function PriorityTicket({ title, level }: any) {
  const style =
    level === "urgent"
      ? "text-red-400 border-red-400/30 bg-red-500/10"
      : level === "high"
      ? "text-orange-400 border-orange-400/30 bg-orange-500/10"
      : "text-yellow-400 border-yellow-400/30 bg-yellow-500/10";

  return (
    <div className="flex items-center justify-between">
      <p className="text-sm">{title}</p>
      <Badge className={style} variant="outline">
        {level}
      </Badge>
    </div>
  );
}

function MiniCommand({ title, desc }: any) {
  return (
    <div className="p-3 rounded-xl border border-border bg-background/30 hover:bg-accent transition">
      <p className="text-sm font-medium">{title}</p>
      <p className="text-xs text-muted-foreground">{desc}</p>
    </div>
  );
}

function ControlTile({ title, desc }: any) {
  return (
    <div className="p-4 rounded-xl border border-border bg-background/20 hover:bg-accent transition cursor-pointer">
      <p className="font-medium text-sm">{title}</p>
      <p className="text-xs text-muted-foreground mt-1">{desc}</p>
    </div>
  );
}

function ThemeOption({ label, active }: any) {
  return (
    <div
      className={`flex items-center justify-between px-3 py-2 rounded-xl border transition ${
        active ? "border-primary bg-primary/10" : "border-border"
      }`}
    >
      <span className="text-sm">{label}</span>
      {active && <Settings2 size={14} className="text-primary" />}
    </div>
  );
}