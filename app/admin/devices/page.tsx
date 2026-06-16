"use client";

import { Card } from "@/components/ui/card";

export default function DeviceManager() {
  return (
    <Card className="p-6 bg-card/40 backdrop-blur-xl border border-border">

      <h2 className="text-lg font-semibold">Device Manager</h2>

      <div className="mt-4 space-y-3 text-sm">

        <p>💻 Windows - Chrome (Active)</p>
        <p>📱 iPhone - Safari (Trusted)</p>
        <p>💻 Unknown device - Lagos IP (Flagged)</p>

      </div>

    </Card>
  );
}