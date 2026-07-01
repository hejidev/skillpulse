"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthContext } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { useNotifications } from "@/lib/notifications/useNotifications";
import { useGlobalNotifications } from "@/hooks/useGlobalNotifications";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
} from "@/components/ui/navigation-menu";
import { Bell, Menu, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import UserDropdown from "./UserDropdown";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";
import API from "@/lib/api";
import { useAppConfig } from "@/lib/useAppConfig";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const { user, loading } = useAuthContext();

  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { unread } = useNotifications();
  useGlobalNotifications(); // keep socket sync globally


  const { config } = useAppConfig(); // load app name

  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // 🚫 DO NOT RUN IF USER NOT READY
    if (!user) return;

    // ✅ SOCKET
    socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_URL as string);

    const userId = localStorage.getItem("userId");

    if (userId) {
      socketRef.current.emit("register", userId);
    }

    socketRef.current.on("notification", (data: any) => {
      toast.success(data.message);
      // setUnreadCount((prev) => prev + 1);
    });

    // ✅ FETCH UNREAD (SAFE NOW)
    const fetchUnread = async () => {
      try {
        const res = await API.get("/settings/notifications");

        const unread = res.data.filter((n: any) => !n.read).length;
        // setUnreadCount(unread);
      } catch (err) {
        console.error("Unread count error:", err);
      }
    };

    fetchUnread();

    return () => {
      socketRef.current?.disconnect();
    };
  }, [user]); // ✅ DEPEND ON USER

  if (loading) return null;
  if (user?.role === "admin") return null;

  const isActive = (path: string) => pathname === path;

  const getGreeting = () => {
    if (!user?.name) return "Welcome 👋";
    return `Hi ${user.name.split(" ")[0]} 👋`;
  };

  const appName = config?.appName || "SkillPulse";
  const appInitial = appName.charAt(0).toUpperCase();

  return (
    <header
      className="
    fixed top-0 w-full z-50
    border-b border-border
    bg-background/70
    backdrop-blur-2xl
    supports-backdrop-filter:bg-background/60
    transition-colors duration-300
  "
    >

      {/* 🌌 TOP GLOW */}
      <div className="absolute inset-0 -z-10 overflow-hidden">

        <div className="absolute left-0 top-0 w-75 h-75 bg-green-500/10 blur-[120px] rounded-full" />

        <div className="absolute right-0 top-0 w-75 h-75 bg-purple-500/10 blur-[120px] rounded-full" />

      </div>

      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* ================= LOGO ================= */}
        <Link href="/" className="group flex items-center gap-3">
          {/* Icon / logomark */}
          <div
            className="
      w-10 h-10 rounded-2xl
      bg-linear-to-br from-emerald-500/70 via-brand/70 to-brand/90
      flex items-center justify-center
      text-foreground font-black text-lg
      shadow-[0_0_24px_rgba(16,185,129,0.45)]
      ring-1 ring-emerald-300/50
      transition-transform duration-300
      group-hover:scale-105 group-hover:shadow-[0_0_30px_rgba(16,185,129,0.6)]
    "
          >
            {appInitial}
          </div>

          {/* Wordmark */}
          <div className="flex flex-col">
            <span
              className="
        text-sm md:text-xl font-black tracking-tight
        bg-linear-to-r from-emerald-300 via-emerald-400 to-teal-500
        bg-clip-text text-transparent
      "
            >
              {appName}
            </span>
            <span className="hidden md:block text-[10px] uppercase tracking-[0.14em] text-muted-foreground/80">
              Growth Intelligence
            </span>
          </div>
        </Link>

        {/* ================= NAVIGATION ================= */}
        <NavigationMenu className="hidden md:flex">

          <NavigationMenuList className="flex items-center gap-2">

            {!user ? (
              <>

                <NavigationMenuItem>
                  <Link
                    href="/company/about"
                    className="
                  px-4 py-2 rounded-xl
                  text-sm text-muted-foreground
                  hover:text-foreground
                  hover:bg-accent
                  transition-all duration-300
                "
                  >
                    About
                  </Link>


                  <Link href="/company/careers"
                    className="
                  px-4 py-2 rounded-xl
                  text-sm text-muted-foreground
                  hover:text-foreground
                  hover:bg-accent
                  transition-all duration-300
                ">Careers</Link>


                  <Link href="/company/community"
                    className="
                  px-4 py-2 rounded-xl
                  text-sm text-muted-foreground
                  hover:text-foreground
                  hover:bg-accent
                  transition-all duration-300
                ">Community</Link>

                  <Link href="/company/blogs"
                    className="
                  px-4 py-2 rounded-xl
                  text-sm text-muted-foreground
                  hover:text-foreground
                  hover:bg-accent
                  transition-all duration-300
                ">Blogs</Link>

                  <Link href="/company/contacts"
                    className="
                  px-4 py-2 rounded-xl
                  text-sm text-muted-foreground
                  hover:text-foreground
                  hover:bg-accent
                  transition-all duration-300
                ">Contact</Link>
                </NavigationMenuItem>
              </>
            ) : (
              <>
                {[
                  {
                    name: "About",
                    href: "/company/about",
                  },
                  {
                    name: "Careers",
                    href: "/company/careers",
                  },
                  {
                    name: "Community",
                    href: "/company/community",
                  },
                  {
                    name: "Billings",
                    href: "/company/billing",
                  },
                  {
                    name: "Blogs",
                    href: "/company/blogs",
                  },
                  {
                    name: "Contact",
                    href: "/company/contacts",
                  },
                ].map((link, i) => (

                  <NavigationMenuItem key={i}>
                    <Link
                      href={link.href}
                      className="
                    relative px-4 py-2 rounded-xl
                    text-sm text-muted-foreground
                    hover:text-foreground
                    hover:bg-accent
                    transition-all duration-300
                  "
                    >
                      {link.name}
                    </Link>
                  </NavigationMenuItem>

                ))}
              </>
            )}

          </NavigationMenuList>

        </NavigationMenu>

        <div className="flex items-center gap-3">

          {!user ? (
            <>

              <Link href="/auth/login">
                <Button
                  variant="ghost"
                  className="
                rounded-xl
                text-foreground
                hover:bg-accent
                hover:text-foreground
              "
                >
                  Login
                </Button>
              </Link>

              <Link href="/auth/signup">
                <Button
                  className="
                rounded-xl
                bg-linear-to-r from-brand/90 to-emerald-400
                text-foreground font-semibold
                hover:scale-[1.02]
                transition-all duration-300
                shadow-[0_0_30px_rgba(34,197,94,0.25)]
              "
                >
                  Get Started
                </Button>
              </Link>

            </>
          ) : (
            <>
              <Link
                href="/dashboard/notifications"
                className="
              relative p-2.5 rounded-xl
              border border-border
              bg-card/40
              hover:bg-accent
              transition-all duration-300
            "
              >

                <Bell size={18} />

                {unread > 0 && (
                  <span
                    className="
                  absolute -top-1 -right-1
                  min-w-4.5 h-4.5
                  px-1 rounded-full
                  bg-green-500
                  text-black
                  text-[10px]
                  font-bold
                  flex items-center justify-center
                  shadow-[0_0_15px_rgba(34,197,94,0.4)]
                "
                  >
                    {unread}
                  </span>
                )}

              </Link>

              <div
                className="
              hidden lg:flex items-center gap-2
              px-4 py-2 rounded-xl
              border border-border
              bg-card/40
            "
              >

                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />

                <span className="text-sm text-muted-foreground">
                  {getGreeting()}
                </span>

              </div>

              <UserDropdown />

            </>
          )}

          {/* MOBILE MENU */}
          <button
            className="
          md:hidden p-2.5 rounded-xl
          border border-border
          bg-card/40
          hover:bg-accent
          transition-all
          mr-3
        "
            onClick={() => setOpen(!open)}
          >
            <Menu size={20} />
          </button>

        </div>

      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-30 bg-background md:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.div
              key="mobile-menu"
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed inset-y-0 right-0 z-40 w-4/5 max-w-xs md:hidden
                 bg-background border-l border-border backdrop-blur-xl
                 shadow-[0_0_40px_rgba(0,0,0,0.45)]"
            >
              <div className="h-16 flex items-center justify-between px-6 border-b border-border">
                <span className="text-sm font-semibold text-muted-foreground">
                  Menu
                </span>
                <button
                  className="p-2 rounded-lg border border-border bg-card/60 text-xs"
                  onClick={() => setOpen(false)}
                >
                  <X/>
                </button>
              </div>

              <div className="px-6 py-4 space-y-3 bg-background min-h-screen">
                {/* Links for unauthenticated users */}
                {!user ? (
                  <>
                    <Link
                      href="/company/about"
                      className="block text-sm text-muted-foreground hover:text-foreground"
                      onClick={() => setOpen(false)}
                    >
                      About
                    </Link>
                    <Link
                      href="/company/careers"
                      className="block text-sm text-muted-foreground hover:text-foreground"
                      onClick={() => setOpen(false)}
                    >
                      Careers
                    </Link>
                    <Link
                      href="/company/community"
                      className="block text-sm text-muted-foreground hover:text-foreground"
                      onClick={() => setOpen(false)}
                    >
                      Community
                    </Link>
                    <Link
                      href="/company/blogs"
                      className="block text-sm text-muted-foreground hover:text-foreground"
                      onClick={() => setOpen(false)}
                    >
                      Blogs
                    </Link>
                    <Link
                      href="/company/contacts"
                      className="block text-sm text-muted-foreground hover:text-foreground"
                      onClick={() => setOpen(false)}
                    >
                      Contact
                    </Link>

                    <div className="pt-2 flex gap-2">
                      <Link href="/auth/login" onClick={() => setOpen(false)}>
                        <Button variant="ghost" className="w-full rounded-xl">
                          Login
                        </Button>
                      </Link>
                      <Link href="/auth/signup" onClick={() => setOpen(false)}>
                        <Button className="w-full rounded-xl bg-linear-to-r from-brand/90 to-emerald-400">
                          Get Started
                        </Button>
                      </Link>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Links for authenticated users */}
                    {[
                      { name: "About", href: "/company/about" },
                      { name: "Careers", href: "/company/careers" },
                      { name: "Community", href: "/company/community" },
                      { name: "Billings", href: "/company/billing" },
                      { name: "Blogs", href: "/company/blogs" },
                      { name: "Contact", href: "/company/contacts" },
                    ].map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="block text-sm text-muted-foreground hover:text-foreground"
                        onClick={() => setOpen(false)}
                      >
                        {link.name}
                      </Link>
                    ))}
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </header>
  );
}