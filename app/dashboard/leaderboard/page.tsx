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
    <div className="space-y-6 py-4 px-3 sm:px-6">

  <h2 className="text-xl sm:text-2xl font-bold">
    🏆 Leaderboard
  </h2>

  <div className="space-y-3">

    {data?.length === 0 ? (
      <p className="text-gray-400">No users found</p>
    ) : (
      data.map((user: any, index: number) => {

        const level = getLevel(user.totalXP);
        const rank = getRank(user.totalXP);

        return (
          <motion.div
            key={`${user.userId}-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="
              flex flex-col sm:flex-row sm:items-center sm:justify-between
              gap-4 sm:gap-0
              p-4 sm:p-5
              rounded-2xl border
              bg-white/5 hover:bg-white/10
              transition
            "
          >

            {/* LEFT SECTION */}
            <div className="flex items-center gap-3 sm:gap-4">

              <div className="text-lg sm:text-xl font-bold w-6 sm:w-8">
                #{index + 1}
              </div>

              <div className="
                w-9 h-9 sm:w-10 sm:h-10
                rounded-full
                bg-linear-to-r from-indigo-500 to-purple-600
                flex items-center justify-center
                text-black font-bold
              ">
                {user.name?.charAt(0)}
              </div>

              <div>
                <p className="font-semibold text-sm sm:text-base">
                  {user.name}
                </p>

                {/* MOBILE XP (under name) */}
                <p className="sm:hidden text-xs text-gray-400">
                  {user.totalXP} XP • Lv {level}
                </p>
              </div>

            </div>

            {/* RIGHT SECTION (DESKTOP ONLY) */}
            <div className="hidden sm:block text-right space-y-1">
              <p className="font-bold">
                {user.totalXP} XP
              </p>

              <p className="text-sm font-semibold text-indigo-400">
                Lv {level}
              </p>
            </div>

            {/* BADGE */}
            <div className="sm:ml-4">
              <RankBadge rank={rank} />
            </div>

          </motion.div>
        );
      })
    )}

  </div>
</div>
  );
}