"use client";

import { useQuery } from "@tanstack/react-query";
import API from "@/lib/api";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";

export default function CoachPage() {
    const [speaking, setSpeaking] = useState(false);

    const isSpeakingRef = useRef(false);
    const voicesLoadedRef = useRef(false);

    const { data, isLoading } = useQuery({
        queryKey: ["coach-dashboard"],
        queryFn: async () => {
            const res = await API.get("/coach/dashboard");
            console.log("COACH DATA:", res.data);
            return res.data;
        },
    });

    const skillId = data?.skills?.[0].skill?._id;

    const { data: aiData, isLoading: aiLoading } = useQuery({
        queryKey: ["coach-ai", data?.skills?.[0]?.skill?._id],
        queryFn: async () => {
            const res = await API.post("/coach", {
                skillId,
            });

            return res.data;
        },
        enabled: !!skillId,
    });

    useEffect(() => {
        const loadVoices = () => {
            const voices = window.speechSynthesis.getVoices();
            if (voices.length > 0) {
                voicesLoadedRef.current = true;
            }
        };

        loadVoices();

        window.speechSynthesis.onvoiceschanged = loadVoices;

        return () => {
            window.speechSynthesis.onvoiceschanged = null;
        };
    }, []);

    const speak = (payload?: string | { text: string; mood?: string }) => {
        if (!payload) return;

        const text = typeof payload === "string" ? payload : payload.text;
        const mood = typeof payload === "object" ? payload.mood : "neutral";

        if (!text?.trim()) return;
        if (!("speechSynthesis" in window)) return;

        const synth = window.speechSynthesis;

        synth.cancel();

        isSpeakingRef.current = true;

        setTimeout(() => {
            const utterance = new SpeechSynthesisUtterance(text.trim());

            // 🎯 MOOD ENGINE (NEW V3 FEATURE)
            switch (mood) {
                case "strict":
                    utterance.rate = 1.1;
                    utterance.pitch = 0.8;
                    break;

                case "focused":
                    utterance.rate = 0.95;
                    utterance.pitch = 1;
                    break;

                case "motivational":
                    utterance.rate = 1;
                    utterance.pitch = 1.2;
                    break;

                default:
                    utterance.rate = 0.95;
                    utterance.pitch = 1;
            }

            utterance.lang = "en-US";

            const voices = synth.getVoices();

            if (voices.length) {
                utterance.voice =
                    voices.find(v => v.lang.startsWith("en")) || voices[0];
            }

            utterance.onstart = () => {
                isSpeakingRef.current = true;
                setSpeaking(true);
            };

            utterance.onend = () => {
                isSpeakingRef.current = false;
                setSpeaking(false);
            };

            utterance.onerror = (e) => {
                isSpeakingRef.current = false;
                setSpeaking(false);

                if (e.error === "interrupted") return;

                console.warn("Speech error:", e.error);
            };

            synth.speak(utterance);
        }, 120);
    };

    if (isLoading) {
        return (
            <div className="p-6 space-y-4">
                <Skeleton className="h-32 w-full rounded-xl" />
                <Skeleton className="h-24 w-full rounded-xl" />
                <Skeleton className="h-64 w-full rounded-xl" />
            </div>
        );
    }

    if (!data) {
        return (
            <div className="p-6 m-auto text-red-400">
                No data returned from server
            </div>
        );
    }

    return (
        <div className="relative space-y-10 p-6">

            {/* 🌌 GLOBAL BACKGROUND */}
            <div className="fixed inset-0 -z-10 bg-linear-to-br from-background via-[#050510] to-background" />

            {/* ================= HERO ================= */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative p-8 rounded-3xl border border-border/10 backdrop-blur-2xl overflow-hidden"
            >

                {/* 🔥 MOOD REACTIVE BACKGROUND */}
                <div
                    className={`absolute inset-0 opacity-20 blur-3xl ${aiData?.mood === "motivational"
                            ? "bg-purple-500"
                            : aiData?.mood === "strict"
                                ? "bg-red-500"
                                : aiData?.mood === "focused"
                                    ? "bg-blue-500"
                                    : "bg-indigo-500"
                        }`}
                />

                {/* 🧠 AI ORB */}
                <div className="flex items-center gap-5 mb-6">

                    <motion.div
                        animate={{
                            scale: speaking ? [1, 1.3, 1] : 1,
                            rotate: speaking ? [0, 10, -10, 0] : 0,
                        }}
                        transition={{ repeat: speaking ? Infinity : 0, duration: 1.2 }}
                        className="w-14 h-14 rounded-full bg-linear-to-br from-brand to-border/60 flex items-center justify-center text-foreground font-bold shadow-lg"
                    >
                        AI
                    </motion.div>

                    <div>
                        <p className="text-xs text-gray-400">Neural Coach</p>
                        <h3 className="text-sm font-semibold">
                            {speaking ? "Speaking..." : "System Ready"}
                        </h3>
                    </div>
                </div>

                {/* 💬 MESSAGE */}
                <motion.h2
                    key={aiData?.text}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xl font-semibold leading-relaxed mb-6"
                >
                    {aiLoading
                        ? "Analyzing your performance..."
                        : aiData?.text || "No insights available"}
                </motion.h2>

                {/* 🎤 BUTTON */}
                <Button
                    disabled={!aiData?.text || aiLoading || speaking}
                    onClick={() => speak(aiData)}
                    className="w-full rounded-xl bg-linear-to-r from-brand/80 to-brand hover:scale-[1.02] transition-all text-card font-semibold"
                >
                    {speaking ? "🔊 Coaching..." : "🔊 Activate Coach"}
                </Button>

                {/* 🎧 VOICE WAVE */}
                {speaking && (
                    <div className="flex gap-1 mt-4 justify-center">
                        {[...Array(20)].map((_, i) => (
                            <motion.div
                                key={i}
                                animate={{ height: [10, 30, 10] }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 0.6,
                                    delay: i * 0.05,
                                }}
                                className="w-1 bg-brand/40 rounded"
                            />
                        ))}
                    </div>
                )}
            </motion.div>

            {/* ================= STATS ================= */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-brand">

                <StatCard title="Total Skills" value={data.totalSkills} />
                <StatCard title="Weekly Hours" value={`${data.totalHours}h`} />

                {/* 🔥 CIRCULAR PROGRESS */}
                <Card className="p-6 bg-card/50 text-brand border border-border/50 backdrop-blur-xl flex flex-col items-center justify-center">
                    <p className="text-xs text-forground mb-2">Consistency</p>

                    <div className="relative w-24 h-24">
                        <svg className="w-full h-full -rotate-90">
                            <circle
                                cx="50%"
                                cy="50%"
                                r="40"
                                stroke="#222"
                                strokeWidth="6"
                                fill="none"
                            />
                            <circle
                                cx="50%"
                                cy="50%"
                                r="40"
                                stroke="#00bf30"
                                strokeWidth="6"
                                fill="none"
                                strokeDasharray={251}
                                strokeDashoffset={
                                    251 -
                                    (251 * Math.round(data.avgConsistency)) / 100
                                }
                            />
                        </svg>

                        <div className="absolute inset-0 flex items-center justify-center text-xl font-bold">
                            {Math.round(data.avgConsistency)}%
                        </div>
                    </div>
                </Card>
            </div>

            {/* ================= SKILLS ================= */}
            <div className="space-y-4">
                <h3 className="text-sm text-foreground">Skill Breakdown</h3>

                <div className="grid md:grid-cols-2 gap-6">
                    {data.skills.map((item: any, i: number) => (
                        <motion.div
                            key={item.skill._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <Card className="group p-5 bg-card/50 border border-border/50 backdrop-blur-xl space-y-3 hover:scale-[1.02] transition-all cursor-pointer">

                                <h4 className="font-semibold text-lg text-foreground group-hover:text-brand/80 transition">
                                    {item.skill.name}
                                </h4>

                                <div className="flex justify-between text-xs text-foreground">
                                    <span>🔥 {item.streak} day streak</span>
                                    <span>
                                        📊 {Math.round(item.context?.consistencyScore || 0)}%
                                    </span>
                                </div>

                                {/* 🔥 MINI PROGRESS BAR */}
                                <div className="h-2 bg-foreground rounded overflow-hidden">
                                    <div
                                        className="h-full bg-brand"
                                        style={{
                                            width: `${item.context?.consistencyScore || 0}%`,
                                        }}
                                    />
                                </div>

                                <div className="text-xs text-muted-foreground">
                                    ⏱ {item.context?.weeklyHours || 0}h this week
                                </div>

                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/* ================= REUSABLE ================= */
function StatCard({ title, value }: any) {
    return (
        <Card className="p-4 bg-card/50 border border-border/50 backdrop-blur-xl">
            <p className="text-xs text-foreground">{title}</p>
            <h3 className="text-xl font-semibold text-brand">{value}</h3>
        </Card>
    );
}