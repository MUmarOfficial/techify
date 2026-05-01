export const CATEGORIES = [
  "Software Engineering",
  "DevOps",
  "Data Science",
  "Design",
  "Cybersecurity",
  "Marketing",
  "Business",
] as const;

export type CategoryType = (typeof CATEGORIES)[number];
