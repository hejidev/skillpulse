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
    <div className="space-y-6 py-25 px-40">

      <h2 className="text-2xl font-bold">🏆 Leaderboard</h2>

      <div className="space-y-4">

        {data?.length === 0 ? (
          <p className="text-gray-400">No users found</p>
        ) : (
          data.map((user: any, index: number) => {

            // ✅ FIX: level must be inside map
            const level = getLevel(user.totalXP);
            const rank = getRank(user.totalXP);

            return (
              <motion.div
                key={`${user.userId}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-5 rounded-2xl border bg-white/5 hover:bg-white/10 transition"
              >
                {/* LEFT */}
                <div className="flex items-center gap-4">

                  <div className="text-xl font-bold w-8">
                    #{index + 1}
                  </div>

                  <div className="w-10 h-10 rounded-full bg-linear-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-black font-bold">
                    {user.name?.charAt(0)}
                  </div>

                  <p className="font-semibold">
                    {user.name}
                  </p>
                </div>

                {/* RIGHT */}
                <div className="text-right space-y-1">

                  <p className="font-bold">
                    {user.totalXP} XP
                  </p>

                  {/* LEVEL */}
                  <p className="text-sm font-semibold text-indigo-400">
                    Lv {level}
                  </p>

                </div>

                <RankBadge rank={rank} />
              </motion.div>
            );
          })
        )}

      </div>
    </div>
  );
}