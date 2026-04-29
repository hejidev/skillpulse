"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import API from "@/lib/api";
import { Bell } from "lucide-react";
import { useState } from "react";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);

  const { data = [], refetch } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await API.get("/settings/notifications");
      return res.data;
    },
  });

  const markRead = useMutation({
    mutationFn: async () => {
      await API.put("/settings/notifications/read");
    },
    onSuccess: () => refetch(),
  });

  const unread = data.filter((n: any) => !n.read).length;

  return (
    <div className="relative">
      
      {/* 🔔 ICON */}
      <button onClick={() => setOpen(!open)} className="relative">
        <Bell />

        {unread > 0 && (
          <span className="absolute -top-1 right-1 bg-red-500 text-xs px-1 rounded-full">
            {unread}
          </span>
        )}
      </button>

      {/* 📦 DROPDOWN */}
      {open && (
        <div className="absolute left-0 mt-2 w-80 bg-black border rounded-lg p-4 space-y-3">
          
          <div className="flex justify-between">
            <h3>Notifications</h3>
            <button onClick={() => markRead.mutate()}>
              Mark all read
            </button>
          </div>

          {data.length === 0 ? (
            <p>No notifications</p>
          ) : (
            data.map((n: any, i: number) => (
              <div
                key={i}
                className={`p-2 rounded ${
                  n.read ? "opacity-50" : "bg-white/10"
                }`}
              >
                {n.message}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}