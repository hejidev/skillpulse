"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createTicket } from "@/lib/api/tickets";

import Footer from "@/components/footer";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      const res = await createTicket({
        name: form.name,
        email: form.email,
        subject: form.subject,
        message: form.message,
        priority: "medium",
        category: "general",
      });

      if (res.success) {
        toast.success("Ticket created successfully 🚀");
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        toast.error("Failed to create ticket");
      }
    } catch (err: any) {
      toast.error(
        err.message || "Something went wrong"
      );

      console.log(err);
    }
  };

  return (
    <>
    <section className="relative overflow-hidden py-24 px-0 bg-background text-foreground">

      {/* GLOBAL GLOW LAYER */}
      <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-transparent blur-3xl" />

      <div className="relative max-w-7xl px-7 mx-auto space-y-20">

        {/* ================= HERO ================= */}
        <div className="text-center max-w-3xl mx-auto">

          <Badge className="mb-6 px-4 py-2">
            Support Intelligence Center
          </Badge>

          <h1 className="text-3xl md:text-6xl font-bold leading-tight">
            Talk to SkillPulse
            <span className="block text-primary">
              We Respond Fast
            </span>
          </h1>

          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            Whether it’s a bug, idea, collaboration, or account issue —
            our system routes your message instantly to the right team.
          </p>

        </div>

        {/* ================= CORE GRID ================= */}
        <div className="grid lg:grid-cols-3 gap-8">

          {/* ===== LEFT: FORM (2 columns) ===== */}
          <motion.div className="lg:col-span-2" whileHover={{ y: -3 }}>

            <Card className="relative overflow-hidden p-3 bg-card/40 backdrop-blur-xl border-border/50">

              {/* glow accent */}
              <div className="absolute w-full inset-0 bg-linear-to-br from-primary/10 via-transparent to-transparent pointer-events-none" />


              <form className="contents relative space-y-5" onSubmit={handleSubmit}>
                <div>
                  <h2 className="text-2xl font-bold">Send a Message</h2>
                  <p className="text-sm text-muted-foreground">
                    Your request becomes a tracked support ticket instantly.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Full Name"
                  />

                  <Input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email Address"
                  />

                </div>

                <Input
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="Subject (auto-routed)"
                />

                <Textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Describe your issue..."
                  className="min-h-35"
                />

                {/* PRIORITY STRIP */}
                <div className="flex flex-wrap gap-2 text-xs">
                  <Badge variant="outline">Low</Badge>
                  <Badge variant="outline">Medium</Badge>
                  <Badge variant="outline">High</Badge>
                  <Badge className="bg-red-500/10 text-red-400">Urgent</Badge>
                </div>

                <Button className="w-full text-base text-foreground font-semibold bg-brand" type="submit">
                  Submit Support Ticket
                </Button>
              </form>
            </Card>
          </motion.div>

          {/* ===== RIGHT: INTELLIGENCE PANEL ===== */}
          <div className="space-y-5">

            {/* AI BOX */}
            <Card className="p-5 bg-card/40 backdrop-blur-xl border-border/30">
              <h3 className="font-semibold">🤖 AI Support Assistant</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Ask before submitting — get instant help.
              </p>

              <div className="mt-4 p-3 rounded-xl bg-background border border-border/30 text-sm text-muted-foreground">
                Try: “login issue”, “payment failed”, “reset password”
              </div>
            </Card>

            {/* SUPPORT STATUS */}
            <Card className="p-5 bg-card/40 backdrop-blur-xl">
              <h3 className="font-semibold">⚡ System Status</h3>
              <p className="text-sm text-green-400 mt-2">
                All systems operational
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Avg response: 6–12 hours
              </p>
            </Card>

            {/* QUICK ACTIONS */}
            <Card className="p-5 space-y-2 border border-border/30 bg-card/40 backdrop-blur-xl">

              <h3 className="font-semibold mb-2">⚡ Quick Actions</h3>

              {[
                "Report Bug",
                "Account Issue",
                "Feature Request",
                "Billing Help",
              ].map((item) => (
                <Button
                  key={item}
                  variant="outline"
                  className="w-full justify-start"
                >
                  {item}
                </Button>
              ))}

            </Card>

          </div>

        </div>

        {/* ================= SUPPORT CHANNELS ================= */}
        <div className="grid md:grid-cols-3 gap-6">

          {[
            {
              title: "Email Support",
              desc: "Direct human support channel",
            },
            {
              title: "Help Center",
              desc: "Instant self-service answers",
            },
            {
              title: "Community Help",
              desc: "Get answers from users",
            },
          ].map((c, i) => (
            <Card
              key={i}
              className="p-6 bg-card/40 backdrop-blur-xl hover:bg-accent transition"
            >
              <h3 className="font-semibold">{c.title}</h3>
              <p className="text-sm text-muted-foreground mt-2">
                {c.desc}
              </p>
            </Card>
          ))}

        </div>

        {/* ================= FINAL CTA ================= */}
        <Card className="p-10 text-center bg-card/40 backdrop-blur-xl">

          <h2 className="text-3xl font-bold">
            Need Faster Help?
          </h2>

          <p className="text-muted-foreground mt-3">
            Visit our Help Center or join the community for instant answers.
          </p>

          <div className="mt-4 flex justify-center gap-4">

            <Link href="/company/help">
              <Button>Help Center</Button>
            </Link>

            <Button variant="outline">
              Join Community
            </Button>

          </div>

        </Card>

      </div>
    </section>
    <Footer />
    </>
  );
}