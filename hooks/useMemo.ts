// import { useMemo } from "react";

// const enrichedSkills = useMemo(() => {
//   const skillMap = new Map<string, any>();

//   skills.forEach((skill: any) => {
//     skillMap.set(skill._id.toString(), {
//       ...skill,
//       logs: [],
//     });
//   });

//   allProgress.forEach((log: any) => {
//     const skillId = log.skillId?.toString();
//     const skill = skillMap.get(skillId);
//     if (skill) skill.logs.push(log);
//   });

//   return Array.from(skillMap.values());
// }, [skills, allProgress]);