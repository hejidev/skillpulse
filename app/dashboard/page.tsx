"use client";

import { io } from "socket.io-client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";

import API from "@/lib/api";
import { fetchSkills } from "@/lib/api/skills";

import { getAchievements } from "@/lib/utils/achievements";
import { getLevel } from "@/lib/utils/xp";
import { normalizeActivity } from "@/lib/utils/activityPro";
import { calculateStreak } from "@/lib/utils/streak";

import { useReminder } from "@/hooks/useReminder";

import Leaderboard from "./leaderboard/page";
import AddSkill from "@/components/skills/add-skill";
import SkillCard from "@/components/skills/SkillCard";
import { LevelCard } from "@/components/LevelCard";
import { AchievementPopup } from "@/components/AchievementPopup";
import { RecentActivity } from "@/components/RecentActivity";
import SkillLevelUpPopup from "@/components/SkillLevelUpPopup";
import SkillLevelUpCinematic from "@/components/SkillLevelUpCinematic";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
    startOfWeek,
    endOfWeek,
    isWithinInterval,
    subDays,
    format,
} from "date-fns";
import NotificationBell from "@/components/notificationBell";


type Activity = {
    _id: string;
    hours: number;
    xp: number;
    skillName: string;
    createdAt: string;
};

export default function Dashboard() {
    const [achievement, setAchievement] = useState<any>(null);
    const [levelUp, setLevelUp] = useState<any>(null);
    const [prevLevel, setPrevLevel] = useState(0);
    const [skillLevels, setSkillLevels] = useState<Record<string, number>>({});
    const [levelUpSkill, setLevelUpSkill] = useState<any>(null);
    const [liveItem, setLiveItem] = useState<any>(null);

    const queryClient = useQueryClient();

    // ✅ SINGLE SOCKET (FIXED + typed data)
    useEffect(() => {
        const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "");

        const userId =
            typeof window !== "undefined"
                ? localStorage.getItem("userId")
                : null;

        if (userId) socket.emit("register", userId);

        socket.on("new-progress", (newItem: any) => {
            queryClient.setQueryData(["all-progress"], (old: any = []) => [
                newItem,
                ...old,
            ]);
        });

        socket.on("streak-alert", (data: { message: string }) => {
            toast(data.message);

            const audio = new Audio("/sounds/level-up.mp3");
            audio.volume = 0.5;

            audio.play().catch((err) => {
                console.warn("Audio play blocked:", err);
            });

            if (
                typeof window !== "undefined" &&
                Notification.permission === "granted"
            ) {
                new Notification("SkillPulse 🔥", {
                    body: data.message,
                    icon: "/logo.png",
                });
            }
        });

        return () => {
            socket.disconnect();
        };
    }, [queryClient]);

    // ===============================
    // 📦 FETCH SKILLS
    // ===============================
    const { data: skills = [], isError, error } = useQuery({
        queryKey: ["skills"],
        queryFn: fetchSkills,
    });

    // ===============================
    // 📦 FETCH ALL PROGRESS (SOURCE OF TRUTH)
    // ===============================
    const { data: allProgress = [] } = useQuery({
        queryKey: ["all-progress"],
        queryFn: async () => {
            const res = await API.get("/progress");
            return res.data;
        },
    });

    // ✅ SAFE SORT (avoid undefined bugs)

    const recentActivity = [...allProgress]
        .map(normalizeActivity)
        .sort(
            (a: any, b: any) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
        )
        .slice(0, 5);

    useEffect(() => {
        const unlocked = getAchievements(allProgress);
        if (unlocked.length > 0) {
            setAchievement(unlocked[unlocked.length - 1]);
        }
    }, [allProgress]);

    const normalized: Activity[] = allProgress.map(normalizeActivity);

    const xp = normalized.reduce((acc, { xp }) => acc + xp, 0);

    const last7Days = Array.from({ length: 7 }).map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);

        const hours = allProgress
            .filter((p: any) =>
                new Date(p.createdAt).toDateString() === date.toDateString()
            )
            .reduce((acc: number, p: any) => acc + p.hours, 0);

        return hours;
    });

    // ===============================
    // 🧠 MAP PROGRESS → SKILLS
    // ===============================
    const enrichedSkills = useMemo(() => {
        const skillMap = new Map<string, any>();

        skills.forEach((skill: any) => {
            skillMap.set(skill._id.toString(), {
                ...skill,
                logs: [],
            });
        });

        allProgress.forEach((log: any) => {
            const skillId = log.skillId?.toString();
            const skill = skillMap.get(skillId);

            if (skill) {
                skill.logs.push(log);
            }
        });

        return Array.from(skillMap.values());
    }, [skills, allProgress]);


    // 1️⃣ ONLY handle skill levels update (NO side effects here)
    useEffect(() => {
        const updated: Record<string, number> = {};

        enrichedSkills.forEach((skill: any) => {
            const skillXP = (skill.totalHours || 0) * 10;
            const level = getLevel(skillXP);

            updated[skill._id] = level;
        });

        setSkillLevels((prev) => {
            // prevent useless re-renders
            const isSame =
                Object.keys(updated).length === Object.keys(prev).length &&
                Object.keys(updated).every((key) => updated[key] === prev[key]);

            if (isSame) return prev;

            return updated;
        });
    }, [enrichedSkills]);

    useEffect(() => {
        if (!enrichedSkills.length) return;

        enrichedSkills.forEach((skill: any) => {
            const skillXP = (skill.totalHours || 0) * 10;
            const level = getLevel(skillXP);

            if (skillLevels[skill._id] && skillLevels[skill._id] !== level) {
                setLevelUpSkill({
                    skill,
                    level,
                });
            }
        });
    }, [skillLevels, enrichedSkills]);

    useEffect(() => {
        if ("Notification" in window) {
            Notification.requestPermission();
        }
    }, []);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const audio = new Audio("/sounds/level-up.mp3");
        audio.volume = 0.6;

        audio.play().catch((err) => {
            console.log("Audio blocked:", err);
        });
    }, []);

    const { data: reminder } = useReminder();
    useEffect(() => {
        if (reminder?.unread) {
            toast("🔥 " + reminder.lastMessage);
        }
    }, [reminder]);

    if (isError) {
        console.log(error);
        return <p className="m-auto text-red-500">Failed to load skills</p>;
    }

    // ===============================
    // 📊 BASIC STATS
    // ===============================
    const totalSkills = skills.length;

    const totalProgress = skills.reduce(
        (acc: number, s: any) => acc + s.progress,
        0
    );

    const avgProgress =
        totalSkills > 0 ? totalProgress / totalSkills : 0;

    // ===============================
    // 🔥 GLOBAL STREAK (REAL)
    // ===============================
    const globalStreak = calculateStreak(allProgress);

    // ===============================
    // 🎯 GLOBAL GOAL
    // ===============================
    const totalHoursAll = skills.reduce(
        (acc: number, s: any) => acc + (s.totalHours || 0),
        0
    );

    const totalTargetAll = skills.reduce(
        (acc: number, s: any) => acc + (s.targetHours || 0),
        0
    );

    const globalGoalPercent =
        totalTargetAll > 0
            ? (totalHoursAll / totalTargetAll) * 100
            : 0;

    // ===============================
    // 🧠 CONSISTENCY (FIXED)
    // ===============================
    const getConsistency = (logs: any[] = []) => {
        if (!logs.length) return 0;

        const today = new Date();

        const last7Days = Array.from({ length: 7 }).map((_, i) =>
            format(subDays(today, i), "yyyy-MM-dd")
        );

        const activeDaysSet = new Set(
            logs.map((log: any) =>
                format(new Date(log.createdAt), "yyyy-MM-dd")
            )
        );

        const activeDays = last7Days.filter((day) =>
            activeDaysSet.has(day)
        ).length;

        return (activeDays / 7) * 100;
    };

    const mostConsistentSkill =
        enrichedSkills.length > 0
            ? [...enrichedSkills].sort(
                (a, b) => getConsistency(b.logs) - getConsistency(a.logs)
            )[0]
            : null;

    // ===============================
    // 📈 IMPROVEMENT (FIXED)
    // ===============================
    const getWeeklyImprovement = (logs: any[] = []) => {
        const now = new Date();

        const thisWeek = logs
            .filter((log: any) =>
                isWithinInterval(new Date(log.createdAt), {
                    start: startOfWeek(now),
                    end: endOfWeek(now),
                })
            )
            .reduce((acc: number, log: any) => acc + log.hours, 0);

        const lastWeek = logs
            .filter((log: any) =>
                isWithinInterval(new Date(log.createdAt), {
                    start: startOfWeek(subDays(now, 7)),
                    end: endOfWeek(subDays(now, 7)),
                })
            )
            .reduce((acc: number, log: any) => acc + log.hours, 0);

        return thisWeek - lastWeek;
    };

    const mostImprovedSkill =
        enrichedSkills.length > 0
            ? [...enrichedSkills].sort(
                (a, b) =>
                    getWeeklyImprovement(b.logs) - getWeeklyImprovement(a.logs)
            )[0]
            : null;


    // ===============================
    // ⚡ SORT BY ACTIVITY (FIXED)
    // ===============================
    const getLastActivity = (logs: any[]) => {
        if (!logs.length) return 0;

        return Math.max(
            ...logs.map((log: any) =>
                new Date(log.createdAt).getTime()
            )
        );
    };

    const sortedSkills = enrichedSkills.sort(
        (a: any, b: any) =>
            getLastActivity(b.logs) - getLastActivity(a.logs)
    );

    // ===============================
    // 🏆 TOP SKILL
    // ===============================
    const topSkill = [...skills].sort((a: any, b: any) => {
        if (b.progress !== a.progress) {
            return b.progress - a.progress;
        }
        return (b.totalHours || 0) - (a.totalHours || 0);
    })[0];

    // const rawXP = calculateXP(allProgress);
    // const xp = Number(rawXP) || 0;



    return (
        <div className="space-y-10">

            {/* HERO */}
            <div className="flex justify-between pt-10">
                <NotificationBell />
                <div>
                    <h1 className="text-5xl font-bold">Dashboard</h1>
                    <p className="text-gray-400 mt-2">
                        Your learning system 🚀
                    </p>
                </div>

                <AddSkill />
            </div>

            {/* STATS */}
            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

                <Stat label="Skills" value={totalSkills} />
                {/* <Stat label="Streak" value={`🔥 ${globalStreak} days`} /> */}
                <Stat
                    label="Streak"
                    value={
                        <span className="flex items-center gap-1">
                            🔥 {globalStreak} days
                            {globalStreak > 3 && (
                                <span className="animate-pulse text-orange-500">🔥</span>
                            )}
                        </span>
                    }
                />

                <Stat
                    label="Most Consistent"
                    value={mostConsistentSkill?.name || "—"}
                    sub={`${getConsistency(mostConsistentSkill?.logs || []).toFixed(0)}%`}
                />

                <Stat
                    label="Most Improved"
                    value={mostImprovedSkill?.name || "—"}
                    sub={`${getWeeklyImprovement(mostImprovedSkill?.logs || [])} hrs`}
                />

            </div>

            {/* SKILLS */}
            <div className="space-y-4">
                <div className="flex justify-between">
                    <h2>Your Skills ({skills.length})</h2>

                    {skills.length > 3 && (
                        <Link href="/skills">
                            <Button size="sm">View all →</Button>
                        </Link>
                    )}
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {sortedSkills.slice(0, 3).map((skill: any) => (
                        <SkillCard key={skill._id} skill={skill} />
                    ))}
                </div>
            </div>

            <SkillLevelUpCinematic
                open={!!levelUpSkill}
                skill={levelUpSkill?.skill}
                level={levelUpSkill?.level}
                xpGained={10}
                onClose={() => setLevelUpSkill(null)}
            />

            {/* RECENT ACTIVITY */}
            <div className="space-y-3">
                <RecentActivity recentActivity={recentActivity} />
            </div>

            <LevelCard xp={xp} />

            <SkillLevelUpPopup
                skill={levelUpSkill?.skill}
                level={levelUpSkill?.level}
                onClose={() => setLevelUpSkill(null)}
            />

            <AchievementPopup achievement={achievement} />

            <div className="flex gap-2">
                {last7Days.map((count, i) => (
                    <div
                        key={i}
                        className={`w-6 h-6 rounded ${count > 20
                            ? "bg-green-600"
                            : count > 10
                                ? "bg-green-400"
                                : count > 0
                                    ? "bg-green-200"
                                    : "bg-gray-800"
                            }`}
                    />
                ))}
            </div>

            <Leaderboard />
        </div>
    );
}


function Stat({ label, value, sub }: any) {
    return (
        <div className="p-6 rounded-2xl border border-white/10 bg-white/5">
            <p className="text-xs text-muted-foreground">{label}</p>
            <h2 className="text-xl font-bold mt-2">{value}</h2>
            {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
        </div>
    );
}

