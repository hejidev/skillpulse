// app/settings/page.tsx
"use client";

import MFASetting from "@/components/settings/MFASetting";

export default function SettingsPage() {
  return (
    <main className="py-20 max-w-3xl mx-auto">
      <MFASetting />
      {/* You can render other settings sections here later */}
    </main>
  );
}