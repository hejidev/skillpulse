// lib/useAppConfig.ts
"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";

type AppConfig = {
  appName: string;
  defaultTheme: "light" | "dark";
};

export function useAppConfig() {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await API.get("/public-settings");
        setConfig(res.data);
      } catch (err) {
        console.error("Failed to load app config", err);
        // fall back to defaults
        setConfig({ appName: "SkillPulse", defaultTheme: "dark" });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return { config, loading };
}