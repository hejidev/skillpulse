"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { useState } from "react";

export default function CTA() {
  const [openDemo, setOpenDemo] = useState(false);

  return (
    <section className="relative py-28 px-6 text-center overflow-hidden">
      
      {/* 🔥 Background Glow */}
      <div className="absolute inset-0 bg-linear-to-r from-green-500/10 via-transparent to-purple-500/10 blur-3xl" />

      <div className="relative z-10 max-w-3xl mx-auto">
        
        {/* 🚀 Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold leading-tight"
        >
          Start building skills with{" "}
          <span className="bg-linear-to-r from-green-400 to-purple-400 bg-clip-text text-transparent">
            intention
          </span>
        </motion.h2>

        {/* 💬 Subtext */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-5 text-gray-400 text-lg"
        >
          Stop guessing your progress. Track it, measure it, and improve daily.
        </motion.p>

        {/* ⚡ CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-10 flex justify-center gap-4 flex-wrap"
        >
          <Button className="bg-green-500 hover:bg-green-600 text-black px-8 py-4 text-lg transition-all duration-300 hover:scale-105">
            Get Started Free
          </Button>

          <Button
            onClick={() => setOpenDemo(true)}
            variant="outline"
            className="px-6 py-3"
          >
            View Demo ▶
          </Button>
        </motion.div>

        {/* 🔒 Trust line */}
        <p className="mt-6 text-sm text-gray-500">
          No credit card required • Free to start
        </p>
      </div>

      <Dialog open={openDemo} onOpenChange={setOpenDemo}>
        <DialogContent className="max-w-3xl bg-black border border-white/10 text-white">

          <div className="space-y-4 text-center">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-white">SkillPulse Demo</DialogTitle>
            </DialogHeader>

            <p className="text-sm text-gray-400">
              Watch how you track skills, level up, and grow consistency.
            </p>

            {/* DEMO VIDEO PLACEHOLDER */}
            <div className="aspect-video rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
              <p className="text-gray-400">🎬 Demo video goes here</p>
            </div>

          </div>

        </DialogContent>
      </Dialog>
    </section>
  );
}