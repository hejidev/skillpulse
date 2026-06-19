"use client";

import ProfileSetting from "@/components/settings/ProfileSetting";
import PasswordSetting from "@/components/settings/PasswordSetting";
import NotificationSetting from "@/components/settings/NotificationSetting";
import ThemeSetting from "@/components/settings/ThemeSetting";
import SecurityLogs from "@/components/SecurityLogs";
import MFASetting from "@/components/settings/MFASetting";
import DangerZone from "@/components/settings/DangerZone";


import { useEffect, useState } from "react";
import API from "@/lib/api";
import { useUser } from "@/context/UserContext";
import { useQuery } from "@tanstack/react-query";

import { motion } from "framer-motion";

import {
  Shield,
  Bell,
  Lock,
  User,
  Palette,
  Sparkles,
} from "lucide-react";
import SkillSkeleton from "@/components/SkillSkeleton";

export default function SettingsPage() {
  const [email, setEmail] = useState(true);
  const [push, setPush] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [loading, setLoading] = useState(true);

  const { setUser } = useUser();

  // ================= LOAD SETTINGS =================
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

  // ================= GLOBAL USER SYNC =================
  useEffect(() => {
    const load = async () => {
      const res = await API.get("/settings/me");
      setUser(res.data);
    };

    load();
  }, [setUser]);

  // ================= USER QUERY =================
  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await API.get("/settings/me");
      return res.data;
    },
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background
text-foreground
border-border">
        <SkillSkeleton />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background
text-foreground
border-border
transition-colors duration-300">

      {/* ================= BACKGROUND ================= */}
      <div className="absolute inset-0 -z-10">

        <div className="absolute -top-37.5 -left-30 w-100 h-100 rounded-full bg-indigo-500/20 blur-[120px]" />

        <div className="absolute -bottom-37.5 -right-30 w-100 h-100 rounded-full bg-purple-500/20 blur-[120px]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_35%)]" />
      </div>

      <div className="max-w-8xl mx-auto px-6 lg:px-10 py-10 space-y-8">

        {/* ================= HERO ================= */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="
            relative overflow-hidden
            rounded-[32px]
            border border-white/10
            bg-white/4
            backdrop-blur-3xl
            p-8 lg:p-10
          "
        >

          <div className="absolute inset-0 bg-linear-to-r from-indigo-500/10 via-purple-500/10 to-cyan-500/10" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

            {/* LEFT */}
            <div className="space-y-4">

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-sm text-indigo-300">

                <Sparkles size={16} />

                Premium Settings Workspace
              </div>

              <div>
                <h1 className="text-4xl lg:text-6xl font-black tracking-tight">
                  Settings
                </h1>

                <p className="text-gray-400 mt-4 max-w-xl leading-relaxed">
                  Control your account, security, notifications and appearance
                  from your futuristic dashboard experience.
                </p>
              </div>
            </div>

            {/* RIGHT PROFILE */}
            <div className="flex items-center gap-4 p-4 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl">

              <img
                src={user?.avatar || "/default-avatar.png"}
                alt="avatar"
                className="
                  w-20 h-20 rounded-2xl object-cover
                  border border-white/10
                "
              />

              <div>
                <h3 className="text-xl font-bold">
                  {user?.name || "User"}
                </h3>

                <p className="text-sm text-gray-400">
                  Secure Workspace
                </p>

                <div className="flex items-center gap-2 mt-2 text-emerald-400 text-sm">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Protected
                </div>
              </div>
            </div>

          </div>
        </motion.div>

        {/* ================= GRID ================= */}
        <div className="grid xl:grid-cols-[280px_1fr] gap-8">

          {/* ================= SIDEBAR ================= */}
          <div className="sticky top-6 h-fit">

            <div className="rounded-[30px] border border-border bg-background backdrop-blur-3xl p-4 space-y-2">

              <SidebarItem
                icon={<User size={18} />}
                label="Profile"
              />

              <SidebarItem
                icon={<Lock size={18} />}
                label="Password"
              />

              <SidebarItem
                icon={<Bell size={18} />}
                label="Notifications"
              />

              <SidebarItem
                icon={<Palette size={18} />}
                label="Theme"
              />

              <SidebarItem
                icon={<Shield size={18} />}
                label="Security"
              />

            </div>

            {/* STATUS CARD */}
            <div className="
              mt-6 rounded-[30px]
              border border-indigo-500/20
              bg-linear-to-br
              from-indigo-500/10
              to-purple-500/10
              p-6
              backdrop-blur-3xl
            ">

              <h3 className="font-semibold text-lg mb-4">
                System Status
              </h3>

              <div className="space-y-4 text-sm">

                <div className="flex items-center justify-between">
                  <span className="text-gray-400">
                    Notifications
                  </span>

                  <span>
                    {email || push ? "Enabled" : "Disabled"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-400">
                    Theme
                  </span>

                  <span>
                    {darkMode ? "Dark" : "Light"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-400">
                    Security
                  </span>

                  <span className="text-emerald-400">
                    Protected
                  </span>
                </div>

              </div>
            </div>

          </div>

          {/* ================= CONTENT ================= */}
          <div className="space-y-8">

            <PremiumCard>
              <ProfileSetting />
            </PremiumCard>

            <PremiumCard>
              <PasswordSetting />
            </PremiumCard>

            <PremiumCard>
              <NotificationSetting
                email={email}
                push={push}
                setEmail={setEmail}
                setPush={setPush}
              />
            </PremiumCard>

            <PremiumCard>
              <ThemeSetting
                darkMode={darkMode}
                setDarkMode={setDarkMode}
              />
            </PremiumCard>

            <PremiumCard>
              <SecurityLogs />
            </PremiumCard>

            <PremiumCard>
              <MFASetting />
            </PremiumCard>

              <DangerZone />

          </div>

        </div>

      </div>
    </div>
  );
}

/* ================= PREMIUM CARD ================= */

function PremiumCard({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.div
      whileHover={{
        y: -3,
      }}
      transition={{
        duration: 0.2,
      }}
      className="
        relative overflow-hidden
        rounded-[30px]
        border border-white/10
        bg-white/4
        backdrop-blur-3xl
        p-1
        shadow-[0_0_60px_rgba(99,102,241,0.08)]
      "
    >

      <div className="absolute inset-0 bg-linear-to-br from-white/3 to-transparent" />

      <div className="relative z-10">
        {children}
      </div>

    </motion.div>
  );
}

/* ================= SIDEBAR ITEM ================= */

function SidebarItem({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div
      className="
        flex items-center gap-3
        px-4 py-3
        rounded-2xl
        cursor-pointer
        transition-all duration-300
        hover:bg-white/10
        hover:border-white/10
        border border-transparent
      "
    >

      <div className="text-brand">
        {icon}
      </div>

      <span className="text-sm font-medium">
        {label}
      </span>

    </div>
  );
}