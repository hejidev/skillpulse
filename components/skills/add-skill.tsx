"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useSound } from "@/hooks/useSound";

export default function AddSkill({ onCreate }: any) {
  const playSound = useSound("/sounds/level-up.mp3");

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [level, setLevel] = useState("Beginner");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("Skill name is required");
      return;
    }

    try {
      setLoading(true);

      // ✅ USE MUTATION FROM PARENT
      await onCreate({ name, level });

      toast.success("Skill added 🚀");
      playSound();

      setName("");
      setLevel("Beginner");
      setOpen(false);
    } catch (err: any) {
  const status = err.response?.status;
  const msg = err.response?.data?.message;

  if (status === 403) {
    toast.error(
      msg ||
        "You’ve reached the skill limit for your current plan. Upgrade to add more."
    );
    // don’t log this as an error; it’s expected business logic
    return;
  }

  console.error("Add skill error:", err);
  toast.error(msg || "Unable to create skill right now.");
} finally {
  setLoading(false);
}
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Skill</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Skill</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <Input
            placeholder="e.g. React, UI Design..."
            value={name}
            disabled={loading}
            onChange={(e) => setName(e.target.value)}
          />

          <Select value={level} onValueChange={setLevel}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="Beginner">Beginner</SelectItem>
              <SelectItem value="Intermediate">Intermediate</SelectItem>
              <SelectItem value="Advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>

          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full"
          >
            {loading ? "Creating..." : "Save Skill"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}