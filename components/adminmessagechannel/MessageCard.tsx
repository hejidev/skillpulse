// components/messages/MessageCard.tsx

"use client";

import {
    CheckCheck,
    Clock3,
    AlertTriangle,
    Archive,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";

interface MessageCardProps {
    item: any;
}

export default function MessageCard({
    item,
}: MessageCardProps) {

    const archiveMessage = async () => {
        try {
            const token =
                localStorage.getItem("token");

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/messages/archive/${item._id}`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await res.json();

            if (!data.success) {
                throw new Error();
            }
            toast.success("Message archived");
        } catch (err) {
            toast.error("Archive failed");
        }
    };

    return (
        <div className="bg-background border border-border rounded-3xl p-5 hover:border-cyan-500/40 transition-all duration-300">

            <div className="flex items-start justify-between gap-4">

                {/* LEFT */}
                <div className="flex-1">

                    <div className="flex items-center gap-3 mb-3">

                        <h3 className="font-black text-lg">
                            {item.title}
                        </h3>

                        <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${item.priority === "critical"
                                ? "bg-red-500/20 text-red-400"
                                : item.priority === "high"
                                    ? "bg-orange-500/20 text-orange-400"
                                    : item.priority === "medium"
                                        ? "bg-yellow-500/20 text-yellow-400"
                                        : "bg-cyan-500/20 text-cyan-400"
                                }`}
                        >
                            {item.priority}
                        </span>

                    </div>

                    <p className="text-muted-foreground leading-relaxed">
                        {item.content}
                    </p>

                    {/* DELIVERY */}
                    <div className="flex flex-wrap items-center gap-4 mt-5 text-sm">

                        <div className="flex items-center gap-2 text-emerald-400">
                            <CheckCheck size={15} />
                            {item.deliveryStats?.delivered || 0} delivered
                        </div>

                        <div className="flex items-center gap-2 text-yellow-400">
                            <Clock3 size={15} />
                            {item.deliveryStats?.sent || 0} sent
                        </div>

                        <div className="flex items-center gap-2 text-red-400">
                            <AlertTriangle size={15} />
                            {item.deliveryStats?.failed || 0} failed
                        </div>

                    </div>

                </div>

                {/* RIGHT */}
                <div className="flex flex-col items-end gap-3">
                    <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${item.status === "sent"
                            ? "bg-green-500/10 text-green-400"
                            : item.status === "failed"
                                ? "bg-red-500/10 text-red-400"
                                : item.status === "scheduled"
                                    ? "bg-yellow-500/10 text-yellow-400"
                                    : "bg-cyan-500/10 text-cyan-400"
                            }`} > {item.status}
                    </span>
                    {item.deliveredAt && (
                        <span className="text-xs text-muted-foreground"
                        >
                            Delivered: {" "} {new Date(item.deliveredAt).toLocaleString()}
                        </span>)}
                </div>
                <Button
                    variant="outline"
                    disabled={item.category === "archived"}
                    onClick={archiveMessage}
                    className={
                        item.category === "archived"
                            ? "border-emerald-500/30 text-emerald-400 cursor-not-allowed"
                            : ""
                    }
                >
                    {item.category === "archived" ? (
                        <>
                            <Archive size={15} />
                            Archived
                        </>
                    ) : (
                        "Archive"
                    )}
                </Button>
            </div>

        </div>
    );
}
