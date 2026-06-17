"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Share2, Users, Copy } from "lucide-react";
import PageSkeleton from "@/components/PageSkeleton";

type ReferralOverview = {
    user: {
        name: string;
        email: string;
        referralCode?: string;
        referralStats?: {
            totalReferrals: number;
            successfulReferrals: number;
            pointsEarned: number;
        };
        wallet?: {
            points: number;
            lastUpdatedAt?: string;
        };
    };
    referrals: {
        id: string;
        status: "clicked" | "signed_up" | "activated" | "rewarded";
        activationEvent?: string;
        createdAt: string;
        referredUser?: {
            name: string;
            email: string;
        } | null;
    }[];
};

type ReferralConfig = {
    pointsToPremium?: {
        pointsPerMonth: number;
    };
};

export default function ReferralDashboardPage() {
    const [data, setData] = useState<ReferralOverview | null>(null);
    const [config, setConfig] = useState<ReferralConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadingConfig, setLoadingConfig] = useState(true);
    const [redeeming, setRedeeming] = useState(false);

    const loadOverview = async () => {
        try {
            setLoading(true);
            const res = await API.get("/referrals/me");
            setData(res.data);
        } catch (err: any) {
            toast.error(
                err?.response?.data?.message || "Failed to load referrals"
            );
        } finally {
            setLoading(false);
        }
    };

    const loadConfig = async () => {
        try {
            setLoadingConfig(true);
            const res = await API.get("/admin/referrals/config"); // adjust path if needed
            setConfig(res.data);
        } catch (err: any) {
            // you can keep this silent; redemption UI will just show fallback text
            console.error(err);
        } finally {
            setLoadingConfig(false);
        }
    };

    useEffect(() => {
        loadOverview();
        loadConfig();
    }, []);

    if (loading || !data) {
        return (
            <div className="mt-10">
                <h1 className="text-3xl font-bold tracking-tight">
                    Referral Rewards
                </h1>
                <PageSkeleton />
            </div>
        );
    }

    const { user, referrals } = data;
    const referralCode = user.referralCode || "";
    const referralLink = referralCode
        ? `${process.env.NEXT_PUBLIC_FRONTEND_URL || "https://skillpulse-rho.vercel.app"}/auth/signup?ref=${referralCode}`
        : "";

    const hasReferralCode = !!referralCode;

    const stats = user.referralStats || {
        totalReferrals: 0,
        successfulReferrals: 0,
        pointsEarned: 0,
    };
    const points = user.wallet?.points || 0;
    const pointsPerMonth = config?.pointsToPremium?.pointsPerMonth;

    const copyLink = async () => {
        if (!referralLink) return;
        await navigator.clipboard.writeText(referralLink);
        toast.success("Referral link copied");
    };

    const redeem = async () => {
        if (!pointsPerMonth) return;
        setRedeeming(true);
        try {
            const res = await API.post("/wallet/redeem/premium");
            toast.success(
                res.data?.message || "Redeemed points for premium"
            );
            await loadOverview();
        } catch (err: any) {
            toast.error(
                err?.response?.data?.message || "Failed to redeem points"
            );
        } finally {
            setRedeeming(false);
        }
    };

    return (
        <div className="space-y-8 mt-8">
            {/* HEADER */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    Referral Rewards
                </h1>
                <p className="text-muted-foreground mt-2">
                    Invite builders you trust. When they activate, both of you earn
                    SkillPoints and premium time.
                </p>
            </div>

            {/* REFERRAL LINK */}
            <Card className="p-6 bg-card/40 border border-border backdrop-blur-xl">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <Share2 className="h-4 w-4 text-primary" />
                            Your referral link
                        </h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            Share this link with friends. When they create their first skill
                            and log progress, you both unlock rewards.
                        </p>
                    </div>
                    <div className="flex flex-col gap-2 w-full md:w-[360px]">
                        <Input
                            readOnly
                            value={
                                hasReferralCode
                                    ? referralLink
                                    : "Your referral link will appear here once generated."
                            }
                            className="text-xs"
                            disabled={!hasReferralCode}
                        />

                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="flex items-center justify-center gap-2"
                            onClick={copyLink}
                            disabled={!hasReferralCode}
                        >
                            <Copy className="h-4 w-4" />
                            {hasReferralCode ? "Copy link" : "No link yet"}
                        </Button>
                    </div>
                </div>
            </Card>

            {/* STATS + WALLET */}
            <div className="grid md:grid-cols-4 gap-6">
                <Card className="p-5 bg-card/40 border border-border">
                    <p className="text-xs text-muted-foreground">Total referrals</p>
                    <p className="text-2xl font-bold mt-2">
                        {stats.totalReferrals || stats.successfulReferrals}
                    </p>
                </Card>
                <Card className="p-5 bg-card/40 border border-border">
                    <p className="text-xs text-muted-foreground">Successful referrals</p>
                    <p className="text-2xl font-bold mt-2">
                        {stats.successfulReferrals}
                    </p>
                </Card>
                <Card className="p-5 bg-card/40 border border-border">
                    <p className="text-xs text-muted-foreground">SkillPoints earned</p>
                    <p className="text-2xl font-bold mt-2">{points}</p>
                </Card>

                {/* WALLET / REDEEM CARD */}
                <Card className="p-5 bg-card/40 border border-border">
                    <p className="text-xs text-muted-foreground">SkillPoints balance</p>
                    <p className="text-2xl font-bold mt-2">{points}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                        {loadingConfig
                            ? "Loading rewards..."
                            : pointsPerMonth
                                ? `${pointsPerMonth} points = 1 month premium`
                                : "Redemption rate will be announced soon."}
                    </p>
                    <Button
                        className="mt-3 w-full"
                        size="sm"
                        disabled={
                            !pointsPerMonth || points < pointsPerMonth || redeeming
                        }
                        onClick={redeem}
                    >
                        {redeeming
                            ? "Redeeming..."
                            : "Redeem for 1 month premium"}
                    </Button>
                </Card>
            </div>


            {/* REFERRAL LIST */}
            <Card className="p-6 bg-card/40 border border-border">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-primary" />
                        <h2 className="text-lg font-semibold">Referral history</h2>
                    </div>
                    <Badge className="bg-primary/10 text-primary border-primary/20">
                        {referrals.length} referrals
                    </Badge>
                </div>

                {referrals.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                        You haven’t referred anyone yet. Share your link to get started.
                    </p>
                ) : (
                    <div className="mt-2 border border-border rounded-2xl overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-background/60 text-muted-foreground">
                                <tr>
                                    <th className="px-4 py-3 text-left">Friend</th>
                                    <th className="px-4 py-3 text-left">Status</th>
                                    <th className="px-4 py-3 text-left hidden md:table-cell">
                                        Activation
                                    </th>
                                    <th className="px-4 py-3 text-left hidden md:table-cell">
                                        Invited
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {referrals.map((r) => (
                                    <tr
                                        key={r.id}
                                        className="border-t border-border/60 hover:bg-accent/40 transition"
                                    >
                                        <td className="px-4 py-3">
                                            {r.referredUser?.name || "Unknown"}{" "}
                                            <span className="text-xs text-muted-foreground block">
                                                {r.referredUser?.email || "—"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <ReferralStatusBadge status={r.status} />
                                        </td>
                                        <td className="px-4 py-3 text-xs text-muted-foreground hidden md:table-cell">
                                            {r.activationEvent || "—"}
                                        </td>
                                        <td className="px-4 py-3 text-xs text-muted-foreground hidden md:table-cell">
                                            {new Date(r.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>
        </div>
    );
}

function ReferralStatusBadge({
    status,
}: {
    status: "clicked" | "signed_up" | "activated" | "rewarded";
}) {
    if (status === "rewarded") {
        return (
            <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
                Rewarded
            </Badge>
        );
    }
    if (status === "activated") {
        return (
            <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                Activated
            </Badge>
        );
    }
    if (status === "signed_up") {
        return (
            <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20">
                Signed up
            </Badge>
        );
    }
    return (
        <Badge className="bg-slate-500/10 text-slate-300 border-slate-500/20">
            Clicked
        </Badge>
    );
}