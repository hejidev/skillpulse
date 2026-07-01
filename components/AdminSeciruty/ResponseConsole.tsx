"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import API from "@/lib/api";
import { toast } from "sonner";

export default function ResponseConsole() {
  const emergencyLockdown = async () => {
    try {
      await API.post("/admin/security/actions/emergency-lockdown", {
        scope: "global",
        reason: "Manual emergency lockdown from console",
      });
      toast.success("Emergency lockdown activated");
    } catch (err: any) {
      console.error("Lockdown error:", err);
      toast.error(err.response?.data?.message || "Failed to activate lockdown");
    }
  };

  // For these, in future you can show a dialog to enter IP/user, etc.
  const blockIp = async () => {
    // example hard-coded IP or open a modal
  };
  const isolateUser = async () => {
    // call /admin/security/actions/isolate-user with userId
  };

  return (
    <Card className="p-6 bg-card/40 backdrop-blur-xl border">
      <h2 className="text-lg font-semibold mb-4">Security Response Console</h2>

      <div className="grid gap-3">
        <Button variant="outline" onClick={blockIp}>
          Block IP Address
        </Button>
        <Button variant="outline">Enable Geo-Fencing</Button>
        <Button variant="outline">Activate Rate Limiting</Button>
        <Button variant="outline" onClick={isolateUser}>
          Isolate User Session
        </Button>
        <Button
          className="bg-red-500 hover:bg-red-600"
          onClick={emergencyLockdown}
        >
          Emergency Lockdown
        </Button>
      </div>
    </Card>
  );
}