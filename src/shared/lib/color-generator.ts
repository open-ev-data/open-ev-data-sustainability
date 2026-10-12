import { APP_CONSTANTS } from '@/shared/config/constants';

/**
 * Generates a consistent hue (0-360) based on the input string.
 * Uses HUE_SALT from config to allow rotation of the color palette.
 */
export const generateMakeHue = (str: string): number => {
  let hash = 0;
  const combinedStr = str + APP_CONSTANTS.VEHICLE_COLORS.HUE_SALT;

  for (let i = 0; i < combinedStr.length; i++) {
    hash = combinedStr.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash % 360);
};

/**
 * Generates a consistent neon color based on the input string (e.g. vehicle make).
 * Uses a hash function to determine the Hue, while keeping Saturation and Lightness
 * constant to ensure a "Neon" look.
 *
 * @param str - The input string (e.g., "Tesla", "BMW")
 * @returns A CSS HSL color string: "hsl(hue, 100%, 50%)"
 */
export const generateMakeColor = (str: string): string => {
  const hue = generateMakeHue(str);
  // Saturation 100%, Lightness 50% for maximum neon brightness
  return `hsl(${hue}, 100%, 50%)`;
};
