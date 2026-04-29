"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

export default function EditSkillDialog({
  skill,
  onSave,
}: {
  skill: any;
  onSave: (data: any) => void;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(skill.name);
  const [level, setLevel] = useState(skill.level);

  // ✅ Reset values when opening
  useEffect(() => {
    if (open) {
      setName(skill.name);
      setLevel(skill.level);
    }
  }, [open, skill]);

  const handleSave = () => {
    console.log("CLICKED ✅"); // 👈 debug

    onSave({ name, level });

    setOpen(false); // ✅ close dialog
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="secondary">
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Skill</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <input
            className="w-full p-2 border rounded bg-black/40"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <select
            className="w-full p-2 border rounded bg-black/40"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
          >
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>

          <Button
            className="w-full"
            onClick={handleSave}
          >
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}