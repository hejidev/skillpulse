"use client";

import AddProgress from "@/components/progress/AddProgress";
import AnalyticsChart from "../analytics-chart";
import SkillInsights from "@/components/skills/SkillInsights";
import WeeklyAnalytics from "@/components/analytics/WeeklyAnalytics";
import AICoach from "../ai/AICoach";
import { getLevel } from "@/lib/utils/xp";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import FocusMode from "../focus/FocusMode";
import { useState } from "react";

/* ---------------- UTIL ---------------- */
const getStatus = (progress: number) => {
  if (progress < 20) return "🚀 Starting";
  if (progress < 50) return "⚡ Building";
  if (progress < 80) return "🔥 Strong";
  return "🏆 Mastery";
};

/* ---------------- COMPONENT ---------------- */
export default function SkillCard({ skill }: any) {
  const totalHours = skill.totalHours || 0;
  const targetHours = skill.targetHours || 1;
  const [focusOpen, setFocusOpen] = useState(false);

  const progress = Math.min(100, (totalHours / targetHours) * 100);

  // ⚡ LEVEL SYSTEM
  const skillXP = totalHours * 10;
  const level = getLevel(skillXP);

  const nextLevelXP = Math.pow((level + 1) / 0.1, 2);
  const currentLevelXP = Math.pow(level / 0.1, 2);

  const levelProgress =
    nextLevelXP > currentLevelXP
      ? ((skillXP - currentLevelXP) /
        (nextLevelXP - currentLevelXP)) *
      100
      : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 overflow-hidden shadow-xl hover:shadow-2xl transition-all"
    >
      {/* 🔥 BACKGROUND GLOW */}
      <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 blur-3xl" />

      <div className="relative space-y-6">

        {/* ================= HEADER ================= */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold tracking-tight">
              {skill.name}
            </h3>

            <p className="text-xs text-gray-400 mt-1">
              Level {level} • {totalHours} hrs
            </p>
          </div>

          <Badge className="bg-white/10 border border-white/20 text-white">
            {getStatus(progress)}
          </Badge>
        </div>

        {/* ================= PROGRESS RING ================= */}
        <div className="flex items-center justify-between">

          {/* 🔵 RADIAL PROGRESS */}
          <div className="relative w-24 h-24">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="50%"
                cy="50%"
                r="40"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="8"
                fill="transparent"
              />
              <motion.circle
                cx="50%"
                cy="50%"
                r="40"
                stroke="url(#grad)"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={251}
                strokeDashoffset={251 - (progress / 100) * 251}
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="grad">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </svg>

            <div className="absolute inset-0 flex items-center justify-center text-sm font-bold">
              {progress.toFixed(0)}%
            </div>
          </div>

          {/* 📊 QUICK STATS */}
          <div className="text-right space-y-1">
            <p className="text-xs text-gray-400">XP</p>
            <p className="font-semibold">{skillXP}</p>

            <p className="text-xs text-gray-400 mt-2">Target</p>
            <p className="font-semibold">{targetHours}h</p>
          </div>
        </div>

        {/* ================= LEVEL BAR ================= */}
        <div>
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Level Progress</span>
            <span>{Math.floor(levelProgress)}%</span>
          </div>

          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${levelProgress}%` }}
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-600"
            />
          </div>

          <p className="text-[11px] text-gray-500 mt-1">
            {Math.max(0, Math.ceil(nextLevelXP - skillXP))} XP to next level
          </p>
        </div>

        {/* ================= MAIN ACTION ================= */}
        <div className="pt-2">
          <AddProgress skillId={skill._id} />
        </div>

        {/* ================= AI COACH ================= */}
        <div className="p-3 rounded-xl bg-white/5 border border-white/10">
          <AICoach skill={skill} />
        </div>

        <div>
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

        {/* ================= EXPANDABLE SECTIONS ================= */}
        <Accordion type="single" collapsible className="space-y-2">

          <AccordionItem value="analytics">
            <AccordionTrigger>📊 Performance Analytics</AccordionTrigger>
            <AccordionContent>
              <AnalyticsChart skillId={skill._id} />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="insights">
            <AccordionTrigger>🧠 Smart Insights</AccordionTrigger>
            <AccordionContent>
              <SkillInsights skillId={skill._id} skill={skill} />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="weekly">
            <AccordionTrigger>📅 Weekly Breakdown</AccordionTrigger>
            <AccordionContent>
              <WeeklyAnalytics skillId={skill._id} />
            </AccordionContent>
          </AccordionItem>

        </Accordion>

      </div>
    </motion.div>
  );
}