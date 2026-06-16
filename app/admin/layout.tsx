"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  BarChart3,
  Activity,
  Ticket,
  MessageSquare,
  Users,
  Shield,
  Settings,
  KeyRound,
  Bell,
  FileText,
  History,
  Bot,
  UserCog,
  Lock,
  ChevronLeft,
  ChevronRight,
  TicketCheck,
  ChevronDown,
  Moon,
  Sun,
  Newspaper,
  Subscript,
  Link2,
} from "lucide-react";

import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuthContext } from "@/components/auth-provider";
import API from "@/lib/api";
import { useAppConfig } from "@/lib/useAppConfig";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { logout } = useAuthContext();

  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const { appName } = useAppConfig().config || { appName: "SkillPulse" };
  const appInitial = appName.charAt(0).toUpperCase();

  // which section is expanded; null means all collapsed
  const [openSection, setOpenSection] = useState<string | null>("Overview");

  // bottom theme menu open/close
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);

  // Appearance toggle state
  const [darkMode, setDarkMode] = useState(false);

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

  // Same logic as ThemeSetting.toggleTheme, but local to sidebar
  const { user, token } = useAuthContext(); // adjust to your context shape

  const toggleTheme = async (value: boolean) => {
    setDarkMode(value);

    if (value) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }

    // Only persist if logged in and token exists
    if (!token || !user) return;

    try {
      await API.put("/settings/theme", {
        theme: value ? "dark" : "light",
      });
    } catch (err) {
      console.error("Failed to save theme", err);
    }
  };

  // Close theme menu on Escape or click outside sidebar
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setThemeMenuOpen(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      const sidebar = document.getElementById("admin-sidebar");
      if (sidebar && !sidebar.contains(e.target as Node)) {
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

  const navSections = [
    {
      title: "Overview",
      items: [
        { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
        { name: "Activity", href: "/admin/activity", icon: Activity },
      ],
    },
    {
      title: "Support Engine",
      items: [
        { name: "Tickets", href: "/admin/tickets", icon: Ticket },
        { name: "Messages", href: "/admin/messages", icon: MessageSquare },
        { name: "Live Chat", href: "/admin/chat", icon: MessageSquare },
        { name: "AI Assistant", href: "/admin/ai", icon: Bot },
      ],
    },
    {
      title: "Users & Access",
      items: [
        { name: "Users", href: "/admin/users", icon: Users },
        { name: "Roles", href: "/admin/roles", icon: UserCog },
        { name: "Billing", href: "/admin/billing", icon: TicketCheck },
        { name: "Subscribers", href: "/admin/subscribers", icon: Subscript },
        { name: "Newsletter", href: "/admin/newsletter", icon: Newspaper },
        { name: "Referrals Lab", href: "/admin/referrals", icon: Link2 },
      ],
    },
    {
      title: "Content",
      items: [
        { name: "About Intelligence", href: "/admin/about", icon: FileText },
        { name: "Blog Control", href: "/admin/blog", icon: FileText },
        { name: "Notifications", href: "/admin/notifications", icon: Bell },
      ],
    },
    {
      title: "System",
      items: [
        { name: "Settings", href: "/admin/settings", icon: Settings },
        { name: "Security Logs", href: "/admin/logs", icon: History },
        { name: "Devices", href: "/admin/devices", icon: Lock },
        { name: "API Keys", href: "/admin/api", icon: KeyRound },
        { name: "Security", href: "/admin/security", icon: Shield },
      ],
    },
  ];

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* ================= SIDEBAR ================= */}
      <aside
        id="admin-sidebar"
        className={cn(
          "relative border-r border-border bg-card/30 backdrop-blur-xl transition-all duration-300",
          collapsed ? "w-20" : "w-80"
        )}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          {!collapsed && (
            <div>
              <h1 className="text-xl font-bold">⚡ {appName}</h1>
              <p className="text-xs text-muted-foreground">
                Admin Control System
              </p>
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto"
          >
            {collapsed ? <ChevronRight /> : <ChevronLeft />}
          </Button>
        </div>

        {/* NAV */}
        <ScrollArea className="h-[calc(100vh-180px)] px-3 py-4">
          {navSections.map((section) => {
            const isOpen = openSection === section.title;

            return (
              <div key={section.title} className="mb-3">
                {/* Section header as dropdown trigger */}
                <button
                  type="button"
                  onClick={() =>
                    setOpenSection((current) =>
                      current === section.title ? null : section.title
                    )
                  }
                  className={cn(
                    "flex w-full items-center justify-between px-3 py-2 rounded-lg text-[11px] font-bold tracking-widest uppercase",
                    isOpen
                      ? "bg-accent/60 text-foreground"
                      : "text-muted-foreground hover:bg-accent/40"
                  )}
                >
                  <span>{section.title}</span>
                  <ChevronDown
                    className={cn(
                      "h-3 w-3 transition-transform",
                      isOpen && "rotate-180"
                    )}
                  />
                </button>

                {/* Items – only when open */}
                {isOpen && (
                  <div className="space-y-1 mt-1">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const active = pathname === item.href;

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={cn(
                            "flex items-center gap-3 rounded-xl px-3 py-3 transition-all group",
                            active
                              ? "border-brand border text-brand font-bold shadow-lg"
                              : "hover:bg-accent"
                          )}
                        >
                          <Icon size={18} />
                          {!collapsed && (
                            <span className="text-sm font-medium">
                              {item.name}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          <button
            className="w-full text-left px-2 py-1 hover:bg-red-500/20 rounded text-red-400 mt-2"
            onClick={() => {
              logout();
              router.push("/");
            }}
          >
            Logout
          </button>
        </ScrollArea>

        {/* ADMIN USER PANEL / THEME TOGGLE */}
        <div className="border-t border-border px-4 py-3 relative">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-linear-to-br from-green-400 to-emerald-600" />
            {!collapsed && (
              <div className="flex-1">
                <p className="text-sm font-medium truncate">Admin</p>
                <button
                  type="button"
                  onClick={() => setThemeMenuOpen((v) => !v)}
                  className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/70 px-2.5 py-[2px] text-[11px] text-muted-foreground hover:bg-accent"
                >
                  <span className="text-emerald-400">
                    {darkMode ? "Dark mode" : "Light mode"}
                  </span>
                  <ChevronDown className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>

          {/* Small appearance dropdown like user sidebar */}
          {themeMenuOpen && !collapsed && (
            <div className="-mt-10 ml-32 rounded-2xl border border-border/70 bg-background/95 backdrop-blur-2xl shadow-[0_16px_40px_rgba(0,0,0,0.45)] p-3 z-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center h-7 w-7 rounded-xl bg-linear-to-br from-indigo-500/20 to-purple-500/20 border border-white/10">
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
                <Switch checked={darkMode} onCheckedChange={toggleTheme} />
              </div>
            </div>
          )}
        </div>

        {/* SYSTEM STATUS */}
        {/* <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-card/40">
          {!collapsed ? (
            <div className="text-xs space-y-1">
              <p className="text-muted-foreground">System Status</p>
              <div className="flex items-center gap-2 text-green-400">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Operational
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            </div>
          )}
        </div> */}
      </aside>

      {/* ================= MAIN ================= */}
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}