"use client";

import { useEffect, useMemo, useState } from "react";

import {
  Bell,
  ShieldAlert,
  Users,
  Server,
  Mail,
  LifeBuoy,
  Bot,
  FileText,
  BarChart3,
  CheckCheck,
  Archive,
  Search,
  AlertTriangle,
  Sparkles,
  Trophy,
  Clock,
} from "lucide-react";

import {
  getNotifications,
  getNotificationStats,
  markNotificationRead,
  markAllNotificationsRead,
  archiveNotification,
  markManyNotificationsRead,
  archiveManyNotifications,
  deleteManyNotifications,
  deleteNotification,
  deleteNotificationsByFilter,
} from "@/lib/api/admin-notifications";

import { socketService } from "@/lib/socket";
import { AdminPageSkeleton } from "../admin-skeleton";
import MetricCard from "./MetriCard";

interface Notification {
  _id: string;
  title: string;
  message: string;
  category: string;
  severity: string;
  createdAt: string;
  metadata?: Record<string, any>;
  read?: boolean;
}

interface NotificationStats {
  total: number;
  unread: number;
  critical: number;
  today: number;
}

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState<NotificationStats>({
    total: 0,
    unread: 0,
    critical: 0,
    today: 0,
  });
  const [loading, setLoading] = useState(true);

  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false);
  const [deleteAllLoading, setDeleteAllLoading] = useState(false);

  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);

  useEffect(() => {
    const enableSound = () => setHasUserInteracted(true);

    window.addEventListener("click", enableSound);
    window.addEventListener("keydown", enableSound);

    return () => {
      window.removeEventListener("click", enableSound);
      window.removeEventListener("keydown", enableSound);
    };
  }, []);

  const [audio] = useState(
    () => new Audio("/sounds/level-up.mp3")
  );

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    socketService.connect(user?._id);
    socketService.emit("join-admin-dashboard");

    const handler = async (notification: Notification) => {
      if (hasUserInteracted) {
        try {
          await audio.play();
        } catch (err) {
          // swallow or log quietly
          console.warn("Notification sound blocked:", err);
        }
      }
      setNotifications((prev) => [notification, ...prev]);
    };

    socketService.on("adminNotification", handler);

    return () => {
      socketService.off("adminNotification", handler);
    };
  }, [audio, hasUserInteracted]);

  const loadData = async () => {
    try {
      setLoading(true);

      const [notificationsRes, statsRes] = await Promise.all([
        getNotifications(),
        getNotificationStats(),
      ]);

      setNotifications(
        (notificationsRes.notifications ?? []).map((n: any) => ({
          ...n,
          read: n.read ?? false, // or derive from n.readBy
        }))
      );

      setStats(
        statsRes.stats || {
          total: 0,
          unread: 0,
          critical: 0,
          today: 0,
        }
      );
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handler = async (notification: Notification) => {
    if (soundEnabled) {
      try {
        await audio.play();
      } catch (err) {
        console.warn("Notification sound blocked:", err);
      }
    }
    setNotifications((prev) => [notification, ...prev]);
  };

  const sortedNotifications = useMemo(
    () =>
      [...notifications].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      ),
    [notifications]
  );

  const filteredNotifications = useMemo(() => {
    return sortedNotifications.filter((notification) => {
      const categoryMatch =
        activeFilter === "all" || activeFilter === "unread"
          ? true
          : notification.category === activeFilter;

      const scopeMatch =
        activeFilter === "unread"
          ? !notification.read
          : true;

      const searchMatch =
        notification.title
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        notification.message
          .toLowerCase()
          .includes(search.toLowerCase());

      return categoryMatch && scopeMatch && searchMatch;
    });
  }, [sortedNotifications, activeFilter, search]);

  const categories = [
    { id: "all", label: "All", icon: Bell },
    { id: "unread", label: "Unread", icon: CheckCheck },
    { id: "auth", label: "Auth", icon: ShieldAlert },
    { id: "billing", label: "Billing", icon: BarChart3 },
    { id: "user", label: "Users", icon: Users },
    { id: "achievement", label: "Achievements", icon: Sparkles },
    { id: "leaderboard", label: "Leaderboard", icon: Trophy },
    { id: "security", label: "Security", icon: ShieldAlert },
    { id: "system", label: "System", icon: Server },
    { id: "ticket", label: "Tickets", icon: LifeBuoy },
    { id: "message", label: "Messages", icon: Mail },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "cms", label: "CMS", icon: FileText },
    { id: "ai", label: "AI", icon: Bot },
  ];

  const allSelected =
    selectedIds.length === filteredNotifications.length &&
    filteredNotifications.length > 0;
  const hasSelection = selectedIds.length > 0;

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredNotifications.map((n) => n._id));
    }
  };

  const getCardClass = (severity: string, read?: boolean) => {
    const base =
      "border rounded-3xl p-5 flex justify-between gap-5 items-start transition-all";

    const severityClass = (() => {
      switch (severity) {
        case "critical":
          return "border-red-500/40 bg-red-500/5";
        case "warning":
          return "border-amber-500/40 bg-amber-500/5";
        case "success":
          return "border-emerald-500/30 bg-emerald-500/5";
        default:
          return "border-cyan-500/20 bg-cyan-500/5";
      }
    })();

    const readClass = read
      ? "opacity-70 bg-background border-dashed"
      : "shadow-[0_0_0_1px_rgba(56,189,248,0.25)]";

    return `${base} ${severityClass} ${readClass}`;
  };

  const critical = notifications.find(
    (n) => n.severity === "critical"
  );

  const handleMarkRead = async (id: string) => {
    try {
      await markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === id ? { ...n, read: true } : n
        )
      );
      const statsRes = await getNotificationStats();
      setStats(
        statsRes.stats || {
          total: 0,
          unread: 0,
          critical: 0,
          today: 0,
        }
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleBulkMarkRead = async () => {
    try {
      await markManyNotificationsRead(selectedIds);
      setNotifications((prev) =>
        prev.map((n) =>
          selectedIds.includes(n._id)
            ? { ...n, read: true }
            : n
        )
      );
      setSelectedIds([]);
      const statsRes = await getNotificationStats();
      setStats(
        statsRes.stats || {
          total: 0,
          unread: 0,
          critical: 0,
          today: 0,
        }
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleBulkArchive = async () => {
    try {
      await archiveManyNotifications(selectedIds);
      setNotifications((prev) =>
        prev.filter((n) => !selectedIds.includes(n._id))
      );
      setSelectedIds([]);
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSingle = async (id: string) => {
    try {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      setSelectedIds((prev) => prev.filter((x) => x !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const handleBulkDelete = async () => {
    try {
      await deleteManyNotifications(selectedIds);

      setNotifications((prev) =>
        prev.filter((n) => !selectedIds.includes(n._id))
      );

      setSelectedIds([]);

      // Refresh stats from server instead of local recompute
      const statsRes = await getNotificationStats();
      setStats(
        statsRes.stats || {
          total: 0,
          unread: 0,
          critical: 0,
          today: 0,
        }
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAllByFilter = async () => {
    try {
      const confirmed = window.confirm(
        "This will delete ALL notifications that match the current filter (across all pages). Continue?"
      );
      if (!confirmed) return;

      const category = activeFilter === "all" || activeFilter === "unread"
        ? undefined
        : activeFilter;

      // You’re not currently filtering by severity separately,
      // so we skip severity for now.
      const severity = undefined;

      await deleteNotificationsByFilter({
        category,
        severity,
        search: search || undefined,
      });

      await loadData();
      setSelectedIds([]);
    } catch (err) {
      console.error(err);
    }
  };

  // Opens the confirmation overlay
  const openDeleteAllByFilterDialog = () => {
    setShowDeleteAllConfirm(true);
  };

  // Runs when user clicks "Confirm" inside the overlay
  const confirmDeleteAllByFilter = async () => {
    try {
      setDeleteAllLoading(true);

      const category =
        activeFilter === "all" || activeFilter === "unread"
          ? undefined
          : activeFilter;

      const severity = undefined;

      await deleteNotificationsByFilter({
        category,
        severity,
        search: search || undefined,
      });

      await loadData();
      setSelectedIds([]);
      setShowDeleteAllConfirm(false);
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteAllLoading(false);
    }
  };

  if (loading) {
    return <AdminPageSkeleton />;
  }

  return (
    <div className="min-h-screen p-6 bg-background">
      {/* HEADER */}
      <div className="flex justify-between mb-5">
        <div className="mb-8">
          <h1 className="text-4xl font-black">
            Notification Hub
          </h1>
          <p className="text-muted-foreground mt-2">
            Enterprise realtime monitoring center
          </p>

          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            <input
              type="checkbox"
              checked={soundEnabled}
              onChange={(e) => setSoundEnabled(e.target.checked)}
              className="h-3 w-3"
            />
            Play notification sounds
          </label>
        </div>

        <button
          onClick={loadData}
          className="inline-flex h-5 items-center gap-2 px-3 py-4 cursor-pointer rounded-xl border text-xs hover:bg-muted"
        >
          <Clock size={14} />
          Reload
        </button>
      </div>

      {/* METRIC STRIP (MetricCard-style) */}
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        <MetricCard
          title="Total Notifications"
          value={stats.total.toLocaleString()}
          icon={<Bell />}
          color="cyan"
          description="All events in the last 30 days"
        />
        <MetricCard
          title="Unread"
          value={stats.unread.toLocaleString()}
          icon={<AlertTriangle />}
          color="emerald"
          description="Pending attention"
        />
        <MetricCard
          title="Critical"
          value={stats.critical.toLocaleString()}
          icon={<AlertTriangle />}
          color="red"
          description="Security & system alerts"
        />
        <MetricCard
          title="Today"
          value={stats.today.toLocaleString()}
          icon={<Clock />}
          color="yellow"
          description="Arrived in the last 24h"
        />
      </div>

      {/* MAIN GRID: Inbox + Intelligence */}
      <div className="grid lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-6">
        {/* LEFT: Inbox + list */}
        <div className="space-y-6">
          {/* Inbox header */}
          <div className="border rounded-3xl p-5 bg-card/60 backdrop-blur-xl border-border sticky top-4 z-10">
            <div className="flex flex-wrap items-center gap-3 justify-between">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Bell className="text-cyan-400" size={18} />
                  <span className="text-sm font-semibold text-muted-foreground">
                    Notification Inbox
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {stats.unread} unread • {stats.total} total
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 justify-end">
                {/* Select all / Clear selection */}
                <button
                  onClick={toggleSelectAll}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  {allSelected ? "Clear selection" : "Select all"}
                </button>

                {/* Mark all as read */}
                <button
                  onClick={async () => {
                    await markAllNotificationsRead();
                    await loadData();
                    setSelectedIds([]);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-xs text-white hover:bg-emerald-600"
                >
                  <CheckCheck size={14} />
                  Mark all as read
                </button>

                {/* Delete ALL matching filter */}
                <button
                  onClick={openDeleteAllByFilterDialog}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-red-500/10 text-xs text-red-400 hover:bg-red-500/20"
                >
                  <AlertTriangle size={14} />
                  Delete all (filter)
                </button>

                {/* Bulk actions (visible only if selection) */}
                {hasSelection && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleBulkMarkRead}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/10 text-xs text-emerald-400 hover:bg-emerald-500/20"
                    >
                      <CheckCheck size={14} />
                      Mark selected
                    </button>
                    <button
                      onClick={handleBulkArchive}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-500/10 text-xs text-amber-400 hover:bg-amber-500/20"
                    >
                      <Archive size={14} />
                      Archive selected
                    </button>
                    <button
                      onClick={handleBulkDelete}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-red-500/10 text-xs text-red-400 hover:bg-red-500/20"
                    >
                      <AlertTriangle size={14} />
                      Delete selected
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Search row */}
            <div className="mt-4 flex items-center justify-start">
              <div className="relative w-full sm:w-64">
                <Search
                  size={18}
                  className="absolute left-3 top-3 text-muted-foreground"
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search notifications..."
                  className="w-full h-10 pl-10 rounded-2xl border bg-background text-sm"
                />
              </div>
            </div>
          </div>

          {/* Critical banner */}
          {critical && (
            <div className="border border-red-500 bg-red-500/10 rounded-3xl p-5 mb-2 flex items-start gap-3">
              <AlertTriangle className="text-red-500 mt-1" />
              <div>
                <p className="text-sm font-semibold">
                  Critical Threat Active
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {critical.message}
                </p>
              </div>
            </div>
          )}

          {/* List */}
          <div className="space-y-4">
            {filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
                <Bell
                  size={32}
                  className="mb-3 text-muted-foreground/70"
                />
                <p className="text-sm font-medium">
                  No notifications here.
                </p>
                <p className="text-xs mt-1">
                  Try a different category or clear your filters.
                </p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <div
                  key={notification._id}
                  className={getCardClass(
                    notification.severity,
                    notification.read
                  )}
                >
                  <div className="flex gap-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(notification._id)}
                      onChange={() =>
                        toggleSelect(notification._id)
                      }
                      className="mt-2 h-4 w-4 rounded border-muted bg-background"
                    />

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {notification.severity === "critical" && (
                          <AlertTriangle
                            className="text-red-500"
                            size={18}
                          />
                        )}
                        <h3
                          className={`text-sm sm:text-base ${notification.read
                            ? "font-semibold text-foreground/70"
                            : "font-black"
                            }`}
                        >
                          {notification.title}
                        </h3>

                        {!notification.read && (
                          <span className="ml-2 text-[10px] uppercase tracking-wide text-cyan-400">
                            • Unread
                          </span>
                        )}
                      </div>

                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {notification.message}
                      </p>

                      <div className="flex flex-wrap gap-2 mt-3 items-center">
                        <span className="px-3 py-1 rounded-full text-[10px] uppercase tracking-wide bg-muted">
                          {notification.category}
                        </span>
                        <span className="px-3 py-1 rounded-full text-[10px] uppercase tracking-wide bg-muted">
                          {notification.severity}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          {new Date(
                            notification.createdAt
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() =>
                        handleMarkRead(notification._id)
                      }
                      className="h-9 px-3 rounded-xl bg-emerald-500 text-[11px] text-white flex items-center gap-2 hover:bg-emerald-600"
                    >
                      <CheckCheck size={14} />
                      Mark read
                    </button>

                    <button
                      onClick={() =>
                        archiveNotification(notification._id)
                      }
                      className="h-9 px-3 rounded-xl border text-[11px] flex items-center gap-2 hover:bg-muted"
                    >
                      <Archive size={14} />
                      Archive
                    </button>

                    <button
                      onClick={() =>
                        handleDeleteSingle(notification._id)
                      }
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-red-500/10 text-xs text-red-400 hover:bg-red-500/20"
                    >
                      <AlertTriangle size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT: Intelligence panel */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-border bg-card/40 backdrop-blur-xl p-6">
            <div className="flex items-center gap-2">
              <Bot className="text-primary" />
              <h2 className="text-lg font-semibold">
                Notification Intelligence
              </h2>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Summarized insights based on your latest alerts.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>
                • {stats.critical} critical alerts awaiting review.
              </li>
              <li>
                • {stats.unread} unread notifications in the last
                24 hours.
              </li>
              <li>
                • Use filters to narrow down by category and
                severity.
              </li>
            </ul>
          </div>

          {/* Categories card */}
          <div className="border rounded-3xl p-4 bg-card">
            <h2 className="font-black mb-3">Categories</h2>
            <div className="space-y-2">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() =>
                      setActiveFilter(category.id)
                    }
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${activeFilter === category.id
                      ? "bg-cyan-500/10 text-cyan-400"
                      : "hover:bg-muted"
                      }`}
                  >
                    <Icon size={18} />
                    <span className="text-sm">
                      {category.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {showDeleteAllConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10">
                <AlertTriangle className="text-red-500" size={20} />
              </div>
              <div>
                <h2 className="text-sm font-semibold">
                  Delete all matching notifications?
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  This will permanently delete all notifications that match the current filter (across all pages). This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 mt-4">
              <button
                onClick={() => setShowDeleteAllConfirm(false)}
                className="px-3 py-2 text-xs rounded-xl border text-muted-foreground hover:bg-muted"
                disabled={deleteAllLoading}
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteAllByFilter}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500 text-xs text-white hover:bg-red-600 disabled:opacity-60"
                disabled={deleteAllLoading}
              >
                <AlertTriangle size={14} />
                {deleteAllLoading ? "Deleting..." : "Confirm delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value }: any) {
  return (
    <div className="rounded-3xl border bg-card p-6">
      <p className="text-muted-foreground">{title}</p>
      <h2 className="text-4xl font-black mt-3">{value}</h2>
    </div>
  );
}