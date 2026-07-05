"use client";

import { useState } from "react";
import API from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSendOTP = async () => {
    if (loading) return;
    setLoading(true);

    try {
      await API.post("/auth/forgot-password", { email });

      toast.success("OTP sent to your email 📩");
      router.push(`/auth/reset-password?email=${email}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full relative min-h-screen flex justify-center overflow-hidden bg-background text-foreground px-6 py-25">
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-30 -left-30 h-80 w-[320px] rounded-full bg-green-500/10 blur-3xl" />
        <div className="absolute -bottom-30 -right-30 h-80 w-[320px] rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_35%)] dark:bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_35%)]" />
      </div>
      <Card className="
        relative
        w-full
        h-full
        max-w-md
        overflow-hidden
        rounded-[32px]
        border
        border-border/50
        bg-card/70
        backdrop-blur-2xl
        shadow-[0_0_60px_rgba(34,197,94,0.08)]
        px-4
        py-5
      ">
        <h1 className="text-xl font-bold">Reset Password</h1>

        <Input
          placeholder="Enter your email"
          disabled={loading}
          onChange={(e) => setEmail(e.target.value)}
          className="
              mt-1
                h-12
                rounded-xl
                border-border/40
                bg-background/40
                backdrop-blur-xl
                focus-visible:ring-2
                focus-visible:ring-green-500/40
              "
        />

        <Button onClick={handleSendOTP} disabled={loading} className="w-full  h-12
              rounded-xl
              bg-linear-to-r
              from-green-400
              to-green-600
              backdrop-blur-xl
              font-bold
              text-foreground
              transition-all
              hover:scale-[1.02]
              hover:shadow-[0_0_30px_rgba(34,197,94,0.35)]
              disabled:opacity-40
              disabled:cursor-not-allowed
              disabled:hover:scale-100">
          {loading ? "Sending OTP..." : "Send OTP"}
        </Button>
      </Card>
    </div>
  );
}