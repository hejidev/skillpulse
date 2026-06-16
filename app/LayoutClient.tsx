"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar";
import { AuthProvider, useAuthContext } from "@/components/auth-provider";
import { UserProvider } from "@/context/UserContext";
import { Toaster } from "sonner";
import { useGlobalNotifications } from "@/hooks/useGlobalNotifications";
import API from "@/lib/api";

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {

  const { user } = useAuthContext();
  const [maintenance, setMaintenance] = useState(false);
  const [checked, setChecked] = useState(false);

  const pathname = usePathname();

  const hideNavbar = pathname.startsWith("/dashboard");
  const hideAdminNavbar = pathname.startsWith("/admin");

  useGlobalNotifications();

  // Theme initialization (replaces the <script> in RootLayout)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const theme = localStorage.getItem("theme");

    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (theme === "light") {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await API.get("/public-settings");
        setMaintenance(res.data.maintenanceMode ?? false);
      } catch (err) {
        console.error("Failed to load public settings", err);
      } finally {
        setChecked(true);
      }
    };
    load();
  }, []);

  if (!checked) return null; // or a loader

  if (maintenance && user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">We’ll be back soon</h1>
          <p className="text-muted-foreground">
            The app is currently under maintenance. Please check back later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <AuthProvider>
      {!hideNavbar && !hideAdminNavbar && <Navbar />}

      <UserProvider>{children}</UserProvider>

      <Toaster position="top-right" />
    </AuthProvider>
  );
}