"use client";

import { useMemo, useState } from "react";
import API from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Check,
} from "lucide-react";


export default function SignupPage() {
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref"); // e.g. ABC123

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const router = useRouter();

  const getStrength = (password: string) => {
    let score = 0;

    if (password.length >= 6) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    return score;
  };

  const validatePassword = (password: string) => {
    return (
      password.length >= 6 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[^A-Za-z0-9]/.test(password)
    );
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePassword(password)) {
      toast.error("Password too weak");
      return;
    }

    setLoading(true);

    try {
      const res = await API.post("/auth/register", {
        name,
        email,
        password,
        ref,
      });

      toast.success(res.data.message);
      setSuccess(true); // 👈 IMPORTANT
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const strength = getStrength(password);

  const isFormValid = useMemo(() => {
    return (
      name.trim().length > 2 &&
      email.trim().length > 0 &&
      validatePassword(password) &&
      acceptedTerms
    );
  }, [name, email, password, acceptedTerms]);

  if (success) {
    return (
      <Card className="w-96 mx-auto mt-20 p-6 text-center space-y-4">
        <h1 className="text-xl font-bold">Check your email 📩</h1>

        <p>
          We sent a verification link to <b>{email}</b>.
          Please verify your account before logging in.
        </p>

        <Button onClick={() => router.push("/auth/login")}>
          Go to Login
        </Button>
      </Card>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background px-6 py-26 text-foreground">

      {/* 🌌 BACKGROUND FX */}
      <div className="absolute inset-0 -z-10">

        <div className="absolute -top-30 -left-30 h-80 w-[320px] rounded-full bg-green-500/10 blur-3xl" />

        <div className="absolute -bottom-30 -right-30 h-80 w-[320px] rounded-full bg-purple-500/10 blur-3xl" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_35%)] dark:bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_35%)]" />

      </div>

      <Card className="
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
    ">

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
                Create Account
              </h1>

              <p className="mt-2 text-sm text-muted-foreground">
                Start your journey toward intentional growth and consistency.
              </p>
            </div>

          </div>

          {/* 👤 NAME */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Full Name
            </label>

            <Input
              placeholder="Enter your full name"
              disabled={loading}
              onChange={(e) => setName(e.target.value)}
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

          {/* 📩 EMAIL */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Email Address
            </label>

            <Input
              placeholder="Enter your email"
              disabled={loading}
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
            <label className="text-sm font-medium">
              Password
            </label>

            <div className="relative">

              <Input
                placeholder="Create a password"
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
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="
                  absolute
                  right-3
                  top-1/2
                  -translate-y-1/2
                  text-muted-foreground
                  hover:text-foreground
                  transition
                "
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>

            </div>

            {/* 🔥 PASSWORD STRENGTH */}
            {password.length > 0 && (
              <div className="mt-3 space-y-2">

                <div className="h-2 overflow-hidden rounded-full bg-muted">

                  <div
                    className={`
          h-full rounded-full transition-all duration-500
          ${strength <= 2
                        ? "w-1/4 bg-red-500"
                        : strength === 3
                          ? "w-2/4 bg-yellow-500"
                          : "w-full bg-green-500"
                      }
        `}
                  />

                </div>

                <p
                  className={`
        text-xs font-medium
        ${strength <= 2
                      ? "text-red-400"
                      : strength === 3
                        ? "text-yellow-400"
                        : "text-green-400"
                    }
      `}
                >
                  {strength <= 2
                    ? "Weak password"
                    : strength === 3
                      ? "Medium password"
                      : "Strong password"}
                </p>

              </div>
            )}

          </div>

          <div className="flex items-start gap-3">

            <button
              type="button"
              onClick={() =>
                setAcceptedTerms(!acceptedTerms)
              }
              className={`
                mt-0.5
                flex
                h-5
                w-5
                items-center
                justify-center
                rounded-md
                border         
                transition
                cursor-pointer
                ${acceptedTerms
                  ? "border-green-500 bg-green-500 text-white"
                  : "border-border bg-background"
                }
              `}
            >
              {acceptedTerms && (
                <Check size={14} />
              )}
            </button>

            <p className="text-sm text-muted-foreground leading-relaxed">

              I agree to the{" "}

              <Link
                href="/terms"
                className="text-green-400 hover:underline"
              >
                Terms & Conditions
              </Link>

              {" "}and{" "}

              <Link
                href="/privacy"
                className="text-green-400 hover:underline"
              >
                Privacy Policy
              </Link>

            </p>

          </div>

          {/* 🚀 BUTTON */}
          <Button
            onClick={handleSignup}
            disabled={loading || !isFormValid}
            className="
              h-12
              w-full
              rounded-xl
              bg-linear-to-r
            from-green-400
            to-green-600
              font-bold
              text-white
              foreground
              transition-all
              hover:scale-[1.02]
              hover:shadow-[0_0_30px_rgba(34,197,94,0.35)]
              disabled:opacity-40
              disabled:cursor-not-allowed
              disabled:hover:scale-100
              disabled:hover:shadow-none
            "
          >
            {loading ? "Creating account..." : "Sign Up"}
          </Button>

          {/* 🔗 LOGIN */}
          <div className="text-center text-sm text-muted-foreground">

            Already have an account?{" "}

            <Link
              href="/auth/login"
              className="font-medium text-green-400 transition hover:text-green-300 hover:underline"
            >
              Login
            </Link>

          </div>

        </div>

      </Card>
    </div>
  );
}