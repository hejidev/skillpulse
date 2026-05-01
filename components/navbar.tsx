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
import { useState, useEffect } from "react";
import UserDropdown from "./UserDropdown";
import { io } from "socket.io-client";
import { toast } from "sonner";

export default function Navbar() {
  const { user, loading } = useAuthContext();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  if (loading) return null;
  if (user?.role === "admin") return null;

  const isActive = (path: string) => pathname === path;

  const getGreeting = () => {
    if (!user?.name) return "Welcome 👋";
    return `Hi ${user.name.split(" ")[0]} 👋`;
  };

 

const socket = io("https://skillpulse.onrender.com");

useEffect(() => {
  const userId = localStorage.getItem("userId");

  socket.emit("register", userId);

  socket.on("notification", (data) => {
    toast.success(data.message);
  });

  return () => {
    socket.disconnect();
  };
}, []);

  return (
    <header className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/70 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* 🔷 Logo */}
        <Link
          href="/"
          className="text-xl font-bold bg-linear-to-r from-purple-400 to-green-400 bg-clip-text text-transparent"
        >
          SkillPulse
        </Link>

        {/* 🔷 Desktop Nav */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList className="flex gap-6 text-sm">

            {!user ? (
              <>
                <NavigationMenuItem>
                  <Link
                    href="#features"
                    className={`transition ${isActive("#features") ? "text-white" : "text-gray-400"
                      }`}
                  >
                    Features
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link
                    href="#how"
                    className={`transition ${isActive("#how") ? "text-white" : "text-gray-400"
                      }`}
                  >
                    How it Works
                  </Link>
                </NavigationMenuItem>
              </>
            ) : (
              <>
                <NavigationMenuItem>
                  <Link
                    href="/dashboard"
                    className={`transition ${isActive("/dashboard") ? "text-white" : "text-gray-400"
                      }`}
                  >
                    Dashboard
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link
                    href="/"
                    className={`transition ${isActive("/skills") ? "text-white" : "text-gray-400"
                      }`}
                  >
                    About Us
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link
                    href="/"
                    className={`transition ${isActive("/progress") ? "text-white" : "text-gray-400"
                      }`}
                  >
                    Contact
                  </Link>

                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link
                    href="/"
                    className={`transition ${isActive("/leaderboard") ? "text-white" : "text-gray-400"
                      }`}
                  >
                    Blogs
                  </Link>

                </NavigationMenuItem>
              </>
            )}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-3">

          {!user ? (
            <>
              <Link href="/auth/login">
                <Button variant="ghost" className="text-gray-300">
                  Login
                </Button>
              </Link>

              <Link href="/auth/signup">
                <Button className="bg-green-500 text-black hover:bg-green-600">
                  Get Started
                </Button>
              </Link>

              {/* <button
                onClick={() => document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true }))}
                className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 text-sm text-gray-400 hover:text-white"
              >
                ⌘K
              </button> */}
            </>
          ) : (
            <>
              {/* 🔔 Notifications */}
              <Link href="/notification" className="relative p-2 rounded-lg hover:bg-white/10">
                <Bell size={18} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full" />
              </Link>

              {/* 🧠 Greeting */}
              <span className="hidden md:block text-sm text-gray-300">
                {getGreeting()}
              </span>

              <UserDropdown />
            </>
          )}

          {/* 📱 Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setOpen(!open)}
          >
            <Menu />
          </button>
        </div>
      </div>

      {/* 📱 Mobile Menu */}
      {open && (
        <div className="md:hidden px-6 pb-4 bg-black border-t border-white/10">
          <div className="flex flex-col gap-4 text-gray-300">

            {!user ? (
              <>
                <Link href="#features">Features</Link>
                <Link href="#how">How it Works</Link>
                <Link href="/auth/login">Login</Link>
                <Link href="/signup">Get Started</Link>
              </>
            ) : (
              <>
                <Link href="/dashboard">Dashboard</Link>
                <Link href="/">About Us</Link>
                <Link href="/">Contact</Link>
                <Link href="/">Blogs</Link>
                <Link href="/*">*</Link>

                <button
                  onClick={() => {
                    localStorage.clear();
                    window.location.href = "/login";
                  }}
                  className="text-red-500 text-left"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}