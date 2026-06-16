export function adaptiveSystem(sessions: any[]) {
  if (!sessions.length) return null;

  const result = {
    suggestedHoursToday: 1,
    suggestedTime: null as number | null,
    adaptiveGoal: 10,
    messages: [] as string[],
  };

  // =========================
  // 📊 BASE STATS
  // =========================
  const totalHours = sessions.reduce((a, s) => a + s.totalHours, 0);
  const avgSession = totalHours / sessions.length;

  // =========================
  // 🎯 ADAPTIVE WEEKLY GOAL
  // =========================
  const last7 = sessions.filter(s => {
    const diff =
      (Date.now() - new Date(s.start).getTime()) /
      (1000 * 60 * 60 * 24);
    return diff <= 7;
  });

  const weeklyHours = last7.reduce((a, s) => a + s.totalHours, 0);

  if (weeklyHours < 5) {
    result.adaptiveGoal = 6;
    result.messages.push("🎯 Start small: aim for 6 hrs this week.");
  } else if (weeklyHours < 10) {
    result.adaptiveGoal = 10;
    result.messages.push("📈 You're building momentum. Push to 10 hrs.");
  } else {
    result.adaptiveGoal = 15;
    result.messages.push("🔥 You're on fire. Try 15 hrs this week.");
  }

  // =========================
  // 🧠 SUGGEST TODAY SESSION
  // =========================
  if (avgSession < 1) {
    result.suggestedHoursToday = 1;
    result.messages.push("⚡ Do a 1-hour focused session today.");
  } else if (avgSession < 2) {
    result.suggestedHoursToday = 1.5;
    result.messages.push("🧠 Try a 1.5-hour deep work session today.");
  } else {
    result.suggestedHoursToday = 2;
    result.messages.push("🔥 Go for a 2-hour deep work block today.");
  }

  // =========================
  // ⏰ BEST TIME PREDICTION
  // =========================
  const hourMap: Record<number, number> = {};

  sessions.forEach(s => {
    const h = new Date(s.start).getHours();
    hourMap[h] = (hourMap[h] || 0) + (s.focusScore ?? 1);
  });

  result.suggestedTime = Number(
    Object.entries(hourMap).sort((a, b) => b[1] - a[1])[0]?.[0]
  );

  // =========================
  // 🧠 BAD DAY DETECTION
  // =========================
  const lastSession = sessions[sessions.length - 1];

  if (lastSession && lastSession.totalHours < 0.5) {
    result.messages.push(
      "💤 Last session was weak. Keep it light today and rebuild momentum."
    );
  }

  return result;
}