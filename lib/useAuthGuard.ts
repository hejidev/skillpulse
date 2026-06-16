"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export const useAuthGuard = (roleRequired?: "admin" | "user") => {
  const router = useRouter();

  useEffect(() => {
    const token =
      localStorage.getItem("token");

    const role =
      localStorage.getItem("role");

    if (!token) {
      router.replace("/");
      return;
    }

    if (
      roleRequired &&
      role !== roleRequired
    ) {
      router.replace("/dashboard");
    }
  }, [roleRequired, router]);
};