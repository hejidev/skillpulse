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
      className="relative rounded-3xl border border-border/20 bg-background/60 backdrop-blur-xl p-6 overflow-hidden shadow-xl hover:shadow-2xl transition-all"
    >
      {/* 🔥 BACKGROUND GLOW */}
      <div className="absolute inset-0 opacity-20 bg-linear-to-br from-brand via-accent-500 to-brand-secondary-500 blur-3xl" />

      <div className="relative space-y-6">

        {/* ================= HEADER ================= */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold tracking-tight">
              {skill.name}
            </h3>

            <p className="text-xs text-muted-foreground mt-1">
              Level {level} • {totalHours} hrs
            </p>
          </div>

          <Badge className="bg-card/50 border border-border/20 text-foreground">
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
                stroke="oklch(91.887% 0.0001 271.152)"
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
                  <stop offset="0%" stopColor="#22c55e" />
                  <stop offset="100%" stopColor="#62e793" />
                </linearGradient>
              </defs>
            </svg>

            <div className="absolute inset-0 flex items-center justify-center text-sm font-bold">
              {progress.toFixed(0)}%
            </div>
          </div>

          {/* 📊 QUICK STATS */}
          <div className="text-right space-y-1">
            <p className="text-xs text-muted-foreground">XP</p>
            <p className="font-semibold">{skillXP}</p>

            <p className="text-xs text-muted-foreground mt-2">Target</p>
            <p className="font-semibold">{targetHours}h</p>
          </div>
        </div>

        {/* ================= LEVEL BAR ================= */}
        <div>
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Level Progress</span>
            <span>{Math.floor(levelProgress)}%</span>
          </div>

          <div className="w-full h-2 bg-card rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${levelProgress}%` }}
              className="h-full bg-linear-to-r from-green-300 to-green-500"
            />
          </div>

          <p className="text-[11px] text-muted-foreground mt-1">
            {Math.max(0, Math.ceil(nextLevelXP - skillXP))} XP to next level
          </p>
        </div>

        {/* ================= MAIN ACTION ================= */}
        <div className="pt-2">
          <AddProgress skillId={skill._id} />
        </div>

        {/* ================= AI COACH ================= */}
        <div className="p-3 rounded-xl bg-card/5 border border-border/15">
          <AICoach skill={skill} />
        </div>

        <div>
          <Button
            className="w-full mt-2 bg-brand hover:bg-brand/40 hover:text-foreground cursor-pointer"
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