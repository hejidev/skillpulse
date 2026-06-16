"use client";

import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";

export default function FocusTrendChart({ sessions }: any) {
  if (!sessions?.length) return null;

  const data = sessions.map((s: any) => ({
    date: format(new Date(s.start), "MMM d"),
    score: Number((s.focusScore ?? 0).toFixed(2)),
  }));

  return (
    <div className="h-75">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="date" />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="score"
            strokeWidth={3}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}