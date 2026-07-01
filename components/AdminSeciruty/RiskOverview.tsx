"use client";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import API from "@/lib/api";

interface RiskResponse {
  accountSecurityRisk: number;
  networkExposure: number;
  apiAbuseLevel: number;
  deviceTrustScore: number;
}

export default function RiskOverview() {
  const { data } = useQuery({
    queryKey: ["risk-overview"],
    queryFn: () =>
      API.get("/admin/security/risk-overview").then(
        (r) => r.data as RiskResponse
      ),
  });

  return (
    <Card className="p-6 bg-card/40 backdrop-blur-xl border">
      <h2 className="text-lg font-semibold mb-4">System Risk Overview</h2>

      <Risk label="Account Security Risk" value={data?.accountSecurityRisk ?? 0} />
      <Risk label="Network Exposure" value={data?.networkExposure ?? 0} />
      <Risk label="API Abuse Level" value={data?.apiAbuseLevel ?? 0} />
      <Risk label="Device Trust Score" value={data?.deviceTrustScore ?? 0} />
    </Card>
  );
}

function Risk({ label, value }: { label: string; value: number }) {
  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <Progress value={value} />
    </div>
  );
}