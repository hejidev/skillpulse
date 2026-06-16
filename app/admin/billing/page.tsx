"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    ArrowUpDown,
    Crown,
    Loader2,
    ShieldAlert,
    Users,
    CreditCard,
    TrendingUp,
    AlertTriangle,
    BarChart3,
    Wallet,
    Zap,
    Clock,
} from "lucide-react";
import { motion } from "framer-motion";

type PlanId = "free" | "starter" | "pro" | "enterprise";

interface RevenueImpactThisMonth {
    totalDeltaNGN: number;
    upgradesNGN: number;
    downgradesNGN: number;
}

interface Overview {
    totalsByPlan: Record<PlanId, number>;
    estimatedMRR?: number;
    revenueImpactThisMonth?: RevenueImpactThisMonth;
}

interface BillingUser {
    _id: string;
    name: string;
    email: string;
    plan: PlanId;
    totalSkills: number;
    monthHours: number;
    billingStatus?: string;
}

interface BillingEvent {
    id: string;
    userId: string;
    userName: string;
    userEmail: string;
    oldPlan: PlanId;
    newPlan: PlanId;
    amountDeltaNGN: number;
    reason: string;
    createdAt: string;
    meta?: {
        source?: "paystack" | "wallet" | "admin";
        pointsSpent?: number;
    };
}

const planLabel: Record<PlanId, string> = {
    free: "Free",
    starter: "Starter",
    pro: "Pro",
    enterprise: "Enterprise",
};

const planColor: Record<PlanId, string> = {
    free: "bg-slate-700/30 text-slate-100 border-slate-600/40",
    starter: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    pro: "bg-primary/10 text-primary border-primary/30",
    enterprise: "bg-amber-500/10 text-amber-400 border-amber-500/40",
};

interface AdminPlan {
    planId: PlanId;
    name: string;
    priceNGN: number;
    active: boolean;
}

const PLANS_FALLBACK: Record<
    PlanId,
    { name: string; priceNGN: number }
> = {
    free: { name: "Free", priceNGN: 0 },
    starter: { name: "Starter", priceNGN: 7000 },
    pro: { name: "Pro", priceNGN: 31500 },
    enterprise: { name: "Enterprise", priceNGN: 0 },
};

export default function AdminBillingPage() {
    const [overview, setOverview] = useState<Overview | null>(null);
    const [users, setUsers] = useState<BillingUser[]>([]);

    const [events, setEvents] = useState<BillingEvent[]>([]);

    const [plans, setPlans] = useState<AdminPlan[]>([]);

    const [savingPlanId, setSavingPlanId] = useState<PlanId | null>(null);

    const [loading, setLoading] = useState(true);
    const [changingUserId, setChangingUserId] = useState<string | null>(null);

    const ALL_PLAN_IDS: PlanId[] = ["free", "starter", "pro", "enterprise"];

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const [overviewRes, usersRes, eventsRes, plansRes] = await Promise.all([
                    API.get("/admin/billing/overview"),
                    API.get("/admin/billing/users"),
                    API.get("/admin/billing/events"),
                    API.get("/admin/billing/plans"), // returns [{ planId, name, priceNGN, active }]
                ]);

                setOverview(overviewRes.data);
                setUsers(usersRes.data);
                setEvents(eventsRes.data.events || []);

                const plansFromDb: AdminPlan[] = plansRes.data;
                const byId = new Map(plansFromDb.map((p) => [p.planId, p]));

                const normalized: AdminPlan[] = ALL_PLAN_IDS.map((id) => {
                    const existing = byId.get(id);
                    if (existing) return existing;

                    const cfg = PLANS_FALLBACK[id]; // <— use local fallback
                    return {
                        planId: id,
                        name: cfg.name,
                        priceNGN: cfg.priceNGN,
                        active: true,
                    };
                });

                setPlans(normalized);
            } catch (err) {
                console.error("Admin billing load error:", err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const handleAdminChangePlan = async (userId: string, planId: PlanId) => {
        setChangingUserId(userId);


        try {
            await API.post(`/admin/billing/users/${userId}/change-plan`, { planId });
            setUsers((prev) =>
                prev.map((u) => (u._id === userId ? { ...u, plan: planId } : u))
            );
        } catch (err) {
            console.error("Admin change plan error:", err);
        } finally {
            setChangingUserId(null);
        }
    };

    const handleSavePlan = async (plan: AdminPlan) => {
        try {
            setSavingPlanId(plan.planId);
            await API.post("/admin/billing/plans", {
                planId: plan.planId,
                name: plan.name,
                priceNGN: plan.priceNGN,
                active: plan.active,
            }); // hits upsertPlan
        } catch (err) {
            console.error("Save plan error:", err);
            // optional: toast error
        } finally {
            setSavingPlanId(null);
        }
    };

    const totalUsers = users.length || 0;
    const freeUsers = overview?.totalsByPlan?.free ?? 0;
    const starterUsers = overview?.totalsByPlan?.starter ?? 0;
    const proUsers = overview?.totalsByPlan?.pro ?? 0;
    const enterpriseUsers = overview?.totalsByPlan?.enterprise ?? 0;

    const paidUsers = starterUsers + proUsers + enterpriseUsers;
    const paidRatio =
        totalUsers > 0 ? Math.round((paidUsers / totalUsers) * 100) : 0;

    const revenue = overview?.revenueImpactThisMonth;

    return (
        <div className="mt-10 space-y-10">
            {/* =============== HEADER =============== */}
            <div>
                <h1 className="text-4xl font-bold tracking-tight">
                    Billing Intelligence Center
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    Monitor subscription health, plan mix, and revenue signals across your
                    user base.
                </p>
            </div>

            {/* =============== KPI STRIP =============== */}
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                <KpiCard
                    title="Total Subscribers"
                    value={totalUsers.toLocaleString()}
                    icon={<Users />}
                    trend={paidRatio ? `${paidRatio}% paid` : "—"}
                    glow="from-cyan-500/20"
                />
                <KpiCard
                    title="Free Tier"
                    value={freeUsers.toLocaleString()}
                    icon={<ShieldAlert />}
                    trend="Freemium funnel"
                    glow="from-slate-500/20"
                />
                <KpiCard
                    title="Pro & Starter"
                    value={paidUsers.toLocaleString()}
                    icon={<TrendingUp />}
                    trend="Monetized users"
                    glow="from-emerald-500/20"
                />
                <KpiCard
                    title="Billing Health"
                    value={overview?.estimatedMRR ? "Stable" : "Beta"}
                    icon={<CreditCard />}
                    trend="Paystack integration"
                    glow="from-violet-500/20"
                />

                <KpiCard
                    title="Net Revenue Change"
                    value={
                        revenue
                            ? `₦${revenue.totalDeltaNGN.toLocaleString("en-NG")}`
                            : "₦0"
                    }
                    icon={<TrendingUp />}
                    trend={
                        revenue
                            ? `Upgrades: ₦${revenue.upgradesNGN.toLocaleString(
                                "en-NG"
                            )} / Downgrades: ₦${Math.abs(
                                revenue.downgradesNGN
                            ).toLocaleString("en-NG")}`
                            : "No events"
                    }
                    glow="from-emerald-500/20"
                />
            </div>

            {/* =============== MAIN GRID =============== */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* LEFT PANEL (2 cols) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* PLAN DISTRIBUTION */}
                    <Card className="border border-border bg-card/40 p-6 backdrop-blur-xl hover:shadow-lg transition">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold">Plan Distribution</h2>
                            <Badge className="bg-primary/10 text-primary border-primary/20 text-[11px]">
                                Live Mix
                            </Badge>
                        </div>

                        <div className="mt-6 grid gap-4 md:grid-cols-4 text-center text-xs">
                            <PlanStat
                                label="Free"
                                value={freeUsers}
                                color="text-slate-200"
                                badge="Freemium"
                            />
                            <PlanStat
                                label="Starter"
                                value={starterUsers}
                                color="text-emerald-400"
                                badge="Growth"
                            />
                            <PlanStat
                                label="Pro"
                                value={proUsers}
                                color="text-primary"
                                badge="Power"
                            />
                            <PlanStat
                                label="Enterprise"
                                value={enterpriseUsers}
                                color="text-amber-400"
                                badge="Teams"
                            />
                        </div>

                        <div className="mt-6 grid gap-4 md:grid-cols-2 text-xs text-muted-foreground">
                            <div className="space-y-2">
                                <p className="font-medium text-foreground">Conversion Signals</p>
                                <p>
                                    • Track how many free users upgrade to Starter/Pro over time.
                                </p>
                                <p>
                                    • Use this to tune feature gates and upgrade prompts.
                                </p>
                            </div>
                            <div className="space-y-2">
                                <p className="font-medium text-foreground">Health Summary</p>
                                <p>
                                    • A higher Pro ratio generally means deeper product adoption.
                                </p>
                                <p>• Keep a healthy pipeline of Free users in the funnel.</p>
                            </div>
                        </div>
                    </Card>

                    {/* SUBSCRIBERS TABLE */}
                    <Card className="overflow-hidden border border-border bg-card/40 backdrop-blur-xl">
                        <div className="flex items-center justify-between border-b border-border bg-card/70 px-4 py-3">
                            <div>
                                <h2 className="text-sm font-semibold">Subscribers</h2>
                                <p className="text-[11px] text-muted-foreground">
                                    Live list of users with their plans, usage, and status.
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                size="xs"
                                className="flex items-center gap-1 text-[11px]"
                                disabled
                            >
                                <ArrowUpDown className="h-3 w-3" />
                                Sort & filters (soon)
                            </Button>
                        </div>

                        <div className="grid grid-cols-[1.6fr,1.2fr,1fr,1fr,1.4fr] border-b border-border bg-card/80 px-4 py-2 text-[11px] font-medium uppercase text-muted-foreground">
                            <span>User</span>
                            <span>Plan</span>
                            <span>Skills</span>
                            <span>Month hours</span>
                            <span>Status / actions</span>
                        </div>

                        {loading ? (
                            <div className="space-y-2 p-4 text-xs text-muted-foreground">
                                Loading billing data…
                            </div>
                        ) : users.length === 0 ? (
                            <div className="p-4 text-xs text-muted-foreground">
                                No subscribers found yet.
                            </div>
                        ) : (
                            <div className="divide-y divide-border">
                                {users.map((u) => (
                                    <motion.div
                                        key={u._id}
                                        initial={{ opacity: 0, y: 6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="grid grid-cols-[1.6fr,1.2fr,1fr,1fr,1.4fr] items-center px-4 py-2 text-xs"
                                    >
                                        {/* User */}
                                        <div className="flex flex-col">
                                            <span className="font-medium">{u.name}</span>
                                            <span className="text-[11px] text-muted-foreground">
                                                {u.email}
                                            </span>
                                        </div>

                                        {/* Plan */}
                                        <div>
                                            <span
                                                className={`inline-flex items-center gap-1 rounded-full border px-2 py-[3px] text-[10px] ${planColor[u.plan]}`}
                                            >
                                                {planLabel[u.plan]}
                                                {u.plan === "pro" && (
                                                    <Crown className="h-3 w-3" />
                                                )}
                                            </span>
                                        </div>

                                        {/* Skills */}
                                        <div>{u.totalSkills}</div>

                                        {/* Month hours */}
                                        <div>{u.monthHours.toFixed(1)} hrs</div>

                                        {/* Status + actions */}
                                        <div className="flex flex-wrap items-center gap-2">
                                            {u.billingStatus && (
                                                <span className="text-[10px] capitalize text-muted-foreground">
                                                    {u.billingStatus}
                                                </span>
                                            )}
                                            <div className="flex gap-1">
                                                {u.plan !== "free" && (
                                                    <Button
                                                        variant="outline"
                                                        size="xs"
                                                        className="text-[10px]"
                                                        disabled={changingUserId === u._id}
                                                        onClick={() =>
                                                            handleAdminChangePlan(u._id, "free")
                                                        }
                                                    >
                                                        {changingUserId === u._id ? (
                                                            <Loader2 className="h-3 w-3 animate-spin" />
                                                        ) : (
                                                            "Set Free"
                                                        )}
                                                    </Button>
                                                )}
                                                {u.plan !== "pro" && (
                                                    <Button
                                                        variant="outline"
                                                        size="xs"
                                                        className="text-[10px]"
                                                        disabled={changingUserId === u._id}
                                                        onClick={() =>
                                                            handleAdminChangePlan(u._id, "pro")
                                                        }
                                                    >
                                                        {changingUserId === u._id ? (
                                                            <Loader2 className="h-3 w-3 animate-spin" />
                                                        ) : (
                                                            "Set Pro"
                                                        )}
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </Card>

                    {/* PER-USER PAYMENTS TABLE */}
                    <Card className="overflow-hidden border border-border bg-card/40 backdrop-blur-xl">
                        <div className="flex items-center justify-between border-b border-border bg-card/70 px-4 py-3">
                            <div>
                                <h2 className="text-sm font-semibold">Recent Billing Events</h2>
                                <p className="text-[11px] text-muted-foreground">
                                    Per-user upgrades, downgrades, and manual plan changes.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-[1.8fr,1fr,1fr,1fr] border-b border-border bg-card/80 px-4 py-2 text-[11px] font-medium uppercase text-muted-foreground">
                            <span>User</span>
                            <span>Plan change</span>
                            <span>Amount</span>
                            <span>When</span>
                        </div>

                        {loading ? (
                            <div className="space-y-2 p-4 text-xs text-muted-foreground">
                                Loading billing events…
                            </div>
                        ) : events.length === 0 ? (
                            <div className="p-4 text-xs text-muted-foreground">
                                No billing events recorded yet.
                            </div>
                        ) : (
                            <div className="divide-y divide-border">
                                {events.map((e) => {
                                    const sourceLabel =
                                        e.meta?.source === "wallet"
                                            ? `Wallet (${e.meta.pointsSpent ?? 0} pts)`
                                            : e.meta?.source === "paystack"
                                                ? "Paystack"
                                                : e.meta?.source === "admin"
                                                    ? "Admin"
                                                    : e.reason;

                                    return (
                                        <motion.div
                                            key={e.id}
                                            initial={{ opacity: 0, y: 6 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="grid grid-cols-[1.8fr,1fr,1fr,1fr] items-center px-4 py-2 text-xs"
                                        >
                                            {/* User */}
                                            <div className="flex flex-col">
                                                <span className="font-medium">{e.userName}</span>
                                                <span className="text-[11px] text-muted-foreground">
                                                    {e.userEmail}
                                                </span>
                                            </div>

                                            {/* Plan change + source */}
                                            <div className="text-[11px]">
                                                <span className="font-medium">
                                                    {planLabel[e.oldPlan]} → {planLabel[e.newPlan]}
                                                </span>
                                                <span className="ml-2 text-[10px] text-muted-foreground">
                                                    {sourceLabel}
                                                </span>
                                            </div>

                                            {/* Amount */}
                                            <div className={e.amountDeltaNGN >= 0 ? "text-emerald-400" : "text-rose-400"}>
                                                ₦{e.amountDeltaNGN.toLocaleString("en-NG")}
                                            </div>

                                            {/* When */}
                                            <div className="text-[11px] text-muted-foreground">
                                                {new Date(e.createdAt).toLocaleString()}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}
                    </Card>
                </div>

                {/* RIGHT PANEL (1 col) */}
                <div className="space-y-6">
                    {/* Billing Intelligence */}
                    <Card className="border border-border bg-card/40 p-6 backdrop-blur-xl">
                        <div className="flex items-center gap-2">
                            <BarChart3 className="h-4 w-4 text-primary" />
                            <h2 className="text-lg font-semibold">Billing Intelligence</h2>
                        </div>

                        <div className="mt-4 space-y-3 text-xs text-muted-foreground">
                            <p>
                                • {paidUsers} users are on paid plans. Keep an eye on their
                                churn and upgrade paths.
                            </p>
                            <p>
                                • Free → Starter upgrades are your main revenue funnel. Test
                                prompts where free users hit limits.
                            </p>
                            <p>
                                • Pro users are your power users—consider early access features
                                or higher AI limits for them.
                            </p>
                        </div>
                    </Card>

                    {/* Revenue Snapshot (placeholder until you wire real MRR) */}
                    <Card className="border border-border bg-card/40 p-6 backdrop-blur-xl">
                        <div className="flex items-center gap-2">
                            <Wallet className="h-4 w-4 text-emerald-400" />
                            <h2 className="text-lg font-semibold">Revenue Snapshot</h2>
                        </div>

                        <div className="mt-4 space-y-4 text-xs text-muted-foreground">
                            <div className="space-y-1">
                                <div className="flex justify-between">
                                    <span>Estimated MRR</span>
                                    <span className="font-semibold text-foreground">
                                        {overview?.estimatedMRR
                                            ? `₦${overview.estimatedMRR.toLocaleString("en-NG")}`
                                            : "Coming soon"}
                                    </span>
                                </div>
                                <Progress value={overview?.estimatedMRR ? 70 : 20} />
                            </div>

                            <p>
                                Once Paystack is fully wired, this panel can reflect real MRR,
                                churn, and ARPU metrics.
                            </p>
                        </div>
                    </Card>

                    <Card className="border border-border bg-card/40 p-6 backdrop-blur-xl">
                        <div className="flex items-center gap-2">
                            <Zap className="h-4 w-4 text-violet-400" />
                            <h2 className="text-lg font-semibold">Plan Config</h2>
                        </div>

                        <div className="mt-4 space-y-3 text-xs text-muted-foreground">
                            {plans.map((p, idx) => (
                                <div
                                    key={p.planId}
                                    className="flex items-center justify-between gap-2"
                                >
                                    <span className="w-20 text-[11px] font-medium">
                                        {p.name} ({p.planId})
                                    </span>

                                    <input
                                        type="number"
                                        className="w-24 rounded border border-border bg-background px-2 py-1 text-right text-[11px]"
                                        value={p.priceNGN}
                                        onChange={(e) => {
                                            const next = [...plans];
                                            next[idx] = {
                                                ...next[idx],
                                                priceNGN: Number(e.target.value || 0),
                                            };
                                            setPlans(next);
                                        }}
                                    />

                                    <label className="flex items-center gap-1 text-[11px]">
                                        <input
                                            type="checkbox"
                                            checked={p.active}
                                            onChange={(e) => {
                                                const next = [...plans];
                                                next[idx] = { ...next[idx], active: e.target.checked };
                                                setPlans(next);
                                            }}
                                        />
                                        Active
                                    </label>

                                    <Button
                                        size="xs"
                                        variant="outline"
                                        className="text-[10px]"
                                        onClick={() => handleSavePlan(p)}
                                        disabled={savingPlanId === p.planId}
                                    >
                                        {savingPlanId === p.planId ? (
                                            <Loader2 className="h-3 w-3 animate-spin" />
                                        ) : (
                                            "Save"
                                        )}
                                    </Button>
                                </div>
                            ))}

                            {plans.length === 0 && (
                                <p className="text-[11px] text-muted-foreground">
                                    No plans loaded yet. Seed them in the backend.
                                </p>
                            )}
                        </div>
                    </Card>

                    {/* Risk Monitor */}
                    <Card className="border border-border bg-card/40 p-6 backdrop-blur-xl">
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-amber-400" />
                            <h2 className="text-lg font-semibold">Risk Monitor</h2>
                        </div>

                        <div className="mt-4 space-y-3 text-xs text-muted-foreground">
                            <p>
                                • Watch for users with high hours but still on Free—consider
                                upgrade nudges.
                            </p>
                            <p>
                                • If billing issues occur (failed renewals), surface them here
                                once Paystack webhooks are integrated.
                            </p>
                            <p className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Billing alerts and dunning sequences will appear in this panel.
                            </p>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}

/* =============== COMPONENTS =============== */

function KpiCard({ title, value, icon, trend, glow }: any) {
    return (
        <Card className="relative overflow-hidden border border-border bg-card/40 p-5 backdrop-blur-xl transition hover:scale-[1.02]">
            <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${glow}`} />
            <div className="relative flex items-center justify-between">
                <div className="text-muted-foreground">{icon}</div>
                <span className="text-xs text-emerald-400">{trend}</span>
            </div>
            <h2 className="relative mt-4 text-2xl font-bold">{value}</h2>
            <p className="relative text-sm text-muted-foreground">{title}</p>
        </Card>
    );
}

function PlanStat({
    label,
    value,
    color,
    badge,
}: {
    label: string;
    value: number;
    color: string;
    badge: string;
}) {
    return (
        <div className="rounded-xl border border-border bg-background/20 px-4 py-3">
            <div className="flex items-center justify-between">
                <p className={`text-xl font-bold ${color}`}>{value}</p>
                <Badge
                    variant="outline"
                    className="border-border/60 bg-background/40 text-[10px]"
                >
                    {badge}
                </Badge>
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">{label}</p>
        </div>
    );
}