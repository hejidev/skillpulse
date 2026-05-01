"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar";
import { AuthProvider } from "@/components/auth-provider";
import Providers from "./providers";
import { UserProvider } from "@/context/UserContext";
import { Toaster } from "sonner";

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const hideNavbar = pathname.startsWith("/dashboard");

  return (
    <AuthProvider>
      {!hideNavbar && <Navbar />}

      <UserProvider>
        <Providers>{children}</Providers>
      </UserProvider>

      <Toaster position="top-right" />
    </AuthProvider>
  );
}