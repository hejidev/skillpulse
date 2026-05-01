"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import { toast } from "sonner";

export function useNotifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [unread, setUnread] = useState(0);

  const fetchNotifications = async () => {
    try {
      const res = await API.get("/settings/notifications");
      setNotifications(res.data);

      const unreadCount = res.data.filter((n: any) => !n.read).length;
      setUnread(unreadCount);
    } catch (err) {
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const deleteNotification = async (id: string) => {
    await API.delete(`/settings/notifications/${id}`);
    setNotifications((prev) => prev.filter((n) => n._id !== id));
  };

  const clearAll = async () => {
    await API.delete("/settings/notifications/clear-all");
    setNotifications([]);
    setUnread(0);
  };

  const markAllRead = async () => {
    await API.put("/settings/notifications/read");
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true }))
    );
    setUnread(0);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return {
    notifications,
    loading,
    unread,
    refetch: fetchNotifications,
    deleteNotification,
    clearAll,
    markAllRead,
    setNotifications,
  };
}