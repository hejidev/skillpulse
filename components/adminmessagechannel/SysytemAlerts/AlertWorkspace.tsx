// components/messages/alerts/AlertWorkspace.tsx
"use client";

export default function AlertWorkspace({ alert }: any) {
    if (!alert) {
        return (
            <div className="flex items-center justify-center h-full text-muted-foreground">
                Select a system alert
            </div>
        );
    }

    return (
        <div className="p-5 space-y-4 overflow-auto">

            <div>
                <h2 className="text-xl font-black">
                    {alert.title}
                </h2>

                <p className="text-sm text-muted-foreground">
                    {alert.type}
                </p>
            </div>
            <div className="flex items-center gap-2 mt-2">
                <span
                    className={`
      px-2 py-1 rounded-full text-xs font-bold
      ${alert.priority === "critical"
                            ? "bg-red-500/20 text-red-400"
                            : alert.priority === "high"
                                ? "bg-orange-500/20 text-orange-400"
                                : "bg-yellow-500/20 text-yellow-400"
                        }
    `}
                >
                    {alert.priority}
                </span>

                <span className="text-xs text-muted-foreground">
                    {new Date(alert.createdAt).toLocaleString()}
                </span>
            </div>

            <div className="p-4 border rounded-2xl bg-background space-y-2">
                {(() => {
                    try {
                        const parsed =
                            typeof alert.content === "string"
                                ? JSON.parse(alert.content)
                                : alert.content;

                        return (
                            <>
                                {parsed.path && (
                                    <p>
                                        <span className="font-semibold">Endpoint:</span>{" "}
                                        {parsed.path}
                                    </p>
                                )}

                                {parsed.method && (
                                    <p>
                                        <span className="font-semibold">Method:</span>{" "}
                                        {parsed.method}
                                    </p>
                                )}

                                {parsed.duration && (
                                    <p>
                                        <span className="font-semibold">Duration:</span>{" "}
                                        {parsed.duration}ms
                                    </p>
                                )}

                                {parsed.status && (
                                    <p>
                                        <span className="font-semibold">Status:</span>{" "}
                                        {parsed.status}
                                    </p>
                                )}

                                {parsed.ip && (
                                    <p>
                                        <span className="font-semibold">IP:</span>{" "}
                                        {parsed.ip}
                                    </p>
                                )}
                            </>
                        );
                    } catch {
                        return <p>{alert.content}</p>;
                    }
                })()}
            </div>

            {/* TIMELINE */}
            <div className="space-y-2">
                <h3 className="font-semibold text-sm">
                    Incident Timeline
                </h3>

                {alert.timeline?.map((t: any, i: number) => (
                    <div key={i} className="text-xs border-l pl-3">
                        <p>{t.event}</p>
                        <p className="text-xs text-muted-foreground">
                            No incident timeline available
                        </p>
                        <span className="text-muted-foreground">
                            {new Date(t.createdAt).toLocaleString()}
                        </span>
                    </div>
                ))}
            </div>

        </div>
    );
}