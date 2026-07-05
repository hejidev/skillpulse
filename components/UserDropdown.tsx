"use client";

import { useAuthContext } from "@/components/auth-provider";
import Link from "next/link";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";

export default function UserDropdown() {
  const { user, logout } = useAuthContext();
  const [open, setOpen] = useState(false);


  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const router = useRouter();

  const pathname = usePathname();

  if (!user) return null;
  console.log(user);

  // hide navbar on all dashboard routes
  if (pathname.startsWith("/dashboard")) return null;

  if (user?.role === "admin") return null;

  return (
    <>
      <div className="relative">
        <div onClick={() => setOpen(!open)}>
          <Avatar className="cursor-pointer text-foreground">
            <AvatarFallback className="text-foreground font-bold">
              {user?.name?.trim()?.charAt(0)?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        </div>

        {open && (
          <div className="absolute text-foreground right-0 mt-5 w-48 bg-background border border-border/30 rounded-xl shadow-lg p-2 space-y-2">

            <div className="px-2 py-1 text-sm text-muted-foreground">
              <h3>
                {user?.name ? `Welcome ${user.name.split(" ")[0]} 👋` : "Welcome 👋"}
              </h3>
            </div>

            <Link
              href="/dashboard"
              className="block px-2 py-1 hover:bg-card/10 rounded"
            >
              My Profile
            </Link>

            <Link
              href="/dashboard/settings"
              className="block px-2 py-1 hover:bg-card/10 rounded"
            >
              Settings
            </Link>

            <Link
              href="/company/help"
              className="block px-2 py-1 hover:bg-card/10 rounded"
            >
              Help
            </Link>

            <Link
              href="/legal/privacy-policy"
              className="block px-2 py-1 hover:bg-card/10 rounded"
            >
              Privacy Policy
            </Link>
            <Link
              href="/legal/terms"
              className="block px-2 py-1 hover:bg-card/10 rounded"
            >
              Terms of Service
            </Link>

            <button
              className="w-full text-left px-2 py-1 hover:bg-red-500/20 rounded text-red-400 mt-2"
              onClick={() => setShowLogoutConfirm(true)}
            >
              Logout
            </button>

          </div>
        )}
      </div>

      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background w-full h-screen">
          <div className="w-full max-w-sm rounded-2xl border border-border/30 bg-background/95 p-6 shadow-xl">
            <h3 className="text-base font-semibold">
              Sign out of {user?.email}?
            </h3>
            <p className="mt-2 text-xs text-muted-foreground">
              Your session will end on this device.
            </p>

            <div className="mt-5 flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowLogoutConfirm(false)}
                className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                className="bg-red-500 hover:bg-red-600 cursor-pointer"
                onClick={() => {
                  logout();
                  setShowLogoutConfirm(false);
                  router.push("/");
                }}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}