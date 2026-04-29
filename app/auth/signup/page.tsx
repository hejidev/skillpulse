"use client";

import { useState } from "react";
import API from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";


export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

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

  const handleSignup = async () => {
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
    <Card className="w-100 mx-auto mt-20 p-8 space-y-4">
      <h1 className="text-xl font-bold">Create Account</h1>

      <Input
        placeholder="Name"
        disabled={loading}
        onChange={(e) => setName(e.target.value)}
      />

      <Input
        placeholder="Email"
        disabled={loading}
        onChange={(e) => setEmail(e.target.value)}
      />

      <Input
        placeholder="Password"
        type="password"
        disabled={loading}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />


      <div className="mt-2">
        <div className="h-2 bg-gray-700 rounded">
          <div
            className={`h-2 rounded transition-all ${strength <= 2
              ? "bg-red-500 w-1/4"
              : strength === 3
                ? "bg-yellow-500 w-2/4"
                : "bg-green-500 w-full"
              }`}
          />
        </div>

        <p className="text-xs mt-1 text-gray-400">
          {strength <= 2
            ? "Weak password"
            : strength === 3
              ? "Medium password"
              : "Strong password"}
        </p>
      </div>

      <Button onClick={handleSignup} disabled={loading} className="w-full">
        {loading ? "Creating account..." : "Sign Up"}
      </Button>

      <p className="text-sm text-center text-gray-400">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-green-400 hover:underline">
          Login
        </Link>
      </p>
    </Card>
  );
}