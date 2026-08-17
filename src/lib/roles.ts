/**
 * `/api/v1/me` returns Spring Security authorities verbatim, so realm roles
 * arrive prefixed: `ROLE_SUPER_ADMIN`, not `SUPER_ADMIN`. Keycloak's own
 * defaults come through too (`ROLE_default-roles-…`, `ROLE_offline_access`).
 *
 * Comparing against a bare role name therefore never matches. Everything here
 * normalises first, so no caller has to remember the prefix.
 */

/** Realm roles the backend's SecurityConfig admits to every console path. */
export const STAFF_ROLES = ["MODERATOR", "SUPER_ADMIN"] as const;

/** `ROLE_super_admin` → `SUPER_ADMIN`. */
function normalize(role: string): string {
  return role.replace(/^ROLE_/i, "").toUpperCase();
}

/** True when the account holds any of `wanted`, prefix and case ignored. */
export function hasAnyRole(
  roles: string[] | undefined,
  wanted: readonly string[],
): boolean {
  if (!roles) return false;
  const held = new Set(roles.map(normalize));
  return wanted.some((role) => held.has(normalize(role)));
}

/**
 * Whether the account can use this console at all. `SUPER_ADMIN` reaches the
 * moderator endpoints through the backend's role hierarchy, so either role is
 * enough.
 */
export function isStaff(roles: string[] | undefined): boolean {
  return hasAnyRole(roles, STAFF_ROLES);
}
