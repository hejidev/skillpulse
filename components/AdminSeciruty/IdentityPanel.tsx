"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Shield, Mail, User, KeyRound } from "lucide-react";

export default function IdentityPanel() {
  return (
    <Card className="p-6 bg-card/40 backdrop-blur-xl border space-y-6">

      <div>
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <User size={18} />
          Identity Control Center
        </h2>
        <p className="text-sm text-muted-foreground">
          Manage your account credentials and recovery identity
        </p>
      </div>

      {/* NAME */}
      <div className="space-y-2">
        <label className="text-sm">Full Name</label>
        <Input placeholder="Enter full name" />
      </div>

      {/* EMAIL */}
      <div className="space-y-2">
        <label className="text-sm flex items-center gap-2">
          <Mail size={14} /> Email Address
        </label>
        <Input placeholder="admin@company.com" />
      </div>

      {/* PASSWORD */}
      <div className="space-y-2">
        <label className="text-sm flex items-center gap-2">
          <KeyRound size={14} /> Password
        </label>
        <Input type="password" placeholder="••••••••" />
      </div>

      {/* STATUS */}
      <div className="flex items-center justify-between">
        <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
          Identity Verified
        </Badge>

        <Button>
          Update Credentials
        </Button>
      </div>

    </Card>
  );
}