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
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {achievements.map((a: any) => (
          <motion.div
            key={a._id}
            whileHover={{
              y: -6,
              scale: 1.02,
            }}
            className={`
              rounded-2xl border p-5
              transition-all duration-300
              backdrop-blur-xl

              ${
                a.unlocked
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
            {/* TITLE */}
            <h2 className="font-bold text-lg">
              {a.title}
            </h2>

            {/* DESCRIPTION */}
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              {a.description}
            </p>

            {/* PROGRESS */}
            <div className="mt-5 h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${a.progress}%` }}
              />
            </div>

            {/* FOOTER */}
            <div className="flex items-center justify-between mt-4">
              <p className="text-xs text-muted-foreground">
                {a.progress}% Complete
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