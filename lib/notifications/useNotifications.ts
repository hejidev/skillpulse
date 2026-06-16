"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "@/lib/api";

export function useNotifications() {
  const queryClient = useQueryClient();

  // 📥 FETCH (single source of truth)
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await API.get("/settings/notifications");
      return res.data;
    },
  });

  // 📊 UNREAD COUNT
  const unread = notifications.filter((n: any) => !n.read).length;

  // 🗑 DELETE
  const deleteNotification = useMutation({
    mutationFn: async (id: string) => {
      const res = await API.delete(`/settings/notifications/${id}`);
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["notifications"] });
      await queryClient.refetchQueries({ queryKey: ["notifications"] });
    }
  });

  // 🧹 CLEAR ALL
  const clearAll = useMutation({
    mutationFn: async () => {
      const res = await API.delete("/settings/notifications/clear-all");
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["notifications"] });
      await queryClient.refetchQueries({ queryKey: ["notifications"] });
    }
  });

  // ✅ MARK ALL READ
  const markAllRead = useMutation({
    mutationFn: async () => {
      const res = await API.put("/settings/notifications/read");
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["notifications"] });
      await queryClient.refetchQueries({ queryKey: ["notifications"] });
    }
  });

  return {
    notifications,
    unread,
    isLoading,

    deleteNotification: deleteNotification.mutate,
    clearAll: clearAll.mutate,
    markAllRead: markAllRead.mutate,
  };
}