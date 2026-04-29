"use client";

import { useQuery } from "@tanstack/react-query";
import API from "@/lib/api";

export default function SecurityAlert() {
    const { data = [] } = useQuery({
        queryKey: ["notifications"],
        queryFn: async () => {
            const res = await API.get("/settings/notifications");
            return res.data;
        },
    });

    const unreadAlerts = data.filter(
        (n: any) =>
            !n.read && n.message.includes("New device")
    );

    const securityAlerts = data.filter((n: any) =>
        n.message.includes("🚨")
    );

    if (unreadAlerts.length === 0) return null;

    return (
        <div className="p-4 mb-4 rounded-xl border bg-red-500/10 text-red-400">
            {securityAlerts.length > 0 && (
                <span className="absolute -top-1 right-0 bg-red-500 text-xs px-1 rounded-full">
                    New device detected on your account !
                </span>
            )}
        </div>
    );
}