export const interestOptions = [
  "Pilot / early access",
  "Forhåndsbestilling",
  "Generell interesse",
] as const;

export type InterestOption = (typeof interestOptions)[number];
