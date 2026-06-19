// app/admin/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
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
import { useResolvedTheme, UserThemeSetting } from "@/hooks/useResolvedTheme";
import { useRouter } from "next/navigation";

interface AdminDashboardStats {
  kpis: {
    totalUsers: number;
    activeUsersToday: number;
    activeTickets: number;
    resolvedCases: number;
    systemAlerts: number;
  };
  tickets: {
    totalTickets: number;
    openTickets: number;
    pendingTickets: number;
    resolvedTickets: number;
    highUrgentTickets: number;
  };
  activities: {
    _id: string;
    title: string;
    description?: string;
    createdAt: string;
    severity: "info" | "success" | "warning" | "danger";
  }[];
  billingEvents: {
    _id: string;
    userId: string;
    oldPlan: string;
    newPlan: string;
    amountDeltaNGN: number;
    reason: string;
    createdAt: string;
    meta?: {
      source?: "paystack" | "wallet" | "admin";
      pointsSpent?: number;
    };
  }[];
  systemSettings?: {
    appName: string;
    maintenanceMode: boolean;
    defaultTheme: "light" | "dark";
  };
  insights?: { title: string; description: string }[];
  health?: {
    apiPerformance: number;
    dbLoad: number;
    uptime: number;
  };
  adminSummary?: {
    totalUsers: number;
    openHighPriorityTickets: number;
  };
  priorityQueue?: {
    _id: string;
    subject: string;
    priority: "low" | "medium" | "high" | "urgent";
  }[];
}

export default function AdminDashboardHome() {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();


  // user theme from backend: "light" | "dark" | "system"
  const [userTheme, setUserTheme] = useState<UserThemeSetting>("system");

  // apply system mode resolution
  const resolvedTheme = useResolvedTheme(userTheme);

  // Apply resolved theme to <html> class
  useEffect(() => {
    if (typeof window === "undefined") return;
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(resolvedTheme);
    // also mirror to localStorage if you want
    localStorage.setItem("theme", userTheme);
  }, [resolvedTheme, userTheme]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await API.get("/admin/dashboard");
        setStats(res.data);

        // if backend also exposes user.theme somewhere, use that instead
        // fallback: guess from localStorage or default to "system"
        const local = localStorage.getItem("theme") as UserThemeSetting | null;
        if (local === "light" || local === "dark" || local === "system") {
          setUserTheme(local);
        } else {
          setUserTheme("system");
        }
      } catch (err) {
        console.error("Admin dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const k = stats?.kpis;
  const t = stats?.tickets;

  // change theme both in backend (user.theme) and frontend state
  const handleThemeChange = async (theme: UserThemeSetting) => {
    try {
      await API.put("/settings/theme", { theme }); // matches updateTheme controller
      setUserTheme(theme);
    } catch (e) {
      console.error("Failed to update theme", e);
    }
  };

  return (
    <div className="space-y-10 mt-10">
      {/* HEADER */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight">
          {stats?.systemSettings?.appName || "Admin Intelligence Center"}
        </h1>
        <p className="text-muted-foreground mt-2">
          Real-time system analytics, support engine & control dashboard
        </p>
        {stats?.systemSettings?.maintenanceMode && (
          <p className="mt-1 text-xs text-amber-400">
            Maintenance mode is currently enabled.
          </p>
        )}
      </div>

      {/* KPI STRIP */}
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
        <KpiCard
          title="Total Users"
          value={k ? k.totalUsers.toLocaleString() : loading ? "…" : "0"}
          icon={<Users />}
          trend={
            k ? `${k.activeUsersToday.toLocaleString()} active today` : "—"
          }
          glow="from-cyan-500/20"
        />

        <KpiCard
          title="Active Tickets"
          value={k ? k.activeTickets.toString() : loading ? "…" : "0"}
          icon={<Ticket />}
          trend={
            t ? `${t.openTickets} open / ${t.pendingTickets} pending` : "—"
          }
          glow="from-orange-500/20"
        />

        <KpiCard
          title="Resolved Cases"
          value={k ? k.resolvedCases.toLocaleString() : loading ? "…" : "0"}
          icon={<CheckCircle2 />}
          trend={t ? `${t.resolvedTickets} total resolved` : "—"}
          glow="from-green-500/20"
        />

        <KpiCard
          title="System Alerts"
          value={k ? k.systemAlerts.toString() : loading ? "…" : "0"}
          icon={<AlertTriangle />}
          trend={k && k.systemAlerts > 0 ? "Attention needed" : "Healthy"}
          glow="from-red-500/20"
        />
      </div>

      {/* MAIN GRID */}
      <div className="grid lg:grid-cols-3 gap-6">
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
              <TicketStat
                label="Open"
                value={t?.openTickets ?? 0}
                color="text-orange-400"
              />
              <TicketStat
                label="Pending"
                value={t?.pendingTickets ?? 0}
                color="text-yellow-400"
              />
              <TicketStat
                label="Resolved"
                value={t?.resolvedTickets ?? 0}
                color="text-green-400"
              />
            </div>
          </Card>

          {/* LIVE ACTIVITY STREAM */}
          <Card className="p-6 bg-card/40 backdrop-blur-xl border border-border">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Live Activity Stream</h2>
              <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
                Real-time
              </Badge>
            </div>

            <div className="mt-6 space-y-5">
              {loading && (
                <p className="text-xs text-muted-foreground">
                  Loading activity…
                </p>
              )}
              {!loading && stats?.activities?.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  No recent activity.
                </p>
              )}
              {stats?.activities?.map((a) => (
                <ActivityItem
                  key={a._id}
                  title={a.title}
                  desc={a.description || ""}
                  time={new Date(a.createdAt).toLocaleTimeString()}
                />
              ))}
            </div>

            {/* System Intelligence Feed */}
            <div className="mt-6 pt-6 border-t border-border">
              <h3 className="text-sm font-semibold text-muted-foreground mb-4">
                System Intelligence Feed
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                {(stats?.insights ?? []).map((i, idx) => (
                  <MiniCommand key={idx} title={i.title} desc={i.description} />
                ))}
                {!stats?.insights?.length && !loading && (
                  <p className="text-xs text-muted-foreground">
                    No insights generated yet.
                  </p>
                )}
              </div>
            </div>
          </Card>

          {/* Admin Control Center */}
          <Card className="p-6 bg-card/40 backdrop-blur-xl border border-border">
            <h2 className="text-xl font-semibold mb-5">Admin Control Center</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <ControlTile
                title="User Management"
                desc="Suspend, verify, edit users"
                stat={`${stats?.adminSummary?.totalUsers ?? 0} users`}
              />
              <ControlTile
                title="Ticket Engine"
                desc="Assign & resolve issues"
                stat={`${stats?.adminSummary?.openHighPriorityTickets ?? 0
                  } high‑priority tickets`}
              />
              <ControlTile
                title="System Logs"
                desc="Full audit tracking"
                stat={`${stats?.activities?.length ?? 0} recent events`}
              />
            </div>
          </Card>
        </div>

        {/* RIGHT PANEL */}
        <div className="space-y-6">
          {/* AI Intelligence */}
          <Card className="p-6 bg-card/40 backdrop-blur-xl border border-border">
            <div className="flex items-center gap-2">
              <Bot className="text-primary" />
              <h2 className="text-lg font-semibold">AI Intelligence</h2>
            </div>
            <div className="mt-4 space-y-3 text-sm text-muted-foreground">
              {t && t.highUrgentTickets > 0 && (
                <p>
                  • Prioritize {t.highUrgentTickets} high/urgent tickets in the
                  next hour.
                </p>
              )}
              {k && k.activeUsersToday > 0 && (
                <p>
                  • {k.activeUsersToday} users active in the last 24h – monitor
                  load and response times.
                </p>
              )}
              {k && k.systemAlerts > 0 && (
                <p>
                  • {k.systemAlerts} system alerts raised – check security and
                  performance logs.
                </p>
              )}
              {(!t || !k) && (
                <p>• Not enough data yet to generate suggestions.</p>
              )}
            </div>
            <Button className="w-full mt-5">Generate Full Report</Button>
          </Card>

          {/* System Health */}
          <Card className="p-6 bg-card/40 backdrop-blur-xl border border-border">
            <h2 className="text-lg font-semibold mb-4">
              System Health Monitor
            </h2>
            <HealthBar
              label="API Performance"
              value={stats?.health?.apiPerformance ?? 0}
            />
            <HealthBar
              label="Database Load"
              value={stats?.health?.dbLoad ?? 0}
            />
            <HealthBar
              label="Server Uptime"
              value={stats?.health?.uptime ?? 0}
            />
          </Card>

          {/* Priority Queue */}
          <Card className="p-6 bg-card/40 backdrop-blur-xl border border-border">
            <h2 className="text-lg font-semibold mb-4">Priority Queue</h2>
            <div className="space-y-3">
              {stats?.priorityQueue?.map((tkt) => (
                <PriorityTicket
                  key={tkt._id}
                  title={tkt.subject}
                  level={tkt.priority}
                />
              ))}
              {!loading &&
                (!stats?.priorityQueue ||
                  stats.priorityQueue.length === 0) && (
                  <p className="text-xs text-muted-foreground">
                    No priority tickets in queue.
                  </p>
                )}
            </div>
          </Card>

          {/* Theme Control Panel */}
          <Card className="p-6 bg-card/40 backdrop-blur-xl border border-border">
            <div className="flex items-center gap-2">
              <Palette className="text-primary" />
              <h2 className="text-lg font-semibold">Theme Control Panel</h2>
            </div>
            <p className="text-sm text-muted-foreground mt-3">
              Adjust system appearance & UI experience
            </p>
            <div className="mt-5 space-y-3">
              <ThemeOption
                label="Dark Mode"
                active={userTheme === "dark"}
                onClick={() => handleThemeChange("dark")}
              />
              <ThemeOption
                label="Light Mode"
                active={userTheme === "light"}
                onClick={() => handleThemeChange("light")}
              />
              <ThemeOption
                label="System Auto Sync"
                active={userTheme === "system"}
                onClick={() => handleThemeChange("system")}
              />
            </div>
            <Button
              variant="outline"
              className="w-full mt-5"
              onClick={() => router.push("/admin/settings")}
            >
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

function ControlTile({ title, desc, stat }: any) {
  return (
    <div className="p-4 rounded-xl border border-border bg-background/20 hover:bg-accent transition cursor-pointer">
      <p className="font-medium text-sm">{title}</p>
      <p className="text-xs text-muted-foreground mt-1">{desc}</p>
      {stat !== undefined && (
        <p className="mt-2 text-xs text-muted-foreground">{stat}</p>
      )}
    </div>
  );
}

function ThemeOption({ label, active, onClick }: any) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-between px-3 py-2 rounded-xl border transition w-full text-left ${active ? "border-primary bg-primary/10" : "border-border"
        }`}
    >
      <span className="text-sm">{label}</span>
      {active && <Settings2 size={14} className="text-primary" />}
    </button>
  );
}