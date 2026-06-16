// app/company/billing/upgrade-complete/page.tsx
"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function UpgradeCompletePage() {
  const [message, setMessage] = useState("Confirming your subscription…");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const finalizeUpgrade = async () => {
      try {
        // 1. Get Paystack reference from query
        const reference =
          searchParams.get("reference") || searchParams.get("trxref");

        if (!reference) {
          setMessage("Missing payment reference.");
          return;
        }

        // 2. Ask backend to verify and update billing/plan
        await API.get(
          `/billing/verify?reference=${encodeURIComponent(reference)}`
        );

        // 3. Fetch latest subscription data (just for message / UI)
        const subRes = await API.get("/billing/me");
        const plan = subRes.data.plan as string;

        setMessage(`You are now on the ${plan.toUpperCase()} plan.`);

        // 4. Fetch full profile and sync to localStorage so sidebar sees new plan
        try {
          const profileRes = await API.get("/settings/profile");
          const user = profileRes.data;

          if (typeof window !== "undefined") {
            localStorage.setItem(
              "user",
              JSON.stringify({
                name: user.name,
                email: user.email,
                plan: user.plan, // e.g. "starter"
              })
            );

            // Notify sidebar & any listeners
            const evt = new Event("auth-change");
            window.dispatchEvent(evt);
          }
        } catch (syncErr) {
          console.error("Failed to sync user after upgrade", syncErr);
          // Don't block the redirect just because sync failed
        }

        // 5. Redirect back after short delay
        setTimeout(() => {
          router.push("/company/billing"); // or "/dashboard" if you prefer
        }, 2000);
      } catch (err) {
        console.error("Upgrade complete error:", err);
        setMessage(
          "We couldn't confirm your upgrade yet. Please refresh later or contact support."
        );
      }
    };

    finalizeUpgrade();
  }, [router, searchParams]);

  return (
    <main className="min-h-[80vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-sm text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
        <p>{message}</p>
      </div>
    </main>
  );
}