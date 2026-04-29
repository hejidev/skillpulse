"use client";

import { useQuery } from "@tanstack/react-query";
import API from "@/lib/api";

export function useReminder() {
  return useQuery({
    queryKey: ["reminder"],
    queryFn: async () => {
      const res = await API.get("/settings/reminder");
      return res.data;
    },
    refetchInterval: 10000, // auto check every 10s
  });
}