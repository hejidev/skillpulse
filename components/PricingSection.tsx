// components/PricingSection.tsx
"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown } from "lucide-react";
import { motion } from "framer-motion";

type PlanId = "free" | "starter" | "pro" | "enterprise";

interface Plan {
  id: PlanId;
  name: string;
  priceNGN: number;
  interval: "month";
  maxSkills: number | null;
  maxLevel: "Beginner" | "Intermediate" | "Advanced";
  monthlyHoursLimit: number | null;
}

const perksByPlan: Record<PlanId, string[]> = {
  free: [
    "Up to 3 skills",
    "Track up to Intermediate level",
    "10 learning hours per month",
    "Basic analytics",
  ],
  starter: [
    "Up to 10 skills",
    "Advanced level tracking",
    "40 learning hours per month",
    "AI insights & streak engine",
  ],
  pro: [
    "Unlimited skills",
    "Advanced level & mastery analytics",
    "200+ learning hours per month",
    "Full AI coach + deep research",
  ],
  enterprise: [
    "Unlimited skills & hours",
    "Teams & reporting dashboards",
    "Custom onboarding & SLAs",
    "Dedicated success engineer",
  ],
};

interface PricingSectionProps {
  isAuthenticated: boolean;
  currentPlanId?: PlanId; // only meaningful when authenticated
  onSelectPlan?: (planId: PlanId) => void;
}

export function PricingSection({
  isAuthenticated,
  currentPlanId = "free",
  onSelectPlan,
}: PricingSectionProps) {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await API.get("/billing/plans");
        setPlans(res.data);
      } catch (err) {
        console.error("Landing billing load error:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <section className="max-w-7xl mx-auto mt-16 px-4" id="pricing">
      <div className="mx-auto max-w-6xl text-center mb-8">
        <h2 className="text-3xl font-bold tracking-tight">
          Simple, transparent pricing
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Start free, then upgrade only when you are ready.
        </p>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card
              key={i}
              className="h-full animate-pulse border-border/30 border bg-card/60 p-6"
            >
              <div className="h-4 w-20 rounded bg-muted" />
              <div className="mt-4 h-7 w-24 rounded bg-muted" />
              <div className="mt-6 space-y-2">
                <div className="h-3 w-full rounded bg-muted" />
                <div className="h-3 w-5/6 rounded bg-muted" />
                <div className="h-3 w-4/6 rounded bg-muted" />
              </div>
              <div className="mt-6 h-9 w-full rounded bg-muted" />
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => {
            const isCurrent = isAuthenticated && currentPlanId === plan.id;
            const isPopular = plan.id === "pro";
            const perks = perksByPlan[plan.id] || [];

            // Decide CTA label based on auth & plan
            let ctaLabel = "Get started";
            if (isAuthenticated) {
              if (plan.id === "free") ctaLabel = isCurrent ? "Current plan" : "Stay on Free";
              else ctaLabel = isCurrent ? "Current plan" : `Upgrade to ${plan.name}`;
            }

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: plan.id === "free" ? 0 : 0.05 }}
              >
                <Card
                  className={`relative flex h-full flex-col overflow-hidden border border-border/30 bg-card/60 p-6 backdrop-blur-xl ${
                    isCurrent
                      ? "ring-2 ring-primary/60 shadow-lg shadow-primary/20"
                      : ""
                  }`}
                >
                  {/* gradient */}
                  {/* ... same gradient code as in BillingPage ... */}

                  <div className="relative flex flex-col gap-4">
                    {/* Top row */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold">{plan.name}</p>
                        {isCurrent && (
                          <Badge className="border-primary/40 bg-primary/10 text-[10px] uppercase text-primary">
                            Current
                          </Badge>
                        )}
                        {isPopular && !isCurrent && (
                          <Badge className="border-amber-500/40 bg-amber-500/10 text-[10px] uppercase text-amber-300">
                            Most popular
                          </Badge>
                        )}
                      </div>
                      {plan.id === "pro" && (
                        <Crown className="h-4 w-4 text-primary" />
                      )}
                    </div>

                    {/* Price */}
                    <div>
                      <p className="text-2xl font-bold">
                        ₦{plan.priceNGN.toLocaleString("en-NG")}
                        <span className="text-xs font-normal text-muted-foreground">
                          /{plan.interval}
                        </span>
                      </p>
                    </div>

                    {/* Limits */}
                    {/* ... same as BillingPage ... */}

                    {/* Perks */}
                    <ul className="mb-4 mt-2 flex-1 space-y-2 text-xs text-muted-foreground">
                      {perks.map((perk) => (
                        <li key={perk} className="flex items-center gap-2">
                          <Check className="h-3 w-3 text-primary" />
                          <span>{perk}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <Button
                      className="w-full rounded-2xl text-xs bg-brand cursor-pointer text-foreground font-semibold"
                      variant={isCurrent ? "outline" : "default"}
                      disabled={isCurrent}
                      onClick={() => {
                        if (!onSelectPlan) return;
                        onSelectPlan(plan.id);
                      }}
                    >
                      {ctaLabel}
                    </Button>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
  );
}