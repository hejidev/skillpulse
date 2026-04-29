export const generateInsights = (data: {
  totalHours: number;
  streak: number;
  xp: number;
}) => {
  const insights = [];

  if (data.streak < 3) {
    insights.push("Try to be consistent for 3+ days to build momentum.");
  }

  if (data.totalHours < 10) {
    insights.push("You’re just starting — small daily practice wins.");
  }

  if (data.streak >= 7) {
    insights.push("🔥 You’re on fire! Keep your streak alive!");
  }

  if (data.xp > 1000) {
    insights.push("You’re progressing faster than 70% of users.");
  }

  return insights;
};