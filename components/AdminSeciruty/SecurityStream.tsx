"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function SecurityStream() {
  return (
    <Card className="p-6 bg-card/40 backdrop-blur-xl border">

      <h2 className="text-lg font-semibold mb-4">
        Security Event Firehose
      </h2>

      <div className="space-y-3 font-mono text-xs">

        <Event type="BLOCKED" msg="Brute force detected" ip="102.89.11.22" />
        <Event type="ALERT" msg="Suspicious login fingerprint" ip="185.22.10.9" />
        <Event type="INFO" msg="Rate limit triggered" ip="41.203.55.2" />

      </div>

    </Card>
  );
}

function Event({ type, msg, ip }: any) {
  const color =
    type === "BLOCKED"
      ? "text-red-400"
      : type === "ALERT"
      ? "text-orange-400"
      : "text-blue-400";

  return (
    <div className="flex justify-between border-b border-border pb-2">
      <div>
        <p className={`${color} font-semibold`}>{type}</p>
        <p className="text-muted-foreground">{msg}</p>
      </div>

      <p className="text-muted-foreground">{ip}</p>
    </div>
  );
}