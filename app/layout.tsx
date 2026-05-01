import type { Metadata } from "next";
import "./globals.css";
import LayoutClient from "./LayoutClient";


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
    <html lang="en">
      <body>
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}