"use client";

import { Chip, GhostChip, type Tone } from "@/components/workspace/primitives";
import type { AccountStatus, ManageableRole } from "@/contracts";
import { humanizeEnum } from "@/lib/format";

const statusTone: Record<AccountStatus, Tone> = {
  ACTIVE: "solid",
  INACTIVE: "quiet",
  SUSPENDED: "alert",
  DELETED: "alert",
};

export function AccountStatusChip({ status }: { status: AccountStatus }) {
  return <Chip tone={statusTone[status]}>{humanizeEnum(status)}</Chip>;
}

/**
 * Roles read as neutral metadata, not as outcomes — SUPER_ADMIN is the one
 * exception, because seeing at a glance who holds it is the point of the list.
 */
export function RoleChips({ roles }: { roles: ManageableRole[] }) {
  if (roles.length === 0) {
    return <GhostChip>No roles</GhostChip>;
  }

  return (
    <>
      {roles.map((role) =>
        role === "SUPER_ADMIN" ? (
          <Chip key={role} tone="soft">
            {humanizeEnum(role)}
          </Chip>
        ) : (
          <GhostChip key={role}>{humanizeEnum(role)}</GhostChip>
        ),
      )}
    </>
  );
}

/**
 * A role in a picker. Selected roles take the solid brand fill so the set the
 * account will end up with reads at a glance, rather than having to be
 * assembled from checkbox states.
 */
export function RoleToggle({
  role,
  selected,
  onToggle,
  disabled,
}: {
  role: ManageableRole;
  selected: boolean;
  onToggle: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      aria-pressed={selected}
      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50 ${
        selected
          ? "bg-chip-solid text-chip-solid-fg"
          : "bg-ws-card-hover text-ws-muted hover:text-ws-fg"
      }`}
    >
      {humanizeEnum(role)}
    </button>
  );
}
