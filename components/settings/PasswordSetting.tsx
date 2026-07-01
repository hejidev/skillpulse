"use client";

import { useState } from "react";
import API from "@/lib/api";
import { toast } from "sonner";

export default function PasswordSetting() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChangePassword = async () => {
        // ✅ validation
        if (!currentPassword || !newPassword || !confirmPassword) {
            return toast.error("All fields are required");
        }

        if (newPassword !== confirmPassword) {
            return toast.error("Passwords do not match");
        }

        if (newPassword.length < 6) {
            return toast.error("Password must be at least 6 characters");
        }

        try {
            setLoading(true);

            const res = await API.put("/settings/password", {
                currentPassword,
                newPassword,
            });

            toast.success(res.data.message);

            // 🔥 reset form
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");

            // clear token immediately
            localStorage.removeItem("token");

            // hard redirect instantly (no delay)
            window.location.href = "/auth/login";

        } catch (err: any) {
            toast.error(
                err?.response?.data?.message || "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 rounded-xl bg-background text-primary space-y-4">

            <h2 className="font-semibold">Change Password</h2>

            <input
                type="password"
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full p-2 rounded border-border/30 text-input border"
            />

            <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-2 rounded border-border/30 text-input border"
            />

            <input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-2 rounded border-border/30 text-input border"
            />

            <button
                onClick={handleChangePassword}
                disabled={loading}
                className="px-4 py-2 border border-brand/50 text-foreground font-semibold cursor-pointer rounded w-full disabled:opacity-50"
            >
                {loading ? "Updating..." : "Update Password"}
            </button>
        </div>
    );
}