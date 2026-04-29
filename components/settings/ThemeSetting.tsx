"use client";

import { Switch } from "@/components/ui/switch";
import API from "@/lib/api";

export default function ThemeSetting({
  darkMode,
  setDarkMode,
}: any) {

  const toggleTheme = async (value: boolean) => {
    setDarkMode(value);

    await API.put("/settings/theme", {
      theme: value ? "dark" : "light",
    });
  };

  return (
    <div className="p-5 border rounded-xl bg-white/5 flex justify-between items-center">
      <div>
        <h2 className="font-semibold">Theme</h2>
        <p className="text-sm text-muted-foreground">
          Light / Dark mode
        </p>
      </div>

      <Switch checked={darkMode} onCheckedChange={toggleTheme} />
    </div>
  );
}