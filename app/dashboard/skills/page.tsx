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

import { useState } from "react";
import Link from "next/link";

import { motion } from "framer-motion";

import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import DeleteSkillDialog from "@/components/skills/DeleteSkillDialog";
import EditSkillDialog from "@/components/skills/EditSkillDialog";
import SkillSkeleton from "@/components/SkillSkeleton";
import AddSkill from "@/components/skills/add-skill";
import GlobalSearch from "@/components/search/GlobalSearch";

/* ---------------- PAGE ---------------- */
export default function SkillsPage() {
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [level, setLevel] = useState("Beginner");

  const { data: skills = [], isLoading } = useQuery({
    queryKey: ["skills"],
    queryFn: fetchSkills,
  });

  const createMutation = useMutation({
    mutationFn: createSkill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      setName("");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteSkill(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateSkill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
    },
  });

  /* ---------------- LOADING ---------------- */
  if (isLoading) return <SkillSkeleton />;

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-20 space-y-8">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Skills</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage and track your learning journey
          </p>
        </div>
        <div>
          <GlobalSearch />
        </div>

        <AddSkill />
      </div>

      {/* GRID */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

        {skills.map((skill: any) => (
          <motion.div
            key={skill._id}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
          >
            <Link href={`/skills/${skill._id}`}>
              <Card className="bg-transparent rounded-2xl border border-white/10 bg-linear-to-br from-white/5 to-transparent p-5 hover:shadow-lg transition hover:border-muted">

                <CardContent className="p-5 space-y-4">

                  {/* HEADER */}
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-lg text-white">
                      {skill.name}
                    </h3>

                    <Badge variant="secondary" className="hover:text-green-500">
                      {skill.level}
                    </Badge>
                  </div>

                  {/* PROGRESS */}
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Progress
                    </p>

                    <p className="text-sm font-semibold text-white mt-2">
                      {skill.progress}%
                    </p>
                  </div>

                  {/* ACTIONS */}
                  <div
                    className="flex gap-2 pt-2 opacity-0 group-hover:opacity-100 transition"
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

      {/* EMPTY STATE */}
      {skills.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          No skills yet. Add your first skill 🚀
        </div>
      )}

    </div>
  );
}