"use client";

import { useQuery } from "@tanstack/react-query";
import API from "@/lib/api";

export const useSessions = (skillId: string | null) => {
  return useQuery({
    queryKey: ["sessions", skillId],
    enabled: !!skillId,
    queryFn: async () => {
      const res = await API.get(`/progress/sessions/${skillId}`);
      return res.data;
    },
  });
};