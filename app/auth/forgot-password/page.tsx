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
    <Card className="w-100 mx-auto mt-20 p-8 space-y-4 overflow-hidden bg-background text-foreground">
      <h1 className="text-xl font-bold">Reset Password</h1>

      <Input
        placeholder="Enter your email"
        disabled={loading}
        onChange={(e) => setEmail(e.target.value)}
      />

      <Button onClick={handleSendOTP} disabled={loading} className="w-full  h-12
              rounded-xl
              bg-linear-to-r
              from-green-400
              to-green-600
              backdrop-blur-xl
              font-bold
              text-white
              transition-all
              hover:scale-[1.02]
              hover:shadow-[0_0_30px_rgba(34,197,94,0.35)]
              disabled:opacity-40
              disabled:cursor-not-allowed
              disabled:hover:scale-100">
        {loading ? "Sending OTP..." : "Send OTP"}
      </Button>
    </Card>
  );
}