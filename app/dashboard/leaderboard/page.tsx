"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchLeaderboard } from "@/lib/api/leaderboard";
import { motion } from "framer-motion";
import { io } from "socket.io-client";
import { useEffect } from "react";
import { getLevel } from "@/lib/utils/xp";
import RankBadge from "@/components/RankBadge";
import { getRank } from "@/lib/gamification/rank";

export default function Leaderboard() {
  const queryClient = useQueryClient();

  const { data = [] } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: fetchLeaderboard,
  });

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!);

    const handleLeaderboardUpdate = () => {
      queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
    };

    socket.on("leaderboard-update", handleLeaderboardUpdate);

    return () => {
      socket.off("leaderboard-update", handleLeaderboardUpdate);
      socket.disconnect();
    };
  }, [queryClient]);


  return (
    <div className="space-y-6 py-4 px-2 sm:px-6">

      <div className="rounded-2xl border border-border bg-card/70 backdrop-blur-xl p-2 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            🏆 Leaderboard
          </h2>
          <p className="text-[11px] text-muted-foreground">
            Updated in real time
          </p>
        </div>

        <div className="space-y-3">

          {data?.length === 0 ? (
            <p className="text-muted-foreground">No users found</p>
          ) : (
            data.map((user: any, index: number) => {

              const level = getLevel(user.totalXP);
              const rank = getRank(user.totalXP);

              const isTop3 = index < 3;

              const medal =
                index === 0 ? "🥇" :
                  index === 1 ? "🥈" :
                    index === 2 ? "🥉" :
                    null;

              return (
                <motion.div
                  key={`${user.userId}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`
    flex sm:items-center justify-between
    gap-4 sm:gap-0
    p-2 sm:p-5
    rounded-2xl border
    transition
    ${isTop3
                      ? "bg-linear-to-r from-indigo-500/10 via-purple-500/10 to-cyan-500/10 border-indigo-400/40"
                      : "bg-white/5 hover:bg-white/10 border-border"
                    }
  `}
                >

                  {/* LEFT SECTION */}
                  <div className="flex items-center gap-3 sm:gap-4">

                    <div className="flex items-center gap-1 text-lg sm:text-xl font-medium w-10">
                      {medal ? (
                        <span aria-label={`Rank ${index + 1}`} title={`Rank ${index + 1}`}>
                          {medal}
                        </span>
                      ) : (
                        <span className="text-sm">{index + 1}TH</span>
                      )}
                    </div>

                    <div
                      className={`
    w-9 h-9 sm:w-10 sm:h-10 rounded-full
    flex items-center justify-center
    text-foreground font-bold
    ${isTop3
                          ? "bg-linear-to-r from-yellow-300 via-accent to-brand-secondary"
                          : "bg-linear-to-r from-brand/30 to-input"
                        }
  `}
                    >
                      {user.name?.charAt(0) ?? "?"}
                    </div>

                    <div>
                      <p className="font-semibold text-sm sm:text-base">
                        {user.name}
                      </p>

                      {/* MOBILE XP (under name) */}
                      {/* <p className="sm:hidden text-xs text-gray-400">
                        {user.totalXP} XP • Lv {level}
                      </p> */}
                    </div>

                  </div>

                  {/* RIGHT SECTION (DESKTOP ONLY) */}
                  <div className="hidden sm:block text-right space-y-1">
                    <span className="flex gap-1 items-center">
                      <p className="p-2 w-2 h-2 flex items-center justify-center text-[8px] font-bold bg-brand text-foreground rounded-4xl border border-border/60">XP</p>
                    <p className="font-bold">
                       {user.totalXP}
                    </p>
                    </span>

                    <p className="text-sm font-semibold text-brand/50">
                      Lv {level}
                    </p>
                  </div>

                  {/* Mobile XP at rank position */}
                  <div className="flex sm:hidden items-center text-xs font-semibold text-muted-foreground min-w-[60px]">
                   <span className="flex gap-1 items-center">
                      <p className="p-2 w-2 h-2 flex items-center justify-center text-[8px] font-bold bg-brand text-foreground rounded-4xl border border-border/60">XP</p>
                    <p className="font-bold">
                       {user.totalXP}
                    </p>
                    </span>
                  </div>

                  {/* BADGE */}
                  <div className="hidden sm:flex sm:ml-4">
                    <RankBadge rank={rank} />
                  </div>

                </motion.div>
              );
            })
          )}

        </div>
      </div>
    </div>
  );
}