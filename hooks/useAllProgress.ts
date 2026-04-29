"use client";

import { useQuery } from "@tanstack/react-query";
import API from "@/lib/api";

export function useAllProgress() {
  return useQuery({
    queryKey: ["all-progress"],
    queryFn: async () => {
      const res = await API.get("/progress");
      return res.data;
    },
  });
}