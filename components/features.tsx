"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  Brain,
  Target,
  Activity,
} from "lucide-react";

const features = [
  {
    title: "Skill Tracking Dashboard",
    desc: "Track all your skills in one place with structured progress monitoring.",
    icon: BarChart3,
  },
  {
    title: "Reflection Logs",
    desc: "Capture insights and learn faster through intentional reflection.",
    icon: Brain,
  },
  {
    title: "Goal Setting",
    desc: "Set clear milestones and stay focused on what truly matters.",
    icon: Target,
  },
  {
    title: "Consistency Tracking",
    desc: "Build habits and maintain streaks to stay consistent.",
    icon: Activity,
  },
];

export default function Features() {
  return (
  <section
    id="features"
    className="
      relative overflow-hidden
      py-24 px-6
      bg-background
      text-foreground
      transition-colors duration-300
    "
  >

    {/* 🌌 BACKGROUND FX */}
    <div className="absolute inset-0 -z-10">

      <div className="absolute top-0 right-0 w-112.5 h-112.5 bg-primary/10 blur-[120px] rounded-full" />

      <div className="absolute bottom-0 left-0 w-112.5 h-112.5 bg-purple-500/10 blur-[120px] rounded-full" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_35%)]" />

    </div>

    <div className="max-w-7xl mx-auto text-center">

      {/* 🔥 HEADING */}
      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="
          text-4xl md:text-5xl
          font-black tracking-tight
        "
      >
        Everything you need to grow intentionally
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        viewport={{ once: true }}
        className="
          mt-5
          text-muted-foreground
          max-w-2xl mx-auto
          leading-relaxed
        "
      >
        SkillPulse gives you powerful tools to track,
        analyze and improve your skills with clarity,
        focus and measurable consistency.
      </motion.p>

      {/* 🚀 FEATURE CARDS */}
      <div className="mt-20 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">

        {features.map((feature, i) => {
          const Icon = feature.icon;

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                delay: i * 0.12,
                duration: 0.6,
              }}
              viewport={{ once: true }}
              whileHover={{
                y: -10,
                scale: 1.02,
              }}
              className="
                group relative overflow-hidden
                p-7 rounded-[30px]
                border border-border/30
                bg-card/60
                backdrop-blur-2xl
                text-left
                transition-all duration-300
                hover:border-primary/30
                shadow-[0_0_40px_rgba(0,0,0,0.08)]
              "
            >

              {/* HOVER GLOW */}
              <div
                className="
                  absolute inset-0 opacity-0
                  group-hover:opacity-100
                  transition-opacity duration-500
                  bg-linear-to-br
                  from-primary/10
                  via-transparent
                  to-purple-500/10
                "
              />

              {/* TOP LIGHT */}
              <div
                className="
                  absolute top-0 left-0 w-full h-px
                  bg-linear-to-r
                  from-transparent
                  via-white/20
                  to-transparent
                "
              />

              <div className="relative z-10">

                {/* ICON */}
                <div
                  className="
                    mb-6 w-14 h-14
                    flex items-center justify-center
                    rounded-2xl
                    bg-background/60
                    border border-border
                    group-hover:border-primary/40
                    transition-all duration-300
                    shadow-lg
                  "
                >
                  <Icon
                    className="
                      w-6 h-6
                      text-primary
                      group-hover:scale-110
                      transition-transform duration-300
                    "
                  />
                </div>

                {/* TITLE */}
                <h3
                  className="
                    text-xl font-semibold
                    mb-3
                    tracking-tight
                  "
                >
                  {feature.title}
                </h3>

                {/* DESCRIPTION */}
                <p
                  className="
                    text-sm
                    text-muted-foreground
                    leading-relaxed
                  "
                >
                  {feature.desc}
                </p>

              </div>

            </motion.div>
          );
        })}

      </div>
    </div>
  </section>
);
}