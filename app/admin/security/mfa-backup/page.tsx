// app/admin/security/mfa-backup/page.tsx
"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import API from "@/lib/api";

interface MfaStatus {
  backupCodesCount: number;
}

export default function MfaBackupCodesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-mfa-status"],
    queryFn: () => API.get("/admin/security/mfa-status").then((r) => r.data as MfaStatus),
  });

  if (isLoading) {
    return <p className="p-4 text-sm">Loading backup codes…</p>;
  }

  return (
    <div className="max-w-xl mx-auto py-6">
      <Card className="p-6 space-y-4">
        <h1 className="text-xl font-semibold">Backup Codes</h1>
        <p className="text-sm text-muted-foreground">
          You currently have {data?.backupCodesCount ?? 0} backup codes.
        </p>
        <Button disabled>Generate new backup codes (coming soon)</Button>
      </Card>
    </div>
  );
}