/**
 * Route-parameter validation for the identifiers the API uses.
 *
 * Every id is a UUID, so a bad one arrives as a string that simply is not
 * shaped like one. This replaces the `Number.isNaN(Number(param))` guards that
 * made sense while ids were numeric: those now let anything through, because
 * `Number("not-an-id")` was the only thing they could catch.
 */
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuid(value: string | undefined | null): value is string {
  return typeof value === "string" && UUID_PATTERN.test(value);
}
