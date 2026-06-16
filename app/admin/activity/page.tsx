"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { socketService } from "@/lib/socket";

import {
  getActivityFeed,
  getIntelligenceOverview,
  getIntelligenceHistory,
} from "@/lib/api/admin-users";

import {
  ShieldAlert,
  Users,
  Brain,
  Trophy,
  Flame,
  Activity,
  Radar,
  BellRing,
  TrendingUp,
  TrendingDown,
  Eye,
  Cpu,
  Sparkles,
  TimerReset,
  CircleDollarSign,
  UserCheck,
  UserX,
  Shield,
  Bot,
  Wifi,
  Clock3,
  ChevronRight,
  Zap,
} from "lucide-react";

import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function ActivityPage() {
  const [growthGraph, setGrowthGraph] = useState<any[]>([]);
  const [skillPopularity, setSkillPopularity] = useState<any[]>([]);
  const [skillPage, setSkillPage] = useState(1);
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const [threatFeed, setThreatFeed] = useState<any[]>([]);
  const [behavior, setBehavior] = useState<any>({});

  const [range, setRange] = useState("7d");
  const [history, setHistory] = useState<any[]>([]);

  const [threatSummary, setThreatSummary] = useState<any>({});

  const [ticketStats, setTicketStats] = useState({
    openTickets: 0,
    resolvedTickets: 0,
  });

  const [heatmap, setHeatmap] = useState<any[]>([]);
  const [hourlyActivity, setHourlyActivity] = useState<any[]>([]);
  const [weeklyPatterns, setWeeklyPatterns] = useState<any[]>([]);

  const [analytics, setAnalytics] = useState<any>(null);
  const [feed, setFeed] = useState<any[]>([]);

  const onlinePercentage = useMemo(() => {
    if (!analytics?.totalUsers || !analytics?.onlineUsers) return 0;
    return Math.floor((analytics.onlineUsers / analytics.totalUsers) * 100);
  }, [analytics]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    socketService.connect();
    socketService.emit("join-admin-analytics");
    socketService.emit("join-admin-dashboard");

    const safeArray = (arr: any) => (Array.isArray(arr) ? arr : []);

    const loadIntelligence = async () => {
      try {
        if (!token) return;

        const res = await getIntelligenceOverview(token);

        setGrowthGraph(safeArray(res?.growthGraph));
        setSkillPopularity(safeArray(res?.skillPopularity));
        setLeaderboardData(safeArray(res?.leaderboard));
        setThreatFeed(safeArray(res?.threats));
        setHeatmap(safeArray(res?.heatmap));

        setBehavior(res?.behavior || {
          churn: 0,
          users: 0,
          streak: 0,
          highestStreak: 0,
          losingStreaks: 0,
          activeStreakUsers: 0,
        });

        setThreatSummary(res?.threatSummary || {});
        setAnalytics(res?.analytics || {});
      } catch (e) {
        console.log(e);
      }
    };

    const loadHistory = async () => {
      try {
        if (!token) return;

        const res = await getIntelligenceHistory(token, range);

        const snapshots = safeArray(res?.snapshots);

        setHistory(snapshots);

        setHourlyActivity(
          res?.hourlyActivity?.length
            ? res.hourlyActivity
            : Array.from({ length: 24 }).map((_, i) => ({
              hour: `${i}:00`,
              users: Math.floor(Math.random() * 80),
            }))
        );

        setWeeklyPatterns(
          res?.weeklyPatterns?.length
            ? res.weeklyPatterns
            : [
              { day: "Mon", activities: 30 },
              { day: "Tue", activities: 50 },
              { day: "Wed", activities: 40 },
              { day: "Thu", activities: 70 },
              { day: "Fri", activities: 90 },
              { day: "Sat", activities: 60 },
              { day: "Sun", activities: 20 },
            ]
        );

        const latest = snapshots[snapshots.length - 1];

        setTicketStats({
          openTickets: latest?.openTickets || 0,
          resolvedTickets: latest?.resolvedTickets || 0,
        });
      } catch (e) {
        console.log(e);
      }
    };

    const loadFeed = async () => {
      if (!token) return;
      const res = await getActivityFeed(token);
      setFeed(res?.activities || []);
    };

    loadIntelligence();
    loadHistory();
    loadFeed();

    socketService.on(
      "intelligence:growth",
      setGrowthGraph
    );

    socketService.on(
      "intelligence:skills",
      (data) => {
        setSkillPopularity(
          Array.isArray(data)
            ? data
            : []
        );
      }
    );

    socketService.on(
      "intelligence:leaderboard",
      setLeaderboardData
    );

    socketService.on(
      "intelligence:threats",
      setThreatFeed
    );

    socketService.on(
      "intelligence:behavior",
      setBehavior
    );

    return () => {
      socketService.off(
        "intelligence:growth"
      );

      socketService.off(
        "intelligence:skills"
      );

      socketService.off(
        "intelligence:leaderboard"
      );

      socketService.off(
        "intelligence:threats"
      );

      socketService.off(
        "intelligence:behavior"
      );
    };

  }, [range]);

  const skillsPerPage = 4;

  const paginatedSkills = useMemo(() => {
    const start =
      (skillPage - 1) * skillsPerPage;

    return skillPopularity.slice(
      start,
      start + skillsPerPage
    );
  }, [skillPopularity, skillPage]);

  const totalSkillPages = Math.ceil(
    skillPopularity.length / skillsPerPage
  );

  return (
    <div className="min-h-screen  border-border border bg-card/50 text-foreground p-6">

      {/* HEADER */}

      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5 mb-8">

        <div>

          <div className="flex items-center gap-3">

            <div className="w-14 h-14 rounded-3xl bg-linear-to-br from-cyan-500 to-blue-600 flex items-center justify-center">

              <Sparkles size={26} />

            </div>

            <div>

              <h1 className="text-5xl font-black tracking-tight">

                Enterprise Intelligence Center

              </h1>

              <p className="text-zinc-400 mt-1">

                Realtime SaaS observability,
                behavioral intelligence &
                predictive analytics

              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">

          <TopBadge
            icon={<Wifi size={16} />}
            text="Realtime Streaming"
          />

          <TopBadge
            icon={<Shield size={16} />}
            text="Threat Detection Active"
          />

          <TopBadge
            icon={<Bot size={16} />}
            text="AI Intelligence Online"
          />
        </div>
      </div>

      {/* MAIN METRICS */}

      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-5 mb-8">

        <MetricCard
          title="Total Users"
          value={analytics?.totalUsers || 0}
          icon={<Users />}
          growth="+18%"
        />

        <MetricCard
          title="AI Requests"
          value={analytics?.aiRequests || 0}
          icon={<Brain />}
          growth="+42%"
        />

        <MetricCard
          title="Threat Detection"
          value={analytics?.threatsDetected || 0}
          icon={<ShieldAlert />}
          growth="+8%"
        />

        <MetricCard
          title="Realtime XP"
          value={analytics?.totalXP || 0}
          icon={<Trophy />}
          growth="+23%"
        />

        <MetricCard
          title="Engaged Users"
          value={analytics?.engagedUsers || 0}
          icon={<Flame />}
          growth="+16%"
        />

        <MetricCard
          title="Churn Risk"
          value={analytics?.churnRiskUsers || 0}
          icon={<Radar />}
          danger
          growth="-7%"
        />

        <MetricCard
          title="Live Activities"
          value={analytics?.totalActivities || 0}
          icon={<Activity />}
          growth="+31%"
        />

        <MetricCard
          title="Admin Alerts"
          value={analytics?.adminAlerts || 0}
          icon={<BellRing />}
          growth="+5%"
        />

        <MetricCard
          title="Open Tickets"
          value={
            ticketStats.openTickets
          }
          icon={<CircleDollarSign />}
          growth="+12%"
          danger
        />

        <MetricCard
          title="Resolved Tickets"
          value={
            ticketStats.resolvedTickets
          }
          icon={<Shield />}
          growth="+28%"
        />

      </div>

      {/* ANALYTICS GRID */}

      <div className="grid grid-cols-1 2xl:grid-cols-3 gap-6 mb-8">

        {/* USER GROWTH */}

        <div className="2xl:col-span-2 bg-background border border-border rounded-3xl p-6">

          <div className="flex items-start justify-between mb-6">

            <div>

              <h2 className="text-2xl font-black">

                User Growth Analytics

              </h2>

              <p className="text-muted-foreground text-sm mt-1">

                Daily platform engagement
                monitoring

              </p>

            </div>

            <div className="flex items-center gap-4">

              <div className="flex gap-2">

                {["7d", "30d", "90d"].map(
                  (item) => (

                    <button
                      key={item}
                      onClick={() =>
                        setRange(item)
                      }
                      className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${range === item
                        ? "bg-cyan-500 text-white"
                        : "bg-background border border-border text-muted-foreground hover:border-cyan-500"
                        }`}
                    >

                      {item}

                    </button>
                  )
                )}

              </div>

              <div className="flex items-center gap-2 text-emerald-400 text-sm">

                <TrendingUp size={16} />

                +24% Growth

              </div>

            </div>

          </div>

          <div className="h-80">

            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={
                  history.length
                    ? history.map((item) => ({
                      name:
                        new Date(
                          item.createdAt
                        ).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                          }
                        ),

                      users:
                        item.totalUsers,
                    }))
                    : growthGraph
                }
              >

                <defs>
                  <linearGradient
                    id="colorUsers"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="#06b6d4"
                      stopOpacity={0.8}
                    />

                    <stop
                      offset="95%"
                      stopColor="#06b6d4"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#27272a"
                />

                <XAxis
                  dataKey="name"
                  stroke="#71717a"
                />

                <Tooltip />

                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="#06b6d4"
                  fillOpacity={1}
                  fill="url(#colorUsers)"
                />

              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* LIVE PRESENCE */}
        <div className="bg-background border border-border rounded-3xl p-6">

          <div className="flex items-center justify-between">

            <div>

              <h2 className="text-2xl font-black">

                Live Presence

              </h2>

              <p className="text-muted-foreground text-sm mt-1">

                Active user intelligence

              </p>
            </div>

            <Eye className="text-cyan-400" />
          </div>

          <div className="mt-10 flex items-center justify-center">

            <div className="relative w-56 h-56 rounded-full border-16 border-border flex items-center justify-center">

              <div className="text-center">

                <h2 className="text-4xl font-black">

                  {onlinePercentage}%

                </h2>

                <p className="text-zinc-500 mt-2">

                  Online Now

                </p>
              </div>

              <div className="absolute top-0 left-0 w-full h-full rounded-full border-16 border-cyan-500 border-t-transparent rotate-45" />

            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-10">

            <MiniStat
              title="Online"
              value={analytics?.onlineUsers || 0}
              icon={<UserCheck size={16} />}
            />

            <MiniStat
              title="Inactive"
              value={analytics?.inactiveUsers || 0}
              icon={<UserX size={16} />}
            />

          </div>
        </div>

      </div>

      {/* SECOND GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">

        {/* SKILL POPULARITY */}
        <div className="bg-background border border-border rounded-3xl p-6">

          <div className="flex items-center justify-between mb-6">

            <div>

              <h2 className="text-2xl font-black">
                Skill Popularity
              </h2>

              <p className="text-zinc-500 text-sm">
                Trending learning paths
              </p>

            </div>

            <Zap className="text-yellow-400" />

          </div>

          {/* PIE CHART */}
          <div className="h-65">

            <ResponsiveContainer width="100%" height="100%">

              <PieChart>

                <Pie
                  data={skillPopularity}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={95}
                >

                  {skillPopularity.map(
                    (_, index) => (

                      <Cell
                        key={index}
                        fill={
                          [
                            "#06b6d4",
                            "#8b5cf6",
                            "#22c55e",
                            "#f59e0b",
                            "#ef4444",
                            "#14b8a6",
                            "#eab308",
                            "#6366f1",
                          ][index % 8]
                        }
                      />
                    )
                  )}

                </Pie>

                <Tooltip />

              </PieChart>

            </ResponsiveContainer>

          </div>

          {/* SKILL LIST */}
          <div className="mt-6 space-y-3">

            {paginatedSkills.map(
              (skill, index) => {

                const colors = [
                  "bg-cyan-400",
                  "bg-purple-400",
                  "bg-green-400",
                  "bg-yellow-400",
                  "bg-red-400",
                  "bg-teal-400",
                  "bg-indigo-400",
                  "bg-orange-400",
                ];

                return (

                  <div
                    key={index}
                    className="flex items-center justify-between bg-background border border-border rounded-2xl p-4"
                  >

                    <div className="flex items-center gap-3">

                      <div
                        className={`w-3 h-3 rounded-full ${colors[index % 8]
                          }`}
                      />

                      <div>

                        <h3 className="font-bold text-sm">
                          {skill.name}
                        </h3>

                        <p className="text-xs text-muted-foreground">
                          Trending skill activity
                        </p>

                      </div>

                    </div>

                    <div className="text-right">

                      <h3 className="font-black text-cyan-400">
                        {skill.value}
                      </h3>

                      <p className="text-xs text-muted-foreground">
                        learners
                      </p>

                    </div>

                  </div>
                );
              }
            )}

          </div>

          {/* PAGINATION */}
          <div className="flex items-center justify-between mt-6">

            <button
              disabled={skillPage === 1}
              onClick={() =>
                setSkillPage((prev) =>
                  Math.max(prev - 1, 1)
                )
              }
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${skillPage === 1
                ? "bg-zinc-900 text-zinc-600 cursor-not-allowed"
                : "bg-background border border-border hover:border-cyan-500"
                }`}
            >

              Previous

            </button>

            <div className="text-sm text-muted-foreground">

              Page {skillPage} of {totalSkillPages || 1}

            </div>

            <button
              disabled={
                skillPage === totalSkillPages
              }
              onClick={() =>
                setSkillPage((prev) =>
                  Math.min(
                    prev + 1,
                    totalSkillPages
                  )
                )
              }
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${skillPage === totalSkillPages
                ? "bg-zinc-900 text-zinc-600 cursor-not-allowed"
                : "bg-background border border-border hover:border-cyan-500"
                }`}
            >

              Next

            </button>

          </div>

        </div>

        {/* THREAT CENTER */}
        <div className="bg-background border border-border/90 rounded-3xl p-6">

          <div className="flex items-center justify-between mb-6">

            <div>

              <h2 className="text-2xl font-black">

                Threat Center

              </h2>

              <p className="text-zinc-500 text-sm">

                Live security intelligence

              </p>
            </div>

            <ShieldAlert className="text-red-500" />
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">

            <ThreatStat
              label="Critical"
              value={
                threatSummary?.critical || 0
              }
              color="text-red-400"
            />

            <ThreatStat
              label="High"
              value={
                threatSummary?.high || 0
              }
              color="text-orange-400"
            />

            <ThreatStat
              label="Medium"
              value={
                threatSummary?.medium || 0
              }
              color="text-yellow-400"
            />

            <ThreatStat
              label="Low"
              value={
                threatSummary?.low || 0
              }
              color="text-cyan-400"
            />
          </div>

          <div className="space-y-4">

            {threatFeed.map(
              (
                threat,
                index
              ) => (

                <div
                  key={index}
                  className="bg-background border border-border/40 rounded-2xl p-4"
                >

                  <div className="flex items-center justify-between">

                    <h3 className="font-bold">

                      {
                        threat.title
                      }

                    </h3>

                    <div
                      className={`px-3 py-1 rounded-full text-xs font-bold ${threat.severity === "critical"
                        ? "bg-red-500/20 text-red-400"
                        : threat.severity === "high"
                          ? "bg-orange-500/20 text-orange-400"
                          : threat.severity === "medium"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-cyan-500/20 text-cyan-400"
                        }`}
                    >

                      {
                        threat.severity
                      }

                    </div>
                  </div>
                </div>
              )
            )}

          </div>
        </div>

        {/* LEADERBOARD */}
        <div className="bg-background border border-border rounded-3xl p-6">

          <div className="flex items-center justify-between mb-6">

            <div>

              <h2 className="text-2xl font-black">

                Leaderboard AI

              </h2>

              <p className="text-zinc-500 text-sm">

                Top platform performers

              </p>
            </div>

            <Trophy className="text-yellow-400" />
          </div>

          <div className="space-y-4">

            {leaderboardData.map(
              (
                user,
                index
              ) => (

                <div
                  key={index}
                  className="bg-background border border-zinc-800 rounded-2xl p-4 flex items-center justify-between"
                >

                  <div className="flex items-center gap-4">

                    <div className="w-12 h-12 rounded-2xl bg-background flex items-center justify-center font-black">

                      #{index + 1}

                    </div>

                    <div>

                      <h3 className="font-bold">

                        {user.name}

                      </h3>

                      <p className="text-zinc-500 text-sm">

                        {user.streak} day streak

                      </p>
                    </div>
                  </div>

                  <div className="text-right">

                    <h3 className="font-black text-cyan-400">

                      {user.xp}

                    </h3>

                    <p className="text-zinc-500 text-sm">

                      XP

                    </p>
                  </div>
                </div>
              )
            )}

          </div>
        </div>

      </div>

      {/* ================= PREMIUM ENGAGEMENT HEATMAP ================= */}
      <div className="bg-background border border-border rounded-3xl p-6 mb-8 overflow-hidden">

        <div className="flex items-center justify-between mb-8">

          <div>
            <h2 className="text-2xl font-black">
              Engagement Heatmap
            </h2>

            <p className="text-muted-foreground text-sm mt-1">
              User engagement intensity across the week
            </p>
          </div>

          <div className="flex items-center gap-2 text-cyan-400 text-sm font-semibold">
            <Activity size={16} />
            Live Engagement
          </div>

        </div>

        {/* DAYS */}
        <div className="grid grid-cols-8 gap-2">
          {/* LABEL COLUMN */}
          <div className="flex flex-col justify-between text-xs text-muted-foreground py-1">

            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>

          </div>

          {/* HEATMAP */}
          <div className="col-span-7 grid grid-cols-7 gap-3">
            {heatmap.map((item, index) => {

              const users =
                item?.users || 0;

              const intensity =
                users > 90
                  ? "from-cyan-300 to-cyan-500 shadow-cyan-500/40"
                  : users > 70
                    ? "from-cyan-400/80 to-cyan-600/80"
                    : users > 50
                      ? "from-cyan-500/60 to-cyan-700/60"
                      : users > 20
                        ? "from-cyan-700/40 to-cyan-900/40"
                        : "from-zinc-800 to-zinc-900";

              return (

                <div
                  key={index}
                  className={`
              relative
              h-16
              rounded-2xl
              bg-linear-to-br
              ${intensity}
              border border-white/5
              hover:scale-105
              hover:border-cyan-400/40
              transition-all
              duration-300
              cursor-pointer
              group
              overflow-hidden
            `}
                >

                  {/* GLOW */}

                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-cyan-400/10 blur-xl" />
                  {/* VALUE */}
                  <div className="absolute bottom-2 left-2">

                    <h3 className="text-sm font-black text-white">

                      {users}

                    </h3>

                    {/* <div className="absolute items-center text-center opacity-0 group-hover:opacity-100"> */}
                    <p className="text-[10px] text-zinc-300">
                      {item.day} - {users} users active
                    </p>
                    {/* </div> */}

                  </div>

                  {/* TOP DOT */}
                  <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-white/70 animate-pulse" />
                </div>
              );
            })}

          </div>

        </div>

        {/* LEGEND */}

        <div className="flex items-center justify-end gap-3 mt-8">

          <span className="text-xs text-muted-foreground">
            Low
          </span>

          <div className="flex gap-1">

            <div className="w-4 h-4 rounded bg-zinc-800" />
            <div className="w-4 h-4 rounded bg-cyan-900/50" />
            <div className="w-4 h-4 rounded bg-cyan-700/60" />
            <div className="w-4 h-4 rounded bg-cyan-500/70" />
            <div className="w-4 h-4 rounded bg-cyan-400" />

          </div>

          <span className="text-xs text-muted-foreground">
            High
          </span>

        </div>

      </div>

      {/* BEHAVIOR ENGINE */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">

        <div className="bg-background border border-border/60 rounded-3xl p-6">

          <div className="flex items-center justify-between mb-6">

            <div>

              <h2 className="text-2xl font-black">

                Behavioral Intelligence

              </h2>

              <p className="text-zinc-500 text-sm">

                Predictive engagement engine

              </p>
            </div>

            <Brain className="text-purple-400" />
          </div>

          <div className="space-y-4">

            <BehaviorCard
              title="Likely To Churn"
              value={behavior?.churn || 0}
              trend="Declining activity detected"
              icon={<TrendingDown />}
              danger
            />

            <BehaviorCard
              title="Highly Engaged"
              value={behavior?.users || 0}
              trend="Excellent engagement"
              icon={<Flame />}
            />

            <BehaviorCard
              title="Declining Streaks"
              value={behavior?.streak || 0}
              trend="Streak drop within 7 days"
              icon={<TimerReset />}
              danger
            />

            <BehaviorCard
              title="Highest Streak"
              value={behavior?.highestStreak || 0}
              trend="Top streak achieved today"
              icon={<Trophy />}
            />

            <BehaviorCard
              title="Users Losing Streaks"
              value={behavior?.losingStreaks || 0}
              trend="Users inactive for 24h+"
              icon={<TrendingDown />}
              danger
            />

            <BehaviorCard
              title="Active Streak Users"
              value={behavior?.activeStreakUsers || 0}
              trend="Maintaining daily streaks"
              icon={<Flame />}
            />

          </div>
        </div>

        {/* LIVE FEED */}

        <div className="bg-background border border-border rounded-3xl p-6">

          <div className="flex items-center justify-between mb-6">

            <div>

              <h2 className="text-2xl font-black">

                Live Intelligence Feed

              </h2>

              <p className="text-muted-foreground text-sm">

                Realtime platform stream

              </p>
            </div>

            <Clock3 className="text-cyan-400" />
          </div>

          <div className="space-y-4 max-h-130 overflow-y-auto pr-1">

            {feed.map(
              (
                item
              ) => (

                <div
                  key={item._id}
                  className="border border-border bg-background rounded-2xl p-4 hover:border-cyan-500/40 transition-all"
                >

                  <div className="flex items-start justify-between gap-3">

                    <div>

                      <h3 className="font-bold">

                        {item.title}

                      </h3>

                      <p className="text-muted-foreground text-sm mt-2 leading-relaxed">

                        {
                          item.description
                        }

                      </p>
                    </div>

                    <ChevronRight
                      className="text-muted-foreground"
                      size={18}
                    />
                  </div>

                  <div className="mt-4 flex items-center justify-between">

                    <div className="flex items-center gap-2 text-xs text-zinc-500">

                      <Cpu size={13} />

                      Live Event Stream
                    </div>

                    <span className="text-xs text-muted-foreground">

                      {new Date(
                        item.createdAt
                      ).toLocaleTimeString()}

                    </span>
                  </div>
                </div>
              )
            )}

          </div>
        </div>

      </div>

    </div>
  );
}

/* ================= COMPONENTS ================= */

function MetricCard({
  title,
  value,
  icon,
  growth,
  danger,
}: any) {

  return (
    <div className="bg-background border border-border rounded-3xl p-6 hover:border-cyan-500/30 transition-all duration-300">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-foreground text-sm">

            {title}

          </p>

          <h2 className="text-5xl font-muted-foreground mt-3">

            {value || 0}

          </h2>

          <div
            className={`mt-4 inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full ${danger
              ? "bg-red-500/20 text-red-400"
              : "bg-emerald-500/20 text-emerald-400"
              }`}
          >

            <TrendingUp size={12} />

            {growth}

          </div>
        </div>

        <div className="w-16 h-16 rounded-3xl bg-card/90 border-border border flex items-center justify-center text-cyan-400">

          {icon}

        </div>
      </div>
    </div>
  );
}

function TopBadge({
  icon,
  text,
}: any) {

  return (
    <div className="bg-background border border-zinc-800 rounded-2xl px-4 py-3 flex items-center gap-2 text-sm text-muted-foreground">

      {icon}

      {text}
    </div>
  );
}

function MiniStat({
  title,
  value,
  icon,
}: any) {

  return (
    <div className="bg-background border border-border rounded-2xl p-4">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-muted-foreground text-sm">

            {title}

          </p>

          <h2 className="text-3xl font-muted-foreground mt-2">

            {value}

          </h2>
        </div>

        <div className="text-cyan-400">

          {icon}

        </div>
      </div>
    </div>
  );
}

function BehaviorCard({
  title,
  value,
  trend,
  icon,
  danger,
}: any) {

  return (
    <div className="bg-background border border-border rounded-2xl p-5 flex items-center justify-between">

      <div>

        <h3 className="font-bold text-lg">

          {title}

        </h3>

        <h2 className="text-3xl font-muted-foreground mt-2">

          {value}

        </h2>

        <p className="text-muted-foreground text-sm mt-2">

          {trend}

        </p>
      </div>

      <div
        className={`w-16 h-16 rounded-3xl flex items-center justify-center ${danger
          ? "bg-red-500/10 text-red-400"
          : "bg-cyan-500/10 text-cyan-400"
          }`}
      >

        {icon}

      </div>
    </div>
  );
}

function ThreatStat({
  label,
  value,
  color,
}: any) {

  return (
    <div className="bg-background border border-border rounded-2xl p-4">

      <p className="text-muted-foreground text-sm">

        {label}

      </p>

      <h2
        className={`text-2xl font-black mt-2 ${color}`}
      >

        {value}

      </h2>

    </div>
  );
}