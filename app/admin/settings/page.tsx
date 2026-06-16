// app/admin/settings-os/page.tsx
"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Settings,
  Shield,
  KeyRound,
  Globe,
  Palette,
  Plug,
  Activity,
  Lock,
  Database,
} from "lucide-react";
import { toast } from "sonner";
import { AdminPageSkeleton } from "../admin-skeleton";

type SystemSettings = {
  appName: string;
  apiBaseUrl: string;

  maintenanceMode: boolean;
  debugMode: boolean;

  enforce2FA: boolean;
  trustedDevicesLock: boolean;
  jwtRotationEnabled: boolean;
  sessionMaxAgeMinutes: number;

  openAIApiKey?: string;
  smtpConnectionString?: string;
  webhookUrl?: string;

  defaultTheme: "light" | "dark";
  compactLayout: boolean;
  reduceAnimations: boolean;
  highContrast: boolean;

  notifyOnPlanChange: boolean;
  notifyOnSecurityEvents: boolean;

  updatedAt?: string;
};

export default function SettingsOS() {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load settings on mount
  useEffect(() => {
    const load = async () => {
      try {
        const res = await API.get("/admin/settings");
        setSettings(res.data);
      } catch (err: any) {
        console.error("Failed to load admin settings", err);
        toast.error(
          err.response?.data?.message || "Failed to load admin settings."
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const updateLocal = (partial: Partial<SystemSettings>) => {
    setSettings((prev) => (prev ? { ...prev, ...partial } : prev));
  };

  const saveSettings = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      const res = await API.put("/admin/settings", settings);
      setSettings(res.data);
      toast.success("Settings saved.");
    } catch (err: any) {
      console.error("Failed to save settings", err);
      toast.error(err.response?.data?.message || "Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  const handleForceLogoutAll = async () => {
    try {
      await API.post("/admin/actions/force-logout-all");
      toast.success("Forced logout for all users.");
    } catch (err: any) {
      console.error("Failed to force logout all users", err);
      toast.error(
        err.response?.data?.message || "Failed to force logout all users."
      );
    }
  };

  if (loading || !settings) {
    return <AdminPageSkeleton/>
  }

  const darkMode = settings.defaultTheme === "dark";

  return (
    <div className="space-y-8">
      {/* HEADER (unchanged) */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">System Settings OS</h1>
          <p className="text-muted-foreground mt-2">
            Enterprise control center for SaaS configuration, security &
            integrations
          </p>
        </div>
        <Button onClick={saveSettings} disabled={saving}>
          {saving ? "Saving…" : "Save Changes"}
        </Button>
      </div>

      {/* GRID 1 (unchanged structure) */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* SECURITY & ACCESS */}
        <Card className="p-5 bg-card/40 backdrop-blur-xl space-y-4">
          <div className="flex items-center gap-2">
            <Shield />
            <h2 className="font-semibold">Security & Access</h2>
          </div>

          <SettingItem
            label="Enable 2FA Enforcement"
            checked={settings.enforce2FA}
            onChange={(v) => updateLocal({ enforce2FA: v })}
          />
          <SettingItem
            label="Force Logout All Users"
            checked={false}
            onChange={() => handleForceLogoutAll()}
            asButton
          />
          <SettingItem
            label="Rotate JWT Tokens"
            checked={settings.jwtRotationEnabled}
            onChange={(v) => updateLocal({ jwtRotationEnabled: v })}
          />
          <SettingItem
            label="Trusted Devices Lock"
            checked={settings.trustedDevicesLock}
            onChange={(v) => updateLocal({ trustedDevicesLock: v })}
          />

          <div className="flex items-center justify-between border-b border-border pb-2">
            <p className="text-sm">Session Max Age (minutes)</p>
            <Input
              className="w-24 h-8 text-xs"
              type="number"
              value={settings.sessionMaxAgeMinutes}
              onChange={(e) =>
                updateLocal({ sessionMaxAgeMinutes: Number(e.target.value) })
              }
            />
          </div>

          <Button variant="outline" className="w-full">
            View Security Logs
          </Button>
        </Card>

        {/* SYSTEM CONFIG */}
        <Card className="p-5 bg-card/40 backdrop-blur-xl space-y-4">
          <div className="flex items-center gap-2">
            <Database />
            <h2 className="font-semibold">System Configuration</h2>
          </div>

          <Input
            placeholder="App Name (SkillPulse)"
            value={settings.appName}
            onChange={(e) => updateLocal({ appName: e.target.value })}
          />
          <Input
            placeholder="API Base URL"
            value={settings.apiBaseUrl}
            onChange={(e) => updateLocal({ apiBaseUrl: e.target.value })}
          />

          <div className="flex items-center justify-between">
            <p className="text-sm">Maintenance Mode</p>
            <Switch
              checked={settings.maintenanceMode}
              onCheckedChange={(v) => updateLocal({ maintenanceMode: v })}
            />
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm">Debug Mode</p>
            <Switch
              checked={settings.debugMode}
              onCheckedChange={(v) => updateLocal({ debugMode: v })}
            />
          </div>
        </Card>

        {/* INTEGRATIONS */}
        <Card className="p-5 bg-card/40 backdrop-blur-xl space-y-4">
          <div className="flex items-center gap-2">
            <Plug />
            <h2 className="font-semibold">Integrations</h2>
          </div>

          <Input
            placeholder="OpenAI API Key"
            value={settings.openAIApiKey || ""}
            onChange={(e) => updateLocal({ openAIApiKey: e.target.value })}
          />
          <Input
            placeholder="SMTP Email Service (connection)"
            value={settings.smtpConnectionString || ""}
            onChange={(e) =>
              updateLocal({ smtpConnectionString: e.target.value })
            }
          />
          <Input
            placeholder="Webhook URL"
            value={settings.webhookUrl || ""}
            onChange={(e) => updateLocal({ webhookUrl: e.target.value })}
          />

          <Button className="w-full" onClick={saveSettings} disabled={saving}>
            Save Integrations
          </Button>
        </Card>
      </div>

      {/* GRID 2 (unchanged structure) */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* THEME CONTROL */}
        <Card className="p-5 bg-card/40 backdrop-blur-xl space-y-4">
          <div className="flex items-center gap-2">
            <Palette />
            <h2 className="font-semibold">Theme Control</h2>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm">Dark Mode</p>
            <Switch
              checked={darkMode}
              onCheckedChange={(v) =>
                updateLocal({ defaultTheme: v ? "dark" : "light" })
              }
            />
          </div>

          <SettingItem
            label="Compact Layout Mode"
            checked={settings.compactLayout}
            onChange={(v) => updateLocal({ compactLayout: v })}
          />
          <SettingItem
            label="Reduce Animations"
            checked={settings.reduceAnimations}
            onChange={(v) => updateLocal({ reduceAnimations: v })}
          />
          <SettingItem
            label="High Contrast Mode"
            checked={settings.highContrast}
            onChange={(v) => updateLocal({ highContrast: v })}
          />
        </Card>

        {/* API KEYS & NOTIFICATIONS */}
        <Card className="p-5 bg-card/40 backdrop-blur-xl space-y-4">
          <div className="flex items-center gap-2">
            <KeyRound />
            <h2 className="font-semibold">API Keys & Notifications</h2>
          </div>

          <ApiKey
            label="OpenAI Key"
            value={settings.openAIApiKey ? "••••••••••" : "Not set"}
          />
          <ApiKey
            label="SMTP Connection"
            value={settings.smtpConnectionString ? "••••••••••" : "Not set"}
          />

          <SettingItem
            label="Email on Plan Change"
            checked={settings.notifyOnPlanChange}
            onChange={(v) => updateLocal({ notifyOnPlanChange: v })}
          />
          <SettingItem
            label="Email on Security Events"
            checked={settings.notifyOnSecurityEvents}
            onChange={(v) => updateLocal({ notifyOnSecurityEvents: v })}
          />

          <Button variant="outline" className="w-full" disabled>
            Generate New Key
          </Button>
        </Card>
      </div>

      {/* SYSTEM STATUS (unchanged, with last updated info) */}
      <Card className="p-5 bg-card/40 backdrop-blur-xl">
        <div className="flex items-center gap-2 text-green-400">
          <Activity />
          <h2 className="font-semibold text-white">
            System Status: Operational
          </h2>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          All services running normally — no incidents detected
        </p>
        {settings.updatedAt && (
          <p className="text-xs text-muted-foreground mt-1">
            Last updated: {new Date(settings.updatedAt).toLocaleString()}
          </p>
        )}
      </Card>
    </div>
  );
}

/* COMPONENTS */

function SettingItem({
  label,
  checked,
  onChange,
  asButton,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  asButton?: boolean;
}) {
  if (asButton) {
    return (
      <div className="flex items-center justify-between border-b border-border pb-2">
        <p className="text-sm">{label}</p>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onChange(true)}
          className="text-xs"
        >
          Run
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between border-b border-border pb-2">
      <p className="text-sm">{label}</p>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

function ApiKey({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 border rounded-xl bg-background flex justify-between items-center">
      <p className="text-sm">{label}</p>
      <Badge variant="outline">{value}</Badge>
    </div>
  );
}