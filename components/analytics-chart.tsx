"use client";

import { useQuery } from "@tanstack/react-query";
import API from "@/lib/api";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function AnalyticsChart({
  skillId,
}: {
  skillId: string;
}) {
  const { data = [] } = useQuery({
    queryKey: ["progress", skillId],
    queryFn: async () => {
      const res = await API.get(`/progress/${skillId}`);
      return res.data;
    },
  });

  const formatted = data
    .map((item: any) => ({
      date: new Date(item.createdAt).toLocaleDateString(),
      progress: item.hours, // ✅ FIXED
    }))
    .reverse();

  return (
    <div className="mt-4">
      <h4 className="text-sm mb-2">Growth Chart</h4>

      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={formatted}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="progress"
            stroke="#22c55e"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}