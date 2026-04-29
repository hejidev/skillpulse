"use client";

import ProfileSetting from "@/components/settings/ProfileSetting";
import PasswordSetting from "@/components/settings/PasswordSetting";
import NotificationSetting from "@/components/settings/NotificationSetting";
import ThemeSetting from "@/components/settings/ThemeSetting";
import SecurityLogs from "@/components/SecurityLogs";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import { useUser } from "@/context/UserContext";
import { useQuery } from "@tanstack/react-query";

export default function SettingsPage() {
  const [email, setEmail] = useState(true);
  const [push, setPush] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [loading, setLoading] = useState(true);
  
  const { setUser } = useUser();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await API.get("/settings/me");

        setEmail(res.data.emailNotifications);
        setPush(res.data.pushNotifications);
        setDarkMode(res.data.theme === "dark");
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);


useEffect(() => {
  const load = async () => {
    const res = await API.get("/settings/me");
    setUser(res.data); // 🔥 global sync
  };
  load();
}, []);

const { data: user } = useQuery({
  queryKey: ["user"],
  queryFn: async () => {
    const res = await API.get("/settings/me");
    return res.data;
  },
});

  if (loading) {
    return <p className="text-center mt-10">Loading settings...</p>;
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">

      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground text-sm">
          Manage your account and preferences
        </p>
      </div>

      <ProfileSetting />
      <PasswordSetting />

      <NotificationSetting
        email={email}
        push={push}
        setEmail={setEmail}
        setPush={setPush}
      />

      <ThemeSetting
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      <div className="p-6 border rounded-xl bg-white/5">
        <SecurityLogs />
      </div>

    </div>
  );
}