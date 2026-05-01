"use client";

import { useAuthContext } from "@/components/auth-provider";
import Link from "next/link";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { usePathname, useRouter } from "next/navigation";

export default function UserDropdown() {
  const { user, logout } = useAuthContext();
  const [open, setOpen] = useState(false);

  const router = useRouter();

  const pathname = usePathname();

  if (!user) return null;
  console.log(user);

  // hide navbar on all dashboard routes
  if (pathname.startsWith("/dashboard")) return null;

  if (user?.role === "admin") return null;

  return (
    <div className="relative">
      <div onClick={() => setOpen(!open)}>
        <Avatar className="cursor-pointer">
          <AvatarFallback>
            {user?.name?.trim()?.charAt(0)?.toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
      </div>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-black border border-gray-800 rounded-xl shadow-lg p-2 space-y-2">

          <div className="px-2 py-1 text-sm text-gray-400">
            <h3>
              {user?.name ? `Welcome ${user.name.split(" ")[0]} 👋` : "Welcome 👋"}
            </h3>
          </div>

          <Link
            href="/userProfile"
            className="block px-2 py-1 hover:bg-white/10 rounded"
          >
            My Profile
          </Link>

          <Link
            href="/dashboard/settings"
            className="block px-2 py-1 hover:bg-white/10 rounded"
          >
            Settings
          </Link>

          <button
            className="w-full text-left px-2 py-1 hover:bg-red-500/20 rounded text-red-400"
            onClick={() => {
              logout();
              router.push("/");
              window.dispatchEvent(new Event("auth-change"));
            }}
          >
            Logout
          </button>

        </div>
      )}
    </div>
  );
}