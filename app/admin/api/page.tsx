"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ApiKeys() {
  return (
    <Card className="p-6 bg-card/40 backdrop-blur-xl border border-border">

      <h2 className="text-lg font-semibold">API Keys</h2>
      <p className="text-sm text-muted-foreground mt-2">
        Manage integrations and external services
      </p>

      <div className="mt-5 space-y-3">

        <div className="p-3 border rounded-xl text-sm">
          sk_live_••••••••••••••••
        </div>

        <Button className="w-full">Generate New Key</Button>

        <Button variant="outline" className="w-full">
          Revoke All Keys
        </Button>

      </div>

    </Card>
  );
}