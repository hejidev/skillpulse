"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import GlobalSearch from "@/components/search/GlobalSearch";
import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";


export default function Hero() {
  const [openDemo, setOpenDemo] = useState(false);

  const router = useRouter();

  const handleStartTracking = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login to start tracking 🚀");
      router.push("/login");
      return;
    }

    router.push("/dashboard");
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">

      {/* Glow Background */}
      <div className="absolute w-125 h-125 bg-green-500/20 blur-3xl rounded-full -top-25 -left-25" />
      <div className="absolute w-100 h-100 bg-blue-500/20 blur-3xl rounded-full -bottom-25 -right-25" />

      {/* Animated Curve */}
      <svg className="absolute w-full h-full opacity-20">
        <motion.path
          d="M0,300 C300,100 900,400 1440,100"
          stroke="lime"
          strokeWidth="3"
          fill="transparent"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2 }}
        />
      </svg>

      {/* CONTENT */}
      <div className="relative z-10 text-center max-w-3xl">

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-bold leading-tight"
        >
          Track your growth. <br />
          Measure your improvement.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-lg text-gray-300"
        >
          Build skills with clarity, not guesswork.
        </motion.p>

        {/* ⭐ PREMIUM SEARCH BOX */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-13 flex justify-center"
        >
          <div className="w-full max-w-lg">
            <GlobalSearch />
          </div>
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 flex justify-center gap-4 flex-wrap"
        >
          {/* START TRACKING */}
          <Button
            onClick={handleStartTracking}
            className="bg-green-500 hover:bg-green-600 text-black px-6 py-3"
          >
            Start Tracking 🚀
          </Button>

          <Button
            onClick={() => setOpenDemo(true)}
            variant="outline"
            className="px-6 py-3"
          >
            View Demo ▶
          </Button>
        </motion.div>

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