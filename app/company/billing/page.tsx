"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
    Check,
    Crown,
    Info,
    Loader2,
    Sparkles,
    Zap,
    ArrowRight,
    Shield,
    Clock,
    BarChart3,
} from "lucide-react";
import { motion } from "framer-motion";
import PageSkeleton from "@/components/PageSkeleton";
import Footer from "@/components/footer";

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

interface MySubscription {
    plan: PlanId;
    premium: boolean;
    billing?: {
        status?: string;
        currentPeriodEnd?: string;
    };
    // optional usage snapshot from backend if you want
    usage?: {
        totalSkills: number;
        monthHours: number;
    };
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

export default function BillingPage() {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [me, setMe] = useState<MySubscription | null>(null);
    const [loading, setLoading] = useState(true);
    const [changingPlan, setChangingPlan] = useState<PlanId | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const [plansRes, meRes] = await Promise.all([
                    API.get("/billing/plans"),
                    API.get("/billing/me"),
                ]);

                setPlans(plansRes.data);
                setMe(meRes.data);
            } catch (err: any) {
                console.error("Billing load error:", err);
                setError(
                    err.response?.data?.message || "Failed to load billing information."
                );
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const handleChangePlan = async (planId: PlanId) => {
        if (!me || planId === me.plan) return;

        setError(null);
        setSuccess(null);
        setChangingPlan(planId);

        try {
            // 1. Downgrade to free: no Paystack, just internal change
            if (planId === "free") {
                const res = await API.post("/billing/change-plan", { planId });
                setMe((prev) =>
                    prev ? { ...prev, plan: res.data.plan, premium: res.data.premium } : prev
                );
                setSuccess(`Your plan has been updated to ${planId.toUpperCase()}.`);
                return;
            }

            if (planId === "enterprise") {
                setError("Contact sales to activate an Enterprise plan.");
                return;
            }

            // 2. Paid upgrade (starter/pro): go through Paystack
            const initRes = await API.post("/billing/initialize-upgrade", { planId });

            const { authorizationUrl } = initRes.data;
            if (!authorizationUrl) {
                throw new Error("Missing Paystack authorization URL");
            }

            // Option A: hard redirect to Paystack hosted checkout
            window.location.href = authorizationUrl;

            // Option B (later): use Paystack Inline instead of full redirect
        } catch (err: any) {
            console.error("Change plan error:", err);
            setError(
                err.response?.data?.message || "Unable to change plan right now."
            );
        } finally {
            setChangingPlan(null);
        }
    };

    const currentPlanId = me?.plan || "free";
    const currentPlan = plans.find((p) => p.id === currentPlanId);

    const usedSkills = me?.usage?.totalSkills ?? 0;
    const usedHours = me?.usage?.monthHours ?? 0;
    const skillsLimit = currentPlan?.maxSkills ?? null;
    const hoursLimit = currentPlan?.monthlyHoursLimit ?? null;

    const skillsPercent =
        skillsLimit && skillsLimit > 0
            ? Math.min(100, (usedSkills / skillsLimit) * 100)
            : 0;
    const hoursPercent =
        hoursLimit && hoursLimit > 0
            ? Math.min(100, (usedHours / hoursLimit) * 100)
            : 0;

    if (loading) {
        return <PageSkeleton />;
    }

    return (
        <main className="min-h-[80vh] bg-background px-4 py-20 text-foreground space-y-10">
            <div className="mx-auto flex max-w-7xl px-7 flex-col gap-10">
                {/* HEADER */}
                <section className="space-y-4">
                    <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/40 px-3 py-1 text-[15px] text-muted-foreground backdrop-blur-xl">
                        <Sparkles className="h-3 w-3 text-primary" />
                        <span>Skill Engine Billing</span>
                    </div>

                    <div className="flex flex-wrap items-end justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                                Power up your learning stack
                            </h1>
                            <p className="mt-2 max-w-2xl text-md text-muted-foreground">
                                Manage your subscription, see usage, and unlock more capacity as
                                you level up your skills.
                            </p>
                        </div>

                        {me?.billing?.status && (
                            <div className="rounded-xl border border-border/30 bg-card/40 px-4 py-2 text-sm text-muted-foreground backdrop-blur-xl">
                                <div className="flex items-center gap-2">
                                    <Shield className="h-3 w-3 text-emerald-400" />
                                    <span className="font-bold capitalize">
                                        {me.billing.status}
                                    </span>
                                </div>
                                {me.billing.currentPeriodEnd && (
                                    <p className="mt-1 text-xs">
                                        Renews on{" "}
                                        {new Date(
                                            me.billing.currentPeriodEnd
                                        ).toLocaleDateString()}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </section>

                {error && (
                    <Alert variant="destructive">
                        <AlertTitle>Billing issue</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {success && (
                    <Alert>
                        <AlertTitle>Plan updated</AlertTitle>
                        <AlertDescription>{success}</AlertDescription>
                    </Alert>
                )}

                {/* TOP GRID: CURRENT PLAN + USAGE + INSIGHT */}
                <section className="grid gap-6 md:grid-cols-[1.4fr,1.1fr]">
                    {/* Current plan / usage */}
                    <Card className="relative overflow-hidden border border-border/30 bg-card/40 p-4 backdrop-blur-xl">
                        <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-emerald-500/10 opacity-80" />
                        <div className="relative flex flex-col gap-4">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Current plan</p>
                                    <div className="mt-1 flex items-center gap-2">
                                        <h2 className="text-xl font-semibold capitalize">
                                            {currentPlan?.name || currentPlanId}
                                        </h2>
                                        <Badge className="border-primary/40 bg-primary/10 text-[10px] uppercase text-primary">
                                            Active
                                        </Badge>
                                        {currentPlanId === "pro" && (
                                            <Crown className="h-4 w-4 text-primary" />
                                        )}
                                    </div>
                                </div>

                                {currentPlan && (
                                    <div className="text-right">
                                        <p className="text-sm text-muted-foreground">
                                            Billing amount
                                        </p>
                                        <p className="text-lg font-semibold">
                                            ₦{currentPlan.priceNGN.toLocaleString("en-NG")}
                                            <span className="text-sm font-normal text-muted-foreground">
                                                /{currentPlan.interval}
                                            </span>
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Usage bars */}
                            <div className="mt-4 grid gap-4 md:grid-cols-2">
                                <div>
                                    <div className="flex items-center justify-between text-sm mb-1">
                                        <span>Skills used</span>
                                        <span className="text-muted-foreground">
                                            {skillsLimit
                                                ? `${usedSkills}/${skillsLimit}`
                                                : `${usedSkills}`}
                                        </span>
                                    </div>
                                    <Progress
                                        value={skillsLimit ? skillsPercent : 0}
                                        className="h-2"
                                    />
                                </div>

                                <div>
                                    <div className="flex items-center justify-between text-sm mb-1">
                                        <span>Hours this month</span>
                                        <span className="text-muted-foreground">
                                            {hoursLimit
                                                ? `${usedHours.toFixed(1)}/${hoursLimit} hrs`
                                                : `${usedHours.toFixed(1)} hrs`}
                                        </span>
                                    </div>
                                    <Progress
                                        value={hoursLimit ? hoursPercent : 0}
                                        className="h-2"
                                    />
                                </div>
                            </div>

                            {/* Small “intelligence” row */}
                            <div className="mt-3 grid gap-3 text-sm md:grid-cols-3">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Zap className="h-3 w-3 text-primary" />
                                    <span>
                                        Upgrade your plan if you routinely hit your monthly hours
                                        limit.
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Clock className="h-3 w-3 text-emerald-400" />
                                    <span className="text-md">Streak and XP systems are always active.</span>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <BarChart3 className="h-3 w-3 text-cyan-400" />
                                    <span className="text-md">More advanced analytics unlock with higher tiers.</span>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Plan intelligence / recommendation */}
                    <Card className="border border-border/30 bg-card/40 p-5 backdrop-blur-xl">
                        <div className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-primary" />
                            <h2 className="text-lg font-semibold">Plan intelligence</h2>
                        </div>
                        <p className="mt-2 text-lg text-muted-foreground">
                            Based on your current usage, we recommend the plan that keeps you
                            within limits and leaves room to grow.
                        </p>

                        <div className="mt-4 space-y-2 text-sm">
                            <p>
                                • If you create many skills or log long sessions,{" "}
                                <span className="font-semibold text-brand">Pro</span> prevents
                                hitting caps.
                            </p>
                            <p>
                                • If you&apos;re still exploring,{" "}
                                <span className="font-semibold text-brand">Starter</span>{" "}
                                balances cost with capacity.
                            </p>
                            <p>
                                • You can downgrade anytime before renewal.
                            </p>
                        </div>

                        <Button
                            variant="outline"
                            size="sm"
                            className="mt-4 w-full text-sm border border-border/30 py-5 cursor-pointer"
                            onClick={() => {
                                const anchor = document.getElementById("plans-grid");
                                if (anchor) anchor.scrollIntoView({ behavior: "smooth" });
                            }}
                        >
                            Explore plans
                            <ArrowRight className="ml-1 h-4 w-4" />
                        </Button>
                    </Card>
                </section>

                {/* PLANS GRID */}
                <section id="plans-grid">
                    {loading ? (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <Card
                                    key={i}
                                    className="h-full animate-pulse border-border/30 bg-card/60 p-6"
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
                                const isCurrent = currentPlanId === plan.id;
                                const isPopular = plan.id === "pro";
                                const perks = perksByPlan[plan.id] || [];

                                return (
                                    <motion.div
                                        key={plan.id}
                                        initial={{ opacity: 0, y: 16 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: plan.id === "free" ? 0 : 0.05 }}
                                    >
                                        <Card
                                            className={`relative flex h-full flex-col overflow-hidden border border-border/30 bg-card/60 p-6 backdrop-blur-xl ${isCurrent
                                                    ? "ring-2 ring-primary/60 shadow-lg shadow-primary/20"
                                                    : ""
                                                }`}
                                        >
                                            <div
                                                className={`pointer-events-none absolute inset-0 bg-linear-to-br ${plan.id === "free"
                                                        ? "from-slate-700/20 via-transparent to-slate-900/40"
                                                        : plan.id === "starter"
                                                            ? "from-emerald-500/10 via-transparent to-emerald-500/20"
                                                            : plan.id === "pro"
                                                                ? "from-violet-500/15 via-transparent to-blue-500/20"
                                                                : "from-amber-500/15 via-transparent to-amber-700/20"
                                                    }`}
                                            />
                                            <div className="relative flex flex-col gap-4">
                                                {/* Top row */}
                                                <div className="flex items-center justify-between gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-sm font-semibold">
                                                            {plan.name}
                                                        </p>
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
                                                        <span className="text-sm font-semibold text-muted-foreground">
                                                            /{plan.interval}
                                                        </span>
                                                    </p>
                                                </div>

                                                {/* Limits */}
                                                <div className="space-y-1 text-sm text-muted-foreground">
                                                    <p>
                                                        Skills:{" "}
                                                        <span className="font-semibold text-foreground">
                                                            {plan.maxSkills === null
                                                                ? "Unlimited"
                                                                : plan.maxSkills}
                                                        </span>
                                                    </p>
                                                    <p>
                                                        Levels up to:{" "}
                                                        <span className="font-semibold text-foreground">
                                                            {plan.maxLevel}
                                                        </span>
                                                    </p>
                                                    <p>
                                                        Monthly hours:{" "}
                                                        <span className="font-semibold text-foreground">
                                                            {plan.monthlyHoursLimit === null
                                                                ? "Unlimited"
                                                                : `${plan.monthlyHoursLimit} hrs`}
                                                        </span>
                                                    </p>
                                                </div>

                                                {/* Perks */}
                                                <ul className="mb-4 mt-2 flex-1 space-y-2 text-sm text-muted-foreground">
                                                    {perks.map((perk) => (
                                                        <li key={perk} className="flex items-center gap-2">
                                                            <Check className="h-3 w-3 text-primary" />
                                                            <span>{perk}</span>
                                                        </li>
                                                    ))}
                                                </ul>

                                                {/* CTA */}
                                                <Button
                                                    variant={isCurrent ? "outline" : "default"}
                                                    className="w-full rounded-2xl text-sm font-medium cursor-pointer"
                                                    disabled={isCurrent || !!changingPlan}
                                                    onClick={() => handleChangePlan(plan.id)}
                                                >
                                                    {isCurrent ? (
                                                        "Current plan"
                                                    ) : changingPlan === plan.id ? (
                                                        <>
                                                            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                                                            Updating…
                                                        </>
                                                    ) : plan.id === "free" ? (
                                                        "Stay on Free"
                                                    ) : (
                                                        `Upgrade to ${plan.name}`
                                                    )}
                                                </Button>
                                            </div>
                                        </Card>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </section>

                {/* FOOTNOTE */}
                <section className="mt-2 flex items-start gap-2 text-xs text-muted-foreground">
                    <Info className="mt-0.5 h-3 w-3" />
                    <p>
                        Billing is handled securely via Paystack. You can upgrade, downgrade,
                        or cancel anytime. We&apos;ll always show your current plan and
                        renewal date clearly.
                    </p>
                </section>
            </div>

            <Footer/>
        </main>
    );
}