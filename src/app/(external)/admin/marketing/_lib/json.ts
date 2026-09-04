/**
 * Prisma's `Json` columns type as `JsonValue` (string | number | boolean |
 * null | JsonObject | JsonArray) because JSON can hold anything — safe to
 * assign `unknown`, but never safe to `as string[]` and trust blindly.
 * This is the one place that narrows it, at the DB boundary.
 */
export function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((v): v is string => typeof v === "string");
}
