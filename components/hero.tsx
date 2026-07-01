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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Code2 } from "lucide-react";

export default function Hero() {
  const [openDemo, setOpenDemo] = useState(false);
  const router = useRouter();

  const handleStartTracking = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login to start tracking 🚀");
      router.push("/auth/login");
      return;
    }

    router.push("/dashboard");
  };

  return (
    <section className="relative min-h-screen flex items-center px-6 mt-6 lg:mt-0 lg:px-12 overflow-hidden">
      {/* Glow Background */}
      <div className="absolute w-125 h-125 bg-green-500/10 blur-3xl rounded-full -top-25 -left-25" />
      <div className="absolute w-100 h-100 bg-blue-500/10 blur-3xl rounded-full -bottom-25 -right-25" />

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

      {/* CONTENT GRID */}
      <div className="relative z-10 w-full max-w-7xl lg:px-7 mx-auto grid lg:grid-cols-2 gap-10 items-center">
        {/* LEFT: Product copy + CTAs */}
        <div className="text-center lg:text-left">
          {/* Small badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 rounded-full border border-border/40 bg-background/60 px-3 py-1 text-xs text-muted-foreground mb-4"
          >
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            <span>Skill tracking for anyone learning and growing</span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold leading-tight"
          >
            Track your growth. <br />
            Measure your improvement.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 text-lg text-muted-foreground"
          >
            Build skills with clarity, not guesswork. See your progress over time,
            stay consistent, and turn practice into real results.
          </motion.p>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 flex justify-center lg:justify-start"
          >
            <div className="w-full max-w-lg">
              <GlobalSearch />
              <p className="mt-3 text-xs text-muted-foreground">
                Search skills, frameworks, or goals and start tracking in seconds.
              </p>
            </div>
          </motion.div>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-7 flex justify-center lg:justify-start gap-4 flex-wrap"
          >
            <Button
              onClick={handleStartTracking}
              className="bg-brand hover:bg-green-600 text-foreground px-6 py-3"
            >
              Start tracking now
            </Button>

            <Button
              onClick={() => setOpenDemo(true)}
              variant="outline"
              className="px-6 py-3"
            >
              View live demo
            </Button>
          </motion.div>

          {/* Creator / portfolio strip */}
          {/* <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-6 flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start text-xs text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/me.jpg" alt="Your name" />
                <AvatarFallback>ME</AvatarFallback>
              </Avatar>
              <div className="text-left">
                <p className="font-medium text-foreground text-xs">
                  Designed & built by [Your Name]
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Product-focused Web Developer · Frontend / Full‑stack
                </p>
              </div>
            </div>
            <div className="hidden sm:block h-8 w-px bg-border" />
            <div className="flex items-center gap-2">
              <Code2 className="h-4 w-4 text-muted-foreground" />
              <p className="text-[11px]">
                React · Next.js · TypeScript · Tailwind · Node
              </p>
            </div>
          </motion.div> */}
        </div>

        {/* RIGHT: UI preview card (to impress companies) */}
        <motion.div
  initial={{ opacity: 0, x: 40 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ delay: 0.4 }}
  className="hidden lg:block"
>
  <div className="relative">
    <div className="rounded-3xl border border-border/60 bg-card/80 backdrop-blur-xl p-5 shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold">SkillPulse Dashboard</h3>
        <span className="text-[11px] text-muted-foreground">
          Portfolio project
        </span>
      </div>

      {/* Mini metrics row */}
      <div className="grid grid-cols-3 gap-3 text-xs">
        <div className="rounded-2xl bg-background/80 border border-border/40 p-3">
          <p className="text-muted-foreground text-[11px]">
            Weekly streak
          </p>
          <p className="mt-1 text-lg font-bold">12 days</p>
        </div>
        <div className="rounded-2xl bg-background/80 border border-border/40 p-3">
          <p className="text-muted-foreground text-[11px]">
            Skills tracked
          </p>
          <p className="mt-1 text-lg font-bold">18</p>
        </div>
        <div className="rounded-2xl bg-background/80 border border-border/40 p-3">
          <p className="text-muted-foreground text-[11px]">
            Completion rate
          </p>
          <p className="mt-1 text-lg font-bold text-emerald-400">
            92%
          </p>
        </div>
      </div>

      {/* Chart placeholder */}
      <div className="mt-4 h-24 rounded-2xl bg-linear-to-r from-emerald-500/20 via-cyan-500/20 to-blue-500/20 border border-border/40 flex items-center justify-center text-xs text-muted-foreground">
        Growth chart preview · built with responsive, accessible UI
      </div>

      {/* Tiny UX note */}
      <div className="mt-4 text-[11px] text-muted-foreground">
        Optimized for clarity, responsive layouts, and fast interactions — 
        designed to scale for real users and teams.
      </div>
    </div>
  </div>
</motion.div>
      </div>

      {/* Demo dialog */}
      <Dialog open={openDemo} onOpenChange={setOpenDemo}>
        <DialogContent className="max-w-3xl bg-background border border-border/30 text-foreground">
          <div className="space-y-4 text-center">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-foreground">
                SkillPulse Demo
              </DialogTitle>
            </DialogHeader>

            <p className="text-sm text-muted-foreground">
              See how SkillPulse works, from tracking skills to visualizing your
              growth journey.
            </p>

            <div className="aspect-video rounded-xl bg-card/90 border border-border/30 flex items-center justify-center">
              <p className="text-muted-foreground">🎬 Demo video goes here</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}