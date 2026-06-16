"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ThreatMapPanel() {
  return (
    <Card className="p-6 bg-card/40 backdrop-blur-xl border">

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          Global Attack Intelligence
        </h2>

        <Badge className="bg-red-500/10 text-red-400 border-red-500/20">
          Live Threat Map
        </Badge>
      </div>

      <div className="mt-5 h-[280px] rounded-xl bg-gradient-to-br from-red-500/10 via-background to-blue-500/10 flex items-center justify-center text-sm text-muted-foreground">
        🌍 Live attack heatmap (geo IPs, botnets, intrusion sources)
      </div>

      <div className="grid grid-cols-3 gap-3 mt-5 text-xs">
        <Stat label="Blocked Attacks" value="14,892" />
        <Stat label="Active Threats" value="42" />
        <Stat label="High Risk Regions" value="9" />
      </div>

    </Card>
  );
}

function Stat({ label, value }: any) {
  return (
    <div className="p-3 border rounded-xl bg-background/20">
      <p className="font-semibold">{value}</p>
      <p className="text-muted-foreground">{label}</p>
    </div>
  );
}