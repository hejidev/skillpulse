"use client";

import Sidebar from "@/components/dashboard/Sidebar";
import NotificationBell from "@/components/notificationBell";
import GlobalSearch from "@/components/search/GlobalSearch";

import { usePathname } from "next/navigation";
import { useState } from "react";

import {
  Menu,
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const pathname = usePathname();

  const [collapsed, setCollapsed] = useState(false);

  const [mobileOpen, setMobileOpen] = useState(false);

  const showSearch =
    pathname === "/dashboard" ||
    pathname.startsWith("/skills");

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* MOBILE OVERLAY */}
      {mobileOpen && (
        <div
          className="
            fixed inset-0 z-40
            bg-black/60 backdrop-blur-sm
            lg:hidden
          "
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* MAIN */}
      <div
        className={`
          min-h-screen
          transition-all duration-300

          ${collapsed
            ? "lg:ml-20"
            : "lg:ml-64"
          }
        `}
      >

        {/* TOPBAR */}
        <header
          className="
            sticky top-0 z-30
            h-16
            border-b border-border
            bg-background/80
            backdrop-blur-2xl
          "
        >

          <div className="h-full px-4 lg:px-6 flex items-center justify-between gap-4">

            {/* LEFT */}
            <div className="flex items-center gap-3">

              {/* MOBILE MENU */}
              <button
                onClick={() => setMobileOpen(true)}
                className="
                  lg:hidden
                  p-2 rounded-xl
                  hover:bg-accent
                  transition
                "
              >
                <Menu size={20} />
              </button>

              <div>
                <p className="text-[11px] text-muted-foreground">
                  Welcome back
                </p>

                <h2 className="font-semibold tracking-tight text-sm lg:text-base">
                  SkillPulse
                </h2>
              </div>

            </div>

            {/* SEARCH */}
            {showSearch && (
              <div className="hidden md:flex flex-1 justify-center px-4">

                <div className="w-full max-w-md">
                  <GlobalSearch />
                </div>

              </div>
            )}

            {/* RIGHT */}
            <div className="flex items-center gap-2 lg:gap-3">

              <div className="relative p-1 rounded-xl hover:bg-accent transition">
                <NotificationBell />
              </div>

              {/* <div
                className="
                  w-9 h-9 rounded-full
                  bg-linear-to-br
                  from-green-400
                  to-emerald-600
                "
              /> */}

            </div>

          </div>

        </header>

        {/* PAGE */}
        <main className="p-4 sm:p-6 lg:p-10">
          {children}
        </main>

      </div>

    </div>
  );
}