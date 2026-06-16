"use client";

import AchievementCard from "./AchievementCard";

export default function AchievementGrid({ achievements }: any) {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {achievements.map((a: any, i: number) => (
        <AchievementCard key={a._id || i} achievement={a} index={i} />
      ))}
    </div>
  );
}