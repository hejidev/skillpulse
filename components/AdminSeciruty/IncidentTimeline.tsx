"use client";

import { Card } from "@/components/ui/card";

export default function IncidentTimeline() {
  return (
    <Card className="p-6 bg-card/40 backdrop-blur-xl border">

      <h2 className="text-lg font-semibold mb-4">
        Incident Timeline (Forensics)
      </h2>

      <div className="space-y-4">

        <Item time="12:01" event="Login attempt blocked (IP anomaly)" />
        <Item time="12:04" event="AI flagged suspicious fingerprint" />
        <Item time="12:06" event="Rate limiting activated" />
        <Item time="12:09" event="Attack source auto-blocked" />

      </div>

    </Card>
  );
}

function Item({ time, event }: any) {
  return (
    <div className="flex justify-between border-b border-border pb-2">
      <p className="text-sm">{event}</p>
      <p className="text-xs text-muted-foreground">{time}</p>
    </div>
  );
}