"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import API from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function ResetPasswordClient() {
  const params = useSearchParams();
  const router = useRouter();

  const email = params.get("email");

  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleReset = async () => {
    if (loading) return;

    const finalOtp = otp.join("");

    if (finalOtp.length < 6) return;

    if (!email) {
      return toast.error("Invalid reset link");
    }

    setLoading(true);

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

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

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

    inputsRef.current[5]?.focus();
  };

  return (
    <div className="relative min-h-screen flex justify-center overflow-hidden bg-background text-foreground px-6 py-26">
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-30 -left-30 h-80 w-[320px] rounded-full bg-green-500/10 blur-3xl" />
        <div className="absolute -bottom-30 -right-30 h-80 w-[320px] rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_35%)] dark:bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_35%)]" />
      </div>
      <Card className="w-100 h-full mx-auto mt-20 p-8 space-y-2 overflow-hidden bg-background text-foreground">
        <div className="text-center space-y-1">
          <h1 className="text-xl font-bold">Verify OTP</h1>
          <p className="text-sm text-muted-foreground">
            Enter the 6-digit code sent to your email
          </p>
        </div>

        <div className="flex justify-between gap-2" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <Input
              key={index}
              maxLength={1}
              value={digit}
              ref={(el) => { (inputsRef.current[index] = el) }}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="text-center text-lg font-semibold h-12"
            />
          ))}
        </div>

        <Input
          placeholder="New Password"
          type="password"
          disabled={loading}
          onChange={(e) => setPassword(e.target.value)}
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

        <Button onClick={handleReset} disabled={loading} className=" h-12
              w-full
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
              cursor-pointer
              disabled:opacity-40
              disabled:cursor-not-allowed
              disabled:hover:scale-100">
          {loading ? "Resetting..." : "Reset Password"}
        </Button>
      </Card>
    </div>
  );
}