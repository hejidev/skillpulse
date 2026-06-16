"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

const logs = [
  {
    event: "Successful Login",
    ip: "102.89.21.11",
    time: "10 min ago",
    status: "safe",
  },
  {
    event: "Failed Login Attempt",
    ip: "197.210.44.10",
    time: "1 hr ago",
    status: "warning",
  },
  {
    event: "Password Changed",
    ip: "102.88.10.22",
    time: "Yesterday",
    status: "safe",
  },
];

export default function LoginHistory() {
  return (
    <Card className="p-6 bg-card/40 backdrop-blur-xl border space-y-4">

      <h2 className="font-semibold">Login History</h2>

      {logs.map((l, i) => (
        <div key={i} className="flex justify-between items-center border p-3 rounded-xl">

          <div>
            <p className="text-sm font-medium">{l.event}</p>
            <p className="text-xs text-muted-foreground">
              IP: {l.ip}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Clock size={14} className="text-muted-foreground" />

            <span className="text-xs text-muted-foreground">
              {l.time}
            </span>

            <Badge
              className={
                l.status === "warning"
                  ? "bg-red-500/10 text-red-400"
                  : "bg-green-500/10 text-green-400"
              }
            >
              {l.status}
            </Badge>
          </div>

        </div>
      ))}

    </Card>
  );
}