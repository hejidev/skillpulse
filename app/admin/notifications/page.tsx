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
} from "lucide-react";

import {
  getNotifications,
  getNotificationStats,
  markNotificationRead,
  markAllNotificationsRead,
  archiveNotification,
} from "@/lib/api/admin-notifications";

import { socketService } from "@/lib/socket";
import { AdminPageSkeleton } from "../admin-skeleton";

interface Notification {
  _id: string;
  title: string;
  message: string;
  category: string;
  severity: string;
  createdAt: string;
}

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] =
    useState<Notification[]>([]);

  const [stats, setStats] = useState<any>({});

  const [loading, setLoading] =
    useState(true);

  const [activeFilter, setActiveFilter] =
    useState("all");

  const [search, setSearch] =
    useState("");

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const user = JSON.parse(
      localStorage.getItem("user") || "{}"
    );

    socketService.connect(user?._id);

    socketService.emit(
      "join-admin-dashboard"
    );

    socketService.on(
      "adminNotification",
      (notification: Notification) => {

        audio.play();

        setNotifications((prev) => [
          notification,
          ...prev,
        ]);
      }
    );

    return () => {
      socketService.off(
        "admin-notification"
      );
    };
  }, []);

  const sortedNotifications =
    [...notifications].sort(
      (a, b) =>
        new Date(
          b.createdAt
        ).getTime()
        -
        new Date(
          a.createdAt
        ).getTime()
    );

  const loadData = async () => {
    try {
      setLoading(true);

      const [notificationsRes, statsRes] =
        await Promise.all([
          getNotifications(),
          getNotificationStats(),
        ]);

      setNotifications(
        notificationsRes.notifications ||
        notificationsRes ||
        []
      );

      setStats(
        statsRes.stats ||
        statsRes ||
        {}
      );
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredNotifications =
    useMemo(() => {
      return notifications.filter(
        (notification) => {
          const categoryMatch =
            activeFilter === "all"
              ? true
              : notification.category ===
              activeFilter;

          const searchMatch =
            notification.title
              .toLowerCase()
              .includes(
                search.toLowerCase()
              ) ||
            notification.message
              .toLowerCase()
              .includes(
                search.toLowerCase()
              );

          return (
            categoryMatch &&
            searchMatch
          );
        }
      );
    }, [
      notifications,
      activeFilter,
      search,
    ]);

  const categories = [
    {
      id: "all",
      label: "All",
      icon: Bell,
    },
    {
      id: "auth",
      label: "Auth",
      icon: ShieldAlert,
    },
    {
      id: "user",
      label: "Users",
      icon: Users,
    },
    {
      id: "security",
      label: "Security",
      icon: ShieldAlert,
    },
    {
      id: "system",
      label: "System",
      icon: Server,
    },
    {
      id: "ticket",
      label: "Tickets",
      icon: LifeBuoy,
    },
    {
      id: "message",
      label: "Messages",
      icon: Mail,
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
    },
    {
      id: "cms",
      label: "CMS",
      icon: FileText,
    },
    {
      id: "ai",
      label: "AI",
      icon: Bot,
    },
  ];

  const getSeverityClass = (
    severity: string
  ) => {
    switch (severity) {
      case "critical":
        return "border-red-500/30 bg-red-500/5";

      case "warning":
        return "border-amber-500/30 bg-amber-500/5";

      case "success":
        return "border-emerald-500/30 bg-emerald-500/5";

      default:
        return "border-cyan-500/20 bg-cyan-500/5";
    }
  };

const critical =
  notifications.find(
    n =>
      n.severity ===
      "critical"
  );

useEffect(() => {
  setStats((prev: any) => ({
    ...prev,
    total: notifications.length,
    critical:
      notifications.filter(
        n =>
          n.severity ===
          "critical"
      ).length,
  }));
}, [notifications]);

  const [audio] = useState(
    () =>
      new Audio(
        "/sounds/level-up.mp3"
      )
  );

  if (loading) {
    return <AdminPageSkeleton />;
  }

  return (
    <div className="min-h-screen p-6 bg-background">

      <div className="mb-8">

        <h1 className="text-4xl font-black">
          Notification Hub
        </h1>

        <p className="text-muted-foreground mt-2">
          Enterprise realtime
          monitoring center
        </p>

      </div>

      {/* STATS */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">

        <StatCard
          title="Total"
          value={stats.total || 0}
        />

        <StatCard
          title="Unread"
          value={stats.unread || 0}
        />

        <StatCard
          title="Critical"
          value={stats.critical || 0}
        />

        <StatCard
          title="Today"
          value={stats.today || 0}
        />

      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">

        {/* SIDEBAR */}

        <div className="border rounded-3xl p-4 bg-card">

          <h2 className="font-black mb-5">
            Categories
          </h2>

          <div className="space-y-2">

            {categories.map(
              (category) => {
                const Icon =
                  category.icon;

                return (
                  <button
                    key={category.id}
                    onClick={() =>
                      setActiveFilter(
                        category.id
                      )
                    }
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${activeFilter ===
                      category.id
                      ? "bg-cyan-500/10 text-cyan-400"
                      : "hover:bg-muted"
                      }`}
                  >
                    <Icon size={18} />

                    <span>
                      {category.label}
                    </span>
                  </button>
                );
              }
            )}

          </div>

        </div>

        {/* CONTENT */}

        <div className="xl:col-span-3">

          <div className="border rounded-3xl p-5 bg-card mb-5">
            <div className="flex gap-3">

  <button
    onClick={async () => {
      await markAllNotificationsRead();
      loadData();
    }}
  >
    Mark All Read
  </button>

</div>
            <div className="relative">

              <Search
                size={18}
                className="absolute left-4 top-4 text-muted-foreground"
              />

              <input
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                placeholder="Search notifications..."
                className="w-full h-12 pl-11 rounded-2xl border bg-background"
              />

            </div>

          </div>

          <div className="space-y-4">

            {loading ? (
              [...Array(8)].map(
                (_, i) => (
                  <div
                    key={i}
                    className="h-28 rounded-3xl border animate-pulse bg-muted"
                  />
                )
              )
            ) : (
              filteredNotifications.length ===
              0 && (
                sortedNotifications.map(
                  (
                    notification
                  ) => (
                    <div
                      key={
                        notification._id
                      }
                      className={`border rounded-3xl p-5 transition-all ${getSeverityClass(
                        notification.severity
                      )}`}
                    >
                      <div className="flex justify-between gap-5">

                        <div>

                          <div className="flex items-center gap-2 mb-2">

                            {notification.severity ===
                              "critical" && (
                                <AlertTriangle className="text-red-500" />
                              )}

                            <h3 className="font-black text-lg">
                              {
                                notification.title
                              }
                            </h3>

                          </div>

                          <p className="text-muted-foreground">
                            {
                              notification.message
                            }
                          </p>

                          <div className="flex gap-2 mt-4">

                            <span className="px-3 py-1 rounded-full text-xs bg-muted">
                              {
                                notification.category
                              }
                            </span>

                            <span className="px-3 py-1 rounded-full text-xs bg-muted">
                              {
                                notification.severity
                              }
                            </span>

                          </div>

                        </div>

                        <div className="flex flex-col gap-2">

                          <button
                            onClick={() =>
                              markNotificationRead(
                                notification._id
                              )
                            }
                            className="h-10 px-4 rounded-xl bg-emerald-500 text-white flex items-center gap-2"
                          >
                            <CheckCheck size={16} />

                            Read

                          </button>

                          <button
                            onClick={() =>
                              archiveNotification(
                                notification._id
                              )
                            }
                            className="h-10 px-4 rounded-xl border flex items-center gap-2"
                          >
                            <Archive size={16} />

                            Archive

                          </button>

                        </div>

                      </div>

                    </div>
                  )
                )
              ))}

          </div>

        </div>

      </div>

      {
        critical && (

          <div
            className="
 border
 border-red-500
 bg-red-500/10
 rounded-3xl
 p-5
 mb-6
"
          >
            <div
              className="
  flex
  items-center
  gap-3
 "
            >
              <AlertTriangle />

              <span>
                Critical Threat Active
              </span>
            </div>

            <p>
              {critical.message}
            </p>
          </div>

        )}

    </div>
  );
}

function StatCard({
  title,
  value,
}: any) {
  return (
    <div className="rounded-3xl border bg-card p-6">
      <p className="text-muted-foreground">
        {title}
      </p>

      <h2 className="text-4xl font-black mt-3">
        {value}
      </h2>
    </div>
  );
}