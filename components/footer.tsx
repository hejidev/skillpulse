// components/footer.tsx 
"use client";

import { useAppConfig } from "@/lib/useAppConfig";
import Link from "next/link";
import { useState } from "react";
import API from "@/lib/api";
import { toast } from "sonner";

export default function Footer() {
  const { config } = useAppConfig();
  const appName = config?.appName || "SkillPulse";
  const appInitial = appName.charAt(0).toUpperCase();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Enter your email");
      return;
    }
    setLoading(true);
    try {
      const res = await API.post("/newsletter/subscribe", { email });
      toast.success(res.data?.message || "You’re subscribed.");
      setEmail("");
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Unable to subscribe right now."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="
  relative overflow-hidden
  border-t border-border
  bg-background
  text-foreground
">

      {/* 🌌 BACKGROUND FX */}
      <div className="absolute inset-0 -z-10">

        <div className="absolute top-0 left-0 w-100 h-100 bg-card/40 blur-[140px] rounded-full" />

        <div className="absolute bottom-0 right-0 w-100 h-100 bg-purple-500/10 blur-[140px] rounded-full" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_40%)]" />
      </div>

      {/* ================= TOP CTA ================= */}
      <div className="max-w-7xl mx-auto px-6 pt-16">

        <div className="
        relative overflow-hidden
        rounded-[32px]
        border border-border
        bg-card/50
        backdrop-blur-2xl
        p-8 md:p-12
      ">

          {/* glow */}
          <div className="absolute inset-0 bg-linear-to-r from-green-500/10 via-purple-500/10 to-cyan-500/10" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-border bg-card/50 text-xs text-green-300 backdrop-blur-xl mb-4">
                ⚡ Build consistency. Track real growth.
              </div>

              <h2 className="text-3xl md:text-5xl font-black leading-tight">
                Your future self is built by what you track today.
              </h2>

              <p className="mt-5 text-muted-foreground leading-relaxed max-w-xl">
                SkillPulse helps creators, developers, students, and ambitious people
                transform random effort into measurable progress.
              </p>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-2 gap-4 min-w-50">

              <div className="rounded-2xl border border-border bg-card/40 p-5 backdrop-blur-xl">
                <h3 className="text-2xl font-bold text-green-400">
                  24/7
                </h3>

                <p className="text-sm text-muted-foreground mt-1">
                  Progress Tracking
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-card/40 p-5 backdrop-blur-xl">
                <h3 className="text-2xl font-bold text-purple-400">
                  AI
                </h3>

                <p className="text-sm text-muted-foreground mt-1">
                  Smart Insights
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-card/40 p-5 backdrop-blur-xl">
                <h3 className="text-2xl font-bold text-cyan-400">
                  Goals
                </h3>

                <p className="text-sm text-muted-foreground mt-1">
                  Achievement Focused
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-card/40 p-5 backdrop-blur-xl">
                <h3 className="text-2xl font-bold text-yellow-400">
                  Growth
                </h3>

                <p className="text-sm text-muted-foreground mt-1">
                  Visual Analytics
                </p>
              </div>

            </div>

          </div>
        </div>
      </div>

      {/* ================= MAIN FOOTER ================= */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid gap-12 lg:grid-cols-5">

        {/* BRAND */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3">
            <div
    className="
      w-10 h-10 rounded-2xl
      bg-linear-to-br from-emerald-500/70 via-brand/70 to-brand/90
      flex items-center justify-center
      text-black font-black text-lg
      shadow-[0_0_24px_rgba(16,185,129,0.45)]
      ring-1 ring-emerald-300/50
      transition-transform duration-300
      group-hover:scale-105 group-hover:shadow-[0_0_30px_rgba(16,185,129,0.6)]
    "
  >
    {appInitial}
  </div>

            <div className="flex flex-col">
              <span
                className="
        text-lg md:text-xl font-black tracking-tight
        bg-linear-to-r from-emerald-300 via-emerald-400 to-teal-500
        bg-clip-text text-transparent
      "
              >
                {appName}
              </span>
              <span className="hidden md:block text-[10px] uppercase tracking-[0.14em] text-muted-foreground/80">
                Growth Intelligence
              </span>
            </div>
          </div>

          <p className="mt-6 text-muted-foreground leading-relaxed max-w-md">
            More than a tracker, SkillPulse is your digital growth ecosystem.
            Stay accountable, measure consistency, and build momentum every day.
          </p>

          {/* SOCIALS */}
          <div className="flex gap-3 mt-6">

            {["X", "IG", "YT", "GH"].map((item, i) => (
              <div
                key={i}
                className="
                w-11 h-11 rounded-xl
                border border-border
                bg-white/5
                hover:bg-white/10
                hover:border-green-500/30
                transition-all
                flex items-center justify-center
                cursor-pointer
              "
              >
                {item}
              </div>
            ))}

          </div>

        </div>

        {/* PRODUCT */}
        <div>
          <h3 className="font-semibold mb-5 text-foreground">
            Product
          </h3>

          <ul className="space-y-3 text-sm text-muted-foreground">

            <li>
              <Link href="#features" className="hover:text-green-400 transition">
                Features
              </Link>
            </li>

            <li>
              <Link href="#how" className="hover:text-green-400 transition">
                How It Works
              </Link>
            </li>

            <li>
              <Link href="#" className="hover:text-green-400 transition">
                Progress Analytics
              </Link>
            </li>

            <li>
              <Link href="#" className="hover:text-green-400 transition">
                AI Insights
              </Link>
            </li>

          </ul>
        </div>

        {/* COMPANY */}
        {/* <div>
          <h3 className="font-semibold mb-5 text-foreground">
            Company
          </h3>

          <ul className="space-y-3 text-sm text-muted-foreground">

            <li>
              <Link href="/company/about" className="hover:text-green-400 transition">
                About
              </Link>
            </li>

            <li>
              <Link href="/company/blogs" className="hover:text-green-400 transition">
                Blog
              </Link>
            </li>

            <li>
              <Link href="/company/careers" className="hover:text-green-400 transition">
                Careers
              </Link>
            </li>

            <li>
              <Link href="/company/community" className="hover:text-green-400 transition">
                Community
              </Link>
            </li>

          </ul>
        </div> */}

        {/* SUPPORT */}
        <div>
          <h3 className="font-semibold mb-5 text-foreground">
            Support
          </h3>

          <ul className="space-y-3 text-sm text-muted-foreground">

            <li>
              <Link href="/company/help" className="hover:text-green-400 transition">
                Help Center
              </Link>
            </li>

            <li>
              <Link href="/company/contacts" className="hover:text-green-400 transition">
                Contact
              </Link>
            </li>

            <li>
              <Link href="/legal/privacy-policy" className="hover:text-green-400 transition">
                Privacy Policy
              </Link>
            </li>

            <li>
              <Link href="/legal/terms" className="hover:text-green-400 transition">
                Terms of Service
              </Link>
            </li>

          </ul>
        </div>

        {/* NEW: Newsletter column (replace one of the 3 if you want) */}
        <div className="lg:col-span-1">
          <h3 className="font-semibold mb-5 text-foreground">
            Stay in the loop
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Get product updates, growth tips, and feature drops straight to your inbox.
          </p>

          <form onSubmit={handleSubscribe} className="space-y-2">
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-border bg-card/40 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/40"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-green-500 text-sm font-medium py-2.5 text-black hover:bg-green-400 transition disabled:opacity-50"
            >
              {loading ? "Subscribing…" : "Subscribe"}
            </button>
          </form>

          <p className="mt-2 text-[11px] text-muted-foreground">
            No spam. One‑click unsubscribe in every email.
          </p>
        </div>
      </div>

      {/* ================= BOTTOM ================= */}
      <div className="border-t border-border">

        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">

          <p className="text-sm text-muted-foreground text-center md:text-left">
            © {new Date().getFullYear()} SkillPulse Designed for people obsessed with growth.
          </p>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">

            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />

            Crafted by{" "}
            <span className="text-green-500 font-medium">
              HejiDev
            </span>

          </div>

        </div>

      </div>

    </footer >
  );
}