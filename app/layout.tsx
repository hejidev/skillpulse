import type { Metadata } from "next";
import "./globals.css";
import LayoutClient from "./LayoutClient";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "SkillPulse",
  description: "Track your growth",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <LayoutClient>{children}</LayoutClient>
        </Providers>
      </body>
    </html>
  );
}