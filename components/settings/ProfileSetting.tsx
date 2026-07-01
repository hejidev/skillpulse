"use client";

import { useState, useEffect, useRef } from "react";
import API from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function ProfileSetting() {
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  const [saving, setSaving] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
    try {
      setSaving(true);

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

      queryClient.setQueryData(["user"], res.data);
      toast.success("Profile updated!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 rounded-xl bg-background space-y-4">

      <h2 className="font-semibold">Profile</h2>

      {/* Avatar */}
      <div className="flex items-center gap-4">
        <img
          src={preview || "/default-avatar.png"}
          className="w-16 h-16 rounded-full object-cover"
          alt="Avatar preview"
        />

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) =>
            e.target.files && handleFile(e.target.files[0])
          }
          className="hidden"
        />

        {/* Visible button to pick image */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="px-3 py-2 cursor-pointer rounded border border-input/30 text-sm text-input hover:bg-accent transition"
        >
          Pick image
        </button>
      </div>

      {/* Name */}
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 rounded border-input/30 text-input border"
        placeholder="Your name"
      />

      <button
        onClick={handleSave}
        disabled={saving}
        className={`
    px-4 py-2 border border-brand/50 rounded font-semibold cursor-pointer
    ${saving ? "opacity-70 cursor-not-allowed" : ""}
  `}
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}