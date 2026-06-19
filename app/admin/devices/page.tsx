// components/DeviceManager.tsx
"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getMyDevices, revokeMyDeviceApi, UserDevice } from "@/lib/api/devices-api";

export default function DeviceManager() {
  const [devices, setDevices] = useState<UserDevice[]>([]);
  const [loading, setLoading] = useState(true);

  const [revoking, setRevoking] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getMyDevices();
        if (data.success) {
          setDevices(data.devices);
        }
      } catch (err) {
        console.error("Device load error:", err);
        toast.error("Failed to load devices");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleRevoke = async (deviceHash: string) => {
    if (!confirm("Revoke this device's access?")) return;
    try {
      setRevoking(deviceHash);
      await revokeMyDeviceApi(deviceHash);
      toast.success("Device revoked");
      setDevices((prev) => prev.filter((d) => d.deviceHash !== deviceHash));
    } catch (err) {
      console.error("Revoke device error:", err);
      toast.error("Failed to revoke device");
    } finally {
      setRevoking(null);
    }
  };

  return (
    <Card className="p-6 bg-card/60 backdrop-blur-xl border border-border/60 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Device Manager</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Manage where your account is signed in.
          </p>
        </div>
        {!loading && (
          <span className="text-xs text-muted-foreground">
            {devices.length} {devices.length === 1 ? "device" : "devices"}
          </span>
        )}
      </div>
      <h2 className="text-lg font-semibold">Device Manager</h2>

      {loading ? (
        <p className="mt-4 text-sm text-muted-foreground">Loading devices…</p>
      ) : devices.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">
          No trusted devices yet.
        </p>
      ) : (
        <div className="mt-5 space-y-3 text-sm">
          {devices.map((d) => {
            const isCurrent = false; // TODO: mark via user-agent or hash

            return (
              <div
                key={d.id}
                className="flex items-center justify-between rounded-xl border border-border/60 bg-card/40 px-4 py-3 hover:border-primary/40 hover:bg-card/60 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">
                      {d.device || "Unknown device"}
                    </p>
                    {isCurrent && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {d.ip || "Unknown IP"} • Last used{" "}
                    {new Date(d.lastUsed).toLocaleString()}
                  </p>
                </div>

                <Button
                  size="xs"
                  variant="outline"
                  disabled={revoking === d.deviceHash}
                  onClick={() => handleRevoke(d.deviceHash)}
                >
                  {revoking === d.deviceHash ? "Revoking..." : "Revoke"}
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}