export const skillGap = (userSkills = [], targetSkills = []) => {
  const have = new Set(userSkills.map((s) => s.toLowerCase()));
  const need = targetSkills.filter((s) => !have.has(s.toLowerCase()));
  return { missing: need, coverage: 1 - need.length / Math.max(1, targetSkills.length) };
};
