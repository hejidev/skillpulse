"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import API from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function VerifyEmailClient() {
  const params = useSearchParams();
  const router = useRouter();

  const token = params.get("token");

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("Invalid verification link");
      setLoading(false);
      return;
    }

    const verify = async () => {
      try {
        const res = await API.get(`/auth/verify-email?token=${token}`);
        setStatus(res.data.message);
      } catch (err: any) {
        setStatus(err.response?.data?.message || "Verification failed");
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [token]);

  return (
    <Card className="w-96 mx-auto mt-20 p-6 text-center space-y-4 overflow-hidden bg-background text-foreground">
      <h1 className="text-xl font-bold">Email Verification</h1>

      {loading ? <p>Verifying your email...</p> : <p>{status}</p>}

      {!loading && (
        <Button onClick={() => router.push("/auth/login")} className="h-12
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
              disabled:hover:scale-100">
          Go to Login
        </Button>
      )}
    </Card>
  );
}