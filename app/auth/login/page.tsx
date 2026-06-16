"use client";

import { useMemo, useState } from "react";
import API from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [need2FA, setNeed2FA] = useState(false);

  const router = useRouter();

  const isFormValid = useMemo(() => {
    return /^\S+@\S+\.\S+$/.test(email) && password.trim().length > 0;
  }, [email, password]);

  // const handleLogin = async () => {
  //   if (loading) return;
  //   setLoading(true);

  //   try {
  //     const res = await API.post("/auth/login", {
  //       email,
  //       password,
  //     });

  //     const token = res.data.accessToken;

  //     localStorage.setItem("token", token);
  //     localStorage.setItem("user", JSON.stringify(res.data.user));
  //     window.dispatchEvent(new Event("auth-change"));

  //     const decoded = jwtDecode<{ role: string }>(token);
  //     localStorage.setItem("role", decoded.role);

  //     toast.success("Login successful 🚀");

  //     router.push(decoded.role === "admin" ? "/admin" : "/dashboard");
  //   } catch (err: any) {
  //     const data = err?.response?.data;

  //     if (data?.require2faSetup) {
  //       toast.info("2FA is required, please set it up.");
  //       router.push("/settings?setup2fa=1");
  //       return;
  //     }

  //     if (data?.require2faVerify) {
  //       // TODO: show 2FA code input UI here (modal/step)
  //       toast.info("Enter your 2FA code to continue.");
  //       // Example: open a modal to collect twoFactorCode and re-call /auth/login
  //       return;
  //     }

  //     toast.error(data?.message || "Login failed");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleLogin = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const body: any = { email, password };
      if (need2FA && twoFactorCode) {
        body.twoFactorCode = twoFactorCode;
      }

      const res = await API.post("/auth/login", body);

      // const token = res.data.accessToken;
      const token = res.data.accessToken;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      const decoded = jwtDecode<{ role: string }>(token);

      localStorage.setItem("role", decoded.role);

      window.dispatchEvent(new Event("auth-change"));

      router.push(decoded.role === "admin" ? "/admin" : "/dashboard");
      // ... store token, user, navigate, etc.
    } catch (err: any) {
      const data = err?.response?.data;

      if (data?.require2faVerify) {
        setNeed2FA(true);
        toast.info("Enter your 2FA code to continue.");
        // Here you show a 2FA input field in the form
        return;
      }

      toast.error(data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background px-6 py-16 text-foreground">
      {/* 🌌 BACKGROUND FX */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-30 -left-30 h-80 w-[320px] rounded-full bg-green-500/10 blur-3xl" />
        <div className="absolute -bottom-30 -right-30 h-80 w-[320px] rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_35%)] dark:bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_35%)]" />
      </div>

      <Card
        className="
        relative
        w-full
        max-w-md
        overflow-hidden
        rounded-[32px]
        border
        border-border/50
        bg-card/70
        backdrop-blur-2xl
        shadow-[0_0_60px_rgba(34,197,94,0.08)]
      "
      >
        {/* ✨ Glow */}
        <div className="absolute inset-0 bg-linear-to-br from-green-500/5 via-transparent to-purple-500/5" />

        <div className="relative p-8 space-y-6">
          {/* 🔥 HEADER */}
          <div className="text-center space-y-3">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-green-500/20 bg-green-500/10 backdrop-blur-xl">
              <div className="h-6 w-6 rounded-full bg-linear-to-r from-green-400 to-purple-400" />
            </div>

            <div>
              <h1 className="text-3xl font-black tracking-tight">
                Welcome Back
              </h1>

              <p className="mt-2 text-sm text-muted-foreground">
                Continue tracking your growth journey with SkillPulse.
              </p>
            </div>
          </div>

          {/* 📩 EMAIL */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Email Address</label>

            <Input
              placeholder="Enter your email"
              disabled={loading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="
                h-12
                rounded-xl
                border-border/60
                bg-background/40
                backdrop-blur-xl
                focus-visible:ring-2
                focus-visible:ring-green-500/40
              "
            />
          </div>

          {/* 🔒 PASSWORD */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>

            <div className="relative">
              <Input
                placeholder="Enter your password"
                type={showPassword ? "text" : "password"}
                disabled={loading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="
                  h-12
                  rounded-xl
                  border-border/60
                  bg-background/40
                  pr-12
                  backdrop-blur-xl
                  focus-visible:ring-2
                  focus-visible:ring-green-500/40
                "
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="
                  absolute
                  right-3
                  top-1/2
                  -translate-y-1/2
                  text-sm
                  muted-foreground
                  hover:text-foreground
                  transition
                "
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {need2FA && (
              <div className="space-y-2">
                <label className="text-sm font-medium">2FA Code</label>
                <Input
                  placeholder="123456"
                  disabled={loading}
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value)}
                />
              </div>
            )}
          </div>

          {/* 🔗 FORGOT */}
          <div className="flex justify-end">
            <Link
              href="/auth/forgot-password"
              className="text-sm text-green-400 transition hover:text-green-300 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {/* 🚀 BUTTON */}
          <Button
            onClick={handleLogin}
            disabled={loading || !isFormValid}
            className="
              h-12
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
              disabled:opacity-40
              disabled:cursor-not-allowed
              disabled:hover:scale-100
            "
          >
            {loading ? "Logging in..." : "Login"}
          </Button>

          {/* 🌍 SOCIAL LOGIN */}
          <div className="space-y-4">
            <div className="relative flex items-center">
              <div className="flex-1 border-t border-border" />
              <span className="px-3 text-xs text-muted-foreground">
                OR CONTINUE WITH
              </span>
              <div className="flex-1 border-t border-border" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* GOOGLE */}
              <button
                type="button"
                className="
                  flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  border-border/60
                  bg-background/40
                  px-4
                  py-3
                  text-sm
                  font-medium
                  transition-all
                  hover:bg-accent
                "
              >
                <Image
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  className="h-5 w-5"
                  width={20}
                  height={20}
                />
                Google
              </button>

              {/* FACEBOOK */}
              <button
                type="button"
                className="
                  flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  border-border/60
                  bg-background/40
                  px-4
                  py-3
                  text-sm
                  font-medium
                  transition-all
                  hover:bg-accent
                "
              >
                <Image
                  src="https://www.svgrepo.com/show/475647/facebook-color.svg"
                  alt="Facebook"
                  className="h-5 w-5"
                  width={20}
                  height={20}
                />
                Facebook
              </button>
            </div>
          </div>

          {/* 🪪 REGISTER */}
          <div className="text-center text-sm text-muted-foreground">
            Not registered?{" "}
            <Link
              href="/auth/signup"
              className="font-medium text-green-400 transition hover:text-green-300 hover:underline"
            >
              Create account
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}