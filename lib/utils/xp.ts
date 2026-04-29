//lib/utils/xp.ts

export const calculateXP = (activities: any[]) => {
  return activities.reduce((acc, a) => acc + a.hours * 10, 0);
};

export const getLevel = (xp: number) => {
  return Math.floor(xp / 100); // every 100xp = level up
};

export const getNextLevelXP = (level: number) => {
  return (level + 1) * 100;
};