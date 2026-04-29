export const getRank = (xp: number) => {
  if (xp < 500) return "Bronze";
  if (xp < 1500) return "Silver";
  if (xp < 3000) return "Gold";
  return "Diamond";
};