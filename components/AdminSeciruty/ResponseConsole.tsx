"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ResponseConsole() {
  return (
    <Card className="p-6 bg-card/40 backdrop-blur-xl border">

      <h2 className="text-lg font-semibold mb-4">
        Security Response Console
      </h2>

      <div className="grid gap-3">

        <Button variant="outline">Block IP Address</Button>
        <Button variant="outline">Enable Geo-Fencing</Button>
        <Button variant="outline">Activate Rate Limiting</Button>
        <Button variant="outline">Isolate User Session</Button>
        <Button className="bg-red-500 hover:bg-red-600">
          Emergency Lockdown
        </Button>

      </div>

    </Card>
  );
}