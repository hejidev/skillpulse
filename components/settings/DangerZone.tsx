// components/settings/DangerZone.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/components/auth-provider";
import API from "@/lib/api";

export default function DangerZone() {
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [phraseInput, setPhraseInput] = useState("");

  const router = useRouter();
  const { logout, user } = useAuthContext();
  const username = user?.email || user?.name || "";
  const verifyPhrase = "delete my account"; // like GitHub’s phrase

  const canDelete =
    usernameInput.trim().toLowerCase() === username.trim().toLowerCase() &&
    phraseInput.trim().toLowerCase() === verifyPhrase.toLowerCase() &&
    !deleting;

  const handleOpen = () => {
    setOpen(true);
    setUsernameInput("");
    setPhraseInput("");
  };

  const handleClose = () => {
    if (deleting) return;
    setOpen(false);
    setUsernameInput("");
    setPhraseInput("");
  };

  const handleDelete = async () => {
    if (!canDelete) return;

    try {
      setDeleting(true);
      await API.delete("/settings/account");
      toast.success("Account deleted");
      logout?.();
      router.push("/");
    } catch (err) {
      console.error("Delete account error:", err);
      toast.error("Failed to delete account");
    } finally {
      setDeleting(false);
      handleClose();
    }
  };

  return (
    <>
      {/* GitHub-style danger zone section */}
      <section className="border border-red-500/20 rounded-2xl p-6 bg-red-500/5">
        <h3 className="text-base font-semibold text-red-500">
          Danger Zone
        </h3>
        <p className="mt-2 text-xs text-muted-foreground">
          Delete your account and all associated data. This cannot be undone.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-xs text-muted-foreground">
            <p className="font-semibold text-red-400">Delete this account</p>
            <p>
              Permanently remove your account, data, and access to the platform.
            </p>
          </div>

          <Button
            variant="destructive"
            size="sm"
            className="rounded-xl"
            onClick={handleOpen}
          >
            Delete account
          </Button>
        </div>
      </section>

      {/* Full-page GitHub-style confirmation dialog */}
      {open && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose();
          }}
        >
          <div
            className="w-full max-w-xl rounded-2xl border border-border bg-background/95 p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                Are you sure you want to do this?
              </h2>
              <button
                className="text-muted-foreground hover:text-foreground text-xl leading-none"
                onClick={handleClose}
              >
                ×
              </button>
            </div>

            {/* Warning bar */}
            <div className="mt-4 flex items-start gap-3 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2">
              <TriangleAlert className="mt-0.5 h-4 w-4 text-red-400" />
              <div>
                <p className="text-xs font-semibold text-red-300">
                  This is extremely important.
                </p>
                <p className="mt-1 text-xs text-red-100/80">
                  Deleting your account is permanent. All of your data, streaks,
                  progress and security history will be removed and cannot be
                  recovered.
                </p>
              </div>
            </div>

            {/* Body text (GitHub-style explanation) */}
            <div className="mt-4 space-y-2 text-xs text-muted-foreground">
              <p>
                You will no longer be able to sign in with this account. Any
                subscriptions or premium features connected to it will be
                cancelled.
              </p>
              <p>
                This action cannot be undone. Make sure you have exported any
                data you want to keep before continuing.
              </p>
            </div>

            {/* Username field */}
            <div className="mt-5 space-y-1">
              <label className="text-xs font-medium text-foreground">
                Your username or email
              </label>
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder={username || "your@email.com"}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-red-500"
              />
            </div>

            {/* Phrase field */}
            <div className="mt-4 space-y-1">
              <label className="text-xs font-medium text-foreground">
                To verify, type{" "}
                <span className="font-semibold">{verifyPhrase}</span> exactly as
                it appears
              </label>
              <input
                type="text"
                value={phraseInput}
                onChange={(e) => setPhraseInput(e.target.value)}
                placeholder={verifyPhrase}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-red-500"
              />
            </div>

            {/* Footer buttons */}
            <div className="mt-6 flex flex-col sm:flex-row sm:justify-end gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleClose}
                disabled={deleting}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                variant="destructive"
                className="w-full sm:w-auto cursor-pointer"
                disabled={!canDelete}
                onClick={handleDelete}
              >
                {deleting ? "Deleting..." : "Cancel plan and delete this account"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}