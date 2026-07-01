"use client";

import { useState, useEffect } from "react";
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
    }, 400);

    return () => clearTimeout(timer);
  }, [note, skills]);

  const finalSkillId = suggestedSkill?._id || skillId;

  const handleSubmit = async () => {
    if (!finalSkillId) {
      toast.error("No skill detected.");
      return;
    }

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

      queryClient.invalidateQueries({ queryKey: ["all-progress"] });
      queryClient.invalidateQueries({ queryKey: ["skills"] });

    } catch (err) {
      console.error(err);
      toast.error("Failed to add progress");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-card text-foreground">Add Progress</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Log Progress</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">

          <Input
            type="number"
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
          />

          <Textarea
            placeholder="What did you learn?"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />

          {thinking && (
            <div className="text-xs text-gray-400">
              🤖 thinking...
            </div>
          )}

          {suggestedSkill && (
            <div className="p-2 text-xs bg-green-500/10 border rounded">
              💡 Suggested: <b>{suggestedSkill.name}</b>
            </div>
          )}

          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : "Add Progress"}
          </Button>

        </div>
      </DialogContent>
    </Dialog>
  );
}