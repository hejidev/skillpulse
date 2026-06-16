// app/admin/about/page.tsx
"use client";

import { useState, useEffect } from "react";
import {
    getAdminAbout,
    updateAbout,
    updateAboutStatus,
    getAboutAnalytics,
    uploadAboutImageApi,
} from "@/lib/api/about-api";

import { useDropzone } from "react-dropzone";

// pull these from your design system
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// lucide icons (same vibe as your dashboard)
import {
    Sparkles,
    LayoutDashboard,
    Target,
    Users,
    BarChart3,
    Activity,
    Globe2,
    ShieldCheck,
    Rocket,
    PenSquare,
    Search,
} from "lucide-react";
import { toast } from "sonner";
import { AdminPageSkeleton } from "../admin-skeleton";

interface AboutData {
    heroTitle: string;
    heroSubtitle?: string;
    heroBadge?: string;
    heroImage?: string;
    heroImagePublicId?: string;
    founderMessage?: string;
    founderName?: string;
    founderRole?: string;
    founderImage?: string;
    founderImagePublicId?: string;
    companyFounded?: string;
    headquarters?: string;
    activeUsers?: string;
    countriesReached?: string;
    employees?: string;
    storyTitle?: string;
    storyContent?: string;
    storyImage?: string;
    storyImagePublicId?: string;
    mission?: string;
    vision?: string;
    stats?: Array<{ title: string; value: string; icon?: string }>;
    values?: Array<{ title: string; description: string; icon?: string }>;
    timeline?: Array<{ year: string; title: string; description: string }>;
    team?: Array<{
        name: string;
        role: string;
        image?: string;
        imagePublicId?: string;
        bio?: string;
        linkedin?: string;
        twitter?: string;
        github?: string;
    }>;
    testimonials?: Array<{
        name: string;
        role: string;
        image?: string;
        imagePublicId?: string;
        quote: string;
    }>;
    seo?: { metaTitle?: string; metaDescription?: string; keywords?: string[] };
    status?: "draft" | "published";
    updatedBy?: { id?: string; name?: string };
    publishedAt?: string;
}

export default function AboutCMSPage() {
    const [about, setAbout] = useState<AboutData | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [publishing, setPublishing] = useState(false);
    const [analytics, setAnalytics] = useState<any>(null);

    useEffect(() => {
        loadAbout();
        loadAnalytics();
    }, []);

    const loadAbout = async () => {
        try {
            const data = await getAdminAbout();
            setAbout(data.about);
        } catch (error) {
            console.error("Failed to load about:", error);
            toast.error("Failed to load about:");
        } finally {
            setLoading(false);
        }
    };

    const loadAnalytics = async () => {
        try {
            const data = await getAboutAnalytics();
            setAnalytics(data.analytics);
        } catch (error) {
            console.error("Failed to load analytics:", error);
            toast.error("Failed to load analytics:");
        }
    };

    const updateField = (field: keyof AboutData, value: any) => {
        setAbout((prev) => (prev ? { ...prev, [field]: value } : prev));
    };

    const addArrayItem = (field: keyof AboutData, item: any) => {
        setAbout((prev) => {
            if (!prev) return prev;
            const current = (prev[field] as any[]) || [];
            return { ...prev, [field]: [...current, item] };
        });
    };

    const updateArrayItem = (field: keyof AboutData, index: number, item: any) => {
        setAbout((prev) => {
            if (!prev) return prev;
            const current = [...(((prev[field] as any[]) || []) as any[])];
            current[index] = item;
            return { ...prev, [field]: current };
        });
    };

    const removeArrayItem = (field: keyof AboutData, index: number) => {
        setAbout((prev) => {
            if (!prev) return prev;
            const current = [...(((prev[field] as any[]) || []) as any[])];
            current.splice(index, 1);
            return { ...prev, [field]: current };
        });
    };

    const handleSave = async () => {
        if (!about) return;
        setSaving(true);
        try {
            await updateAbout(about);
            // you can replace alerts with your toast system
            // toast.success("About page saved");
            toast.success("About page saved successfully");
            loadAnalytics();
        } catch (error: any) {
            toast.error("Failed to save: " + error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleStatusChange = async (status: "draft" | "published") => {
        setPublishing(true);
        try {
            await updateAboutStatus(status);
            toast.success(`About page set to ${status}`);
            loadAbout();
            loadAnalytics();
        } catch (error: any) {
            toast.error("Failed to update status: " + error.message);
        } finally {
            setPublishing(false);
        }
    };

    if (loading) {
        return <AdminPageSkeleton />;
    }

    if (!about) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center text-muted-foreground">
                Failed to load About configuration.
            </div>
        );
    }

    return (
        <div className="space-y-10 mt-6">
            {/* ================= HEADER ================= */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur-xl">
                        <Sparkles className="w-3 h-3 text-primary" />
                        <span>Experience Engine</span>
                    </div>
                    <h1 className="mt-3 text-4xl font-bold tracking-tight">
                        About Page Experience Studio
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        Craft, optimize and publish your public story with an intelligence-grade CMS.
                    </p>
                </div>

                {/* Publish controls summary */}
                <Card className="flex flex-col gap-3 bg-card/40 backdrop-blur-xl border border-border px-5 py-4 lg:w-[320px]">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground">
                            Publish Status
                        </span>
                        <Badge
                            className={`text-xs ${about.status === "published"
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                }`}
                        >
                            {about.status === "published" ? "Published" : "Draft"}
                        </Badge>
                    </div>

                    <div className="text-xs text-muted-foreground">
                        {about.publishedAt ? (
                            <>Live since {new Date(about.publishedAt).toLocaleString()}</>
                        ) : (
                            <>Not yet published</>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            variant={about.status === "draft" ? "default" : "outline"}
                            disabled={publishing}
                            onClick={() => handleStatusChange("draft")}
                            className="flex-1"
                        >
                            Draft
                        </Button>
                        <Button
                            size="sm"
                            variant={about.status === "published" ? "default" : "outline"}
                            disabled={publishing}
                            onClick={() => handleStatusChange("published")}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                        >
                            {publishing ? "Updating..." : "Publish"}
                        </Button>
                    </div>
                </Card>
            </div>

            {/* ================= KPI STRIP ================= */}
            {analytics && (
                <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
                    <KpiCard
                        title="Experience Blocks"
                        value={
                            analytics.stats +
                            analytics.values +
                            analytics.timeline +
                            analytics.features
                        }
                        icon={<LayoutDashboard className="w-4 h-4" />}
                        trend="+ Live structure"
                        glow="from-cyan-500/20"
                    />
                    <KpiCard
                        title="Core Values"
                        value={analytics.values}
                        icon={<Target className="w-4 h-4" />}
                        trend="Brand narrative"
                        glow="from-amber-500/20"
                    />
                    <KpiCard
                        title="Team Profiles"
                        value={analytics.team}
                        icon={<Users className="w-4 h-4" />}
                        trend="Leadership trust"
                        glow="from-purple-500/20"
                    />
                    <KpiCard
                        title="Social Proof"
                        value={analytics.testimonials + analytics.awards}
                        icon={<BarChart3 className="w-4 h-4" />}
                        trend="Testimonials & awards"
                        glow="from-emerald-500/20"
                    />
                </div>
            )}

            {/* ================= MAIN GRID ================= */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* LEFT PANEL – main editing surface */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Hero + Founder */}
                    <Card className="p-6 bg-card/40 backdrop-blur-xl border border-border hover:shadow-lg transition">
                        <SectionHeader
                            icon={<PenSquare className="w-4 h-4 text-primary" />}
                            title="Hero & Founder"
                            badge="First Impression"
                            description="Control the hero narrative and founder story that visitors see first."
                        />

                        <div className="mt-6 grid gap-6 md:grid-cols-[3fr,2fr]">
                            {/* Hero form */}

                            <div className="space-y-4">
                                <FieldLabel label="Hero Title" required />
                                <Input
                                    value={about.heroTitle || ""}
                                    onChange={(e) => updateField("heroTitle", e.target.value)}
                                    placeholder="Powering the next generation of X"
                                />

                                <FieldLabel label="Hero Subtitle" />
                                <Input
                                    value={about.heroSubtitle || ""}
                                    onChange={(e) => updateField("heroSubtitle", e.target.value)}
                                    placeholder="Short supporting sentence that sets the tone"
                                />

                                <FieldLabel label="Hero Badge" />
                                <Input
                                    value={about.heroBadge || ""}
                                    onChange={(e) => updateField("heroBadge", e.target.value)}
                                    placeholder="Used for small badge copy (e.g. 'Trusted by 10K+ teams')"
                                />
                            </div>

                            {/* Hero / Founder visuals */}
                            <div className="space-y-4">
                                <ImageDropzone
                                    label="Hero Image"
                                    helper="Recommended: 1600×900, PNG or JPG, < 2MB"
                                    rounded="xl"
                                    imageUrl={about.heroImage}
                                    onUpload={async (file) => {
                                        const res = await uploadAboutImageApi(file);
                                        if (res.success) {
                                            updateField("heroImage", res.url);
                                            updateField("heroImagePublicId", res.publicId);
                                        }
                                    }}
                                    onUrlChange={(url) => updateField("heroImage", url)}
                                />

                                <div className="mt-2 rounded-xl border border-dashed border-border bg-background/40 p-3 text-xs text-muted-foreground">
                                    <p className="font-medium mb-1">Hero Designer Tip</p>
                                    <p>
                                        Use a clean product UI or gradient background image to match the rest of
                                        your Admin Intelligence Center visuals.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Founder Block */}
                        <div className="mt-8 grid gap-6 md:grid-cols-[2fr,3fr] border-t border-border pt-6">
                            <div className="space-y-4">
                                <FieldLabel label="Founder Name" />
                                <Input
                                    value={about.founderName || ""}
                                    onChange={(e) => updateField("founderName", e.target.value)}
                                    placeholder="e.g. Basheer Ejiwumi"
                                />

                                <FieldLabel label="Founder Role" />
                                <Input
                                    value={about.founderRole || ""}
                                    onChange={(e) => updateField("founderRole", e.target.value)}
                                    placeholder="Founder & CEO"
                                />

                                <ImageDropzone
                                    label="Founder Image"
                                    helper="Use a clear 1:1 portrait."
                                    rounded="full"
                                    imageUrl={about.founderImage}
                                    onUpload={async (file) => {
                                        const res = await uploadAboutImageApi(file);
                                        if (res.success) {
                                            updateField("founderImage", res.url);
                                            updateField("founderImagePublicId", res.publicId);
                                        }
                                    }}
                                    onUrlChange={(url) => updateField("founderImage", url)}
                                />
                            </div>

                            <div>
                                <FieldLabel label="Founder Message" />
                                <Textarea
                                    value={about.founderMessage || ""}
                                    onChange={(e) => updateField("founderMessage", e.target.value)}
                                    rows={6}
                                    placeholder="A personal, human message from the founder to your users."
                                />
                            </div>
                        </div>
                    </Card>

                    {/* Company story + mission / vision */}
                    <Card className="p-6 bg-card/40 backdrop-blur-xl border border-border hover:shadow-lg transition">
                        <SectionHeader
                            icon={<Globe2 className="w-4 h-4 text-primary" />}
                            title="Story & Company DNA"
                            badge="Narrative Layer"
                            description="Tell the world who you are, why you exist, and where you're going."
                        />

                        <div className="mt-6 grid gap-6 md:grid-cols-[3fr,2fr]">
                            <div className="space-y-4">
                                <FieldLabel label="Story Title" />
                                <Input
                                    value={about.storyTitle || ""}
                                    onChange={(e) => updateField("storyTitle", e.target.value)}
                                    placeholder="How it all started"
                                />

                                <FieldLabel label="Story Content" />
                                <Textarea
                                    value={about.storyContent || ""}
                                    onChange={(e) => updateField("storyContent", e.target.value)}
                                    rows={8}
                                    placeholder="Long-form story content. You can paste rich narrative here."
                                />
                            </div>

                            <div className="space-y-4">
                                <FieldLabel label="Story Image URL" />
                                <Input
                                    value={about.storyImage || ""}
                                    onChange={(e) => updateField("storyImage", e.target.value)}
                                    placeholder="Illustration or team photo"
                                />

                                <FieldLabel label="Company Founded" />
                                <Input
                                    value={about.companyFounded || ""}
                                    onChange={(e) => updateField("companyFounded", e.target.value)}
                                    placeholder="2019"
                                />

                                <FieldLabel label="Headquarters" />
                                <Input
                                    value={about.headquarters || ""}
                                    onChange={(e) => updateField("headquarters", e.target.value)}
                                    placeholder="Ibadan, Oyo, NG"
                                />

                                <FieldLabel label="Active Users" />
                                <Input
                                    value={about.activeUsers || ""}
                                    onChange={(e) => updateField("activeUsers", e.target.value)}
                                    placeholder="12,000+"
                                />

                                <FieldLabel label="Countries Reached" />
                                <Input
                                    value={about.countriesReached || ""}
                                    onChange={(e) => updateField("countriesReached", e.target.value)}
                                    placeholder="40+"
                                />

                                <FieldLabel label="Employees" />
                                <Input
                                    value={about.employees || ""}
                                    onChange={(e) => updateField("employees", e.target.value)}
                                    placeholder="50+"
                                />
                            </div>
                        </div>

                        <div className="mt-8 grid gap-6 md:grid-cols-2 border-t border-border pt-6">
                            <div>
                                <SectionSubTitle icon={<Rocket className="w-4 h-4" />} label="Mission" />
                                <Textarea
                                    value={about.mission || ""}
                                    onChange={(e) => updateField("mission", e.target.value)}
                                    rows={4}
                                    placeholder="What are you here to achieve for your users?"
                                />
                            </div>
                            <div>
                                <SectionSubTitle icon={<ShieldCheck className="w-4 h-4" />} label="Vision" />
                                <Textarea
                                    value={about.vision || ""}
                                    onChange={(e) => updateField("vision", e.target.value)}
                                    rows={4}
                                    placeholder="What does the world look like if you win?"
                                />
                            </div>
                        </div>
                    </Card>

                    {/* Structured arrays: Stats, Values, Timeline, Team, Testimonials */}
                    <ContentArraysSection
                        about={about}
                        updateArrayItem={updateArrayItem}
                        addArrayItem={addArrayItem}
                        removeArrayItem={removeArrayItem}
                    />
                </div>

                {/* RIGHT PANEL – intelligence, preview, SEO */}
                <div className="space-y-6">
                    {/* Content health / analytics */}
                    <Card className="p-6 bg-card/40 backdrop-blur-xl border border-border">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Activity className="w-4 h-4 text-primary" />
                                <h2 className="text-lg font-semibold">Content Health</h2>
                            </div>
                            <Badge className="bg-primary/10 text-primary border-primary/20">
                                Live Metrics
                            </Badge>
                        </div>

                        {analytics ? (
                            <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                                <MiniMetric label="Stats Blocks" value={analytics.stats} />
                                <MiniMetric label="Core Values" value={analytics.values} />
                                <MiniMetric label="Timeline nodes" value={analytics.timeline} />
                                <MiniMetric label="Team members" value={analytics.team} />
                                <MiniMetric label="Testimonials" value={analytics.testimonials} />
                                <MiniMetric label="Partners" value={analytics.partners} />
                            </div>
                        ) : (
                            <p className="mt-4 text-xs text-muted-foreground">
                                Analytics will appear after saving content at least once.
                            </p>
                        )}
                    </Card>

                    {/* SEO Panel */}
                    <Card className="p-6 bg-card/40 backdrop-blur-xl border border-border">
                        <div className="flex items-center gap-2">
                            <Search className="w-4 h-4 text-primary" />
                            <h2 className="text-lg font-semibold">SEO Layer</h2>
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground">
                            Optimize how your About page appears in search and social previews.
                        </p>

                        <div className="mt-5 space-y-3">
                            <FieldLabel label="Meta Title" />
                            <Input
                                value={about.seo?.metaTitle || ""}
                                onChange={(e) =>
                                    updateField("seo", { ...about.seo, metaTitle: e.target.value })
                                }
                                placeholder="Brand – About"
                            />

                            <FieldLabel label="Meta Description" />
                            <Textarea
                                value={about.seo?.metaDescription || ""}
                                onChange={(e) =>
                                    updateField("seo", { ...about.seo, metaDescription: e.target.value })
                                }
                                rows={3}
                                placeholder="One sentence that cleanly describes this page for search engines."
                            />

                            <FieldLabel label="Keywords (comma-separated)" />
                            <Input
                                value={about.seo?.keywords?.join(", ") || ""}
                                onChange={(e) =>
                                    updateField("seo", {
                                        ...about.seo,
                                        keywords: e.target.value
                                            .split(",")
                                            .map((k) => k.trim())
                                            .filter(Boolean),
                                    })
                                }
                                placeholder="ai platform, support automation, etc"
                            />
                        </div>
                    </Card>

                    {/* Save control center */}
                    <Card className="p-6 bg-card/40 backdrop-blur-xl border border-border">
                        <h2 className="text-lg font-semibold mb-3">Publish Control Center</h2>
                        <p className="text-xs text-muted-foreground mb-4">
                            Save structural changes and push them to production when you are ready.
                        </p>

                        <Button
                            className="w-full mb-3"
                            size="lg"
                            onClick={handleSave}
                            disabled={saving}
                        >
                            {saving ? "Saving..." : "Save All Changes"}
                        </Button>

                        <div className="text-xs text-muted-foreground flex items-center justify-between">
                            <span>
                                Last updated:{" "}
                                {about.updatedBy?.name ? `By ${about.updatedBy.name}` : "Unknown"}
                            </span>
                            <span className="inline-flex items-center gap-1">
                                <BarChart3 className="w-3 h-3" />
                                Experience-safe
                            </span>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}

/* ================= REUSABLE MINI COMPONENTS ================= */

function KpiCard({
    title,
    value,
    icon,
    trend,
    glow,
}: {
    title: string;
    value: number | string;
    icon: React.ReactNode;
    trend: string;
    glow: string;
}) {
    return (
        <Card className="relative overflow-hidden bg-card/40 backdrop-blur-xl border border-border hover:shadow-lg transition">
            <div
                className={`pointer-events-none absolute inset-0 bg-linear-to-tr ${glow} to-transparent opacity-80`}
            />
            <div className="relative p-5 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{title}</span>
                    <div className="rounded-full bg-background/60 border border-border p-1.5">
                        {icon}
                    </div>
                </div>
                <div className="text-2xl font-semibold">{value}</div>
                <div className="text-xs text-brand/40">{trend}</div>
            </div>
        </Card>
    );
}

function SectionHeader({
    icon,
    title,
    badge,
    description,
}: {
    icon: React.ReactNode;
    title: string;
    badge: string;
    description: string;
}) {
    return (
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    {icon}
                </div>
                <h2 className="text-xl font-semibold">{title}</h2>
            </div>
            <div className="flex flex-col items-start md:items-end gap-1">
                <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                    {badge}
                </Badge>
                <p className="text-xs text-muted-foreground">{description}</p>
            </div>
        </div>
    );
}

function SectionSubTitle({
    icon,
    label,
}: {
    icon: React.ReactNode;
    label: string;
}) {
    return (
        <div className="mb-2 flex items-center gap-2 text-sm font-medium">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                {icon}
            </span>
            <span>{label}</span>
        </div>
    );
}

function FieldLabel({ label, required }: { label: string; required?: boolean }) {
    return (
        <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
            {label}
            {required && <span className="text-red-500">*</span>}
        </label>
    );
}

function MiniMetric({ label, value }: { label: string; value: number }) {
    return (
        <div className="rounded-lg border border-border bg-background/40 px-3 py-2 flex flex-col">
            <span className="text-[11px] text-muted-foreground">{label}</span>
            <span className="text-lg font-semibold">{value}</span>
        </div>
    );
}

/* ================= CONTENT ARRAYS SECTION ================= */

function ContentArraysSection({
    about,
    updateArrayItem,
    addArrayItem,
    removeArrayItem,
}: {
    about: AboutData;
    updateArrayItem: (field: keyof AboutData, index: number, item: any) => void;
    addArrayItem: (field: keyof AboutData, item: any) => void;
    removeArrayItem: (field: keyof AboutData, index: number) => void;
}) {
    return (
        <>
            {/* Stats */}
            <Card className="p-6 bg-card/40 backdrop-blur-xl border border-border">
                <SectionHeader
                    icon={<BarChart3 className="w-4 h-4 text-primary" />}
                    title="Stats"
                    badge="Quick Signal"
                    description="Metrics you want to show above the fold to build trust instantly."
                />
                <div className="mt-5 space-y-4">
                    {(about.stats || []).map((stat, index) => (
                        <div
                            key={index}
                            className="rounded-xl border border-border bg-background/40 p-4 space-y-3"
                        >
                            <div className="grid md:grid-cols-3 gap-3">
                                <Input
                                    placeholder="Title (e.g. Active Workspaces)"
                                    value={stat.title || ""}
                                    onChange={(e) =>
                                        updateArrayItem("stats", index, {
                                            ...stat,
                                            title: e.target.value,
                                        })
                                    }
                                />
                                <Input
                                    placeholder="Value (e.g. 12,430+)"
                                    value={stat.value || ""}
                                    onChange={(e) =>
                                        updateArrayItem("stats", index, {
                                            ...stat,
                                            value: e.target.value,
                                        })
                                    }
                                />
                                <Input
                                    placeholder="Icon (e.g. users, activity)"
                                    value={stat.icon || ""}
                                    onChange={(e) =>
                                        updateArrayItem("stats", index, {
                                            ...stat,
                                            icon: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="flex justify-end">
                                <Button
                                    size="xs"
                                    variant="outline"
                                    className="text-red-500 border-red-500/40 hover:bg-red-500/10"
                                    onClick={() => removeArrayItem("stats", index)}
                                >
                                    Remove
                                </Button>
                            </div>
                        </div>
                    ))}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            addArrayItem("stats", { title: "", value: "", icon: "" })
                        }
                    >
                        + Add Stat
                    </Button>
                </div>
            </Card>

            {/* Core Values */}
            <Card className="p-6 bg-card/40 backdrop-blur-xl border border-border">
                <SectionHeader
                    icon={<Target className="w-4 h-4 text-primary" />}
                    title="Core Values"
                    badge="Culture Layer"
                    description="Define the values that guide how your team builds and supports users."
                />
                <div className="mt-5 space-y-4">
                    {(about.values || []).map((value, index) => (
                        <div
                            key={index}
                            className="rounded-xl border border-border bg-background/40 p-4 space-y-3"
                        >
                            <Input
                                placeholder="Value title (e.g. Obsess over users)"
                                value={value.title || ""}
                                onChange={(e) =>
                                    updateArrayItem("values", index, {
                                        ...value,
                                        title: e.target.value,
                                    })
                                }
                            />
                            <Textarea
                                rows={3}
                                placeholder="Practical explanation of how this value shows up in your work."
                                value={value.description || ""}
                                onChange={(e) =>
                                    updateArrayItem("values", index, {
                                        ...value,
                                        description: e.target.value,
                                    })
                                }
                            />
                            <div className="flex justify-between items-center gap-3">
                                <Input
                                    placeholder="Icon token (optional)"
                                    value={value.icon || ""}
                                    onChange={(e) =>
                                        updateArrayItem("values", index, {
                                            ...value,
                                            icon: e.target.value,
                                        })
                                    }
                                />
                                <Button
                                    size="xs"
                                    variant="outline"
                                    className="text-red-500 border-red-500/40 hover:bg-red-500/10"
                                    onClick={() => removeArrayItem("values", index)}
                                >
                                    Remove
                                </Button>
                            </div>
                        </div>
                    ))}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            addArrayItem("values", {
                                title: "",
                                description: "",
                                icon: "",
                            })
                        }
                    >
                        + Add Value
                    </Button>
                </div>
            </Card>

            {/* Timeline */}
            <Card className="p-6 bg-card/40 backdrop-blur-xl border border-border">
                <SectionHeader
                    icon={<Activity className="w-4 h-4 text-primary" />}
                    title="Timeline"
                    badge="Milestones"
                    description="Map out the key milestones in your journey so far."
                />
                <div className="mt-5 space-y-4">
                    {(about.timeline || []).map((item, index) => (
                        <div
                            key={index}
                            className="rounded-xl border border-border bg-background/40 p-4 space-y-3"
                        >
                            <div className="grid md:grid-cols-[1fr,2fr] gap-3">
                                <Input
                                    placeholder="Year"
                                    value={item.year || ""}
                                    onChange={(e) =>
                                        updateArrayItem("timeline", index, {
                                            ...item,
                                            year: e.target.value,
                                        })
                                    }
                                />
                                <Input
                                    placeholder="Title"
                                    value={item.title || ""}
                                    onChange={(e) =>
                                        updateArrayItem("timeline", index, {
                                            ...item,
                                            title: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <Textarea
                                rows={3}
                                placeholder="Short narrative about this moment."
                                value={item.description || ""}
                                onChange={(e) =>
                                    updateArrayItem("timeline", index, {
                                        ...item,
                                        description: e.target.value,
                                    })
                                }
                            />
                            <div className="flex justify-end">
                                <Button
                                    size="xs"
                                    variant="outline"
                                    className="text-red-500 border-red-500/40 hover:bg-red-500/10"
                                    onClick={() => removeArrayItem("timeline", index)}
                                >
                                    Remove
                                </Button>
                            </div>
                        </div>
                    ))}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            addArrayItem("timeline", {
                                year: "",
                                title: "",
                                description: "",
                            })
                        }
                    >
                        + Add Timeline Item
                    </Button>
                </div>
            </Card>

            {/* Team */}
            <Card className="p-6 bg-card/40 backdrop-blur-xl border border-border">
                <SectionHeader
                    icon={<Users className="w-4 h-4 text-primary" />}
                    title="Leadership & Team"
                    badge="Trust Layer"
                    description="Show the humans behind the product to make your brand more relatable."
                />

                <div className="mt-5 space-y-4">
                    {(about.team || []).map((member, index) => (
                        <div
                            key={index}
                            className="rounded-xl border border-border bg-background/40 p-4 space-y-3"
                        >
                            <div className="grid md:grid-cols-2 gap-3">
                                <Input
                                    placeholder="Name"
                                    value={member.name || ""}
                                    onChange={(e) =>
                                        updateArrayItem("team", index, {
                                            ...member,
                                            name: e.target.value,
                                        })
                                    }
                                />
                                <Input
                                    placeholder="Role"
                                    value={member.role || ""}
                                    onChange={(e) =>
                                        updateArrayItem("team", index, {
                                            ...member,
                                            role: e.target.value,
                                        })
                                    }
                                />

                                {/* Image dropzone instead of raw input */}
                                <ImageDropzone
                                    label="Member Image"
                                    helper="Square headshot works best."
                                    rounded="full"
                                    imageUrl={member.image}
                                    onUpload={async (file) => {
                                        const res = await uploadAboutImageApi(file);
                                        if (res.success) {
                                            updateArrayItem("team", index, {
                                                ...member,
                                                image: res.url,
                                                imagePublicId: res.publicId,
                                            });
                                        }
                                    }}
                                    onUrlChange={(url) =>
                                        updateArrayItem("team", index, {
                                            ...member,
                                            image: url,
                                        })
                                    }
                                />

                                <Input
                                    placeholder="LinkedIn URL"
                                    value={member.linkedin || ""}
                                    onChange={(e) =>
                                        updateArrayItem("team", index, {
                                            ...member,
                                            linkedin: e.target.value,
                                        })
                                    }
                                />
                                <Input
                                    placeholder="Twitter URL"
                                    value={member.twitter || ""}
                                    onChange={(e) =>
                                        updateArrayItem("team", index, {
                                            ...member,
                                            twitter: e.target.value,
                                        })
                                    }
                                />
                                <Input
                                    placeholder="GitHub URL"
                                    value={member.github || ""}
                                    onChange={(e) =>
                                        updateArrayItem("team", index, {
                                            ...member,
                                            github: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <Textarea
                                placeholder="Short bio"
                                rows={3}
                                value={member.bio || ""}
                                onChange={(e) =>
                                    updateArrayItem("team", index, {
                                        ...member,
                                        bio: e.target.value,
                                    })
                                }
                            />

                            <div className="flex justify-end">
                                <Button
                                    size="xs"
                                    variant="outline"
                                    className="text-red-500 border-red-500/40 hover:bg-red-500/10"
                                    onClick={() => removeArrayItem("team", index)}
                                >
                                    Remove
                                </Button>
                            </div>
                        </div>
                    ))}

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            addArrayItem("team", {
                                name: "",
                                role: "",
                                image: "",
                                bio: "",
                                linkedin: "",
                                twitter: "",
                                github: "",
                            })
                        }
                    >
                        + Add Team Member
                    </Button>
                </div>
            </Card>

            {/* Testimonials */}
            <Card className="p-6 bg-card/40 backdrop-blur-xl border border-border">
                <SectionHeader
                    icon={<Users className="w-4 h-4 text-primary" />}
                    title="Testimonials"
                    badge="Social Proof"
                    description="Highlight authentic customer voices to reinforce trust."
                />

                <div className="mt-5 space-y-4">
                    {(about.testimonials || []).map((t, index) => (
                        <div
                            key={index}
                            className="rounded-xl border border-border bg-background/40 p-4 space-y-3"
                        >
                            <div className="grid md:grid-cols-2 gap-3">
                                <Input
                                    placeholder="Name"
                                    value={t.name || ""}
                                    onChange={(e) =>
                                        updateArrayItem("testimonials", index, {
                                            ...t,
                                            name: e.target.value,
                                        })
                                    }
                                />
                                <Input
                                    placeholder="Role / Company"
                                    value={t.role || ""}
                                    onChange={(e) =>
                                        updateArrayItem("testimonials", index, {
                                            ...t,
                                            role: e.target.value,
                                        })
                                    }
                                />

                                <ImageDropzone
                                    label="Customer Image"
                                    helper="Optional avatar for this quote."
                                    rounded="full"
                                    imageUrl={t.image}
                                    onUpload={async (file) => {
                                        const res = await uploadAboutImageApi(file);
                                        if (res.success) {
                                            updateArrayItem("testimonials", index, {
                                                ...t,
                                                image: res.url,
                                                imagePublicId: res.publicId,
                                            });
                                        }
                                    }}
                                    onUrlChange={(url) =>
                                        updateArrayItem("testimonials", index, {
                                            ...t,
                                            image: url,
                                        })
                                    }
                                />
                            </div>

                            <Textarea
                                placeholder="Customer quote"
                                rows={3}
                                value={t.quote || ""}
                                onChange={(e) =>
                                    updateArrayItem("testimonials", index, {
                                        ...t,
                                        quote: e.target.value,
                                    })
                                }
                            />

                            <div className="flex justify-end">
                                <Button
                                    size="xs"
                                    variant="outline"
                                    className="text-red-500 border-red-500/40 hover:bg-red-500/10"
                                    onClick={() => removeArrayItem("testimonials", index)}
                                >
                                    Remove
                                </Button>
                            </div>
                        </div>
                    ))}

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            addArrayItem("testimonials", {
                                name: "",
                                role: "",
                                image: "",
                                quote: "",
                            })
                        }
                    >
                        + Add Testimonial
                    </Button>
                </div>
            </Card>
        </>
    );
}

function ImageDropzone({
    label,
    helper,
    imageUrl,
    onUpload,
    onUrlChange,
    rounded = "xl",
}: {
    label: string;
    helper?: string;
    imageUrl?: string;
    onUpload: (file: File) => Promise<void>;  // <— match usage
    onUrlChange: (url: string) => void;       // <— match usage
    rounded?: "xl" | "full";
}) {
    const [uploading, setUploading] = useState(false);

    const onDrop = async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) return;

        try {
            setUploading(true);
            await onUpload(file);                  // <— use onUpload here
        } catch (err) {
            console.error(err);
            toast.error("Error uploading image");
        } finally {
            setUploading(false);
        }
    };

    const { getRootProps, getInputProps, isDragActive, isDragReject } =
        useDropzone({
            onDrop,
            accept: { "image/*": [] },
            maxFiles: 1,
        });

    const roundedPreviewClass =
        rounded === "full" ? "rounded-full" : "rounded-xl";

    return (
        <div className="space-y-3">
            <FieldLabel label={label} />

            <div
                {...getRootProps()}
                className={`
          relative flex flex-col items-center justify-center
          rounded-2xl border-2 border-dashed px-4 py-6
          cursor-pointer transition
          bg-card/40 backdrop-blur-xl
          ${isDragActive
                        ? "border-primary/70 bg-primary/5"
                        : "border-border hover:border-primary/60 hover:bg-card/60"
                    }
          ${isDragReject ? "border-red-500/70 bg-red-500/5" : ""}
        `}
            >
                <input {...getInputProps()} />

                <div className="flex flex-col items-center gap-2 text-center">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Sparkles className="w-4 h-4" />
                    </div>

                    <div className="space-y-1">
                        <p className="text-sm font-medium">
                            {uploading
                                ? "Uploading..."
                                : isDragActive
                                    ? "Drop the image here"
                                    : `Drag & drop ${label.toLowerCase()}, or click to upload`}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {helper ??
                                "PNG/JPG only, < 2MB. Will appear on the public About page."}
                        </p>
                    </div>
                </div>

                {imageUrl && (
                    <div className="mt-4 w-full">
                        <p className="mb-1 text-[11px] text-muted-foreground">Preview</p>
                        <div className="flex items-center gap-3">
                            <div
                                className={`overflow-hidden border border-border bg-background/60 ${roundedPreviewClass}`}
                            >
                                <img
                                    src={imageUrl}
                                    alt={`${label} preview`}
                                    className={
                                        rounded === "full"
                                            ? "h-16 w-16 object-cover"
                                            : "h-32 w-full object-cover"
                                    }
                                />
                            </div>
                            {rounded === "full" && (
                                <p className="text-[11px] text-muted-foreground">
                                    Avatar appears in circular format on the public page.
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Manual URL override */}
            <Input
                placeholder={`Or paste ${label.toLowerCase()} URL`}
                value={imageUrl || ""}
                onChange={(e) => onUrlChange(e.target.value)}
            />
        </div>
    );
}