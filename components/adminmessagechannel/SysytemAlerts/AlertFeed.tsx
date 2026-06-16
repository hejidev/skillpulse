"use client";

export default function AlertFeed({
  alerts,
  activeId,
  setActiveId,
}: any) {
  return (
    <div className="flex-1 overflow-auto space-y-2 pr-1">

      {alerts.length === 0 && (
        <div className="text-center text-sm text-muted-foreground mt-10">
          No system alerts
        </div>
      )}

      {alerts.map((a: any, index: number) => {

        const uniqueKey =
          a._id
            ? `${a._id}-${index}`
            : `alert-${index}`;

        return (
          <div
            key={uniqueKey}
            onClick={() => setActiveId(a._id)}
            className={`
              p-3 rounded-2xl border cursor-pointer transition
              hover:border-red-500/40
              ${
                activeId === a._id
                  ? "bg-red-500/10 border-red-500"
                  : "bg-background"
              }
            `}
          >

            <div className="flex items-start justify-between gap-3">

              {/* LEFT */}
              <div className="flex-1 min-w-0">

                <p className="font-semibold text-sm line-clamp-1">
                  {a.title}
                </p>

                <p className="text-xs text-muted-foreground">
                  {a.type}
                </p>

                <p className="text-[11px] text-muted-foreground mt-1">
                  {a.createdAt
                    ? new Date(a.createdAt).toLocaleString()
                    : "Unknown time"}
                </p>

              </div>

              {/* RIGHT */}
              <span
                className={`
                  text-xs px-2 py-1 rounded-full font-bold whitespace-nowrap
                  ${
                    a.priority === "critical"
                      ? "bg-red-500/20 text-red-400"
                      : a.priority === "high"
                      ? "bg-orange-500/20 text-orange-400"
                      : "bg-yellow-500/20 text-yellow-400"
                  }
                `}
              >
                {a.priority || "medium"}
              </span>

            </div>

          </div>
        );
      })}
    </div>
  );
}