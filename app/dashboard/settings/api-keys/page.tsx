"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

type ApiKey = {
  id: string;
  name?: string;
  prefix: string;
  lastFour: string;
  createdAt: string;
  lastUsedAt?: string;
  revokedAt?: string;
};

export default function UserDeveloperApi() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [revokingAll, setRevokingAll] = useState(false);

  const [newKeyPlain, setNewKeyPlain] = useState<string | null>(null);
  const [newKeyLabel, setNewKeyLabel] = useState("");
  const [showNewKeyDialog, setShowNewKeyDialog] = useState(false);

  const loadKeys = async () => {
    try {
      setLoading(true);
      const res = await API.get("/user/api-keys");
      setKeys(res.data.items || []);
    } catch (err: any) {
      console.error("Failed to load API keys", err);
      toast.error(err.response?.data?.message || "Failed to load API keys.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadKeys();
  }, []);

  const handleGenerate = async () => {
    try {
      setGenerating(true);
      const res = await API.post("/user/api-keys", {
        name: newKeyLabel || undefined,
      });
      setNewKeyPlain(res.data.plainKey);
      setShowNewKeyDialog(true);
      setNewKeyLabel("");
      toast.success("New API key generated.");
      await loadKeys();
    } catch (err: any) {
      console.error("Failed to generate API key", err);
      toast.error(err.response?.data?.message || "Failed to generate API key.");
    } finally {
      setGenerating(false);
    }
  };

  const handleRevokeAll = async () => {
    try {
      setRevokingAll(true);
      await API.post("/user/api-keys/revoke-all");
      toast.success("All API keys revoked.");
      await loadKeys();
    } catch (err: any) {
      console.error("Failed to revoke keys", err);
      toast.error(err.response?.data?.message || "Failed to revoke keys.");
    } finally {
      setRevokingAll(false);
    }
  };

  const maskedKey = (k: ApiKey) => `${k.prefix}_••••••••••••••${k.lastFour}`;

  return (
    <>
      <Card className="p-3 bg-card/40 backdrop-blur-xl">
        <h2 className="text-lg font-semibold">Developer API</h2>
        <p className="text-sm text-muted-foreground mt-2">
          Generate API keys to integrate your own backend or automation tools
          with your SkillPulse account.
        </p>

        <div className="mt-4 text-xs text-muted-foreground space-y-1">
          <p>
            Use your API key by sending it in the <code>x-api-key</code> header
            on each request to <code>/api/integrations</code>.
          </p>
          <p>
            Keep keys secret. Do not embed them in frontend code or mobile apps.
          </p>
        </div>

        <div className="mt-5 space-y-4">
          {/* New key form */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">
              Label keys to remember where they are used (e.g. "Personal
              dashboard", "Backend server", "Zapier").
            </p>
            <div className="flex gap-2">
              <Input
                placeholder="Key label (optional)"
                value={newKeyLabel}
                onChange={(e) => setNewKeyLabel(e.target.value)}
              />
              <Button
                className="shrink-0"
                onClick={handleGenerate}
                disabled={generating}
              >
                {generating ? "Generating…" : "Generate New Key"}
              </Button>
            </div>
          </div>

          {/* Existing keys */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground">
                Your API keys
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRevokeAll}
                disabled={revokingAll || keys.length === 0}
              >
                {revokingAll ? "Revoking…" : "Revoke All Keys"}
              </Button>
            </div>

            {loading ? (
              <div className="space-y-2">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-10 w-full rounded-xl bg-muted animate-pulse"
                  />
                ))}
              </div>
            ) : keys.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                You have no API keys yet. Generate one to start integrating
                SkillPulse with your tools.
              </p>
            ) : (
              <div className="space-y-2">
                {keys.map((k) => {
                  const isRevoked = Boolean(k.revokedAt);
                  return (
                    <div
                      key={k.id}
                      className="flex items-center justify-between rounded-xl border border-border/30 bg-background/60 px-3 py-2 text-xs"
                    >
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px]">
                            {maskedKey(k)}
                          </span>
                          {k.name && (
                            <Badge variant="outline" className="text-[10px]">
                              {k.name}
                            </Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-3 text-[10px] text-muted-foreground">
                          <span>
                            Created:{" "}
                            {new Date(k.createdAt).toLocaleDateString()}
                          </span>
                          {k.lastUsedAt && (
                            <span>
                              Last used:{" "}
                              {new Date(k.lastUsedAt).toLocaleString()}
                            </span>
                          )}
                          {isRevoked && (
                            <span className="text-red-400">Revoked</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* One-time key reveal dialog */}
      <Dialog
        open={showNewKeyDialog && !!newKeyPlain}
        onOpenChange={(open) => {
          if (!open) {
            setShowNewKeyDialog(false);
            setNewKeyPlain(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Your new API key</DialogTitle>
          </DialogHeader>
          <p className="text-xs text-muted-foreground mt-1">
            This key is shown only once. Copy it now and store it securely. You
            won&apos;t be able to see the full value again.
          </p>
          <div className="mt-3 rounded-xl border bg-muted/40 p-2 font-mono text-xs break-all">
            {newKeyPlain}
          </div>
          <div className="mt-3 flex justify-end gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                if (!newKeyPlain) return;
                navigator.clipboard.writeText(newKeyPlain);
                toast.success("API key copied.");
              }}
            >
              Copy
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setShowNewKeyDialog(false);
                setNewKeyPlain(null);
              }}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}