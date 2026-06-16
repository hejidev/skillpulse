"use client";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function IdentityRiskPanel() {
  return (
    <Card className="p-6 bg-card/40 backdrop-blur-xl border">

      <h2 className="text-lg font-semibold mb-4">
        Identity Risk Score
      </h2>

      <Risk label="Account Safety" value={86} />
      <Risk label="Password Strength" value={72} />
      <Risk label="Login Trust Level" value={91} />
      <Risk label="Device Integrity" value={78} />

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