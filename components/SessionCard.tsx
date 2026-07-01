export function SessionCard({ session }: any) {
  return (
    <div className="p-5 rounded-2xl border bg-card/50 hover:bg-brand/10 transition">

      <div className="flex justify-between items-center">
        <p className="text-xs text-muted-foreground">
          {new Date(session.start).toLocaleString()}
        </p>

        <span className="text-xs px-2 py-1 rounded bg-white/10">
          {session.intensity}
        </span>
      </div>

      <h2 className="text-2xl font-bold mt-2">
        {session.totalHours} hrs
      </h2>

      <p className="text-green-400 text-xs">
        +{session.xp} XP
      </p>

      <div className="mt-2 text-xs text-muted-foreground">
        Duration: {Math.round(session.duration)} mins
      </div>

      <div className="text-xs text-muted-foreground">
        Focus Score: {(session.focusScore ?? 0).toFixed(1)}
      </div>

    </div>
  );
}