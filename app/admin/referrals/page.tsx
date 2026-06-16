// app/admin/referrals/page.tsx
"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
    Settings2,
    Activity,
    Users,
    Award,
    RefreshCcw,
} from "lucide-react";

type BadgeTier = {
    key: string;
    title: string;
    description: string;
    referralsRequired: number;
    level: "bronze" | "silver" | "gold" | "legendary";
};

type ReferralConfig = {
    _id: string;
    isEnabled: boolean;

    requireEmailVerified: boolean;
    requireFirstSkill: boolean;
    requireFirstProgress: boolean;
    minProgressHours: number;

    referrerPointsPerReferral: number;
    referredPointsPerReferral: number;

    referrerPremiumDaysPerReferral: number;
    referredPremiumDaysPerReferral: number;

    badgeTiers: BadgeTier[];

    pointsToPremium: {
        pointsPerMonth: number;
    };
};

type ReferralStats = {
    totals: {
        totalReferrals: number;
        signedUp: number;
        activated: number;
        rewarded: number;
    };
    topReferrers: {
        _id: string;
        name: string;
        email: string;
        referralCode?: string;
        referralStats?: {
            successfulReferrals: number;
            pointsEarned: number;
        };
    }[];
};

export default function AdminReferralLabPage() {
    const [config, setConfig] = useState<ReferralConfig | null>(null);
    const [stats, setStats] = useState<ReferralStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [statsLoading, setStatsLoading] = useState(false);

    const loadConfig = async () => {
        try {
            setLoading(true);
            const res = await API.get("/admin/referrals/config");
            setConfig(res.data);
        } catch (err: any) {
            toast.error(
                err?.response?.data?.message || "Failed to load referral config"
            );
        } finally {
            setLoading(false);
        }
    };

    const loadStats = async () => {
        try {
            setStatsLoading(true);
            const res = await API.get("/admin/referrals/stats");
            setStats(res.data);
        } catch (err: any) {
            toast.error(
                err?.response?.data?.message || "Failed to load referral stats"
            );
        } finally {
            setStatsLoading(false);
        }
    };

    useEffect(() => {
        loadConfig();
        loadStats();
    }, []);

    const handleToggle = (field: keyof ReferralConfig) => {
        if (!config) return;
        setConfig({ ...config, [field]: !(config as any)[field] });
    };

    const handleNumberChange = (
        field:
            | "minProgressHours"
            | "referrerPointsPerReferral"
            | "referredPointsPerReferral"
            | "referrerPremiumDaysPerReferral"
            | "referredPremiumDaysPerReferral"
    ) => (value: string) => {
        if (!config) return;
        setConfig({ ...config, [field]: Number(value) || 0 });
    };

    const handlePointsPerMonthChange = (value: string) => {
        if (!config) return;
        setConfig({
            ...config,
            pointsToPremium: {
                pointsPerMonth: Number(value) || 0,
            },
        });
    };

    const handleBadgeChange = (
        index: number,
        field: keyof BadgeTier,
        value: string | number
    ) => {
        if (!config) return;
        const tiers = [...config.badgeTiers];
        tiers[index] = {
            ...tiers[index],
            [field]: field === "referralsRequired" ? Number(value) || 0 : value,
        } as BadgeTier;
        setConfig({ ...config, badgeTiers: tiers });
    };

    const addBadgeTier = () => {
        if (!config) return;
        const tiers = [
            ...config.badgeTiers,
            {
                key: `tier_${config.badgeTiers.length + 1}`,
                title: "New Tier",
                description: "",
                referralsRequired: 1,
                level: "bronze" as const,
            },
        ];
        setConfig({ ...config, badgeTiers: tiers });
    };

    const removeBadgeTier = (index: number) => {
        if (!config) return;
        const tiers = [...config.badgeTiers];
        tiers.splice(index, 1);
        setConfig({ ...config, badgeTiers: tiers });
    };

    const saveConfig = async () => {
        if (!config) return;
        setSaving(true);
        try {
            const payload = {
                isEnabled: config.isEnabled,
                requireEmailVerified: config.requireEmailVerified,
                requireFirstSkill: config.requireFirstSkill,
                requireFirstProgress: config.requireFirstProgress,
                minProgressHours: config.minProgressHours,
                referrerPointsPerReferral: config.referrerPointsPerReferral,
                referredPointsPerReferral: config.referredPointsPerReferral,
                referrerPremiumDaysPerReferral: config.referrerPremiumDaysPerReferral,
                referredPremiumDaysPerReferral: config.referredPremiumDaysPerReferral,
                pointsToPremium: config.pointsToPremium,
                badgeTiers: config.badgeTiers,
            };
            const res = await API.put("/admin/referrals/config", payload);
            setConfig(res.data);
            toast.success("Referral configuration saved.");
        } catch (err: any) {
            toast.error(
                err?.response?.data?.message || "Failed to save referral config"
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading || !config) {
        return (
            <div className="mt-10">
                <h1 className="text-4xl font-bold tracking-tight">Referral Lab</h1>
                <p className="mt-2 text-muted-foreground">
                    Loading referral engine configuration…
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-10 mt-10">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight">Referral Lab</h1>
                    <p className="mt-2 text-muted-foreground">
                        Design and tune your referral engine – activation rules, rewards,
                        and ambassador tiers.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Badge
                        className={
                            config.isEnabled
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                : "bg-red-500/10 text-red-400 border-red-500/20"
                        }
                    >
                        {config.isEnabled ? "Program active" : "Program paused"}
                    </Badge>

                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={async () => {
                            try {
                                const res = await API.post("/admin/referrals/backfill-codes");
                                toast.success(`Backfilled ${res.data.updated} users`);
                            } catch (err: any) {
                                toast.error(
                                    err?.response?.data?.message || "Failed to backfill referral codes"
                                );
                            }
                        }}
                    >
                        Generate codes for existing users
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={loadStats}
                        disabled={statsLoading}
                        className="flex items-center gap-1"
                    >
                        <RefreshCcw className="h-4 w-4" />
                        Refresh stats
                    </Button>
                    <Button
                        type="button"
                        onClick={saveConfig}
                        disabled={saving}
                        className="flex items-center gap-2"
                    >
                        <Settings2 className="h-4 w-4" />
                        {saving ? "Saving…" : "Save config"}
                    </Button>
                </div>
            </div>

            <div className="grid xl:grid-cols-3 gap-6">
                {/* LEFT: Activation + Rewards */}
                <div className="xl:col-span-2 space-y-6">
                    <Card className="p-6 bg-card/40 backdrop-blur-xl border border-border">
                        <div className="flex items-center gap-2 mb-4">
                            <Activity className="text-primary" />
                            <h2 className="text-lg font-semibold">Activation rules</h2>
                        </div>

                        <div className="space-y-4 text-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Program enabled</p>
                                    <p className="text-muted-foreground text-xs">
                                        Toggle the entire referral engine on or off.
                                    </p>
                                </div>
                                <Switch
                                    checked={config.isEnabled}
                                    onCheckedChange={() => handleToggle("isEnabled")}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Require email verification</p>
                                    <p className="text-muted-foreground text-xs">
                                        Only reward referrals once the referred user verifies their
                                        email.
                                    </p>
                                </div>
                                <Switch
                                    checked={config.requireEmailVerified}
                                    onCheckedChange={() =>
                                        handleToggle("requireEmailVerified")
                                    }
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Require first skill</p>
                                    <p className="text-muted-foreground text-xs">
                                        Activation only after the user creates their first skill.
                                    </p>
                                </div>
                                <Switch
                                    checked={config.requireFirstSkill}
                                    onCheckedChange={() => handleToggle("requireFirstSkill")}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Require first progress</p>
                                    <p className="text-muted-foreground text-xs">
                                        Activation only after the user logs their first progress.
                                    </p>
                                </div>
                                <Switch
                                    checked={config.requireFirstProgress}
                                    onCheckedChange={() =>
                                        handleToggle("requireFirstProgress")
                                    }
                                />
                            </div>

                            <div>
                                <p className="font-medium">Minimum progress hours</p>
                                <p className="text-muted-foreground text-xs mb-1">
                                    The minimum logged hours required to count as an activated
                                    referral.
                                </p>
                                <Input
                                    type="number"
                                    value={config.minProgressHours}
                                    onChange={(e) =>
                                        handleNumberChange("minProgressHours")(e.target.value)
                                    }
                                    className="max-w-[120px]"
                                />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 bg-card/40 backdrop-blur-xl border border-border">
                        <div className="flex items-center gap-2 mb-4">
                            <Users className="text-primary" />
                            <h2 className="text-lg font-semibold">Rewards engine</h2>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <h3 className="font-semibold mb-2">Referrer rewards</h3>
                                <label className="text-xs text-muted-foreground">
                                    Points per referral
                                </label>
                                <Input
                                    type="number"
                                    value={config.referrerPointsPerReferral}
                                    onChange={(e) =>
                                        handleNumberChange("referrerPointsPerReferral")(
                                            e.target.value
                                        )
                                    }
                                    className="mt-1"
                                />
                                <label className="text-xs text-muted-foreground mt-3 block">
                                    Premium days per referral
                                </label>
                                <Input
                                    type="number"
                                    value={config.referrerPremiumDaysPerReferral}
                                    onChange={(e) =>
                                        handleNumberChange("referrerPremiumDaysPerReferral")(
                                            e.target.value
                                        )
                                    }
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <h3 className="font-semibold mb-2">Referred user rewards</h3>
                                <label className="text-xs text-muted-foreground">
                                    Points per referral
                                </label>
                                <Input
                                    type="number"
                                    value={config.referredPointsPerReferral}
                                    onChange={(e) =>
                                        handleNumberChange("referredPointsPerReferral")(
                                            e.target.value
                                        )
                                    }
                                    className="mt-1"
                                />
                                <label className="text-xs text-muted-foreground mt-3 block">
                                    Premium days per referral
                                </label>
                                <Input
                                    type="number"
                                    value={config.referredPremiumDaysPerReferral}
                                    onChange={(e) =>
                                        handleNumberChange("referredPremiumDaysPerReferral")(
                                            e.target.value
                                        )
                                    }
                                    className="mt-1"
                                />
                            </div>
                        </div>

                        <div className="mt-4">
                            <h3 className="font-semibold mb-1 text-sm">
                                Points to premium conversion
                            </h3>
                            <p className="text-xs text-muted-foreground mb-1">
                                How many points are required for 1 month of Pro.
                            </p>
                            <Input
                                type="number"
                                value={config.pointsToPremium.pointsPerMonth}
                                onChange={(e) =>
                                    handlePointsPerMonthChange(e.target.value)
                                }
                                className="max-w-[160px]"
                            />
                        </div>
                    </Card>

                    <Card className="p-6 bg-card/40 backdrop-blur-xl border border-border">
                        <div className="flex items-center gap-2 mb-4">
                            <Award className="text-primary" />
                            <h2 className="text-lg font-semibold">Ambassador tiers</h2>
                        </div>

                        <div className="space-y-3 text-sm">
                            {config.badgeTiers.map((tier, idx) => (
                                <div
                                    key={tier.key || idx}
                                    className="border border-border/60 rounded-xl p-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                                >
                                    <div className="flex-1 space-y-2">
                                        <Input
                                            value={tier.title}
                                            onChange={(e) =>
                                                handleBadgeChange(idx, "title", e.target.value)
                                            }
                                            className="font-medium"
                                        />
                                        <Input
                                            placeholder="Description"
                                            value={tier.description}
                                            onChange={(e) =>
                                                handleBadgeChange(
                                                    idx,
                                                    "description",
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <div className="flex gap-3">
                                            <div>
                                                <label className="text-xs text-muted-foreground">
                                                    Referrals required
                                                </label>
                                                <Input
                                                    type="number"
                                                    className="mt-1 w-28"
                                                    value={tier.referralsRequired}
                                                    onChange={(e) =>
                                                        handleBadgeChange(
                                                            idx,
                                                            "referralsRequired",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs text-muted-foreground">
                                                    Level
                                                </label>
                                                <select
                                                    className="mt-1 w-32 text-xs bg-background border border-border rounded-md px-2 py-1"
                                                    value={tier.level}
                                                    onChange={(e) =>
                                                        handleBadgeChange(
                                                            idx,
                                                            "level",
                                                            e.target.value
                                                        )
                                                    }
                                                >
                                                    <option value="bronze">Bronze</option>
                                                    <option value="silver">Silver</option>
                                                    <option value="gold">Gold</option>
                                                    <option value="legendary">Legendary</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeBadgeTier(idx)}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4">
                            <Button type="button" variant="outline" onClick={addBadgeTier}>
                                Add tier
                            </Button>
                        </div>
                    </Card>
                </div>

                {/* RIGHT: Stats */}
                <div className="space-y-6">
                    <Card className="p-6 bg-card/40 backdrop-blur-xl border border-border">
                        <div className="flex items-center gap-2 mb-4">
                            <Activity className="text-primary" />
                            <h2 className="text-lg font-semibold">Program performance</h2>
                        </div>

                        {stats ? (
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span>Total referrals</span>
                                    <span className="font-medium">
                                        {stats.totals.totalReferrals}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Signups</span>
                                    <span className="font-medium">
                                        {stats.totals.signedUp}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Activated</span>
                                    <span className="font-medium">
                                        {stats.totals.activated}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Rewarded</span>
                                    <span className="font-medium">
                                        {stats.totals.rewarded}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <p className="text-xs text-muted-foreground">
                                No referral stats yet.
                            </p>
                        )}
                    </Card>

                    <Card className="p-6 bg-card/40 backdrop-blur-xl border border-border">
                        <div className="flex items-center gap-2 mb-4">
                            <Users className="text-primary" />
                            <h2 className="text-lg font-semibold">Top referrers</h2>
                        </div>

                        {stats && stats.topReferrers.length > 0 ? (
                            <div className="space-y-3 text-xs">
                                {stats.topReferrers.map((u) => (
                                    <div
                                        key={u._id}
                                        className="border border-border/60 rounded-lg p-2"
                                    >
                                        <p className="font-medium">{u.name}</p>
                                        <p className="text-muted-foreground">{u.email}</p>
                                        <p className="mt-1">
                                            Referrals:{" "}
                                            {u.referralStats?.successfulReferrals ?? 0}
                                        </p>
                                        <p>
                                            Points: {u.referralStats?.pointsEarned ?? 0}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-muted-foreground">
                                No referrers yet.
                            </p>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
}