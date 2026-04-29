"use client";

import { useQuery } from "@tanstack/react-query";
import API from "@/lib/api";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
} from "date-fns";

import { useState } from "react";
import { Card } from "@/components/ui/card";

export default function PremiumCalendarHeatmap({
  skillId,
}: {
  skillId: string;
}) {
  const { data = [] } = useQuery({
    queryKey: ["progress", skillId],
    queryFn: async () => {
      const res = await API.get(`/progress/${skillId}`);
      return Array.isArray(res.data) ? res.data : [];
    },
  });

  const [hovered, setHovered] = useState<any>(null);

  // 🧠 group progress by date
  const map: Record<string, number> = {};

  data.forEach((item: any) => {
    if (!item?.createdAt) return;

    const date = format(new Date(item.createdAt), "yyyy-MM-dd");
    map[date] = (map[date] || 0) + (item.hours || 0);
  });

  // 📅 current month calendar (REAL calendar)
  const today = new Date();

  const start = startOfWeek(startOfMonth(today));
  const end = endOfWeek(endOfMonth(today));

  const days = eachDayOfInterval({ start, end });

  // 🎨 color scale
  const getColor = (count: number) => {
    if (count === 0) return "bg-muted";
    if (count < 2) return "bg-emerald-900";
    if (count < 4) return "bg-emerald-700";
    if (count < 6) return "bg-emerald-500";
    return "bg-emerald-400";
  };

  return (
    <Card className="p-6 space-y-5">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">
          {format(today, "MMMM yyyy")}
        </h3>

        <span className="text-xs text-muted-foreground">
          Activity Calendar
        </span>
      </div>

      {/* DAY LABELS */}
      <div className="grid grid-cols-7 text-xs text-muted-foreground text-center">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>

      {/* CALENDAR GRID */}
      <div className="grid grid-cols-7 gap-2">

        {days.map((day, i) => {
          const dateStr = format(day, "yyyy-MM-dd");
          const count = map[dateStr] || 0;

          const isCurrentMonth =
            format(day, "MM") === format(today, "MM");

          return (
            <div
              key={i}
              onMouseEnter={() =>
                setHovered({ day, count })
              }
              onMouseLeave={() => setHovered(null)}
              className={`
                relative h-14 rounded-lg border transition-all duration-200
                hover:scale-[1.05] cursor-pointer
                ${getColor(count)}
                ${!isCurrentMonth ? "opacity-30" : ""}
              `}
            >
              {/* DATE NUMBER */}
              <span className="absolute top-1 left-2 text-[11px] text-black/80">
                {format(day, "d")}
              </span>

              {/* HOURS (optional small indicator) */}
              {count > 0 && (
                <span className="absolute bottom-1 right-2 text-[15px] text-white font-bold">
                  {count}h
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* HOVER INFO */}
      {hovered && (
        <div className="text-xs text-muted-foreground">
          <span className="font-medium text-white">
            {hovered.count} hrs
          </span>{" "}
          on {format(hovered.day, "EEEE, MMM dd")}
        </div>
      )}
    </Card>
  );
}