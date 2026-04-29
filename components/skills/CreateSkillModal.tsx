"use client";

import { useState } from "react";
import { createSkill } from "@/lib/api/skills";
import { Button } from "@/components/ui/button";

export default function CreateSkillModal({ onSuccess }: any) {
  const [name, setName] = useState("");
  const [level, setLevel] = useState("Beginner");

  const handleSubmit = async () => {
    await createSkill({ name, level });
    setName("");
    onSuccess();
  };

  return (
    <div className="p-6 bg-white/5 rounded-xl border border-white/10">
      <h2 className="text-lg font-semibold mb-4">Create Skill</h2>

      <input
        className="w-full p-2 mb-3 bg-black/40 border border-white/10 rounded"
        placeholder="Skill name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <select
        className="w-full p-2 mb-4 bg-black/40 border border-white/10 rounded"
        value={level}
        onChange={(e) => setLevel(e.target.value)}
      >
        <option>Beginner</option>
        <option>Intermediate</option>
        <option>Advanced</option>
      </select>

      <Button className="w-full" onClick={handleSubmit}>
        Add Skill
      </Button>
    </div>
  );
}