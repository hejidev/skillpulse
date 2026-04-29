"use client";

import { useUser } from "@/context/UserContext";
import Link from "next/link";
import { useState } from "react";

export default function UserDropdown() {
  const { user } = useUser();
  const [open, setOpen] = useState(false);

  if (!user) return null;

  return (
    <div className="relative">
      <img
        src={user.avatar || "/default-avatar.png"}
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full cursor-pointer border"
      />

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-black border rounded-xl shadow-lg p-2 space-y-2">

          <div className="px-2 py-1 text-sm text-gray-400">
            {user.name}
          </div>

          <Link href="/settings" className="block px-2 py-1 hover:bg-white/10 rounded">
            Settings
          </Link>

          <button
            className="w-full text-left px-2 py-1 hover:bg-red-500/20 rounded text-red-400"
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
          >
            Logout
          </button>

        </div>
      )}
    </div>
  );
}