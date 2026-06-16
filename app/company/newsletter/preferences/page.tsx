"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import API from "@/lib/api";
import { CheckCircle2, MailX } from "lucide-react";

type Status = "loading" | "subscribed" | "unsubscribed" | "error";

export default function NewsletterPreferencesPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState<string>("Loading your preferences...");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!email) {
      setStatus("error");
      setMessage("Invalid link. No email found.");
      return;
    }

    // Optional: you could hit a GET /newsletter/status?email=...
    // For now we just assume they are subscribed when landing here.
    setStatus("subscribed");
    setMessage("You are currently subscribed to the SkillPulse newsletter.");
  }, [email]);

  const handleUnsubscribe = async () => {
    if (!email) return;
    setBusy(true);
    try {
      await API.get("/newsletter/unsubscribe", { params: { email } });
      setStatus("unsubscribed");
      setMessage("You have been unsubscribed. You can resubscribe anytime.");
    } catch (err: any) {
      setStatus("error");
      setMessage(
        err?.response?.data?.message || "Unable to update your preferences."
      );
    } finally {
      setBusy(false);
    }
  };

  const handleSubscribe = async () => {
    if (!email) return;
    setBusy(true);
    try {
      await API.post("/newsletter/subscribe", { email });
      setStatus("subscribed");
      setMessage("You’re subscribed to SkillPulse.");
    } catch (err: any) {
      setStatus("error");
      setMessage(
        err?.response?.data?.message || "Unable to update your preferences."
      );
    } finally {
      setBusy(false);
    }
  };

  const isSubscribed = status === "subscribed";

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <Card className="max-w-md w-full p-8 bg-card/60 backdrop-blur-xl border border-border">
        <div className="flex flex-col items-center text-center space-y-4">
          {isSubscribed && <CheckCircle2 className="w-10 h-10 text-green-400" />}
          {status === "unsubscribed" && <MailX className="w-10 h-10 text-red-400" />}

          <h1 className="text-xl font-semibold">
            Newsletter preferences
          </h1>
          <p className="text-sm text-muted-foreground">{message}</p>

          {/* Toggle button */}
          {status !== "loading" && status !== "error" && (
            <Button
              className="mt-4"
              onClick={isSubscribed ? handleUnsubscribe : handleSubscribe}
              disabled={busy}
              variant={isSubscribed ? "outline" : "default"}
            >
              {busy
                ? "Updating..."
                : isSubscribed
                ? "Unsubscribe"
                : "Subscribe again"}
            </Button>
          )}

          {status === "error" && (
            <Button
              className="mt-4"
              variant="outline"
              onClick={() => window.location.reload()}
            >
              Try again
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}