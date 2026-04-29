// lib/utils/skillMatcher.ts
export function matchSkill(note: string, skills: any[]) {
  const text = note.toLowerCase();

  let bestMatch = null;
  let highestScore = 0;

  for (const skill of skills) {
    let score = 0;

    const name = skill.name.toLowerCase();

    // direct name match
    if (text.includes(name)) score += 5;

    // keyword match
    const keywords = name.split(" ");
    keywords.forEach((k: string) => {
      if (text.includes(k)) score += 2;
    });

    // domain heuristics
    if (name === "react" && text.includes("component")) score += 3;
    if (name === "design" && text.includes("ui")) score += 3;
    if (name === "backend" && text.includes("api")) score += 3;

    if (score > highestScore) {
      highestScore = score;
      bestMatch = skill;
    }
  }

  return bestMatch;
}