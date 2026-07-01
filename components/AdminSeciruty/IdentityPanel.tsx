"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Shield, Mail, User, KeyRound } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "@/lib/api";
import { toast } from "sonner";

export default function IdentityPanel() {
  const qc = useQueryClient();

  const { data: me, isLoading } = useQuery({
    queryKey: ["admin-me"],
    queryFn: () => API.get("/settings/me").then((r) => r.data),
  });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (me) {
      setName(me.name || "");
      setEmail(me.email || "");
    }
  }, [me]);

  const profileMutation = useMutation({
    mutationFn: (payload: { name: string; email: string }) =>
      API.put("/settings/profile", payload).then((r) => r.data),
    onSuccess: () => {
      toast.success("Profile updated");
      qc.invalidateQueries({ queryKey: ["admin-me"] });
    },
    onError: () => {
      toast.error("Failed to update profile");
    },
  });

  const passwordMutation = useMutation({
    mutationFn: (payload: {
      currentPassword: string;
      newPassword: string;
    }) => API.put("/settings/password", payload).then((r) => r.data),
    onSuccess: () => {
      toast.success("Password updated");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message || "Failed to change password";
      toast.error(msg);
    },
  });

  const handleProfileSave = () => {
    profileMutation.mutate({ name, email });
  };

  const handlePasswordSave = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Fill all password fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (newPassword.length < 12) {
      toast.error("Use at least 12 characters for admin password");
      return;
    }
    passwordMutation.mutate({ currentPassword, newPassword });
  };

  return (
    <Card className="p-6 bg-card/40 backdrop-blur-xl border space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <User size={18} />
            Identity Control Center
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage your admin account identity & credentials
          </p>
        </div>
        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
          <Shield className="mr-1 h-3 w-3" />
          Privileged Admin
        </Badge>
      </div>

      {/* Name & email block */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm">Full Name</label>
          <Input
            placeholder="Enter full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading || profileMutation.isPending}
          />
        </div>

        <div className="space-y-0">
          <label className="text-sm flex items-center gap-2">
            <Mail size={14} /> Email Address
          </label>
          <Input
            type="email"
            placeholder="admin@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading || profileMutation.isPending}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          size="sm"
          onClick={handleProfileSave}
          disabled={profileMutation.isPending}
          className="cursor-pointer"
        >
          {profileMutation.isPending ? "Saving…" : "Update Profile"}
        </Button>
      </div>

      {/* Divider */}
      <div className="h-px bg-border/60" />

      {/* Password block */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <KeyRound size={18} />
          <h3 className="text-sm font-semibold">Password & access key</h3>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <label className="text-sm">Current password</label>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm">New password</label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Use at least 12 characters"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm">Confirm new password</label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat new password"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>
            Use a unique, strong password. Avoid reusing passwords from other
            systems.[web:995][web:999]
          </p>
          <Button
            size="sm"
            variant="outline"
            onClick={handlePasswordSave}
            disabled={passwordMutation.isPending}
          >
            {passwordMutation.isPending ? "Updating…" : "Change password"}
          </Button>
        </div>
      </div>
    </Card>
  );
}