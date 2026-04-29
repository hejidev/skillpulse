export const normalizeActivity = (item: any) => ({
  _id: item._id,
  hours: Number(item.hours ?? item.value ?? 0),
  xp: Number(item.xp ?? (item.hours ?? 0) * 10),
  skillName: item.skillName ?? item.skillId?.name ?? "Unknown Skill",
  createdAt: item.createdAt,
});

// 🔥 detect productivity level
export const getIntensity = (hours: number) => {
  if (hours >= 20) return "beast";
  if (hours >= 10) return "high";
  if (hours >= 5) return "medium";
  return "low";
};

// 🎮 combo multiplier logic
export const getCombo = (activities: any[]) => {
  const sorted = [...activities].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  let combo = 1;

  for (let i = 1; i < sorted.length; i++) {
    const diff =
      (new Date(sorted[i].createdAt).getTime() -
        new Date(sorted[i - 1].createdAt).getTime()) /
      (1000 * 60 * 60 * 24);

    if (diff <= 1) combo++;
    else combo = 1;
  }

  return combo;
};

// 🧠 AI-style summary (mock now, real AI later)
export const getFeedInsight = (activities: any[]) => {
  const totalHours = activities.reduce((a, b) => a + b.hours, 0);

  if (totalHours >= 50)
    return "🔥 Legendary productivity week!";
  if (totalHours >= 20)
    return "⚡ Strong momentum building!";
  if (totalHours >= 10)
    return "📈 Good consistency, keep going!";
  return "🚀 Start building momentum!";
};