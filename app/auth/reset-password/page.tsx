"use client";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import { useState, useRef, useEffect } from "react";
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

  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // 👉 move to next input
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  // ⬅️ HANDLE BACKSPACE
  const handleKeyDown = (e: any, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const paste = e.clipboardData.getData("text").slice(0, 6);

    if (!/^\d+$/.test(paste)) return;

    const newOtp = paste.split("");
    setOtp(newOtp);

    newOtp.forEach((_, i) => {
      if (inputsRef.current[i]) {
        inputsRef.current[i]!.value = newOtp[i];
      }
    });

    inputsRef.current[5]?.focus();
  };

  const handleReset = async () => {
    if (loading) return;

    const finalOtp = otp.join("");

    if (finalOtp.length < 6) {
      return toast.error("Enter complete OTP");
    }

    useEffect(() => {
      if (otp.join("").length === 6) {
        handleReset();
      }
    }, [otp]);

    setLoading(true);

    if (!email) {
      return toast.error("Invalid reset link");
    }

    try {
      await API.post("/auth/verify-otp", {
        email,
        otp: finalOtp,
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
    <Card className="w-100 mx-auto mt-20 p-8 space-y-6">

      <div className="text-center space-y-1">
        <h1 className="text-xl font-bold">Verify OTP</h1>
        <p className="text-sm text-gray-400">
          Enter the 6-digit code sent to your email
        </p>
      </div>

      {/* 🔢 OTP INPUTS */}
      <div
        className="flex justify-between gap-2"
        onPaste={handlePaste}
      >
        {otp.map((digit, index) => (
          <Input
            key={index}
            maxLength={1}
            value={digit}
            ref={(el) => {
              inputsRef.current[index] = el;
            }}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className="text-center text-lg font-semibold h-12"
          />
        ))}
      </div>

      {/* 🔐 PASSWORD */}
      <Input
        placeholder="New Password"
        type="password"
        disabled={loading}
        onChange={(e) => setPassword(e.target.value)}
      />

      {/* 🚀 BUTTON */}
      <Button
        onClick={handleReset}
        disabled={loading}
        className="w-full"
      >
        {loading ? "Resetting..." : "Reset Password"}
      </Button>

    </Card>
  );
}