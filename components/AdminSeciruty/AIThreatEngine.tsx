"use client";

import { Card } from "@/components/ui/card";
import { Bot } from "lucide-react";

export default function AIThreatEngine() {
  return (
    <Card className="p-6 bg-card/40 backdrop-blur-xl border">

      <div className="flex items-center gap-2">
        <Bot className="text-primary" />
        <h2 className="text-lg font-semibold">
          AI Threat Correlation Engine
        </h2>
      </div>

      <div className="mt-4 space-y-2 text-sm text-muted-foreground">

        <p>• 3 attack patterns correlated into botnet cluster</p>
        <p>• Login anomaly confidence: 91%</p>
        <p>• 2 IPs auto-flagged as malicious</p>
        <p>• Adaptive firewall rules activated</p>

      </div>

      <div className="mt-4 p-3 border rounded-xl bg-background/20">
        🔮 Prediction: Coordinated attack expected within 12–24 hours
      </div>

    </Card>
  );
}