"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import { matchSkill } from "@/lib/utils/skillMatcher";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { fetchSkills } from "@/lib/api/skills";

export default function AddProgress({ skillId }: { skillId?: string }) {
  const queryClient = useQueryClient();
  const [suggestedSkill, setSuggestedSkill] = useState<any>(null);

  const [open, setOpen] = useState(false);
  const [hours, setHours] = useState(1);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [thinking, setThinking] = useState(false);

  const { data: skills = [] } = useQuery({
    queryKey: ["skills"],
    queryFn: fetchSkills,
  });

  useEffect(() => {
    if (!note) return;

    setThinking(true);

    const timer = setTimeout(() => {
      const match = matchSkill(note, skills);
      setSuggestedSkill(match);
      setThinking(false);
    }, 400); // debounce

    return () => clearTimeout(timer);
  }, [note, skills]);

  const finalSkillId = suggestedSkill?._id || skillId;

  if (!finalSkillId) {
    toast.error("No skill detected. Please select one.");
    return;
  }


  const handleSubmit = async () => {
    try {
      setLoading(true);

      await API.post("/progress", {
        skillId: finalSkillId,
        hours: Number(hours),
        note: note || "",
      });

      toast.success("Progress added 🚀");

      setHours(1);
      setNote("");
      setOpen(false);

      // 🔥 refresh BOTH progress + skills
      queryClient.invalidateQueries({ queryKey: ["progress", skillId] });
      queryClient.invalidateQueries({ queryKey: ["skills"] });

    } catch (err) {
      console.log(err);
      toast.error("Failed to add progress");
    } finally {
      setLoading(false);
    }
  };

  {
    thinking && (
      <div className="text-xs text-gray-400">
        🤖 thinking...
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Add Progress</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Log Progress</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">

          <Input
            type="number"
            placeholder="Hours spent"
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
          />

          <Textarea
            placeholder="What did you learn?"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />

          {suggestedSkill && (
            <div className="p-2 text-xs bg-green-500/10 border border-green-500/30 rounded">
              💡 Suggested: <b>{suggestedSkill.name}</b>
            </div>
          )}

          {thinking && (
            <div className="text-xs text-gray-400">
              🤖 thinking...
            </div>
          )}

          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full"
          >
            {loading ? "Saving..." : "Add Progress"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}