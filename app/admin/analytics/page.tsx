"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Activity,
  AlertTriangle,
  Bot,
  CheckCircle2,
  Cpu,
  Database,
  HardDrive,
  Server,
  Ticket,
  Users,
  Wifi,
  WifiOff,
} from "lucide-react";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { motion } from "framer-motion";

import {
  getDashboardAnalytics,
} from "@/lib/api/admin-users";

import {
  socketService,
} from "@/lib/socket";

import {
  Card,
} from "@/components/ui/card";

import {
  Badge,
} from "@/components/ui/badge";

import {
  Progress,
} from "@/components/ui/progress";
import { AdminPageSkeleton } from "../admin-skeleton";

/* =========================================
   TYPES
========================================= */

interface AnalyticsData {
  users: {
    totalUsers: number;
    onlineUsers: number;
  };

  tickets: {
    totalTickets: number;
    resolvedTickets: number;
  };

  sla: {
    compliance: number;
  };

  aiInsights: string[];

  categories: {
    _id: string;
    total: number;
  }[];
}

interface LiveMetric {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;

  apiLatency: number;

  requestsPerMinute: number;

  failedRequests: number;

  activeUsers: number;

  dbResponseTime: number;

  uptime: number;
}

/* =========================================
   PAGE
========================================= */

export default function AnalyticsPage() {

  const [analytics, setAnalytics] =
    useState<AnalyticsData>({
      users: {
        totalUsers: 0,
        onlineUsers: 0,
      },

      tickets: {
        totalTickets: 0,
        resolvedTickets: 0,
      },

      sla: {
        compliance: 0,
      },

      aiInsights: [],

      categories: [],
    });

  const [liveMetrics, setLiveMetrics] =
    useState<LiveMetric | null>(null);

  const [connected, setConnected] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [history, setHistory] =
    useState<any[]>([]);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token") || ""
      : "";

  /* =========================================
     INITIAL FETCH
  ========================================= */

  useEffect(() => {

    if (!token) return;

    const fetchAnalytics =
      async () => {

        try {

          const data =
            await getDashboardAnalytics(token);

          setAnalytics(
            data.analytics
          );

        } catch (error) {

          console.log(error);

        } finally {

          setLoading(false);

        }
      };

    fetchAnalytics();

  }, [token]);

  /* =========================================
     SOCKET
  ========================================= */
  useEffect(() => {

    socketService.connect();

    socketService.emit(
      "join-admin-analytics"
    );

    const handleConnect = () => {
      setConnected(true);
    };

    const handleDisconnect = () => {
      setConnected(false);
    };

    const handleAnalytics = (data: any) => {

      console.log(
        "LIVE ANALYTICS:",
        data
      );

      setLiveMetrics({
        cpuUsage:
          data.cpuUsage || 0,

        memoryUsage:
          data.memoryUsage || 0,

        diskUsage:
          data.diskUsage || 0,

        apiLatency:
          data.apiLatency || 0,

        requestsPerMinute:
          data.requestsPerMinute || 0,

        failedRequests:
          data.failedRequests || 0,

        activeUsers:
          data.activeUsers || 0,

        dbResponseTime:
          data.dbResponseTime || 0,

        uptime:
          data.uptime || 0,
      });

      if (data.analytics) {
        setAnalytics(data.analytics);
      }

      setHistory((prev) => {

        const next = [
          ...prev,
          {
            time:
              new Date()
                .toLocaleTimeString(),

            cpu:
              data.cpuUsage,

            ram:
              data.memoryUsage,

            latency:
              data.apiLatency,

            db:
              data.dbResponseTime,
          },
        ];

        return next.slice(-20);
      });
    };

    socketService.on(
      "connect",
      handleConnect
    );

    socketService.on(
      "disconnect",
      handleDisconnect
    );

    socketService.on(
      "analytics:init",
      handleAnalytics
    );

    socketService.on(
      "analytics:update",
      handleAnalytics
    );

    return () => {

      socketService.off(
        "connect",
        handleConnect
      );

      socketService.off(
        "disconnect",
        handleDisconnect
      );

      socketService.off(
        "analytics:init",
        handleAnalytics
      );

      socketService.off(
        "analytics:update",
        handleAnalytics
      );
    };

  }, []);

  /* =========================================
     ALERTS
  ========================================= */

  const alerts = useMemo(() => {

    if (!liveMetrics) return [];

    const results = [];

    if (
      liveMetrics.cpuUsage > 80
    ) {
      results.push({
        level: "critical",
        text: "Critical CPU spike detected",
      });
    }

    if (
      liveMetrics.memoryUsage > 85
    ) {
      results.push({
        level: "warning",
        text: "Memory usage is very high",
      });
    }

    if (
      liveMetrics.apiLatency > 1000
    ) {
      results.push({
        level: "warning",
        text: "API latency degradation detected",
      });
    }

    if (
      liveMetrics.failedRequests > 10
    ) {
      results.push({
        level: "critical",
        text: "High API failure rate detected",
      });
    }

    return results;

  }, [liveMetrics]);

  /* =========================================
     LOADING
  ========================================= */
  if (loading) {
    return <AdminPageSkeleton />
  }

  return (
    <div className="space-y-8">

      {/* =========================================
         HEADER
      ========================================= */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        <div>

          <h1 className="text-5xl font-black tracking-tight">

            Analytics Intelligence

          </h1>

          <p className="text-muted-foreground mt-2">

            Enterprise observability,
            infrastructure monitoring,
            realtime analytics &
            AI anomaly detection

          </p>

        </div>

        <div className="flex items-center gap-3">

          <div className="relative flex items-center gap-2">

            <div
              className={`h-3 w-3 rounded-full ${connected
                ? "bg-green-500"
                : "bg-red-500"
                }`}
            />

            {connected && (
              <div className="absolute h-3 w-3 rounded-full bg-green-500 animate-ping" />
            )}

            <Badge
              variant={
                connected
                  ? "default"
                  : "destructive"
              }
            >
              {connected ? (
                <Wifi className="h-4 w-4 mr-1" />
              ) : (
                <WifiOff className="h-4 w-4 mr-1" />
              )}

              {connected
                ? "Realtime Connected"
                : "Socket Offline"}
            </Badge>

          </div>

        </div>

      </div>

      {/* =========================================
         KPI
      ========================================= */}

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

        <Kpi
          title="Total Users"
          value={
            analytics?.users?.totalUsers || 0
          }
          icon={<Users size={20} />}
        />

        <Kpi
          title="Tickets"
          value={
            analytics?.tickets?.totalTickets || 0
          }
          icon={<Ticket size={20} />}
        />

        <Kpi
          title="AI Resolved"
          value={
            analytics?.tickets?.resolvedTickets || 0
          }
          icon={<Bot size={20} />}
        />

        <Kpi
          title="SLA"
          value={`${analytics?.sla?.compliance || 0}%`}
          icon={
            <CheckCircle2 size={20} />
          }
        />

      </div>

      {/* =========================================
         LIVE METRICS
      ========================================= */}

      <div className="grid lg:grid-cols-4 gap-6">

        <MetricCard
          label="CPU Usage"
          value={`${Math.round(
            liveMetrics?.cpuUsage || 0
          )}%`}
          icon={<Cpu size={18} />}
        />

        <MetricCard
          label="RAM Usage"
          value={`${Math.round(
            liveMetrics?.memoryUsage || 0
          )}%`}
          icon={<Database size={18} />}
        />

        <MetricCard
          label="Disk Usage"
          value={`${Math.round(
            liveMetrics?.diskUsage || 0
          )}%`}
          icon={<HardDrive size={18} />}
        />

        <MetricCard
          label="Requests/min"
          value={
            liveMetrics?.requestsPerMinute || 0
          }
          icon={<Activity size={18} />}
        />

      </div>

      {/* =========================================
         CHARTS
      ========================================= */}

      <div className="grid lg:grid-cols-2 gap-6">

        <GraphCard
          title="CPU Usage"
          icon={<Cpu size={18} />}
          data={history}
          dataKey="cpu"
        />

        <GraphCard
          title="Memory Usage"
          icon={<Database size={18} />}
          data={history}
          dataKey="ram"
        />

        <GraphCard
          title="API Latency"
          icon={<Activity size={18} />}
          data={history}
          dataKey="latency"
        />

        <GraphCard
          title="DB Query Timing"
          icon={<Server size={18} />}
          data={history}
          dataKey="db"
        />

      </div>

      {/* =========================================
         HEALTH + ALERTS
      ========================================= */}

      <div className="grid lg:grid-cols-2 gap-6">

        <Card className="p-6 rounded-3xl border bg-card/40 backdrop-blur-xl">

          <h2 className="font-bold text-xl mb-6">

            Infrastructure Health

          </h2>

          <div className="space-y-6">

            <Health
              label="CPU"
              value={
                liveMetrics?.cpuUsage || 0
              }
            />

            <Health
              label="RAM"
              value={
                liveMetrics?.memoryUsage || 0
              }
            />

            <Health
              label="Disk"
              value={
                liveMetrics?.diskUsage || 0
              }
            />

          </div>

        </Card>

        <Card className="p-6 rounded-3xl border bg-card/40 backdrop-blur-xl">

          <div className="flex items-center gap-2 mb-6">

            <AlertTriangle size={18} />

            <h2 className="font-bold text-xl">

              AI Anomaly Detection

            </h2>

          </div>

          <div className="space-y-4">

            {alerts.length === 0 ? (

              <div className="text-green-500 text-sm">

                No anomalies detected

              </div>

            ) : (

              alerts.map(
                (alert, index) => (

                  <motion.div
                    key={index}
                    initial={{
                      opacity: 0,
                      y: 10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    className={`p-4 rounded-2xl border text-sm ${alert.level === "critical"
                      ? "border-red-500/30 bg-red-500/10"
                      : "border-yellow-500/30 bg-yellow-500/10"
                      }`}
                  >
                    {alert.text}
                  </motion.div>

                )
              )

            )}

          </div>

        </Card>

      </div>

      {/* =========================================
         AI INSIGHTS
      ========================================= */}

      <Card className="p-6 rounded-3xl border bg-card/40 backdrop-blur-xl">

        <div className="flex items-center gap-2 mb-5">

          <Bot size={18} />

          <h2 className="font-bold text-xl">

            AI Insights Engine

          </h2>

        </div>

        <div className="space-y-3">

          {analytics?.aiInsights?.map(
            (
              insight,
              index
            ) => (

              <motion.div
                key={index}
                initial={{
                  opacity: 0,
                  x: -10,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                className="text-sm text-muted-foreground"
              >
                • {insight}
              </motion.div>

            )
          )}

        </div>

      </Card>

    </div>
  );
}

/* =========================================
   KPI
========================================= */

function Kpi({
  title,
  value,
  icon,
}: any) {

  return (

    <motion.div
      whileHover={{
        y: -4,
      }}
    >

      <Card className="p-6 rounded-3xl border bg-card/40 backdrop-blur-xl">

        <div className="flex items-center justify-between">

          <div className="text-muted-foreground">
            {icon}
          </div>

        </div>

        <h2 className="text-4xl font-black mt-5">

          {value}

        </h2>

        <p className="text-muted-foreground text-sm mt-2">

          {title}

        </p>

      </Card>

    </motion.div>
  );
}

/* =========================================
   GRAPH
========================================= */

function GraphCard({
  title,
  icon,
  data,
  dataKey,
}: any) {

  return (

    <Card className="p-6 rounded-3xl border bg-card/40 backdrop-blur-xl">

      <div className="flex items-center gap-2 mb-6">

        {icon}

        <h2 className="font-bold">

          {title}

        </h2>

      </div>

      <div className="h-62.5">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <AreaChart data={data}>

            <defs>

              <linearGradient
                id={dataKey}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >

                <stop
                  offset="5%"
                  stopOpacity={0.4}
                />

                <stop
                  offset="95%"
                  stopOpacity={0}
                />

              </linearGradient>

            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              opacity={0.1}
            />

            <XAxis dataKey="time" />

            <YAxis />

            <Tooltip />

            <Area
              type="monotone"
              dataKey={dataKey}
              strokeWidth={3}
              fill={`url(#${dataKey})`}
            />

          </AreaChart>

        </ResponsiveContainer>

      </div>

    </Card>
  );
}

/* =========================================
   HEALTH
========================================= */

function Health({
  label,
  value,
}: any) {

  return (

    <div>

      <div className="flex justify-between text-sm mb-2">

        <span>{label}</span>

        <span>

          {Math.round(value)}%

        </span>

      </div>

      <Progress value={value} />

    </div>
  );
}

/* =========================================
   METRIC
========================================= */

function MetricCard({
  label,
  value,
  icon,
}: any) {

  return (

    <Card className="p-5 rounded-3xl border bg-card/40 backdrop-blur-xl">

      <div className="flex items-center justify-between">

        <div className="text-muted-foreground">

          {icon}

        </div>

      </div>

      <div className="text-sm text-muted-foreground mt-4">

        {label}

      </div>

      <div className="text-3xl font-black mt-2">

        {value}

      </div>

    </Card>
  );
}