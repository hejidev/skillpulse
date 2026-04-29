export const getAchievements = (activities: any[]) => {
  const totalHours = activities.reduce((a, b) => a + b.hours, 0);

  return [
    activities.length >= 1 && { id: "first", title: "First Step", icon: "🔥" },
    totalHours >= 10 && { id: "10h", title: "10 Hours Club", icon: "💪" },
    totalHours >= 50 && { id: "50h", title: "Rising Star", icon: "🚀" },
    activities.length >= 30 && { id: "30logs", title: "Dedicated", icon: "🏆" },
  ].filter(Boolean);
};