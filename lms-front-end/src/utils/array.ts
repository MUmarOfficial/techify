/**
 * Generates an array of a specified length for skeleton placeholders.
 * Returns an array of numbers [0, 1, ..., n-1]
 */
export const getSkeletonArray = (length: number): number[] => {
  return Array.from({ length }, (_, i) => i);
};
