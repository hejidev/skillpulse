"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthContext } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
} from "@/components/ui/navigation-menu";
import { Bell, Menu } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import UserDropdown from "./UserDropdown";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";
import API from "@/lib/api";

export default function Navbar() {
  const { user, loading } = useAuthContext();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

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
      setUnreadCount((prev) => prev + 1);
    });

    // ✅ FETCH UNREAD (SAFE NOW)
    const fetchUnread = async () => {
      try {
        const res = await API.get("/settings/notifications");

        const unread = res.data.filter((n: any) => !n.read).length;
        setUnreadCount(unread);
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

  return (
    <header className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/70 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        <Link
          href="/"
          className="text-xl font-bold bg-linear-to-r from-purple-400 to-green-400 bg-clip-text text-transparent"
        >
          SkillPulse
        </Link>

        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList className="flex gap-6 text-sm">

            {!user ? (
              <>
                <NavigationMenuItem>
                  <Link href="#features" className="text-gray-400">
                    Features
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="#how" className="text-gray-400">
                    How it Works
                  </Link>
                </NavigationMenuItem>
              </>
            ) : (
              <>
                <NavigationMenuItem>
                  <Link href="/dashboard">Dashboard</Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/">About Us</Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/">Contact</Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/">Blogs</Link>
                </NavigationMenuItem>
              </>
            )}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-3">

          {!user ? (
            <>
              <Link href="/auth/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="bg-green-500 text-black">
                  Get Started
                </Button>
              </Link>
            </>
          ) : (
            <>
              {/* 🔔 NOTIFICATION */}
              <Link
                href="/notification"
                className="relative p-2 rounded-lg hover:bg-white/10"
              >
                <Bell size={18} />

                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-green-500 text-black text-[10px] px-1.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </Link>

              <span className="hidden md:block text-sm text-gray-300">
                {getGreeting()}
              </span>

              <UserDropdown />
            </>
          )}

          <button
            className="md:hidden p-2"
            onClick={() => setOpen(!open)}
          >
            <Menu />
          </button>
        </div>
      </div>
    </header>
  );
}