/**
 * Returns true if value is not null, undefined, or empty array/object.
 * This is the central source of truth for "Does this field have data?".
 *
 * @param value - The value to check for presence.
 * @returns boolean - True if data exists.
 */
export function hasData<T>(value: T | null | undefined): value is T {
  if (value === null || value === undefined) {
    return false;
  }
  if (typeof value === "string") {
    return value.trim().length > 0;
  }
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  if (typeof value === "object") {
    return Object.keys(value).length > 0;
  }
  return true;
}
