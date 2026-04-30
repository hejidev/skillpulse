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
    <Card className="w-96 mx-auto mt-20 p-6 text-center space-y-4">
      <h1 className="text-xl font-bold">Email Verification</h1>

      {loading ? <p>Verifying your email...</p> : <p>{status}</p>}

      {!loading && (
        <Button onClick={() => router.push("/auth/login")}>
          Go to Login
        </Button>
      )}
    </Card>
  );
}