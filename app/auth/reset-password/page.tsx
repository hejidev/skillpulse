"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import API from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const params = useSearchParams();
  const router = useRouter();

  const email = params.get("email");

  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (loading) return;
    setLoading(true);

    try {
      await API.post("/auth/verify-otp", {
        email,
        otp,
        newPassword: password,
      });

      toast.success("Password reset successful 🚀");
      router.push("/auth/login");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-100 mx-auto mt-20 p-8 space-y-4">
      <h1 className="text-xl font-bold">Enter OTP</h1>

      <Input
        placeholder="OTP Code"
        disabled={loading}
        onChange={(e) => setOtp(e.target.value)}
      />

      <Input
        placeholder="New Password"
        type="password"
        disabled={loading}
        onChange={(e) => setPassword(e.target.value)}
      />

      <Button onClick={handleReset} disabled={loading} className="w-full">
        {loading ? "Resetting..." : "Reset Password"}
      </Button>
    </Card>
  );
}