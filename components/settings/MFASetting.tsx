// components/settings/MFASetting.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import API from "@/lib/api";
import { toast } from "sonner";

type TwoFAStatus = {
  twoFactorEnabled: boolean;
  backupCodesCount?: number;
};

export default function MFASetting() {
  const [status, setStatus] = useState<TwoFAStatus>({
    twoFactorEnabled: false,
  });
  const [loading, setLoading] = useState(true);
  const [qr, setQr] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const searchParams = useSearchParams();
  const shouldHighlight = searchParams.get("setup2fa") === "1";

  const loadStatus = async () => {
    try {
      // you can also use /settings/me if you prefer
      const res = await API.get("/settings/2fa/status");
      setStatus(res.data);
    } catch (err) {
    //   console.error(err);
    console.log("Token in localStorage:", localStorage.getItem("token"));
      toast.error("Failed to load 2FA status");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatus();
  }, []);

  const startSetup = async () => {
    setSubmitting(true);
    try {
      const res = await API.post("/settings/2fa/start");
      setQr(res.data.qrDataUrl);
      setCode("");
      toast.info("Scan the QR code with your authenticator app.");
    } catch (err: any) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Failed to start 2FA setup"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const confirmSetup = async () => {
    if (!code.trim()) {
      toast.error("Enter the 6-digit code from your app.");
      return;
    }
    setSubmitting(true);
    try {
      await API.post("/settings/2fa/confirm", { code: code.trim() });
      toast.success("Two-factor authentication enabled.");
      setQr(null);
      setCode("");
      await loadStatus();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Invalid 2FA code");
    } finally {
      setSubmitting(false);
    }
  };

  const disable2FA = async () => {
    if (!confirm("Are you sure you want to disable 2FA?")) return;
    setSubmitting(true);
    try {
      await API.post("/settings/2fa/disable");
      toast.success("Two-factor authentication disabled.");
      setQr(null);
      setCode("");
      await loadStatus();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to disable 2FA");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>Loading 2FA…</div>;

  const enabled = status.twoFactorEnabled;

  return (
    <div
      className={`p-4 rounded-2xl bg-card/40 backdrop-blur-xl ${
        shouldHighlight ? "ring-2 ring-emerald-500" : ""
      }`}
    >
      <h3 className="text-lg font-semibold mb-2">Two-Factor Authentication</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Add an extra layer of protection to your account using an authenticator app.
      </p>

      <p className="mb-4">
        Status:{" "}
        <span className={enabled ? "text-emerald-500" : "text-amber-500"}>
          {enabled ? "Enabled" : "Disabled"}
        </span>
      </p>

      {!enabled && !qr && (
        <button
          className="btn-primary"
          onClick={startSetup}
          disabled={submitting}
        >
          {submitting ? "Starting…" : "Enable 2FA"}
        </button>
      )}

      {qr && (
        <div className="mt-4 space-y-3">
          <p className="text-sm">
            1. Scan this QR code with Google Authenticator, Authy, or a similar app.
          </p>
          <img
            src={qr}
            alt="2FA QR Code"
            className="w-40 h-40 border rounded-xl bg-white"
          />
          <p className="text-sm">
            2. Enter the 6-digit code from your app to confirm.
          </p>
          <input
            className="border rounded px-3 py-2 tracking-[0.3em] text-center w-40"
            placeholder="123456"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <div className="flex gap-2 mt-2">
            <button
              className="btn-primary flex-1"
              onClick={confirmSetup}
              disabled={submitting}
            >
              {submitting ? "Verifying…" : "Confirm 2FA Setup"}
            </button>
            <button
              className="btn-outline flex-1"
              onClick={() => {
                setQr(null);
                setCode("");
              }}
              disabled={submitting}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {enabled && (
        <div className="mt-4 space-y-2">
          {/* Optional: show backup codes count */}
          {status.backupCodesCount !== undefined && (
            <p className="text-xs text-muted-foreground">
              Backup codes: {status.backupCodesCount}
            </p>
          )}
          <button
            className="btn-outline text-sm"
            onClick={disable2FA}
            disabled={submitting}
          >
            Disable 2FA
          </button>
        </div>
      )}
    </div>
  );
}