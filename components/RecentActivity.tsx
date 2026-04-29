"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
    format,
    isToday,
    isYesterday,
    formatDistanceToNow,
} from "date-fns";
import { Button } from "./ui/button";
import { useSound } from "@/hooks/useSound";

// ===============================
// 🧠 HELPERS
// ===============================
const getActivityMessage = (hours: number) => {
    if (hours >= 20) return "🚀 Massive progress!";
    if (hours >= 10) return "🔥 Great session!";
    if (hours >= 5) return "💪 Solid work!";
    return "📈 Keep going!";
};

const getActivityColor = (hours: number) => {
    if (hours >= 20) return "from-green-400 to-emerald-600";
    if (hours >= 10) return "from-blue-400 to-indigo-600";
    if (hours >= 5) return "from-yellow-400 to-orange-500";
    return "from-gray-400 to-gray-600";
};

// 🏆 Achievement system
const getAchievement = (hours: number) => {
    if (hours >= 30) return { title: "Beast Mode", icon: "👑" };
    if (hours >= 20) return { title: "Deep Focus", icon: "🧠" };
    if (hours >= 10) return { title: "Consistency King", icon: "🔥" };
    if (hours >= 5) return { title: "On Fire", icon: "⚡" };
    return null;
};

// ===============================
// 🧠 GROUP BY DAY
// ===============================
const groupActivities = (activities: any[]) => {
    const groups: Record<string, any[]> = {};

    activities.forEach((item) => {
        const date = new Date(item.createdAt);

        let key = format(date, "yyyy-MM-dd");

        if (isToday(date)) key = "Today";
        else if (isYesterday(date)) key = "Yesterday";

        if (!groups[key]) groups[key] = [];
        groups[key].push(item);
    });

    return groups;
};

// ===============================
// 📦 COMPONENT
// ===============================
export function RecentActivity({ recentActivity = [], liveItem, paginated = false, page: externalPage,
    setPage: externalSetPage }: any) {
    const [internalPage, setInternalPage] = useState(1);
    // const [page, setPage] = useState(1);
    const pageSize = 10;


    const page = externalPage ?? internalPage;
    const setPage = externalSetPage ?? setInternalPage;

    const playSound = useSound("/sounds/level-up.mp3");

    useEffect(() => {
        if (liveItem) {
            playSound();
        }
    }, [liveItem]);

    const data = liveItem
        ? [liveItem, ...recentActivity]
        : recentActivity;

    useEffect(() => {
        if (page > Math.ceil(recentActivity.length / pageSize)) {
            setPage(1);
        }
    }, [recentActivity]);

    const sortedData = useMemo(() => {
        return [...recentActivity].sort(
            (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
        );
    }, [recentActivity]);

    const paginatedData = useMemo(() => {
        return paginated
            ? sortedData.slice((page - 1) * pageSize, page * pageSize)
            : sortedData;
    }, [sortedData, page, paginated]);

    const groupedActivities = useMemo(
        () => groupActivities(paginatedData),
        [paginatedData]
    );

    const hasNext = page * pageSize < recentActivity.length;

    // ===============================
    // 📊 DAILY TOTAL
    // ===============================
    const getDailyTotal = useCallback((items: any[]) => {
        return items.reduce((acc, item) => acc + item.hours, 0);
    }, []);

    // ===============================
    // 🎯 EMPTY STATE
    // ===============================
    if (!recentActivity.length) {
        return (
            <div className="text-center py-16 text-gray-400">
                <p className="text-lg">No activity yet 🚀</p>
                <p className="text-sm">Start logging your progress</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">

            {/* HEADER */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Activity Feed</h2>
                <p className="text-xs text-gray-400">
                    Your learning journey
                </p>
            </div>

            {/* GROUPED FEED */}
            {Object.entries(groupedActivities)
                .sort(([a], [b]) => {
                    if (a === "Today") return -1;
                    if (b === "Today") return 1;
                    if (a === "Yesterday") return -1;
                    if (b === "Yesterday") return 1;
                    return new Date(b).getTime() - new Date(a).getTime();
                })
                .map(([day, items]: any, groupIndex) => (

                    <div key={day} className="space-y-4">

                        {/* DAY HEADER */}
                        <div className="flex justify-between items-center">
                            <h3 className="text-sm font-semibold text-gray-300">
                                {day}
                            </h3>

                            <span className="text-xs text-gray-500">
                                {getDailyTotal(items)} hrs total
                            </span>

                        </div>

                        {/* CARDS */}
                        <div className="space-y-4">
                            {items.map((item: any, index: number) => {
                                const achievement = getAchievement(item.hours);
                                const isLatest =
                                    groupIndex === 0 && index === 0;
                                const isLive = liveItem?._id === item._id;

                                return (
                                    <motion.div
                                        key={item._id}
                                        initial={isLive ? { opacity: 0, y: -20, scale: 0.95 } : false}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        transition={{ duration: 0.4 }}
                                        className={`relative rounded-2xl border p-5 transition overflow-hidden
                                        ${isLive ? "border-green-400 shadow-lg shadow-green-500/20" : "border-white/10"}
                                        `}
                                    >

                                        {/* 🔥 LIVE PULSE */}
                                        {isLive && (
                                            <div className="absolute top-2 right-2 flex items-center gap-2">
                                                <span className="relative flex h-3 w-3">
                                                    <span className="animate-ping absolute h-full w-full rounded-full bg-green-400 opacity-75" />
                                                    <span className="relative h-3 w-3 rounded-full bg-green-500" />
                                                </span>
                                                <span className="text-[10px] text-green-400">LIVE</span>
                                            </div>
                                        )}

                                        {/* GLOW */}
                                        <div className={`absolute inset-0 opacity-10 bg-linear-to-r ${getActivityColor(item.hours)} blur-xl`} />

                                        <div className="relative flex justify-between items-center">

                                            {/* LEFT */}
                                            <div className="flex items-center gap-4">

                                                {/* AVATAR */}
                                                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-black bg-linear-to-r ${getActivityColor(item.hours)}`}>
                                                    {item.hours}
                                                </div>

                                                <div>
                                                    <p className="font-semibold text-sm">
                                                        {item.skillName || "Unknown Skill"}
                                                    </p>

                                                    <p className="text-xs text-gray-400">
                                                        {getActivityMessage(item.hours)}
                                                    </p>

                                                    {/* 🏆 ACHIEVEMENT */}
                                                    {achievement && (
                                                        <p className="text-[10px] mt-1 text-yellow-400">
                                                            {achievement.icon} {achievement.title}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* RIGHT */}
                                            <div className="text-right">
                                                <p className="text-sm font-semibold">
                                                    +{item.hours} hrs
                                                </p>

                                                <p className="text-xs text-gray-500">
                                                    {formatDistanceToNow(
                                                        new Date(item.createdAt),
                                                        { addSuffix: true }
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                )
                )}

            {paginated && (
                <>
                    <div className="flex justify-center gap-4 mt-6">
                        <Button
                            onClick={() => setPage((p: number) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-4 py-2 rounded bg-white/10 disabled:opacity-50"
                        >
                            Prev
                        </Button>

                        <span className="text-sm text-gray-400">
                            Page {page}
                        </span>

                        <Button
                            onClick={() => setPage((p: number) => (hasNext ? p + 1 : p))}
                            disabled={!hasNext}
                        >
                            Next
                        </Button>
                    </div>

                    {/* 👇 MOVE IT HERE */}
                    <p className="text-xs text-gray-400 text-center mt-2">
                        Showing {(page - 1) * pageSize + 1} -{" "}
                        {Math.min(page * pageSize, recentActivity.length)} of{" "}
                        {recentActivity.length}
                    </p>
                </>
            )}
        </div>
    );
}