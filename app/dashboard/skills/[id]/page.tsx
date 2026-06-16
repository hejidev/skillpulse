"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import API from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog";

import AnalyticsChart from "@/components/analytics-chart";
import AddProgress from "@/components/progress/AddProgress";
import AICoach from "@/components/ai/AICoach";
import { Card } from "@/components/ui/card";
import PremiumCalendarHeatmap from "@/components/analytics/Heatmap";
import FocusMode from "@/components/focus/FocusMode";

/* ---------------- TABS ---------------- */
const tabs = ["Overview", "Analytics", "Activity", "Insights"] as const;
type Tab = typeof tabs[number];

/* ---------------- PAGE ---------------- */
export default function SkillDetailPage() {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState<Tab>("Overview");
    const [focusOpen, setFocusOpen] = useState(false);

    const { data, isLoading } = useQuery({
        queryKey: ["skill", id],
        queryFn: async () => {
            const res = await API.get(`/skills/${id}`);
            return res.data; // ✅ correct
        },
    });

    if (isLoading) return <SkillSkeleton />;
    if (!data) return <p className="p-25">Skill not found</p>;

    const skill = data;

    return (
        <div className="w-full max-w-7xl mx-auto px-6 py-25 space-y-8">

            {/* HEADER */}
            <div>
                <div className="flex items-center gap-10">
                    <h1 className="text-4xl font-bold">{skill.name}</h1>

                    <Badge className="bg-white/10 border border-white/10">
                        {skill.level}
                    </Badge>
                </div>

                <p className="text-gray-400 text-sm mt-2">
                    Skill workspace • analytics • progress tracking
                </p>
            </div>

            {/* TABS */}
            <div className="flex gap-2 border border-white/10 bg-white/5 p-1 rounded-xl w-fit">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-1.5 rounded-lg text-sm transition ${activeTab === tab
                            ? "bg-white text-black"
                            : "text-gray-400 hover:text-white"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* ANIMATED CONTENT */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                >

                    {/* ---------------- OVERVIEW ---------------- */}
                    {activeTab === "Overview" && (
                        <div className="space-y-6">

                            {/* Progress Hero */}
                            <div className="p-6 rounded-2xl border border-white/10 bg-white/5 space-y-3">
                                <div className="flex justify-between text-sm text-gray-400">
                                    <span>Mastery</span>
                                    <span>{skill.progress}%</span>
                                </div>

                                <Progress value={skill.progress} className="h-3" />
                            </div>

                            {/* Stats */}
                            <div className="grid md:grid-cols-3 gap-6">
                                <Stat label="Time Invested" value={`${skill.totalHours || 0}h`} />
                                <Stat label="Progress" value={`${skill.progress}%`} />
                                <Stat label="Streak" value="🔥 Active" />
                            </div>

                            {/* Add Progress Modal */}
                            <AddProgressModal skillId={skill._id} />
                            <Button
                                className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700"
                                onClick={() => setFocusOpen(true)}
                            >
                                🎯 Enter Focus Mode
                            </Button>
                            {focusOpen && (
                                <FocusMode
                                    skill={skill}
                                    onClose={() => setFocusOpen(false)}
                                />
                            )}
                        </div>
                    )}

                    {/* ---------------- ANALYTICS ---------------- */}
                    {activeTab === "Insights" && (
                        <div className="space-y-6">

                            {/* AI COACH HEADER CARD */}
                            <div className="rounded-xl border bg-background p-6 space-y-3">
                                <h3 className="text-sm text-muted-foreground">
                                    AI Coach
                                </h3>

                                <p className="text-lg font-medium leading-relaxed">
                                    Your personalized learning assistant
                                </p>
                            </div>

                            {/* AI COACH COMPONENT */}
                            <AICoach skill={skill} />

                            {/* FUTURE INSIGHTS BLOCK */}
                            <div className="grid md:grid-cols-2 gap-4">

                                <div className="rounded-xl border p-5">
                                    <p className="text-sm text-muted-foreground">Strength</p>
                                    <p className="font-semibold mt-1">Consistency improving</p>
                                </div>

                                <div className="rounded-xl border p-5">
                                    <p className="text-sm text-muted-foreground">Recommendation</p>
                                    <p className="font-semibold mt-1">
                                        Practice daily for 20 mins
                                    </p>
                                </div>

                            </div>

                        </div>
                    )}

                    {/* ---------------- ACTIVITY ---------------- */}
                    {activeTab === "Activity" && (
                        <div className="p-6 rounded-2xl border border-white/10 bg-white/5">
                            <p className="text-gray-800">
                                Activity logs will appear here (progress history, notes, etc.)
                            </p>
                        </div>
                    )}

                    {/* ---------------- INSIGHTS ---------------- */}
                    {activeTab === "Analytics" && (
                        <div className="space-y-6">

                            <Card className="p-6">
                                <AnalyticsChart skillId={skill._id} />
                            </Card>

                            <Card className="p-6">
                                <PremiumCalendarHeatmap skillId={skill._id} />
                            </Card>

                        </div>
                    )}

                </motion.div>
            </AnimatePresence>
        </div>
    );
}

/* ---------------- STAT CARD ---------------- */
function Stat({ label, value }: any) {
    return (
        <div className="p-5 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition">
            <p className="text-xs text-gray-400">{label}</p>
            <h2 className="text-2xl font-bold mt-2">{value}</h2>
        </div>
    );
}

/* ---------------- MODAL ADD PROGRESS ---------------- */
function AddProgressModal({ skillId }: { skillId: string }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="bg-green-500 text-black">
                    Add Progress
                </Button>
            </DialogTrigger>

            <DialogContent className="bg-black border-white/10">
                <AddProgress skillId={skillId} />
            </DialogContent>
        </Dialog>
    );
}

/* ---------------- SKELETON LOADER ---------------- */
function SkillSkeleton() {
    return (
        <div className="max-w-7xl mx-auto px-6 py-10 space-y-8 animate-pulse">

            {/* header */}
            <div className="h-10 w-1/3 bg-muted rounded-lg" />

            {/* tabs */}
            <div className="h-10 w-64 bg-muted rounded-xl" />

            {/* hero progress */}
            <div className="h-28 bg-muted rounded-2xl" />

            {/* stats */}
            <div className="grid md:grid-cols-3 gap-6">
                <div className="h-24 bg-muted rounded-2xl" />
                <div className="h-24 bg-muted rounded-2xl" />
                <div className="h-24 bg-muted rounded-2xl" />
            </div>

            {/* chart */}
            <div className="h-72 bg-muted rounded-2xl" />

            {/* heatmap */}
            <div className="h-48 bg-muted rounded-2xl" />
        </div>
    );
}