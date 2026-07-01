"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  fetchSkills,
  createSkill,
  updateSkill,
  deleteSkill,
} from "@/lib/api/skills";

import { useEffect } from "react";
import { io } from "socket.io-client";
import Link from "next/link";
import { motion } from "framer-motion";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import DeleteSkillDialog from "@/components/skills/DeleteSkillDialog";
import EditSkillDialog from "@/components/skills/EditSkillDialog";
import SkillSkeleton from "@/components/SkillSkeleton";
import AddSkill from "@/components/skills/add-skill";

/* ---------------- PAGE ---------------- */
export default function SkillsPage() {
  const queryClient = useQueryClient();

  const { data: skills = [], isLoading } = useQuery({
    queryKey: ["skills"],
    queryFn: fetchSkills,
    staleTime: 0,
  });

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!);

    socket.on("new-progress", () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
    });

    socket.on("skill-created", (newSkill) => {
      queryClient.setQueryData(["skills"], (old: any = []) => [
        newSkill,
        ...old,
      ]);
    });

    return () => {
      socket.disconnect();
    };
  }, [queryClient]);

  // ✅ CREATE
  const createMutation = useMutation({
    mutationFn: createSkill,
    onSuccess: (newSkill) => {
      queryClient.setQueryData(["skills"], (old: any = []) => [
        newSkill,
        ...old,
      ]);
    }
  });

  // ✅ DELETE
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteSkill(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
    },
  });

  // ✅ UPDATE
  const updateMutation = useMutation({
    mutationFn: updateSkill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
    },
  });

  if (isLoading) return <SkillSkeleton />;

  return (
    <div className="w-full max-w-8xl mx-auto px-6 py-10 space-y-8">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Skills</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage and track your learning journey
          </p>
        </div>

        {/* ✅ PASS MUTATION */}
        <AddSkill onCreate={(data: any) => createMutation.mutateAsync(data)} />
      </div>

      {/* GRID */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {skills.map((skill: any) => (
          <motion.div
            key={skill._id}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
          >
            <Link href={`/dashboard/skills/${skill._id}`}>
              <Card className="rounded-2xl border border-white/10 p-5 hover:shadow-lg transition bg-transparent">

                <CardContent className="p-5 space-y-4">

                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-lg text-foreground">
                      {skill.name}
                    </h3>

                    <Badge variant="secondary">
                      {skill.level}
                    </Badge>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">
                      Progress
                    </p>

                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-muted-foreground">
                        {skill.progress}%
                      </p>

                      <div className="w-full h-2 bg-foreground rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 transition-all duration-500"
                          style={{ width: `${skill.progress}%` }}
                        />
                      </div>

                      {/* {skill.progress === 0 && (
                        <p className="text-green-400 text-xs">
                          🎉 Level upgraded!
                        </p>
                      )} */}

                      <p className="text-xs text-muted-foreground">
                        {skill.progress < 20 && "🚀 Getting started"}
                        {skill.progress >= 20 && skill.progress < 60 && "⚡ Building momentum"}
                        {skill.progress >= 60 && skill.progress < 90 && "🔥 Strong progress"}
                        {skill.progress >= 90 && "🏆 Almost mastered"}
                      </p>
                    </div>
                  </div>

                  <div
                    className="flex gap-2 pt-2"
                    onClick={(e) => e.preventDefault()}
                  >
                    <EditSkillDialog
                      skill={skill}
                      onSave={(data) =>
                        updateMutation.mutate({
                          id: skill._id,
                          data,
                        })
                      }
                    />

                    <DeleteSkillDialog
                      onConfirm={() =>
                        deleteMutation.mutate(skill._id)
                      }
                    />
                  </div>

                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      {skills.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          No skills yet. Add your first skill 🚀
        </div>
      )}
    </div>
  );
}