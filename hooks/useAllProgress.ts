// hooks/useAllProgress.ts

import { useQuery } from "@tanstack/react-query";
import API from "@/lib/api";

export const useAllProgress = () => {
  return useQuery({
    queryKey: ["all-progress"],
    queryFn: async () => {
      const res = await API.get("/progress");

      return {
        progress: res.data.progress || [],
        streak: res.data.streak || 0,
        freezeCount: res.data.freezeCount || 0,
      };
    },
  });
};