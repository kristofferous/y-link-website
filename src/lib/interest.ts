export const interestOptions = [
  "Pilot / tidlig tilgang",
  "Forhåndsbestilling",
  "Generell interesse",
] as const;

export type InterestOption = (typeof interestOptions)[number];
