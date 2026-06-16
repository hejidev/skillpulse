"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Key, Mail, Phone } from "lucide-react";

export default function RecoveryPanel() {
  return (
    <Card className="p-6 bg-card/40 backdrop-blur-xl border space-y-5">

      <h2 className="font-semibold">Account Recovery</h2>

      <div className="space-y-3">

        <RecoveryOption
          icon={<Mail size={16} />}
          title="Recovery Email"
          desc="admin@backup.com"
        />

        <RecoveryOption
          icon={<Phone size={16} />}
          title="Recovery Phone"
          desc="+234 *** *** 0069"
        />

        <RecoveryOption
          icon={<Key size={16} />}
          title="Backup Codes"
          desc="8 unused codes available"
        />

      </div>

      <Button className="w-full">
        Generate New Backup Codes
      </Button>

    </Card>
  );
}

function RecoveryOption({ icon, title, desc }: any) {
  return (
    <div className="flex items-center justify-between border p-3 rounded-xl">
      <div className="flex items-center gap-2">
        {icon}
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="text-xs text-muted-foreground">{desc}</p>
        </div>
      </div>
    </div>
  );
}