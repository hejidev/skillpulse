import { normalizeActivity } from "@/lib/utils/activityPro";

export function ProgressStats({ data = [] }: any) {

    const normalized = data.map(normalizeActivity);

    const totalXP = data.reduce((acc: number, p: any) => {
        const xp = Number(p.xp ?? p.hours * 10);
        return acc + (isNaN(xp) ? 0 : xp);
    }, 0);

    const todayHours = normalized
        .filter(
            (p: any) =>
                new Date(p.createdAt).toDateString() ===
                new Date().toDateString()
        )
        .reduce((acc: number, p: any) => acc + p.hours, 0);

    return (
        <div className="grid grid-cols-3 gap-4">
            <Stat title="Today" value={`${todayHours} hrs`} />
            <Stat title="Total XP" value={totalXP} />
            <Stat title="Entries" value={normalized.length} />
        </div>
    );
}

function Stat({ title, value }: any) {
    return (
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-xs text-gray-400">{title}</p>
            <h2 className="text-lg font-bold mt-1">{value}</h2>
        </div>
    );
}