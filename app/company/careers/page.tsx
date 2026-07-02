"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Footer from "@/components/footer";

const jobs = [
  {
    title: "Frontend Engineer",
    company: "Paystack",
    type: "Remote",
    stack: "React · TypeScript",
    status: "NEW",
  },
  {
    title: "UI/UX Designer",
    company: "Startups Africa",
    type: "Hybrid",
    stack: "Figma · Design Systems",
    status: "HOT",
  },
  {
    title: "AI Product Engineer",
    company: "Tech Labs",
    type: "Remote",
    stack: "AI · Next.js · APIs",
    status: "TRENDING",
  },
];

const pathways = [
  {
    title: "Frontend Developer Path",
    desc: "Master React, Next.js, and modern UI systems",
  },
  {
    title: "UI/UX Designer Path",
    desc: "Learn design systems, UX thinking, and prototyping",
  },
  {
    title: "AI Engineer Path",
    desc: "Build AI-powered apps and automation systems",
  },
];

const insights = [
  "React + Next.js is #1 in demand",
  "Remote jobs increased by 42%",
  "AI Engineers salary growing fast",
  "TypeScript now industry standard",
];

export default function CareersPage() {
  const [query, setQuery] = useState("");

  const filteredJobs = jobs.filter((job) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      job.title.toLowerCase().includes(q) ||
      job.company.toLowerCase().includes(q) ||
      job.stack.toLowerCase().includes(q) ||
      job.type.toLowerCase().includes(q)
    );
  });

  return (
    <>
      <section className="relative overflow-hidden py-20 px-6 bg-background text-foreground">

        {/* GLOW BACKGROUND */}
        <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-transparent blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto space-y-20">

          {/* ================= HERO ================= */}
          <div className="text-center max-w-4xl mx-auto">

            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Career Intelligence
              <span className="block text-primary">
                & Opportunity Engine
              </span>
            </h1>

            <p className="mt-6 text-muted-foreground text-lg">
              Discover real opportunities, career insights, and high-growth roles tailored to your skill journey.
            </p>

            {/* SEARCH */}
            <div className="mt-10 flex flex-col md:flex-row gap-4">

              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search jobs, skills, companies..."
                className="flex-1 px-5 py-4 rounded-2xl border border-border bg-card/40 backdrop-blur-xl"
              />

              <button type="button" onClick={() => filteredJobs} className="px-8 py-4 rounded-2xl bg-primary text-primary-foreground">
                Search
              </button>

            </div>

            <p className="mt-2 text-xs text-muted-foreground">
              Careers engine in alpha · Full matching experience coming soon
            </p>
            {/* <p className="mt-4 text-sm text-muted-foreground">
              🔥 1,240 active opportunities available now
            </p> */}

          </div>


          {/* ================= JOB FEED ================= */}
          <div>
            <h2 className="text-3xl font-bold mb-8">🔥 Live Opportunities</h2>

            <div className="grid md:grid-cols-3 gap-6">
              {jobs.map((job, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.03 }}
                  className="p-6 rounded-2xl border border-border bg-card/40 backdrop-blur-xl"
                >

                  <div className="flex justify-between">
                    <h3 className="font-bold">{job.title}</h3>
                    <span className="text-xs text-primary">
                      {job.status}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground mt-2">
                    {job.company}
                  </p>

                  <p className="text-sm mt-2">{job.type}</p>

                  <p className="text-xs text-muted-foreground mt-2">
                    {job.stack}
                  </p>

                  <button
                    onClick={() =>
                      window.location.href = `mailto:careers@yourdomain.com?subject=${encodeURIComponent(
                        job.title
                      )} at ${job.company}`
                    }
                    className="mt-5 w-full py-2 rounded-xl bg-brand text-foreground"
                  >
                    Apply Now
                  </button>

                </motion.div>
              ))}
            </div>
          </div>

          {/* ================= CAREER PATHWAYS ================= */}
          <div>
            <h2 className="text-3xl font-bold mb-8">🧭 Career Pathways</h2>

            <div className="grid md:grid-cols-3 gap-6">
              {pathways.map((p, i) => (
                <div
                  key={i}
                  className="p-6 rounded-2xl border border-border bg-card/40"
                >
                  <h3 className="font-bold text-xl">{p.title}</h3>
                  <p className="text-muted-foreground mt-3 text-sm">
                    {p.desc}
                  </p>

                  <button className="mt-5 text-sm text-primary">
                    Explore Path →
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* ================= INSIGHTS ================= */}
          <div>
            <h2 className="text-3xl font-bold mb-8">📊 Career Intelligence</h2>

            <div className="grid md:grid-cols-2 gap-6">

              <div className="p-6 rounded-2xl border border-border bg-card/40">
                <h3 className="font-bold mb-4">🔥 Market Trends</h3>

                <ul className="space-y-3 text-sm text-muted-foreground">
                  {insights.map((i, idx) => (
                    <li key={idx}>• {i}</li>
                  ))}
                </ul>
              </div>

              <div className="p-6 rounded-2xl border border-border bg-card/40">
                <h3 className="font-bold mb-4">💡 Smart Recommendation</h3>

                <p className="text-muted-foreground text-sm">
                  Based on your skill progress, you should focus on
                  <span className="text-primary font-semibold"> React + TypeScript + AI APIs</span> to unlock higher-paying roles.
                </p>

                <button className="mt-5 px-5 py-2 rounded-xl bg-primary text-white text-sm">
                  View Learning Plan
                </button>
              </div>

            </div>
          </div>

          {/* ================= CTA ================= */}
          <div className="text-center p-16 rounded-3xl border border-border bg-card/40 backdrop-blur-xl">

            <h2 className="text-4xl font-bold">
              Your Career Growth Starts Here
            </h2>

            <p className="mt-4 text-muted-foreground">
              Don’t just learn skills — turn them into real opportunities.
            </p>

            <button className="mt-8 px-8 py-4 rounded-2xl bg-primary text-white">
              Explore All Opportunities
            </button>

          </div>

        </div>
      </section>
      <Footer />
    </>
  );
}