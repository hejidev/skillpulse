export const getAchievements = (data: {
  totalHours: number;
  streak: number;
  logsCount: number;
}) => {
  const achievements = [];

  if (data.logsCount >= 1) {
    achievements.push({
      id: "first-blood",
      title: "First Blood",
      icon: "🔥",
      desc: "You logged your first progress",
    });
  }

  if (data.totalHours >= 100) {
    achievements.push({
      id: "100-hours",
      title: "100 Hours Grinder",
      icon: "💪",
      desc: "You’ve put in 100+ hours",
    });
  }

  if (data.streak >= 7) {
    achievements.push({
      id: "week-streak",
      title: "Week Streak Master",
      icon: "🏆",
      desc: "7 days consistency",
    });
  }

  return achievements;
};