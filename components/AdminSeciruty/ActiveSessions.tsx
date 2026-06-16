"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Monitor, Smartphone, LogOut } from "lucide-react";

const sessions = [
  {
    device: "Chrome - Windows",
    location: "Ibadan, Nigeria",
    type: "desktop",
    status: "active",
  },
  {
    device: "iPhone 14",
    location: "Lagos, Nigeria",
    type: "mobile",
    status: "active",
  },
];

export default function ActiveSessions() {
  return (
    <Card className="p-6 bg-card/40 backdrop-blur-xl border space-y-5">

      <h2 className="text-xl font-semibold">
        Active Sessions
      </h2>

      <div className="space-y-3">

        {sessions.map((s, i) => (
          <div key={i} className="flex items-center justify-between p-3 border rounded-xl">

            <div className="flex items-center gap-3">

              {s.type === "desktop" ? (
                <Monitor size={16} />
              ) : (
                <Smartphone size={16} />
              )}

              <div>
                <p className="text-sm font-medium">{s.device}</p>
                <p className="text-xs text-muted-foreground">
                  {s.location}
                </p>
              </div>

            </div>

            <div className="flex items-center gap-3">

              <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
                {s.status}
              </Badge>

              <Button size="sm" variant="outline">
                <LogOut size={14} />
              </Button>

            </div>

          </div>
        ))}

      </div>

      <Button variant="destructive" className="w-full">
        Logout All Devices
      </Button>

    </Card>
  );
}