export function generateCoachMessage({
  streak,
  lastActiveDaysAgo,
  weeklyHours,
  goalPercent,
  bestDay,
  worstDay,
  consistencyScore,
}: any) {

  if (lastActiveDaysAgo > 2) {
    return `⚠️ You’ve been inactive. Your best day is ${bestDay} — use it to restart.`;
  }

  if (streak >= 5) {
    return `🔥 ${streak}-day streak! Lock in your ${bestDay} routine.`;
  }

  if (consistencyScore < 40) {
    return `📉 You’re inconsistent. Fix your weakest day (${worstDay}).`;
  }

  if (goalPercent >= 70) {
    return `🎯 ${goalPercent.toFixed(0)}% done. Push harder this week.`;
  }

  if (weeklyHours < 3) {
    return `⚡ Low activity. Try adding a ${bestDay} session.`;
  }

  return "🚀 Keep building your skills daily.";
}