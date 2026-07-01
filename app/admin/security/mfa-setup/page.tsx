// app/admin/security/mfa-setup/page.tsx
"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import API from "@/lib/api";

export default function MfaSetupPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-mfa-status"],
    queryFn: () => API.get("/admin/security/mfa-status").then((r) => r.data),
  });

  if (isLoading) {
    return <p className="p-4 text-sm">Loading 2FA status…</p>;
  }

  return (
    <div className="max-w-xl mx-auto py-6">
      <Card className="p-6 space-y-4">
        <h1 className="text-xl font-semibold">Configure Two-Factor Authentication</h1>
        {/* TODO: implement actual QR, secret, verify code, etc. */}
        <p className="text-sm text-muted-foreground">
          Here you will configure your authenticator app and confirm your 2FA setup.
        </p>
        <Button disabled>Coming soon</Button>
      </Card>
    </div>
  );
}