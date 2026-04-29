"use client";

import { useState } from "react";
import API from "@/lib/api";
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
import { useQueryClient } from "@tanstack/react-query";
import { useSound } from "@/hooks/useSound";

export default function AddSkill() {
  const queryClient = useQueryClient();
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

      await API.post("/skills", { name, level });

      toast.success("Skill added 🚀");

      // 🔥 PLAY SOUND AFTER SUCCESS
      playSound();

      setName("");
      setLevel("Beginner");
      setOpen(false);

      queryClient.invalidateQueries({ queryKey: ["skills"] });
    } catch (err) {
      console.log(err);
      toast.error("Failed to add skill");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="hover:text-green-500 cursor-pointer">
          Add Skill
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
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

          <Select value={level} onValueChange={setLevel} disabled={loading}>
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