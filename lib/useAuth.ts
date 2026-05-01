"use client";

import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const syncAuth = () => {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");

      if (!token || !userData) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        setUser(JSON.parse(userData));
      } catch {
        localStorage.removeItem("user");
        setUser(null);
      }

      setLoading(false);
    };

    syncAuth();

    window.addEventListener("auth-change", syncAuth);

    return () => {
      window.removeEventListener("auth-change", syncAuth);
    };
  }, []);

  return { user, loading };
};