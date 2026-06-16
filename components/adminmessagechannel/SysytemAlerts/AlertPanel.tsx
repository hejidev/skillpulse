// components/messages/alerts/AlertPanel.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

import { Bot, Zap } from "lucide-react";

export default function AlertPanel({ alert }: any) {
    const handleAction = async (action: string) => {
        if (!alert?._id) return;

        try {
            const url = `${process.env.NEXT_PUBLIC_API_URL}/system-alerts/${alert._id}/${action}`;

            console.log("CALLING:", url);

            const res = await fetch(url, {
                method: "PATCH",
                credentials: "include",
            });

            const data = await res.json().catch(() => null);

            console.log("RESPONSE:", res.status, data);

            if (!res.ok) {
                toast.error(data?.message || `${action} failed`);
                return;
            }

            toast.success(`${action} successful`);
        } catch (err) {
            console.error(err);
            toast.error("Network error");
        }
    };

    const getSuggestion = () => {
        const alertType =
            alert?.title
                ?.replace("SOC ALERT: ", "")
                ?.trim();

        switch (alertType) {

            case "auth_failure":
                return "Review failed login attempts and verify suspicious IP activity.";

            case "system_error":
                return "Inspect server logs and restart affected services.";

            case "db_failure":
                return "Verify MongoDB connectivity and replica status.";

            case "api_abuse":
                return "Rate-limit suspicious requests and inspect API logs.";

            case "suspicious_activity":
                return "Review abnormal user behavior and audit account actions.";

            default:
                return "No AI recommendation available.";
        }
    };

    return (
        <div className="space-y-4">

            {/* AI */}
            <Card className="p-4">
                <div className="flex items-center gap-2">
                    <Bot size={16} />
                    <h3 className="font-semibold">
                        AI Analysis
                    </h3>
                </div>

                <p className="text-xs text-muted-foreground mt-2">
                    Suggested resolution
                </p>

                <div className="mt-2 text-sm border p-3 rounded-xl bg-background">
                    {alert
                        ? getSuggestion()
                        : "Select alert to analyze"}
                </div>

                <Button className="w-full mt-3" variant="outline">
                    Apply Suggestion
                </Button>
            </Card>

            {/* ACTIONS */}
            <Card className="p-4 space-y-2">
                <h3 className="font-semibold">Actions</h3>

                <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => handleAction("acknowledge")}
                >
                    Acknowledge
                </Button>

                <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => handleAction("resolve")}
                >
                    Resolve
                </Button>

                <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => handleAction("escalate")}
                >
                    Escalate
                </Button>
            </Card>

            {/* SYSTEM STATUS */}
            <Card className="p-4">
                <div className="flex items-center gap-2 text-green-400">
                    <Zap size={14} />
                    <p className="text-sm">System Healthy</p>
                </div>

                <p className="text-xs text-muted-foreground mt-2">
                    All services operational
                </p>
            </Card>

        </div>
    );
}