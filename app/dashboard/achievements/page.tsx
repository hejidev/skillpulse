"use client";

import { useQuery } from "@tanstack/react-query";
import API from "@/lib/api";
import { motion } from "framer-motion";

export default function AchievementsPage() {
  const { data: achievements = [] } = useQuery({
    queryKey: ["achievements"],
    queryFn: async () => (await API.get("/achievements")).data,
  });

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-bold uppercase tracking-[0.16em] text-muted-foreground">
          Achievements
        </h1>
        <span className="text-[15px] text-muted-foreground">
          Track your milestones and XP progress
        </span>
      </div>
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {achievements.map((a: any) => (
          <motion.div
            key={a._id}
            whileHover={{
              y: -6,
              scale: 1.02,
            }}
            whileTap={{ scale: 0.98 }}
            className={`
              rounded-2xl border p-5
              transition-all duration-300
              backdrop-blur-xl

              ${a.unlocked
                ? `
                    bg-primary/10
                    border-primary/30
                    shadow-[0_0_30px_rgba(99,102,241,0.12)]
                  `
                : `
                    bg-card
                    border-border
                  `
              }
            `}
          >

            {/* TITLE ROW */}
            <div className={`
                  relative flex justify-between items-center rounded-2xl border p-4
                  transition-all duration-300
                  backdrop-blur-xl
                  ${a.unlocked
                ? "bg-primary/10 border-primary/30 shadow-[0_0_30px_rgba(99,102,241,0.12)]"
                : "bg-card border-border/50 opacity-80"
              }
            `}>
              <h2 className="font-bold text-sm sm:text-base line-clamp-1">
                {a.title}
              </h2>

              {a.unlocked && (
                <span className="inline-flex items-center rounded-full bg-emerald-500/10 text-foreground font-semibold border border-emerald-500/40 px-2 py-0.5 text-[10px] uppercase tracking-wide">
                  Unlocked
                </span>
              )}

              {!a.unlocked && (
                <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                  Locked
                </span>
              )}
            </div>

            {/* DESCRIPTION */}
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              {a.description}
            </p>

            {/* PROGRESS */}
            <div className="mt-5 h-2 rounded-full bg-input/60 overflow-hidden">
              <div
                className={`
                  h-full rounded-full transition-all duration-500
                  ${a.unlocked ? "bg-emerald-400" : "bg-brand"}
                `}
                style={{ width: `${Math.min(a.progress, 100)}%` }}
              />
            </div>

            {/* FOOTER */}
            <div className="flex items-center justify-between mt-4 text-xs">
              <p className="text-muted-foreground">
                {a.progress}% complete
                {a.target && (
                  <span className="ml-1 text-[11px] text-muted-foreground/80">
                    · Goal: {a.target}
                  </span>
                )}
              </p>

              <span className="text-sm font-semibold text-primary">
                +{a.xpReward} XP
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}