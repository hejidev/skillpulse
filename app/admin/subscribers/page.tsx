// app/admin/subscribers/page.tsx
"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Users,
    MailCheck,
    MailX,
    Filter,
    Download,
    ChevronDown,
} from "lucide-react";
import { toast } from "sonner";

type Subscriber = {
    _id: string;
    email: string;
    name?: string;
    source: string;
    status: "pending" | "confirmed" | "unsubscribed";
    createdAt: string;
    lastEmailAt?: string;
};

export default function AdminSubscribersPage() {
    const [subs, setSubs] = useState<Subscriber[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<
        "" | "pending" | "confirmed" | "unsubscribed"
    >("");
    const [search, setSearch] = useState("");
    const [exporting, setExporting] = useState(false);
    const [exportStatus, setExportStatus] = useState<
        "all" | "confirmed" | "unsubscribed"
    >("all");

    const load = async () => {
        setLoading(true);
        try {
            const params: any = {};
            if (statusFilter) params.status = statusFilter;
            if (search.trim()) params.q = search.trim();

            const res = await API.get("/admin/subscribers", { params });
            setSubs(res.data.subscribers || []);
        } catch (err: any) {
            toast.error(
                err?.response?.data?.message || "Failed to load subscribers."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [statusFilter]);

    const total = subs.length;
    const confirmed = subs.filter((s) => s.status === "confirmed").length;
    const pending = subs.filter((s) => s.status === "pending").length;
    const unsubscribed = subs.filter((s) => s.status === "unsubscribed").length;

    const handleExport = async () => {
        setExporting(true);
        try {
            const params: any = {};
            if (exportStatus !== "all") {
                params.status = exportStatus;
            }

            const res = await API.get("/admin/subscribers/export", {
                params,
                responseType: "blob",
            });

            const blob = new Blob([res.data], { type: "text/csv;charset=utf-8;" });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            const suffix = exportStatus;
            link.setAttribute("download", `subscribers-${suffix}.csv`);
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (err: any) {
            toast.error(
                err?.response?.data?.message || "Failed to export subscribers."
            );
        } finally {
            setExporting(false);
        }
    };

    const updateStatus = async (
        id: string,
        nextStatus: "confirmed" | "unsubscribed"
    ) => {
        try {
            await API.patch(`/admin/subscribers/${id}/status`, {
                status: nextStatus,
            });
            toast.success(
                `Subscriber marked as ${nextStatus === "confirmed" ? "confirmed" : "unsubscribed"}.`
            );
            load();
        } catch (err: any) {
            toast.error(
                err?.response?.data?.message || "Failed to update subscriber."
            );
        }
    };

    return (
        <div className="space-y-10 mt-10">
            {/* HEADER */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight">
                        Subscriber Intelligence
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Monitor newsletter audience growth and engagement segments.
                    </p>
                </div>

                {/* <div className="flex flex-col gap-2 md:flex-row md:items-center"> */}
                    {/* in the HEADER right side, replace the old single export button block */}
                    <div className="flex flex-col gap-2 md:flex-row md:items-center">
                        <div className="flex items-center gap-2">
                            <Input
                                placeholder="Search by email…"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="max-w-xs"
                                size={undefined}
                            />
                            <Button type="button" variant="outline" size="sm" onClick={load}>
                                <Filter className="mr-2 h-4 w-4" />
                                Apply
                            </Button>
                        </div>

                        {/* Export options */}
                        <div className="flex items-center gap-2">
                            <div className="flex rounded-lg border border-border overflow-hidden text-xs">
                                <button
                                    type="button"
                                    className={`px-2 py-1 ${exportStatus === "all"
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-background text-muted-foreground"
                                        }`}
                                    onClick={() => setExportStatus("all")}
                                >
                                    All
                                </button>
                                <button
                                    type="button"
                                    className={`px-2 py-1 border-l border-border ${exportStatus === "confirmed"
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-background text-muted-foreground"
                                        }`}
                                    onClick={() => setExportStatus("confirmed")}
                                >
                                    Confirmed
                                </button>
                                <button
                                    type="button"
                                    className={`px-2 py-1 border-l border-border ${exportStatus === "unsubscribed"
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-background text-muted-foreground"
                                        }`}
                                    onClick={() => setExportStatus("unsubscribed")}
                                >
                                    Unsubscribed
                                </button>
                            </div>

                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleExport}
                                disabled={exporting}
                                className="flex items-center gap-1"
                            >
                                <Download className="h-4 w-4" />
                                {exporting ? "Exporting…" : "Export CSV"}
                            </Button>
                        </div>
                    </div>
                {/* </div> */}
            </div>

            {/* KPI STRIP */}
            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
                <KpiCard
                    title="Total Subscribers"
                    value={total}
                    icon={<Users />}
                    glow="from-cyan-500/20"
                />
                <KpiCard
                    title="Confirmed"
                    value={confirmed}
                    icon={<MailCheck />}
                    glow="from-green-500/20"
                />
                <KpiCard
                    title="Pending"
                    value={pending}
                    icon={<Filter />}
                    glow="from-yellow-500/20"
                />
                <KpiCard
                    title="Unsubscribed"
                    value={unsubscribed}
                    icon={<MailX />}
                    glow="from-red-500/20"
                />
            </div>

            {/* TABLE + FILTERS */}
            <Card className="p-6 bg-card/40 backdrop-blur-xl border border-border">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-xl font-semibold">Subscribers</h2>
                        <p className="text-sm text-muted-foreground">
                            All emails captured from the footer and other entry points.
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant={statusFilter === "" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setStatusFilter("")}
                        >
                            All
                        </Button>
                        <Button
                            type="button"
                            variant={statusFilter === "confirmed" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setStatusFilter("confirmed")}
                        >
                            Confirmed
                        </Button>
                        <Button
                            type="button"
                            variant={statusFilter === "pending" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setStatusFilter("pending")}
                        >
                            Pending
                        </Button>
                        <Button
                            type="button"
                            variant={
                                statusFilter === "unsubscribed" ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => setStatusFilter("unsubscribed")}
                        >
                            Unsubscribed
                        </Button>
                    </div>
                </div>

                <div className="mt-4 border border-border rounded-2xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-background/60 text-muted-foreground">
                            <tr>
                                <th className="px-4 py-3 text-left">Email</th>
                                <th className="px-4 py-3 text-left hidden md:table-cell">
                                    Name
                                </th>
                                <th className="px-4 py-3 text-left hidden md:table-cell">
                                    Source
                                </th>
                                <th className="px-4 py-3 text-left">Status</th>
                                <th className="px-4 py-3 text-left hidden lg:table-cell">
                                    Joined
                                </th>
                                <th className="px-4 py-3 text-left hidden lg:table-cell">
                                    Last Email
                                </th>
                                <th className="px-4 py-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading && (
                                <tr>
                                    <td
                                        className="px-4 py-6 text-center text-muted-foreground"
                                        colSpan={7}
                                    >
                                        Loading subscribers…
                                    </td>
                                </tr>
                            )}

                            {!loading && subs.length === 0 && (
                                <tr>
                                    <td
                                        className="px-4 py-6 text-center text-muted-foreground"
                                        colSpan={7}
                                    >
                                        No subscribers found.
                                    </td>
                                </tr>
                            )}

                            {!loading &&
                                subs.map((s) => (
                                    <tr
                                        key={s._id}
                                        className="border-t border-border/60 hover:bg-accent/40 transition"
                                    >
                                        <td className="px-4 py-3">{s.email}</td>
                                        <td className="px-4 py-3 hidden md:table-cell">
                                            {s.name || "—"}
                                        </td>
                                        <td className="px-4 py-3 hidden md:table-cell capitalize">
                                            {s.source || "footer"}
                                        </td>
                                        <td className="px-4 py-3">
                                            <StatusBadge status={s.status} />
                                        </td>
                                        <td className="px-4 py-3 hidden lg:table-cell text-xs text-muted-foreground">
                                            {s.createdAt
                                                ? new Date(s.createdAt).toLocaleDateString()
                                                : "—"}
                                        </td>
                                        <td className="px-4 py-3 hidden lg:table-cell text-xs text-muted-foreground">
                                            {s.lastEmailAt
                                                ? new Date(s.lastEmailAt).toLocaleDateString()
                                                : "—"}
                                        </td>
                                        <td className="px-4 py-3">
                                            <SubscriberActions
                                                status={s.status}
                                                onConfirm={() =>
                                                    updateStatus(s._id, "confirmed")
                                                }
                                                onUnsubscribe={() =>
                                                    updateStatus(s._id, "unsubscribed")
                                                }
                                            />
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}

function KpiCard({
    title,
    value,
    icon,
    glow,
}: {
    title: string;
    value: number;
    icon: React.ReactNode;
    glow: string;
}) {
    return (
        <Card className="relative overflow-hidden p-5 bg-card/40 backdrop-blur-xl border border-border transition hover:scale-[1.02]">
            <div className={`absolute inset-0 bg-linear-to-br ${glow} opacity-40`} />
            <div className="relative flex items-center justify-between">
                <div className="text-muted-foreground">{icon}</div>
            </div>
            <h2 className="relative text-2xl font-bold mt-4">{value}</h2>
            <p className="relative text-sm text-muted-foreground">{title}</p>
        </Card>
    );
}

function StatusBadge({ status }: { status: Subscriber["status"] }) {
    if (status === "confirmed")
        return (
            <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
                Confirmed
            </Badge>
        );
    if (status === "pending")
        return (
            <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20">
                Pending
            </Badge>
        );
    return (
        <Badge className="bg-red-500/10 text-red-400 border-red-500/20">
            Unsubscribed
        </Badge>
    );
}

function SubscriberActions({
    status,
    onConfirm,
    onUnsubscribe,
}: {
    status: Subscriber["status"];
    onConfirm: () => void;
    onUnsubscribe: () => void;
}) {
    const isConfirmed = status === "confirmed";
    const isUnsubscribed = status === "unsubscribed";

    if (status === "pending") {
        return (
            <div className="flex gap-2">
                <Button
                    type="button"
                    size="xs"
                    variant="outline"
                    onClick={onConfirm}
                >
                    Mark confirmed
                </Button>
                <Button
                    type="button"
                    size="xs"
                    variant="outline"
                    onClick={onUnsubscribe}
                >
                    Mark unsubscribed
                </Button>
            </div>
        );
    }

    return (
        <div className="flex gap-2 items-center">
            <Button
                type="button"
                size="xs"
                variant={isConfirmed ? "outline" : "ghost"}
                disabled={isConfirmed}
                onClick={onConfirm}
            >
                Confirmed
            </Button>
            <Button
                type="button"
                size="xs"
                variant={isUnsubscribed ? "outline" : "ghost"}
                disabled={isUnsubscribed}
                onClick={onUnsubscribe}
            >
                Unsubscribed
            </Button>
        </div>
    );
}