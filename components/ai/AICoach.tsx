"use client";

import { useQuery } from "@tanstack/react-query";
import API from "@/lib/api";
import { differenceInDays } from "date-fns";
import { calculateStreak } from "@/lib/utils/streak";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function AICoach({ skill }: any) {

    const { data = [] } = useQuery({
        queryKey: ["progress", skill._id],
        queryFn: async () => {
            const res = await API.get(`/progress/${skill._id}`);
            return res.data;
        },
    });

    // 👇 ADD IT HERE (after data is available)
    const dayMap: Record<string, number> = {};

    data.forEach((item: any) => {
        const day = new Date(item.createdAt).toLocaleDateString("en-US", {
            weekday: "short",
        });

        dayMap[day] = (dayMap[day] || 0) + item.hours;
    });

    const sortedDays = Object.entries(dayMap).sort((a, b) => b[1] - a[1]);

    const bestDay = sortedDays[0]?.[0] || "N/A";
    const worstDay = sortedDays[sortedDays.length - 1]?.[0] || "N/A";

    const last7 = data.slice(-7);
    const activeDays = last7.filter((d: any) => d.hours > 0).length;
    const consistencyScore = (activeDays / 7) * 100;

    let streak = 0;
    let weeklyHours = 0;
    let lastActiveDaysAgo = 0;
    let goalPercent = 0;

    if (data.length) {
        const lastEntry = data[data.length - 1];

        lastActiveDaysAgo = differenceInDays(
            new Date(),
            new Date(lastEntry.createdAt)
        );

        streak = calculateStreak(data);

        weeklyHours = data
            .slice(-7)
            .reduce((acc: number, d: any) => acc + d.hours, 0);

        goalPercent = (skill.totalHours / skill.targetHours) * 100;
    }

    const { data: aiMessage, isLoading } = useQuery({
        queryKey: ["ai-coach", skill._id, bestDay, consistencyScore],

        queryFn: async () => {
            const res = await API.post("/ai/coach", {
                skillId: skill._id, // ✅ IMPORTANT
                skillName: skill.name,
                streak,
                weeklyHours,
                lastActiveDaysAgo,
                goalPercent,

                // 🔥 NEW INTELLIGENCE DATA
                bestDay,
                worstDay,
                consistencyScore,
            });

            return res.data.message;
        },

        enabled: data.length > 0,
    });

    if (!data.length) return null;

    return (
        <Card className="p-5 space-y-3 border bg-linear-to-br from-emerald-500/10 to-transparent backdrop-blur-xl">

            <p className="text-xs text-muted-foreground">
                AI Insight
            </p>

            {isLoading ? (
                <Skeleton className="h-5 w-full" />
            ) : (
                <p className="text-sm font-medium leading-relaxed">
                    {aiMessage}
                </p>
            )}

        </Card>
    );
}