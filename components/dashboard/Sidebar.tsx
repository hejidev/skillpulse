"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  BarChart3,
  Settings,
  Trophy,
  ChevronLeft,
  ChevronRight,
  BarChart,
  X,
  Contact,
  ChevronDown,
  Sun,
  Moon,
  Monitor,
  Link2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch"; // your existing switch
import API from "@/lib/api";

type PlanId = "free" | "starter" | "pro" | "enterprise";

interface User {
  name: string;
  email?: string;
  plan?: PlanId;
}

const links = [
  {
    section: "Core",
    items: [{ name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" }],
  },
  {
    section: "Learning",
    items: [
      { name: "Skills", icon: BookOpen, href: "/dashboard/skills" },
      { name: "Sessions", icon: BarChart3, href: "/dashboard/sessions" },
      { name: "Progress", icon: BarChart, href: "/dashboard/progress" },
    ],
  },
  {
    section: "Insights",
    items: [
      { name: "Analytics", icon: BarChart3, href: "/dashboard/analytics" },
      { name: "AI Coach", icon: LayoutDashboard, href: "/dashboard/coach" },
    ],
  },
  {
    section: "Gamification",
    items: [
      {
        name: "Achievements",
        icon: Trophy,
        href: "/dashboard/achievements",
      },
      { name: "Leaderboard", icon: Trophy, href: "/dashboard/leaderboard" },
    ],
  },
  {
    section: "System",
    items: [
      {
        name: "Notifications",
        icon: LayoutDashboard,
        href: "/dashboard/notifications",
      },
      {
        name: "Settings",
        icon: Settings,
        href: "/dashboard/settings",
      },
      {
        name: "Contact Support",
        icon: Contact,
        href: "/dashboard/tickets",
      },
      {
        name: "Referrals",
        icon: Link2,
        href: "/dashboard/referrals",
      },
    ],
  },
];

export default function Sidebar({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}: any) {
  const pathname = usePathname();
  const router = useRouter();

  // which section is expanded; null means all collapsed
  const [openSection, setOpenSection] = useState<string | null>("Core");

  const [user, setUser] = useState<User | null>(null);
  const [planMenuOpen, setPlanMenuOpen] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);

  // Appearance toggle state
  const [darkMode, setDarkMode] = useState(false);

  // Load user from localStorage and listen for auth-change
  useEffect(() => {
    if (typeof window === "undefined") return;

    const saved = localStorage.getItem("user");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        setUser(null);
      }
    }

    const handler = () => {
      const updated = localStorage.getItem("user");
      if (updated) {
        try {
          setUser(JSON.parse(updated));
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    window.addEventListener("auth-change", handler);
    return () => window.removeEventListener("auth-change", handler);
  }, []);

  // Initialize darkMode from stored theme
  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = localStorage.getItem("theme");
    if (stored === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    } else if (stored === "light") {
      setDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const currentPlanLabel = (() => {
    if (!user?.plan) return "Free";
    switch (user.plan) {
      case "starter":
        return "Starter";
      case "pro":
        return "Pro";
      case "enterprise":
        return "Enterprise";
      default:
        return "Free";
    }
  })();

  const handleGoSettings = () => {
    setPlanMenuOpen(false);
    setThemeMenuOpen(false);
    router.push("/dashboard/settings");
  };

  const handleGoBilling = () => {
    setPlanMenuOpen(false);
    setThemeMenuOpen(false);
    router.push("/company/billing"); // adjust to your billing route
  };

  // Same logic as ThemeSetting.toggleTheme, but local to sidebar
  const toggleTheme = async (value: boolean) => {
    setDarkMode(value);

    if (value) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }

    try {
      await API.put("/settings/theme", {
        theme: value ? "dark" : "light",
      });
    } catch (err) {
      // Optional: revert on failure or show toast
      console.error("Failed to save theme", err);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        console.log("Closing menus via Escape");
        setPlanMenuOpen(false);
        setThemeMenuOpen(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      const sidebar = document.getElementById("dashboard-sidebar");
      if (sidebar && !sidebar.contains(e.target as Node)) {
        setPlanMenuOpen(false);
        setThemeMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* MOBILE OVERLAY */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      <aside
        id="dashboard-sidebar"
        className={`
    fixed top-0 left-0 z-50
    h-dvh lg:h-screen
    flex flex-col
    overflow-hidden
    transition-all duration-300
    border-r border-border
    bg-background/95 backdrop-blur-2xl
    ${collapsed ? "lg:w-20" : "lg:w-64"}
    w-72
    ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
  `}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          {!collapsed ? (
            <Link
              href="/"
              className="text-lg font-bold bg-linear-to-r from-emerald-400 to-green-600 bg-clip-text text-transparent"
            >
              SkillPulse
            </Link>
          ) : (
            <Link
              href="/"
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-linear-to-br from-emerald-400 to-green-600 text-xs font-black text-white"
            >
              SP
            </Link>
          )}

          <div className="flex items-center gap-1">
            {/* DESKTOP COLLAPSE */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex p-2 rounded-lg hover:bg-accent transition"
            >
              {collapsed ? (
                <ChevronRight size={18} />
              ) : (
                <ChevronLeft size={18} />
              )}
            </button>

            {/* MOBILE CLOSE */}
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-accent"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-2 scrollbar-thin scrollbar-thumb-primary/20">
          {links.map((group) => {
            const isOpen = openSection === group.section;

            return (
              <div key={group.section} className="space-y-1">
                {/* Section header as dropdown trigger */}
                <button
                  type="button"
                  onClick={() =>
                    setOpenSection((current) =>
                      current === group.section ? null : group.section
                    )
                  }
                  className={`
            flex w-full items-center justify-between
            px-2 py-2
            text-[11px] font-bold tracking-widest uppercase
            rounded-lg
            ${isOpen ? "bg-accent/60 text-foreground" : "text-muted-foreground hover:bg-accent/40"}
          `}
                >
                  <span>{group.section}</span>
                  <ChevronDown
                    className={`
              h-3 w-3 transition-transform
              ${isOpen ? "rotate-180" : ""}
            `}
                  />
                </button>

                {/* Items – shown only when section is open */}
                {isOpen && (
                  <div className="space-y-1 mt-1">
                    {group.items.map((link) => {
                      const active = pathname === link.href;

                      return (
                        <Link
                          key={link.name}
                          href={link.href}
                          onClick={() => setMobileOpen(false)}
                          className={`
                    relative flex items-center gap-3
                    px-3 py-2 rounded-xl
                    transition-all duration-300
                    group
                    ${active
                              ? `
                            bg-primary/10
                            text-foreground
                            border border-primary/20
                            shadow-[0_0_30px_rgba(34,197,94,0.12)]
                          `
                              : `
                            text-muted-foreground
                            hover:bg-accent
                            hover:text-foreground
                            border border-transparent
                          `
                            }
                  `}
                        >
                          {/* ACTIVE BAR */}
                          {active && (
                            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
                          )}

                          {/* ICON */}
                          <link.icon
                            size={18}
                            className="transition-transform duration-300 group-hover:scale-110"
                          />

                          {/* LABEL */}
                          {!collapsed && (
                            <span className="font-medium tracking-wide">
                              {link.name}
                            </span>
                          )}

                          {/* HOVER GLOW */}
                          <div
                            className="
                      absolute inset-0 opacity-0
                      group-hover:opacity-100
                      transition-opacity duration-300
                      bg-linear-to-r
                      from-primary/5
                      to-transparent
                      pointer-events-none
                    "
                          />
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* USER PANEL AT BOTTOM */}
        {!collapsed && (
          <div className="relative border-t border-border">
            <div className="p-4">
              {user ? (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-card/80 hover:bg-accent/80 transition relative">
                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-full bg-linear-to-br from-green-400 to-emerald-600" />

                  {/* Name + plan badge */}
                  <div className="flex flex-col">
                    <span className="text-sm font-medium truncate">
                      {user.name || "You"}
                    </span>

                    <div className="relative mt-1">
                      {/* Plan badge trigger */}
                      <button
                        type="button"
                        onClick={() => {
                          setPlanMenuOpen(v => !v);
                          setThemeMenuOpen(false);
                        }}
                        className="
                  inline-flex items-center gap-1.5
                  rounded-full border border-border/60
                  bg-background/70 px-2.5 py-0.5
                  text-[11px] text-muted-foreground
                  hover:bg-accent
                  shadow-[0_0_16px_rgba(34,197,94,0.15)]
                "
                      >
                        <span className="text-emerald-400">
                          {currentPlanLabel} Plan
                        </span>
                        <ChevronDown className="h-3 w-3" />
                      </button>

                      {/* Main dropdown – anchored above badge */}
                      {planMenuOpen && (
                        <div
                          className="
      
      absolute bottom-10 -left-10
      w-55
      rounded-2xl border border-border/70
      bg-background/95 backdrop-blur-2xl
      shadow-[0_-16px_40px_rgba(0,0,0,0.45)]
      overflow-hidden
    "
                        >
                          <div className="px-3 pt-3 pb-2 border-b border-border/60">
                            <p className="text-xs font-semibold text-foreground">
                              {currentPlanLabel} Plan
                            </p>
                            <p className="mt-1 text-[11px] text-muted-foreground">
                              Manage plan, billing, and appearance.
                            </p>
                          </div>

                          {/* Profile & Settings */}
                          <button
                            type="button"
                            onClick={handleGoSettings}
                            className="
                      flex w-full items-center gap-2 px-3 py-2.5
                      text-xs text-foreground
                      hover:bg-accent/80
                    "
                          >
                            <Settings className="h-3.5 w-3.5" />
                            <span>Profile & Settings</span>
                          </button>

                          {/* Billing & Plan */}
                          <button
                            type="button"
                            onClick={handleGoBilling}
                            className="
                      flex w-full items-center gap-2 px-3 py-2.5
                      text-xs text-foreground
                      hover:bg-accent/80
                    "
                          >
                            <BarChart3 className="h-3.5 w-3.5" />
                            <span>Billing & Plan</span>
                          </button>

                          {/* Preferences with nested panel below */}
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() => setThemeMenuOpen(v => !v)}
                              className="
      flex w-full items-center justify-between
      px-3 py-2
      text-xs text-foreground
      hover:bg-accent/80
    "
                            >
                              <span className="flex items-center gap-2">
                                <Sun className="h-3.5 w-3.5" />
                                <span>Preferences</span>
                              </span>
                              <ChevronRight className={`h-3 w-3 transition-transform ${themeMenuOpen ? "rotate-90" : ""}`} />
                            </button>

                            {themeMenuOpen && (
                              <div
                                className="
        absolute left-10 -top-30 mt-2
        w-45
        rounded-2xl border border-border/70
        bg-background/95 backdrop-blur-2xl
        shadow-[0_16px_40px_rgba(0,0,0,0.45)]
        z-90
      "
                              >
                                <div className="px-3 pt-3 pb-2 border-b border-border/60">
                                  <p className="text-[11px] font-semibold text-foreground">
                                    Appearance
                                  </p>
                                  <p className="mt-1 text-[11px] text-muted-foreground">
                                    Toggle dark or light mode.
                                  </p>
                                </div>

                                <div className="flex items-center justify-between px-3 py-2.5">
                                  <div className="flex items-center gap-2">
                                    <div
                                      className="
              flex items-center justify-center
              h-7 w-7 rounded-xl
              bg-linear-to-br from-indigo-500/20 to-purple-500/20
              border border-white/10
            "
                                    >
                                      {darkMode ? (
                                        <Moon className="h-3.5 w-3.5 text-indigo-300" />
                                      ) : (
                                        <Sun className="h-3.5 w-3.5 text-yellow-400" />
                                      )}
                                    </div>
                                    <span className="text-[11px]">
                                      {darkMode ? "Dark mode" : "Light mode"}
                                    </span>
                                  </div>

                                  <Switch
                                    checked={darkMode}
                                    onCheckedChange={toggleTheme}
                                  />
                                </div>

                                {/* <div className="flex items-center gap-2 px-3 pb-3 text-[10px] text-muted-foreground">
                                  <Monitor className="h-3 w-3" />
                                  <span>Theme preference syncs to your account.</span>
                                </div> */}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-card text-xs text-muted-foreground">
                  <span>Not signed in</span>
                </div>
              )}
            </div>
          </div>
        )}
      </aside>
    </>
  );
}