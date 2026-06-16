// components/messages/BroadcastChannel.tsx

"use client";

import {
    BellRing,
    Send,
} from "lucide-react";

import MessageCard from "./MessageCard";

interface Props {
    messages: any[];
    title: string;
    content: string;
    segment: string;
    priority: string;
    sending: boolean;
    setTitle: any;
    setContent: any;
    setSegment: any;
    setPriority: any;
    sendBroadcast: () => void;
    sendMode: string;
    setSendMode: any;
    scheduledFor: string;
    setScheduledFor: any;
}

export default function BroadcastChannel({
    messages,
    title,
    content,
    segment,
    priority,
    sending,
    setTitle,
    setContent,
    setSegment,
    setPriority,
    sendMode,
    setSendMode,
    scheduledFor,
    setScheduledFor,
    sendBroadcast,
}: Props) {
    const broadcasts = messages.filter(
        (msg) => msg.category === "broadcast"
    );

    return (
        <div className="space-y-6">

            {/* COMPOSER */}
            <div className="bg-background border border-border rounded-3xl p-6">

                <div className="flex items-center justify-between mb-6">

                    <div>

                        <h2 className="text-2xl font-black">
                            Broadcast Composer
                        </h2>

                        <p className="text-muted-foreground text-sm mt-1">
                            Send realtime broadcasts & platform notifications
                        </p>

                    </div>

                    <BellRing className="text-cyan-400" />

                </div>

                <div className="space-y-4">

                    <input
                        type="text"
                        value={title}
                        onChange={(e) =>
                            setTitle(e.target.value)
                        }
                        placeholder="Broadcast title..."
                        className="w-full h-12 px-4 rounded-2xl bg-background border border-border outline-none focus:border-cyan-500"
                    />

                    <textarea
                        value={content}
                        onChange={(e) =>
                            setContent(e.target.value)
                        }
                        rows={5}
                        placeholder="Write your message..."
                        className="w-full p-4 rounded-2xl bg-background border border-border outline-none focus:border-cyan-500 resize-none"
                    />

                    <div className="flex flex-col gap-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                            <select
                                value={segment}
                                onChange={(e) =>
                                    setSegment(e.target.value)
                                }
                                className="h-12 rounded-2xl bg-background border border-border px-4 outline-none"
                            >
                                <option value="all">
                                    All Users
                                </option>

                                <option value="premium">
                                    Premium Users
                                </option>

                                <option value="users">
                                    Users
                                </option>

                                <option value="admins">
                                    Admins
                                </option>

                            </select>

                            <select
                                value={priority}
                                onChange={(e) =>
                                    setPriority(e.target.value)
                                }
                                className="h-12 rounded-2xl bg-background border border-border px-4 outline-none"
                            >
                                <option value="low">
                                    Normal Priority
                                </option>

                                <option value="high">
                                    High Priority
                                </option>

                                <option value="critical">
                                    Critical Alert
                                </option>

                            </select>

                            <select
                                value={sendMode}
                                onChange={(e) =>
                                    setSendMode(e.target.value)
                                }
                                className="h-12 rounded-2xl bg-background border border-border pl-1 pr-4 outline-none text-sm"
                            >
                                <option value="instant">
                                    Send Instantly
                                </option>

                                <option value="scheduled">
                                    Schedule Delivery
                                </option>

                            </select>

                            {sendMode === "scheduled" && (
                                <input
                                    type="datetime-local"
                                    value={scheduledFor}
                                    onChange={(e) =>
                                        setScheduledFor(e.target.value)
                                    }
                                    className="h-12 rounded-2xl bg-background border border-border px-1 outline-none"
                                />
                            )}

                        </div>

                        <button
                            onClick={sendBroadcast}
                            disabled={sending}
                            className="h-12 rounded-2xl bg-cyan-500 hover:bg-cyan-400 transition-all text-white font-bold flex items-center justify-center gap-2"
                        >
                            <Send size={18} />

                            {sending
                                ? "Processing..."
                                : sendMode === "scheduled"
                                    ? "Schedule Broadcast"
                                    : "Send Broadcast"}
                        </button>

                    </div>

                </div>

            </div>

            {/* FEED */}
            <div className="space-y-4">

                {broadcasts.map((item, index) => (
                    <MessageCard
                        key={`${item._id}-${index}`}
                        item={item}
                    />
                ))}

            </div>

        </div>
    );
}