"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import API from "@/lib/api";

export default function FocusMode({ skill, onClose }: any) {
    const [seconds, setSeconds] = useState(1500); // 25 mins
    const [isRunning, setIsRunning] = useState(false);
    const [mode, setMode] = useState<"focus" | "break">("focus");
    const [sessionCount, setSessionCount] = useState(0);
    const [aiMessage, setAiMessage] = useState("");
    const intervalRef = useRef<any>(null);

    const [interruptions, setInterruptions] = useState(0);

    const [sound, setSound] = useState<"none" | "lofi" | "rain">("none");
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // ================= TIMER =================
    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setSeconds((prev) => {
                    if (prev <= 1) {
                        handleSessionEnd();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => clearInterval(intervalRef.current);
    }, [isRunning]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.pause();
        }

        if (sound === "none") return;

        const src =
            sound === "lofi"
                ? "/sounds/lofi.mp3"
                : "/sounds/rain.mp3";

        audioRef.current = new Audio(src);
        audioRef.current.loop = true;
        audioRef.current.volume = 0.4;

        if (isRunning) audioRef.current.play();

        return () => audioRef.current?.pause();
    }, [sound, isRunning]);

    // ================= AUTO AI COACH =================
    useEffect(() => {
        if (!isRunning) return;

        const interval = setInterval(async () => {
            try {
                const res = await API.post("/ai/coach", {
                    skillId: skill._id,
                    skillName: skill.name,
                    streak: 0,
                    weeklyHours: 0,
                    lastActiveDaysAgo: 0,
                    goalPercent: skill.progress,
                    bestDay: "Today",
                    worstDay: "None",
                    consistencyScore: 80,
                });

                setAiMessage(res.data.message);
            } catch (err) {
                console.log("AI Coach failed");
            }
        }, 60000); // every 1 min

        return () => clearInterval(interval);
    }, [isRunning]);

    // ================= SPEECH SYNTHESIS =================
    const speak = (text: string) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1;
        utterance.pitch = 1;
        speechSynthesis.speak(utterance);
    };

    useEffect(() => {
        if (aiMessage) {
            speak(aiMessage);
        }
    }, [aiMessage]);

    useEffect(() => {
        if (isRunning) {
            document.title = "🎯 Focus Mode Active";
        } else {
            document.title = "SkillPulse";
        }
    }, [isRunning]);

    useEffect(() => {
        const handleBlur = () => setInterruptions((p) => p + 1);

        window.addEventListener("blur", handleBlur);
        return () => window.removeEventListener("blur", handleBlur);
    }, []);

    const calculateFocusScore = (secondsSpent: number, interruptions: number) => {
        const base = secondsSpent / 60; // minutes
        const penalty = interruptions * 5;

        return Math.max(0, Math.round(base * 2 - penalty));
    };

    const focusScore = calculateFocusScore(1500 - seconds, interruptions);

    // ================= SESSION END =================
    const handleSessionEnd = async () => {
        setIsRunning(false);

        if (mode === "focus") {
            // ✅ Auto log progress
            await API.post("/progress", {
                skillId: skill._id,
                hours: 0.5, // 30min session
                note: "Focus Mode Session",
                focusScore,
            });

            setMode("break");
            setSeconds(300); // 5 min break
            setSessionCount((prev) => prev + 1);
        } else {
            setMode("focus");
            setSeconds(1500);
        }
    };

    // ================= FORMAT TIME =================
    const formatTime = (sec: number) => {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${m}:${s.toString().padStart(2, "0")}`;
    };



    return (
        <div className="fixed inset-0 z-50 bg-brand-foreground flex flex-col items-center justify-center text-foreground">
            <div className="flex gap-2 mt-4">
                <Button onClick={() => setSound("lofi")}>🎧 Lofi</Button>
                <Button onClick={() => setSound("rain")}>🌧 Rain</Button>
                <Button onClick={() => setSound("none")}>🔇 Off</Button>
            </div>
            {/* CLOSE */}
            <button
                onClick={onClose}
                className="absolute top-6 right-6 text-muted-foreground hover:text-foreground"
            >
                ✕
            </button>

            {/* MODE */}
            <p className="text-sm text-muted-foreground my-2">
                {mode === "focus" ? "🎯 Focus Mode" : "☕ Break Time"}
            </p>

            {/* TIMER */}
            <motion.h1
                key={seconds}
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="text-7xl font-bold tracking-tight"
            >
                {formatTime(seconds)}
            </motion.h1>

            {/* SESSION COUNT */}
            <p className="text-xs text-muted-foreground mt-2">
                Sessions: {sessionCount}
            </p>

            {/* AI COACH */}
            {aiMessage && (
                <div className="mt-6 max-w-md text-center text-sm text-muted-foreground bg-card/5 border border-border/30 p-4 rounded-xl">
                    🤖 {aiMessage}
                </div>
            )}

            {/* CONTROLS */}
            <div className="flex gap-4 mt-8">
                <Button onClick={() => setIsRunning(true)}>
                    Start
                </Button>

                <Button
                    variant="secondary"
                    onClick={() => setIsRunning(false)}
                >
                    Pause
                </Button>

                <Button
                    variant="destructive"
                    onClick={() => {
                        setIsRunning(false);
                        setSeconds(1500);
                        setMode("focus");
                    }}
                >
                    Reset
                </Button>
            </div>

            {/* PROGRESS VISUAL */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-card/50">
                <motion.div
                    className="h-full bg-brand-secondary"
                    initial={{ width: 0 }}
                    animate={{
                        width: `${mode === "focus"
                            ? ((1500 - seconds) / 1500) * 100
                            : ((300 - seconds) / 300) * 100
                            }%`,
                    }}
                />
            </div>

        </div>
    );
}