// utils/streak 

export const calculateStreak = (logs: any[]) => {
    if (!logs.length) return 0;

    const dates = [
        ...new Set(
            logs.map((l) =>
                new Date(l.createdAt).toDateString()
            )
        ),
    ];

    dates.sort(
        (a, b) => new Date(b).getTime() - new Date(a).getTime()
    );

    let streak = 1;

    for (let i = 0; i < dates.length - 1; i++) {
        const curr = new Date(dates[i]);
        const next = new Date(dates[i + 1]);

        const diff =
            (curr.getTime() - next.getTime()) /
            (1000 * 60 * 60 * 24);

        if (diff === 1) {
            streak++;
        } else {
            break;
        }
    }

    return streak;
};