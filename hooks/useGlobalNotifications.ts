"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { io } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";

const socket = io(process.env.NEXT_PUBLIC_API_URL!);

export function useGlobalNotifications() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (userId) {
      socket.emit("join", userId);
    }

    socket.on("notification", (data) => {
      // 🔥 instant toast
      toast.success(data.message);

      // 🔥 refresh ALL notification UIs
      queryClient.invalidateQueries({ queryKey: ["notifications"] });

      // optional global updates
      queryClient.invalidateQueries({ queryKey: ["skills"] });
    });

    return () => {
      socket.off("notification");
    };
  }, [queryClient]);
}