"use client";

import SecurityStream from "@/components/AdminSeciruty/SecurityStream";
import AIThreatEngine from "@/components/AdminSeciruty/AIThreatEngine";
import ThreatMapPanel from "@/components/AdminSeciruty/ThreatMapPanel";
import ResponseConsole from "@/components/AdminSeciruty/ResponseConsole";
import RiskOverview from "@/components/AdminSeciruty/RiskOverview";

import IdentityPanel from "@/components/AdminSeciruty/IdentityPanel";
import MFAControlPanel from "@/components/AdminSeciruty/MFAControlPanel";
import ActiveSessions from "@/components/AdminSeciruty/ActiveSessions";
import LoginHistory from "@/components/AdminSeciruty/LoginHistory";
import RecoveryPanel from "@/components/AdminSeciruty/RecoveryPanel";

export default function SecurityDashboard() {
  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Security Operations Center</h1>
        <p className="text-muted-foreground">
          Full identity control, threat monitoring & account protection system
        </p>
      </div>

      {/* ================= IDENTITY CONTROL (CRITICAL) ================= */}
      <IdentityPanel />

      {/* ================= MFA / 2FA ================= */}
      <MFAControlPanel />

      {/* ================= ACTIVE SESSIONS ================= */}
      <ActiveSessions />

      {/* ================= LOGIN HISTORY ================= */}
      <LoginHistory />

      {/* ================= THREAT INTELLIGENCE ================= */}
      <div className="grid lg:grid-cols-2 gap-6">
        <SecurityStream />
        <AIThreatEngine />
      </div>

      {/* ================= GLOBAL THREAT VISUALIZATION ================= */}
      <ThreatMapPanel />

      {/* ================= RESPONSE CONTROL ================= */}
      <ResponseConsole />

      {/* ================= RISK ANALYSIS ================= */}
      <RiskOverview />

      {/* ================= RECOVERY SETTINGS ================= */}
      <RecoveryPanel />

    </div>
  );
}