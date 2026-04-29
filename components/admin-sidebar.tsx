"use client";

import Link from "next/link";
import { LayoutDashboard, Users, BookOpen, Settings } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminSidebar() {
  return (
    <motion.aside
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed left-0 top-0 h-full w-64 bg-white/10 backdrop-blur-xl border-r border-white/20 p-6"
    >
      <h1 className="text-2xl font-bold text-purple-400 mb-10">
        Admin Panel
      </h1>

      <nav className="space-y-6 text-gray-300">
        <Link className="flex items-center gap-2 hover:text-white" href="/admin">
          <LayoutDashboard size={18} /> Overview
        </Link>

        <Link className="flex items-center gap-2 hover:text-white" href="/admin/users">
          <Users size={18} /> Users
        </Link>

        <Link className="flex items-center gap-2 hover:text-white" href="/admin/skills">
          <BookOpen size={18} /> Skills
        </Link>

        <Link className="flex items-center gap-2 hover:text-white" href="/admin/settings">
          <Settings size={18} /> Settings
        </Link>
      </nav>
    </motion.aside>
  );
}