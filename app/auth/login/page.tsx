"use client";

import { useState } from "react";
import API from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleLogin = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      const token = res.data.accessToken;

      localStorage.setItem("token", token);

      // 👇 THIS is the fix
      localStorage.setItem("user", JSON.stringify(res.data.user));

      window.dispatchEvent(new Event("auth-change"));

      const decoded: any = jwtDecode(token);
      localStorage.setItem("role", decoded.role);

      toast.success("Login successful 🚀");

      router.push(decoded.role === "admin" ? "/admin" : "/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-100 mx-auto mt-20 p-8 space-y-4">
      <h1 className="text-xl font-bold">Welcome Back</h1>

      <Input
        placeholder="Email"
        disabled={loading}
        onChange={(e) => setEmail(e.target.value)}
      />

      <Input
        placeholder="Password"
        type="password"
        disabled={loading}
        onChange={(e) => setPassword(e.target.value)}
      />

      <div className="text-right text-sm">
        <Link href="/auth/forgot-password" className="text-green-400 hover:underline">
          Forgot password?
        </Link>
      </div>

      <Button onClick={handleLogin} disabled={loading} className="w-full">
        {loading ? "Logging in..." : "Login"}
      </Button>

      <p className="text-sm text-center text-gray-400">
        Not registered?{" "}
        <Link href="/auth/signup" className="text-green-400 hover:underline">
          Create account
        </Link>
      </p>
    </Card>
  );
}