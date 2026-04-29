"use client";

import { useMemo } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

import { normalizeActivity } from "@/lib/utils/activityPro";

export default function XPChart({ data = [] }: any) {

    const chartData = useMemo(() => {
        const normalized = data.map(normalizeActivity);

        // 🧠 Sort by date
        const sorted = [...normalized].sort(
            (a: any, b: any) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
        );

        // 📈 Build cumulative XP
        let cumulativeXP = 0;

        return sorted.map((item: any) => {
            cumulativeXP += item.xp;

            return {
                date: new Date(item.createdAt).toLocaleDateString(),
                xp: item.xp,
            };
        });
    }, [data]);

    return (
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <h3 className="text-sm text-gray-400 mb-3">
                XP Growth
            </h3>

            <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line
                        type="monotone"
                        dataKey="xp"
                        stroke="#8b5cf6"
                        strokeWidth={3}
                        dot={false}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "#111",
                            border: "1px solid #333",
                        }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}