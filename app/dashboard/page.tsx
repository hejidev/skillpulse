"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useMemo } from "react";

import { fetchSkills } from "@/lib/api/skills";
import { getAchievements } from "@/lib/utils/achievements";
import { getLevel } from "@/lib/utils/xp";
import { normalizeActivity } from "@/lib/utils/activityPro";

import { useProgressData } from "@/hooks/useProgressData";

import Leaderboard from "./leaderboard/page";
import SkillCard from "@/components/skills/SkillCard";
import { LevelCard } from "@/components/LevelCard";
import { AchievementPopup } from "@/components/AchievementPopup";
import { RecentActivity } from "@/components/RecentActivity";

import { toast } from "sonner";
import { subDays, format } from "date-fns";
import { socket, socketService } from "@/lib/socket";

import { createSkill } from "@/lib/api/skills";
import AddSkill from "@/components/skills/add-skill";

export default function Dashboard() {
  const [achievement, setAchievement] = useState<any>(null);
  const [skillLevels, setSkillLevels] = useState<Record<string, number>>({});
  const [levelUpSkill, setLevelUpSkill] = useState<any>(null);

  const { progress, streak, freezeCount } = useProgressData();
  const queryClient = useQueryClient();

  // 🔥 SKILL CREATION MUTATION
  const createSkillMutation = useMutation({
    mutationFn: createSkill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
    },
  });

  const handleCreateSkill = async ({
    name,
    level,
  }: {
    name: string;
    level: string;
  }) => {
    await createSkillMutation.mutateAsync({ name, level });
  };

  // 🔌 SOCKET
  useEffect(() => {
    socketService.connect();

    const userId =
      typeof window !== "undefined"
        ? localStorage.getItem("userId")
        : null;

    if (userId) {
      socket.emit("register", userId);
    }

    const handleNewProgress = (data: any) => {
      queryClient.setQueryData(["all-progress"], (old: any) => ({
        progress: [data.progress, ...(old?.progress || [])],
        streak: data.streak ?? old?.streak ?? 0,
        freezeCount: data.freezeCount ?? old?.freezeCount ?? 0,
      }));
    };

    const handleStreakAlert = (data: { message: string }) => {
      toast(data.message);
    };

    socket.on("new-progress", handleNewProgress);
    socket.on("streak-alert", handleStreakAlert);

    return () => {
      socket.off("new-progress", handleNewProgress);
      socket.off("streak-alert", handleStreakAlert);
    };
  }, [queryClient]);

    // 📦 SKILLS
    const { data: skills = [] } = useQuery({
        queryKey: ["skills"],
        queryFn: fetchSkills,
    });

    // 🔥 NORMALIZED DATA
    const normalized = useMemo(
        () => progress.map(normalizeActivity),
        [progress]
    );

    // 📊 RECENT ACTIVITY
    const recentActivity = [...normalized]
        .sort(
            (a: any, b: any) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
        )
        .slice(0, 5);

    // 🏆 ACHIEVEMENTS
    useEffect(() => {
        const unlocked = getAchievements(progress);
        if (unlocked.length > 0) {
            setAchievement(unlocked[unlocked.length - 1]);
        }
    }, [progress]);

    // ⚡ XP
    const xp = normalized.reduce((acc: number, item: any) => acc + item.xp, 0);

    // 📅 LAST 7 DAYS
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);

        return normalized
            .filter(
                (p: any) =>
                    new Date(p.createdAt).toDateString() ===
                    date.toDateString()
            )
            .reduce((acc: number, p: any) => acc + p.hours, 0);
    });

    // 🧠 ENRICH SKILLS
    const enrichedSkills = useMemo(() => {
        if (!skills.length) return [];

        const skillMap = new Map<string, any>();

        skills.forEach((skill: any) => {
            skillMap.set(skill._id.toString(), {
                ...skill,
                logs: [],
            });
        });

        progress.forEach((log: any) => {
            const skillId = log.skillId?.toString();
            const skill = skillMap.get(skillId);

            if (skill) {
                skill.logs.push(log);
            }
        });

        return Array.from(skillMap.values());
    }, [skills, progress]); // ✅ MUST use progress, not allProgress

    // 🎯 LEVEL SYSTEM
    useEffect(() => {
        const updated: Record<string, number> = {};

        enrichedSkills.forEach((skill: any) => {
            const skillXP = (skill.totalHours || 0) * 10;
            const level = getLevel(skillXP);

            updated[skill._id] = level;
        });

        setSkillLevels((prev) => {
            const isSame =
                Object.keys(updated).length === Object.keys(prev).length &&
                Object.keys(updated).every((key) => updated[key] === prev[key]);

            if (isSame) return prev; // 🛑 stop infinite loop

            return updated;
        });
    }, [enrichedSkills]);

    // 📊 CONSISTENCY
    const getConsistency = (logs: any[] = []) => {
        if (!logs.length) return 0;

        const today = new Date();

        const last7 = Array.from({ length: 7 }).map((_, i) =>
            format(subDays(today, i), "yyyy-MM-dd")
        );

        const set = new Set(
            logs.map((l) =>
                format(new Date(l.createdAt), "yyyy-MM-dd")
            )
        );

        return (last7.filter((d) => set.has(d)).length / 7) * 100;
    };

    const mostConsistent =
        enrichedSkills.length > 0
            ? [...enrichedSkills].sort(
                (a, b) =>
                    getConsistency(b.logs) -
                    getConsistency(a.logs)
            )[0]
            : null;

    return (
        <div className="space-y-10 bg-background
text-foreground
border-border">

            {/* HEADER */}
            <div className="flex justify-between pt-10">
                <div>
                    <h1 className="text-5xl font-bold">Dashboard</h1>
                    <p className="text-gray-400 mt-2">
                        Your learning system 🚀
                    </p>
                </div>

                 <AddSkill onCreate={handleCreateSkill} />
            </div>

            {/* STATS */}
            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

                <Stat label="Skills" value={skills.length} />

                <Stat
                    label="Streak"
                    value={
                        <div className="flex items-center gap-2">
                            🔥 {streak}
                            {freezeCount > 0 && (
                                <span className="text-blue-400 text-sm">
                                    ❄️ {freezeCount}
                                </span>
                            )}
                        </div>
                    }
                />

                <Stat
                    label="Most Consistent"
                    value={mostConsistent?.name || "—"}
                    sub={`${getConsistency(mostConsistent?.logs).toFixed(0)}%`}
                />

                <Stat label="XP" value={xp} />

            </div>

            {/* SKILLS */}
            <div className="grid md:grid-cols-3 gap-6">
                {enrichedSkills.slice(0, 3).map((skill: any) => (
                    <SkillCard key={skill._id} skill={skill} />
                ))}
            </div>

            <RecentActivity recentActivity={recentActivity} />

            <LevelCard xp={xp} />

            <AchievementPopup achievement={achievement} />

            {/* HEATMAP */}
            <div className="flex gap-2">
                {last7Days.map((h, i) => (
                    <div
                        key={i}
                        className={`w-6 h-6 rounded ${h > 10 ? "bg-green-500" : "bg-gray-700"
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
        <div className="p-6 rounded-2xl border border-border bg-background">
            <p className="text-xs text-muted-foreground">{label}</p>
            <h2 className="text-xl font-bold mt-2">{value}</h2>
            {sub && <p className="text-xs">{sub}</p>}
        </div>
    );
}