"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  BookOpen,
  BarChart3,
  Settings,
  Trophy,
  ChevronLeft,
  ChevronRight,
  Home,
} from "lucide-react";

const links = [
  { name: "Overview", icon: LayoutDashboard, href: "/dashboard" },
  { name: "Skills", icon: BookOpen, href: "/dashboard/skills" },
  { name: "Progress", icon: BarChart3, href: "/dashboard/progress" },
  { name: "Leaderboard", icon: Trophy, href: "/dashboard/leaderboard" },
  { name: "Settings", icon: Settings, href: "/dashboard/settings" },
];

export default function Sidebar({
  collapsed,
  setCollapsed,
}: {
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
}) {
  const pathname = usePathname();

  return (
    <aside
      className={`fixed top-0 left-0 h-screen border-r border-white/10 
      bg-black/40 backdrop-blur-xl transition-all duration-300 flex flex-col
      ${collapsed ? "w-20" : "w-64"} p-4 z-50`}
    >

      {/* HEADER */}
      <div className="flex items-center justify-between mb-8 px-2">

        {!collapsed && (
          <h1 className="text-xl font-bold bg-linear-to-r from-green-400 to-emerald-600 text-transparent bg-clip-text">
            <Link href="/">
             SkillPulse
             </Link>
          </h1>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-white/10 transition"
        >
          {collapsed ? (
            <ChevronRight size={18} />
          ) : (
            <ChevronLeft size={18} />
          )}
        </button>

      </div>

      {/* NAVIGATION */}
      <nav className="space-y-1 flex-1">

        {links.map((link) => {
          const active = pathname === link.href;

          return (
            <Link
              key={link.name}
              href={link.href}
              className={`relative flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all
              ${active
                  ? "bg-white/10 text-white"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
            >

              <link.icon size={18} />

              {!collapsed && <span>{link.name}</span>}

              {/* ACTIVE INDICATOR */}
              {active && (
                <span className="absolute left-0 w-1 h-6 bg-green-500 rounded-r" />
              )}

            </Link>
          );
        })}

      </nav>

      {/* FOOTER */}
      {!collapsed && (
        <div className="text-xs text-gray-500 mt-auto px-2">
          v1.0 • SkillPulse SaaS
        </div>
      )}

    </aside>
  );
}