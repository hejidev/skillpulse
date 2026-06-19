// hooks/useResolvedTheme.ts
import { useEffect, useState } from "react";

export type UserThemeSetting = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

export function useResolvedTheme(setting: UserThemeSetting): ResolvedTheme {
  const [resolved, setResolved] = useState<ResolvedTheme>("dark");

  useEffect(() => {
    if (setting !== "system") {
      setResolved(setting);
      return;
    }

    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const apply = () => setResolved(media.matches ? "dark" : "light");

    apply();                          // initial
    media.addEventListener("change", apply);

    return () => media.removeEventListener("change", apply);
  }, [setting]);

  return resolved;
}