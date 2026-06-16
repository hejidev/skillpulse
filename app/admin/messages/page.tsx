"use client";

import { useState, useEffect } from "react";

import { socketService } from "@/lib/socket";

import {
  MessageSquare,
  ShieldAlert,
  Users,
  Clock3,
  CheckCheck,
  AlertTriangle,
  Plus,
  Mail,
  ChevronRight,
  Bot,
  Archive,
  CalendarClock,
  Send,
} from "lucide-react";

import InboxChannel from "@/components/adminmessagechannel/InboxChannel";
import BroadcastChannel from "@/components/adminmessagechannel/BroadcastChannel";
import SystemAlertsChannel from "@/components/adminmessagechannel/SystemAlertsChannel";
import ScheduledChannel from "@/components/adminmessagechannel/ScheduledChannel";
import ArchivedChannel from "@/components/adminmessagechannel/ArchivedChannel";

export default function MessagesHub() {
  const [activeTab, setActiveTab] = useState("Inbox");

  const [liveMessages, setLiveMessages] = useState<any[]>([]);

  const [title, setTitle] = useState("");

  const [content, setContent] = useState("");

  const [segment, setSegment] = useState("all");

  const [priority, setPriority] = useState("medium");

  const [sending, setSending] = useState(false);

  const [sendMode, setSendMode] = useState<"instant" | "scheduled">("instant");

  const [scheduledFor, setScheduledFor] = useState("");

  const [loading, setLoading] = useState(true);

  const metrics = {
    total: liveMessages.length,

    delivered: liveMessages.reduce(
      (acc, msg) =>
        acc + (msg.deliveryStats?.delivered || 0),
      0
    ),

    pending: liveMessages.filter(
      (msg) => msg.status === "pending"
    ).length,

    failed: liveMessages.reduce(
      (acc, msg) =>
        acc + (msg.deliveryStats?.failed || 0),
      0
    ),
  };

  const [animatedMetrics, setAnimatedMetrics] =
    useState(metrics);

  useEffect(() => {
    setAnimatedMetrics(metrics);
  }, [liveMessages]);

  useEffect(() => {

    let interval: NodeJS.Timeout;

    const fetchMessages = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/messages`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();

    const normalized = Array.isArray(data)
      ? data
      : data?.messages
      ? data.messages
      : data?.data
      ? data.data
      : [];

    setLiveMessages(normalized);
  } catch (err) {
    console.log(err);
  } finally {
    setLoading(false);
  }
};

    fetchMessages();

    interval = setInterval(() => {
      fetchMessages();
    }, 15000);

    const user = JSON.parse(
      localStorage.getItem("user") || "{}"
    );

    socketService.connect(user?._id);

    socketService.joinAdminMessages();

    const handleMessage = (msg: any) => {

      setLiveMessages((prev) => {

        const exists = prev.find(
          (m) => String(m._id) === String(msg._id)
        );

        if (exists) {

          return prev.map((m) =>
            String(m._id) === String(msg._id)
              ? msg
              : m
          );
        }

        return [msg, ...prev];
      });
    };
    socketService.onMessage(handleMessage);

    const handleArchive = (updatedMessage: any) => {

      setLiveMessages((prev) =>
        prev.map((msg) =>
          msg._id === updatedMessage._id
            ? updatedMessage
            : msg
        )
      );
    };

    socketService.on("messageArchived", handleArchive);

    return () => {

      clearInterval(interval);

      socketService.off(
        "message",
        handleMessage
      );

      socketService.off(
        "messageArchived",
        handleArchive
      );

      socketService.disconnect();
    };

  }, []);

  const sendBroadcast = async () => {
    try {
      setSending(true);

      const token =
        localStorage.getItem("token");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/messages/broadcast`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            title,
            content,
            segment,
            priority,

            scheduledFor:
              sendMode === "scheduled"
                ? scheduledFor
                : null,
          }),
        }
      );

      const data = await res.json();

      if (!data.success) {
        throw new Error(
          data.error || "Broadcast failed"
        );
      }

      setLiveMessages((prev) => [
        data.message,
        ...prev,
      ]);

      setTitle("");
      setContent("");

    } catch (err) {
      console.log(err);

    } finally {
      setSending(false);
    }
  };

  const analytics = {
    totalSent: liveMessages.reduce(
      (acc, msg) =>
        acc + (msg.deliveryStats?.sent || 0),
      0
    ),
    totalDelivered: liveMessages.reduce(
      (acc, msg) =>
        acc + (msg.deliveryStats?.delivered || 0),
      0
    ),
    totalOpened: liveMessages.reduce(
      (acc, msg) =>
        acc + (msg.deliveryStats?.opened || 0),
      0
    ),
    unreadMessages: liveMessages.reduce(
      (acc, msg) => {
        const sent =
          msg.deliveryStats?.sent || 0;

        const opened =
          msg.deliveryStats?.opened || 0;

        return acc + (sent - opened);
      },
      0
    ),
  };

  /* =========================
     PERCENTAGES
  ========================= */
  const broadcastReach =
    analytics.totalSent > 0
      ? Math.round(
        (analytics.totalDelivered /
          analytics.totalSent) *
        100
      )
      : 0;

  const engagementRate =
    analytics.totalDelivered > 0
      ? Math.round(
        (analytics.totalOpened /
          analytics.totalDelivered) *
        100
      )
      : 0;

  const sidebar = [
    {
      icon: <Mail size={18} />,
      name: "Inbox",
    },

    {
      icon: <Send size={18} />,
      name: "Broadcasts",
    },

    {
      icon: <ShieldAlert size={18} />,
      name: "System Alerts",
    },

    {
      icon: <CalendarClock size={18} />,
      name: "Scheduled",
    },

    {
      icon: <Archive size={18} />,
      name: "Archived",
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {

      case "Inbox":
        return (
          <InboxChannel
          />
        );

      case "Broadcasts":
        return (
          <BroadcastChannel
            messages={liveMessages}
            title={title}
            setTitle={setTitle}
            content={content}
            setContent={setContent}
            segment={segment}
            setSegment={setSegment}
            priority={priority}
            setPriority={setPriority}
            sending={sending}
            sendBroadcast={sendBroadcast}
            sendMode={sendMode}
            setSendMode={setSendMode}
            scheduledFor={scheduledFor}
            setScheduledFor={setScheduledFor}
          />
        );

      case "System Alerts":
        return (
          <SystemAlertsChannel
            messages={liveMessages}
          />
        );

      case "Scheduled":
        return (
          <ScheduledChannel
            messages={liveMessages}
          />
        );

      case "Archived":
        return (
          <ArchivedChannel
            messages={liveMessages}
          />
        );

      default:
        return null;
    }
  };

  if (loading) {
  return <MessagesHubSkeleton />;
}

  return (
    <div className="min-h-screen bg-card/40 border border-border rounded-3xl p-6 text-foreground">

      {/* HEADER */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5 mb-8">

        <div className="flex items-center gap-4">

          <div className="w-14 h-14 rounded-3xl bg-linear-to-br from-cyan-500 to-blue-600 flex items-center justify-center">

            <MessageSquare size={28} />

          </div>

          <div>

            <h1 className="text-4xl font-black tracking-tight">

              Enterprise Messages Hub

            </h1>

            <p className="text-muted-foreground mt-1">

              Realtime communication,
              broadcasts & intelligence messaging center

            </p>

          </div>

        </div>

        <button className="h-12 px-5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 transition-all text-white font-bold flex items-center gap-2">

          <Plus size={18} />

          New Broadcast

        </button>

      </div>

      {/* METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">

        <MetricCard
          title="Total Messages"
          value={animatedMetrics.total}
          icon={<Mail />}
        />

        <MetricCard
          title="Delivered"
          value={animatedMetrics.delivered}
          icon={<CheckCheck />}
        />

        <MetricCard
          title="Pending"
          value={animatedMetrics.pending}
          icon={<Clock3 />}
        />

        <MetricCard
          title="Failed"
          value={animatedMetrics.failed}
          icon={<AlertTriangle />}
          danger
        />

      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">

        {/* SIDEBAR */}
        <div className="bg-background border border-border rounded-3xl p-3">

          <div className="flex items-center justify-between mb-6">

            <h2 className="text-xl font-black">
              Channels
            </h2>

            <Bot className="text-cyan-400" />

          </div>

          <div className="space-y-3">

            {sidebar.map((item, index) => (

              <button
                key={index}
                onClick={() =>
                  setActiveTab(item.name)
                }
                className={`w-full flex items-center justify-between px-4 py-4 rounded-2xl transition-all border ${activeTab === item.name
                  ? "bg-cyan-500/10 border-cyan-500 text-cyan-400"
                  : "bg-background border-border hover:border-cyan-500/40"
                  }`}
              >

                <div className="flex items-center gap-3">

                  {item.icon}

                  <span className="font-semibold">
                    {item.name}
                  </span>

                </div>

                <ChevronRight size={16} />

              </button>
            ))}

          </div>

        </div>

        {/* CHANNEL CONTENT */}
        <div className="xl:col-span-2">

          {renderTabContent()}

        </div>

        {/* ANALYTICS */}
        <div className="space-y-6">

          <div className="bg-background border border-border rounded-3xl p-6">

            <div className="flex items-center justify-between mb-6">

              <div>

                <h2 className="text-xl font-black">
                  Delivery Analytics
                </h2>

                <p className="text-muted-foreground text-sm mt-1">
                  Realtime messaging performance
                </p>

              </div>

              <Users className="text-cyan-400" />

            </div>

            <div className="space-y-5">

              <AnalyticsRow
                label="Broadcast Reach"
                value={`${broadcastReach}%`}
              />

              <AnalyticsRow
                label="User Engagement"
                value={`${engagementRate}%`}
              />

              <AnalyticsRow
                label="Unread Messages"
                value={analytics.unreadMessages}
              />

              <AnalyticsRow
                label="Opened Messages"
                value={analytics.totalOpened}
              />

              <AnalyticsRow
                label="Total Delivered"
                value={analytics.totalDelivered}
              />

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

function MetricCard({
  title,
  value,
  icon,
  danger,
}: any) {
  return (
    <div className="bg-background border border-border rounded-3xl p-6">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-muted-foreground text-sm">
            {title}
          </p>

          <h2 className="text-4xl font-black mt-3">
            {value}
          </h2>

        </div>

        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center ${danger
            ? "bg-red-500/10 text-red-400"
            : "bg-cyan-500/10 text-cyan-400"
            }`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
}

function AnalyticsRow({
  label,
  value,
}: any) {
  return (
    <div className="flex items-center justify-between border-b border-border pb-3">

      <span className="text-muted-foreground text-sm">
        {label}
      </span>

      <span className="font-bold text-cyan-400">
        {value}
      </span>

    </div>
  );
}



function MessagesHubSkeleton() {
  return (
    <div className="min-h-screen bg-card/40 border border-border rounded-3xl p-6 animate-pulse">

      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5 mb-8">

        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-3xl bg-muted" />

          <div className="space-y-3">
            <div className="h-8 w-72 bg-muted rounded-xl" />
            <div className="h-4 w-96 bg-muted rounded-xl" />
          </div>
        </div>

        <div className="h-12 w-44 rounded-2xl bg-muted" />
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="bg-background border border-border rounded-3xl p-6"
          >
            <div className="flex justify-between">
              <div className="space-y-3">
                <div className="h-4 w-24 bg-muted rounded" />
                <div className="h-10 w-20 bg-muted rounded" />
              </div>

              <div className="w-14 h-14 rounded-2xl bg-muted" />
            </div>
          </div>
        ))}
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">

        {/* Sidebar */}
        <div className="bg-background border border-border rounded-3xl p-4">
          <div className="h-6 w-32 bg-muted rounded mb-6" />

          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="h-16 rounded-2xl bg-muted skeleton-shimmer"
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="xl:col-span-2 bg-background border border-border rounded-3xl p-6">

          <div className="space-y-5">
            <div className="h-8 w-56 bg-muted rounded skeleton-shimmer" />

            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-24 rounded-2xl bg-muted skeleton-shimmer"
              />
            ))}
          </div>

        </div>

        {/* Analytics */}
        <div className="bg-background border border-border rounded-3xl p-6">

          <div className="h-7 w-48 bg-muted rounded mb-8" />

          <div className="space-y-6">

            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="flex justify-between"
              >
                <div className="h-4 w-32 bg-muted rounded" />
                <div className="h-4 w-16 bg-muted rounded" />
              </div>
            ))}

          </div>

        </div>

      </div>
    </div>
  );
}