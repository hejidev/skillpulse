"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Smartphone, KeyRound } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import API from "@/lib/api";
import { useRouter } from "next/navigation";
import { AdminPageSkeleton } from "@/app/admin/admin-skeleton";

export default function MFAControlPanel() {
  const router = useRouter();

  const { data: settings, isLoading: settingsLoading } = useQuery({
    queryKey: ["system-settings"],
    queryFn: () => API.get("/admin/settings").then((r) => r.data),
  });

  const { data: mfaStats, isLoading: statsLoading } = useQuery({
    queryKey: ["mfa-stats"],
    queryFn: () => API.get("/admin/security/mfa-stats").then((r) => r.data),
  });

  const enforcementLabel =
    settingsLoading || !settings
      ? "Loading…"
      : settings.enforce2FA
        ? "On"
        : "Off";

  const usersWithout2FA =
    statsLoading || !mfaStats ? "…" : mfaStats.usersWithout2FA;

  if (settingsLoading || !settings) {
    return <AdminPageSkeleton />;
  }

  return (
    <Card className="p-6 bg-card/40 backdrop-blur-xl border space-y-5">

      <div className="p-4 border rounded-xl flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="text-sm">
          <p className="font-semibold">Your 2FA status</p>
          <p className="text-xs text-muted-foreground">
            Protect this admin account with an authenticator app and backup codes.
          </p>
        </div>
        <div className="flex gap-2">
          {/* Show Enable / Manage based on twoFactorEnabled from /2fa/status */}
          <Button size="sm" variant="outline" onClick={() => router.push("/admin/security/mfa-setup")}>
            Configure 2FA
          </Button>
          <Button size="sm" variant="outline" onClick={() => router.push("/admin/security/mfa-backup")}>
            Backup codes
          </Button>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <ShieldCheck size={18} />
          Multi-Factor Authentication
        </h2>
        <p className="text-sm text-muted-foreground">
          Add extra layer of protection to your account
        </p>
      </div>

      {/* STATUS */}
      <Card className="p-4 space-y-2">
        <h2 className="font-semibold">MFA / 2FA Control</h2>
        <p>2FA Enforcement: {enforcementLabel}</p>
        <p>
          Users without 2FA:{" "}
          <button
            className="underline text-sm"
            onClick={() => router.push("/admin/users?filter=no-2fa")}
            disabled={statsLoading || !mfaStats}
          >
            {usersWithout2FA}
          </button>
        </p>
      </Card>

      {/* OPTIONS */}
      <div className="space-y-3">
        <div className="flex justify-between items-center p-3 border rounded-xl">
          <span className="text-sm flex items-center gap-2">
            <Smartphone size={14} /> Authenticator App
          </span>
          <Button variant="outline" size="sm">
            Setup
          </Button>
        </div>

        <div className="flex justify-between items-center p-3 border rounded-xl">
          <span className="text-sm flex items-center gap-2">
            <KeyRound size={14} /> Backup Codes
          </span>
          <Button variant="outline" size="sm">
            Generate
          </Button>
        </div>
      </div>
    </Card>
  );
}