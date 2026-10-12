import { type ClassValue, clsx } from "clsx";

/**
 * Merges class names using clsx.
 *
 * Checks for truthy values and combines them into a single string.
 * This function accepts any number of arguments which can be a string, number,
 * array, or object (keys are class names, values are boolean).
 *
 * @param inputs - The class values to merge.
 * @returns The merged class string.
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
