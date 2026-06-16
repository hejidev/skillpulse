import {
  startOfWeek,
  endOfWeek,
  subDays,
  isWithinInterval,
} from "date-fns";

export default function Trends({ data }: any) {
  const now = new Date();

  const startThisWeek = startOfWeek(now, { weekStartsOn: 1 });
  const endThisWeek = endOfWeek(now, { weekStartsOn: 1 });

  const startLastWeek = startOfWeek(subDays(now, 7), { weekStartsOn: 1 });
  const endLastWeek = endOfWeek(subDays(now, 7), { weekStartsOn: 1 });

  const sum = (logs: any[]) =>
    logs.reduce((acc, l) => acc + Number(l.hours || 0), 0);

  const thisWeekHours = sum(
    data.filter((log: any) =>
      isWithinInterval(new Date(log.createdAt), {
        start: startThisWeek,
        end: endThisWeek,
      })
    )
  );

  const lastWeekHours = sum(
    data.filter((log: any) =>
      isWithinInterval(new Date(log.createdAt), {
        start: startLastWeek,
        end: endLastWeek,
      })
    )
  );

  const diff = thisWeekHours - lastWeekHours;

  const trendText =
    diff > 0
      ? `📈 +${diff} hrs improvement`
      : diff < 0
      ? `📉 ${diff} hrs decline`
      : `➖ No change`;

  return (
    <div className="grid md:grid-cols-3 gap-6">

      <TrendCard
        title="Weekly Trend"
        value={trendText}
        highlight={diff}
      />

      <TrendCard
        title="This Week"
        value={`${thisWeekHours} hrs`}
      />

      <TrendCard
        title="Last Week"
        value={`${lastWeekHours} hrs`}
      />

    </div>
  );
}

function TrendCard({ title, value, highlight }: any) {
  const color =
    highlight > 0
      ? "text-green-400"
      : highlight < 0
      ? "text-red-400"
      : "text-gray-400";

  return (
    <div className="p-6 rounded-2xl border border-white/10 bg-white/5">
      <p className="text-xs text-muted-foreground">{title}</p>
      <h2 className={`text-xl font-bold mt-2 ${color}`}>
        {value}
      </h2>
    </div>
  );
}