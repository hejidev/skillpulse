// components/adminmessagechannel/ScheduledChannel.tsx

"use client";

import {
    CalendarClock,
    Clock3,
    Send,
} from "lucide-react";

import MessageCard from "./MessageCard";

interface Props {
    messages: any[];
}

export default function ScheduledChannel({
    messages,
}: Props) {

    const scheduledMessages = messages.filter(
        (msg) =>
            msg.status === "scheduled"
    );

    const nextScheduled =
        [...scheduledMessages]
            .sort(
                (a, b) =>
                    new Date(a.scheduledFor).getTime() -
                    new Date(b.scheduledFor).getTime()
            )[0] || null;

    return (
        <div className="space-y-6">

            {/* HEADER */}
            <div className="bg-background border border-border rounded-3xl p-6">

                <div className="flex items-center justify-between">

                    <div className="flex items-center gap-4">

                        <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center">

                            <CalendarClock className="text-cyan-400" />

                        </div>

                        <div>

                            <h2 className="text-2xl font-black">
                                Scheduled Messages
                            </h2>

                            <p className="text-muted-foreground text-sm mt-1">
                                Future broadcasts waiting for delivery
                            </p>

                        </div>

                    </div>

                    <div className="px-4 py-2 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">

                        <p className="text-xs text-muted-foreground">
                            Total Scheduled
                        </p>

                        <h3 className="text-xl font-black text-cyan-400">

                            {scheduledMessages.length}

                        </h3>

                    </div>

                </div>

            </div>

            {/* NEXT DELIVERY */}
            {nextScheduled && (
                <div className="bg-background border border-border rounded-3xl p-5">

                    <div className="flex items-center justify-between">

                        <div className="flex items-center gap-3">

                            <Clock3 className="text-yellow-400" />

                            <div>

                                <h3 className="font-black">
                                    Next Scheduled Delivery
                                </h3>

                                <p className="text-sm text-muted-foreground mt-1">

                                    {nextScheduled.title}

                                </p>

                            </div>

                        </div>

                        <div className="text-right">

                            <p className="text-xs text-muted-foreground">

                                Delivery Time

                            </p>

                            <p className="font-bold text-cyan-400">

                                {nextScheduled.scheduledFor
                                    ? new Date(
                                        nextScheduled.scheduledFor
                                    ).toLocaleString()
                                    : "Not specified"}

                            </p>

                        </div>

                    </div>

                </div>
            )}

            {/* EMPTY STATE */}
            {scheduledMessages.length === 0 && (
                <div className="bg-background border border-dashed border-border rounded-3xl p-10 text-center">

                    <div className="w-20 h-20 mx-auto rounded-full bg-cyan-500/10 flex items-center justify-center mb-5">

                        <Send
                            size={32}
                            className="text-cyan-400"
                        />

                    </div>

                    <h3 className="text-2xl font-black">
                        No Scheduled Messages
                    </h3>

                    <p className="text-muted-foreground mt-2 max-w-md mx-auto">

                        You currently have no queued broadcasts
                        waiting for delivery.

                    </p>

                </div>
            )}

            {/* SCHEDULED FEED */}
            <div className="space-y-4">

                {scheduledMessages.map(
                    (item, index) => (

                        <MessageCard
                            key={`${item._id}-${index}`}
                            item={item}
                        />

                    )
                )}

            </div>

        </div>
    );
}