"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await API.get("/settings/notifications");
        setNotifications(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="max-w-3xl mx-auto mt-24 p-6">
      <h1 className="text-2xl font-bold mb-6">Notifications 🔔</h1>

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : notifications.length === 0 ? (
        <p className="text-gray-500">No notifications yet.</p>
      ) : (
        <div className="space-y-3">
          {notifications.map((n, i) => (
            <div
              key={i}
              className={`p-4 rounded-lg border ${
                n.read ? "bg-black/40" : "bg-green-500/10 border-green-500/30"
              }`}
            >
              <p>{n.message}</p>
              <span className="text-xs text-gray-400">
                {new Date(n.createdAt).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}