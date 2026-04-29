"use client";

import AdminSidebar from "@/components/admin-sidebar";
import { Card, CardContent } from "@/components/ui/card";

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen bg-black text-white">

      <AdminSidebar />

      <main className="ml-64 w-full p-10 space-y-6">

        <h1 className="text-3xl font-bold">Admin Overview</h1>

        <div className="grid md:grid-cols-3 gap-6">

          <Card className="bg-white/10 backdrop-blur-xl border-white/20">
            <CardContent className="p-6">
              <p>Total Users</p>
              <h2 className="text-3xl font-bold text-purple-400">120</h2>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-xl border-white/20">
            <CardContent className="p-6">
              <p>Total Skills</p>
              <h2 className="text-3xl font-bold text-purple-400">340</h2>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-xl border-white/20">
            <CardContent className="p-6">
              <p>Active Users</p>
              <h2 className="text-3xl font-bold text-purple-400">89</h2>
            </CardContent>
          </Card>

        </div>

      </main>

    </div>
  );
}