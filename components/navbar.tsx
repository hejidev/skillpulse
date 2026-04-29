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
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bell, Menu } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { user, loading } = useAuthContext();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  if (loading) return null;
  if (user?.role === "admin") return null;

  const isActive = (path: string) => pathname === path;

  const getGreeting = () => {
    if (!user?.name) return "Hi there 👋";
    return `Hi ${user.name.split(" ")[0]} 👋`;
  };

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
                    href="/skills"
                    className={`transition ${isActive("/skills") ? "text-white" : "text-gray-400"
                      }`}
                  >
                    Skills
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link
                    href="/progress"
                    className={`transition ${isActive("/progress") ? "text-white" : "text-gray-400"
                      }`}
                  >
                    Progress
                  </Link>

                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link
                    href="/leaderboard"
                    className={`transition ${isActive("/leaderboard") ? "text-white" : "text-gray-400"
                      }`}
                  >
                    Leaderboard
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
              <button className="relative p-2 rounded-lg hover:bg-white/10">
                <Bell size={18} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full" />
              </button>

              {/* 🧠 Greeting */}
              <span className="hidden md:block text-sm text-gray-300">
                {getGreeting()}
              </span>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button>
                    <Avatar className="cursor-pointer">
                      <AvatarFallback>
                        {user.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="bg-gray-900 border border-gray-800 text-white">
                  <DropdownMenuItem asChild>
                    <Link href="/userProfile">My Profile</Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings">Settings</Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => {
                      localStorage.clear();
                      window.location.href = "/auth/login";
                    }}
                    className="text-red-500"
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
                <Link href="/skills">Skills</Link>
                <Link href="/progress">Progress</Link>
                <Link href="/leaderboard">Leaderboard</Link>
                <Link href="/userProfile">Profile</Link>

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