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
      className="py-24 px-6 bg-gray-900 text-white"
    >
      <div className="max-w-6xl mx-auto text-center">
        
        {/* 🔥 Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold"
        >
          Everything you need to grow intentionally
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-4 text-gray-400 max-w-xl mx-auto"
        >
          SkillPulse gives you the tools to track, analyze, and improve your skills with clarity.
        </motion.p>

        {/* 🚀 Feature Cards */}
        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, i) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  delay: i * 0.15,
                  duration: 0.6,
                }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="group relative p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur hover:border-green-500/40 transition"
              >
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-green-500/0 via-green-500/10 to-purple-500/0 opacity-0 group-hover:opacity-100 transition" />

                {/* Icon */}
                <div className="mb-4 w-12 h-12 flex items-center justify-center rounded-xl bg-black/40 border border-white/10 group-hover:border-green-500/50 transition">
                  <Icon className="w-6 h-6 text-green-400" />
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold mb-2">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-400 leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}