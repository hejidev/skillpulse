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

export default function SkillCard({ skill }: any) {
  const totalHours = skill.totalHours || 0;
  const targetHours = skill.targetHours || 1;

  // 🎯 PROGRESS %
  const progress = Math.min(
    100,
    (totalHours / targetHours) * 100
  );

  // ⚡ SKILL LEVEL (independent level system per skill)
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
    <div className="relative rounded-2xl border border-white/10 bg-linear-to-br from-white/5 to-transparent p-5 hover:shadow-xl transition overflow-hidden">

      {/* 🔥 BACKGROUND GLOW */}
      <div className="absolute inset-0 opacity-10 bg-linear-to-r from-indigo-500 to-purple-600 blur-2xl" />

      <div className="relative">

        {/* HEADER */}
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-lg font-semibold">{skill.name}</h3>

            <p className="text-xs text-gray-400">
              Level {level} • {totalHours}h total
            </p>
          </div>

          <Badge className="bg-purple-500/10 text-purple-300 border border-purple-500/20">
            {progress.toFixed(0)}%
          </Badge>
        </div>

        {/* 🧠 AI COACH */}
        <div className="mb-4">
          <AICoach skill={skill} />
        </div>

        {/* 📊 SKILL LEVEL BAR */}
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Skill Level XP</span>
            <span>{skillXP} XP</span>
          </div>

          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-indigo-500 to-purple-600 transition-all"
              style={{ width: `${Math.min(100, levelProgress)}%` }}
            />
          </div>

          <p className="text-[11px] text-gray-500 mt-1">
            {Math.max(0, Math.ceil(nextLevelXP - skillXP))} XP to next skill level
          </p>
        </div>

        {/* 📊 OVERALL PROGRESS BAR */}
        <div className="mb-4">
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-green-400 to-emerald-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* ➕ ADD PROGRESS */}
        <AddProgress skillId={skill._id} />

        {/* 🔽 ACCORDION SECTIONS */}
        <Accordion type="single" collapsible className="mt-4 space-y-2">

          <AccordionItem value="analytics">
            <AccordionTrigger>📊 Analytics</AccordionTrigger>
            <AccordionContent>
              <AnalyticsChart skillId={skill._id} />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="insights">
            <AccordionTrigger>🧠 Insights</AccordionTrigger>
            <AccordionContent>
              <SkillInsights skillId={skill._id} skill={skill} />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="weekly">
            <AccordionTrigger>📅 Weekly Report</AccordionTrigger>
            <AccordionContent>
              <WeeklyAnalytics skillId={skill._id} />
            </AccordionContent>
          </AccordionItem>

        </Accordion>
      </div>
    </div>
  );
}