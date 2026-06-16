"use client";

import { Switch } from "@/components/ui/switch";
import API from "@/lib/api";
import { MoonStar, Sun } from "lucide-react";

export default function ThemeSetting({
  darkMode,
  setDarkMode,
}: any) {

  const toggleTheme = async (value: boolean) => {
    // update state instantly
    setDarkMode(value);

    // 🔥 APPLY THEME GLOBALLY
    if (value) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }

    // save to backend
    await API.put("/settings/theme", {
      theme: value ? "dark" : "light",
    });
  };

  return (
    <div
      className="
        relative overflow-hidden
        rounded-[28px]
        border border-border
        bg-card/50
        backdrop-blur-2xl
        p-6
      "
    >
      {/* glow */}
      <div className="absolute inset-0 bg-linear-to-br from-indigo-500/10 to-purple-500/5" />

      <div className="relative flex items-center justify-between">

        <div className="flex items-center gap-4">

          <div
            className="
              flex items-center justify-center
              w-14 h-14 rounded-2xl
              bg-linear-to-br
              from-indigo-500/20
              to-purple-500/20
              border border-white/10
            "
          >
            {darkMode ? (
              <MoonStar className="text-indigo-300" size={24} />
            ) : (
              <Sun className="text-yellow-400" size={24} />
            )}
          </div>

          <div>
            <h2 className="text-lg font-semibold">
              Appearance
            </h2>

            <p className="text-sm text-muted-foreground">
              Switch between dark and light mode
            </p>
          </div>

        </div>

        <Switch
          checked={darkMode}
          onCheckedChange={toggleTheme}
        />
      </div>
    </div>
  );
}