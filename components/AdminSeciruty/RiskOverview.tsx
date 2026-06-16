"use client";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function RiskOverview() {
  return (
    <Card className="p-6 bg-card/40 backdrop-blur-xl border">

      <h2 className="text-lg font-semibold mb-4">
        System Risk Overview
      </h2>

      <Risk label="Account Security Risk" value={72} />
      <Risk label="Network Exposure" value={64} />
      <Risk label="API Abuse Level" value={41} />
      <Risk label="Device Trust Score" value={88} />

    </Card>
  );
}

function Risk({ label, value }: any) {
  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <Progress value={value} />
    </div>
  );
}