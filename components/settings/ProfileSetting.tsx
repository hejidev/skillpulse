"use client";

import { useState, useEffect } from "react";
import API from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function ProfileSetting() {
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const queryClient = useQueryClient();

  // ✅ Load current user
  useEffect(() => {
    const load = async () => {
      const res = await API.get("/settings/me");
      setName(res.data.name);
      setPreview(res.data.avatar);
    };
    load();
  }, []);

  // ✅ Preview before upload
  const handleFile = (file: File) => {
    setAvatar(file);
    setPreview(URL.createObjectURL(file));
  };

  // ✅ Submit update
  const handleSave = async () => {
    const formData = new FormData();
    formData.append("name", name);

    if (avatar) {
      formData.append("avatar", avatar);
    }

    const res = await API.put("/settings/profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // 🔥 REAL-TIME SYNC across app
    queryClient.setQueryData(["user"], res.data);

    toast.success("Profile updated!");
  };

  return (
    <div className="p-6 border border-border rounded-xl bg-background space-y-4">

      <h2 className="font-semibold">Profile</h2>

      {/* Avatar */}
      <div className="flex items-center gap-4">
        <img
          src={preview || "/default-avatar.png"}
          className="w-16 h-16 rounded-full object-cover"
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            e.target.files && handleFile(e.target.files[0])
          }
          className="border-foreground text-input border p-2"
        />
      </div>

      {/* Name */}
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 rounded border-foreground text-input border"
        placeholder="Your name"
      />

      <button
        onClick={handleSave}
        className="px-4 py-2 border border-brand rounded font-semibold"
      >
        Save Changes
      </button>
    </div>
  );
}