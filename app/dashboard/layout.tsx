"use client";

import Sidebar from "@/components/dashboard/Sidebar";
import GlobalSearch from "@/components/search/GlobalSearch";
import { useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#0b0f19] text-white">

      {/* Sidebar */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 
        ${collapsed ? "ml-20" : "ml-64"}`}
      >
        {/* Top Bar */}
        <header className="w-full h-16 flex items-center justify-between px-10 border-b border-white/10 glass">
          <div>
            <p className="text-xs text-gray-400">Welcome back</p>
            <h2 className="font-semibold">SkillPulse Dashboard</h2>
          </div>

          <GlobalSearch />
        </header>

        {/* Page Content */}
        <main className="p-6 lg:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}