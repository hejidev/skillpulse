"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Monitor, Smartphone } from "lucide-react";

const sessions = [
  { device: "Windows Chrome", location: "Ibadan", active: true },
  { device: "iPhone 15", location: "Lagos", active: false },
];

export default function SessionMonitor() {
  return (
    <Card className="p-6 bg-card/40 backdrop-blur-xl border">

      <h2 className="text-lg font-semibold mb-4">
        Live Sessions
      </h2>

      <div className="space-y-3">

        {sessions.map((s, i) => (
          <div key={i} className="flex justify-between border p-3 rounded-xl">

            <div className="flex gap-2 items-center">
              <Monitor size={14} />
              <div>
                <p className="text-sm">{s.device}</p>
                <p className="text-xs text-muted-foreground">{s.location}</p>
              </div>
            </div>

            <Badge
              className={
                s.active
                  ? "bg-green-500/10 text-green-400"
                  : "bg-red-500/10 text-red-400"
              }
            >
              {s.active ? "Active" : "Inactive"}
            </Badge>

          </div>
        ))}

      </div>

    </Card>
  );
}