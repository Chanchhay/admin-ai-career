"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, KeyRound, ShieldCheck, UserRound } from "lucide-react";
import { toast } from "sonner";
import { AccountStatusChip, RoleToggle } from "@/components/console/UserChips";
import { useSetPageHeading } from "@/components/layout/PageHeader";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  GhostChip,
  Panel,
  PanelHeader,
} from "@/components/workspace/primitives";
import type { ManageableRole } from "@/contracts";
import { useWorkspaceTranslation } from "@/i18n/useWorkspaceTranslation";
import { getApiErrorMessage } from "@/lib/api-error";
import { formatDateTime, humanizeEnum, orDash } from "@/lib/format";
import {
  useGetUserQuery,
  useReactivateUserMutation,
  useSuspendUserMutation,
  useUpdateUserRolesMutation,
} from "@/services/usersApi";

const ALL_ROLES: ManageableRole[] = [
  "SEEKER",
  "RECRUITER",
  "MODERATOR",
  "FINANCE",
  "SUPER_ADMIN",
];

export default function UserDetailPage() {
  const tx = useWorkspaceTranslation();
  const { keycloakUserId } = useParams<{ keycloakUserId: string }>();
  useSetPageHeading(tx("Account"));

  const { data: user, isLoading, isError, refetch } = useGetUserQuery(keycloakUserId);

  if (isLoading) return <LoadingState rows={6} />;
  if (isError || !user) {
    return (
      <ErrorState message={tx("Unable to load this account.")} onRetry={refetch} />
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <Link
        href="/users"
        className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-ws-muted transition-colors hover:text-ws-fg"
      >
        <ArrowLeft aria-hidden="true" className="size-4" /> {tx("All accounts")}
      </Link>

      <Panel>
        <PanelHeader
          title={orDash(user.username)}
          icon={<UserRound aria-hidden="true" className="size-5" />}
          action={<AccountStatusChip status={user.status} />}
        />

        <dl className="grid gap-3 sm:grid-cols-2">
          <Row label="Email" value={orDash(user.email)} />
          <Row
            label="Name"
            value={orDash(
              [user.firstName, user.lastName].filter(Boolean).join(" ") || null,
            )}
          />
          <Row
            label="Email verified"
            value={user.emailVerified ? tx("Yes") : tx("No")}
          />
          <Row
            label="Sign-in enabled"
            value={user.enabled ? tx("Yes") : tx("No")}
          />
          <Row
            label="Created"
            value={formatDateTime(user.keycloakCreatedAt)}
          />
          <Row label="Keycloak id" value={user.keycloakUserId} />
        </dl>

        {/*
          * enabled and status come from different systems and can disagree —
          * most often when someone was disabled straight in the Keycloak
          * console. Saying so is more useful than quietly showing two rows that
          * look contradictory.
          */}
        {user.enabled === false && user.status === "ACTIVE" ? (
          <p className="mt-4 rounded-[18px] bg-chip-alert px-4 py-3 text-xs text-chip-alert-fg">
            {tx(
              "This user is disabled in Keycloak but has no suspension recorded here. It was most likely changed directly in the Keycloak console.",
            )}
          </p>
        ) : null}

        {!user.hasLocalAccount ? (
          <p className="mt-4 rounded-[18px] bg-ws-card-hover px-4 py-3 text-xs text-ws-muted">
            {tx(
              "No local account row exists yet. One will be created the first time this account is suspended or reactivated.",
            )}
          </p>
        ) : null}

        {user.profiles.length > 0 ? (
          <div className="mt-4 flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-ws-muted">
              {tx("Profiles")}
            </span>
            {user.profiles.map((profile) => (
              <GhostChip key={profile}>{tx(humanizeEnum(profile))}</GhostChip>
            ))}
          </div>
        ) : null}
      </Panel>

      {/*
        * Keyed on the saved role set so a successful save (or a change made by
        * another administrator) remounts the picker with fresh state. Cheaper
        * and clearer than re-seeding it from an effect.
        */}
      <RolesPanel
        key={user.roles.join(",")}
        keycloakUserId={user.keycloakUserId}
        currentRoles={user.roles}
      />

      <StatusPanel
        keycloakUserId={user.keycloakUserId}
        suspended={user.status === "SUSPENDED"}
      />
    </div>
  );
}

function RolesPanel({
  keycloakUserId,
  currentRoles,
}: {
  keycloakUserId: string;
  currentRoles: ManageableRole[];
}) {
  const tx = useWorkspaceTranslation();
  const [updateRoles, { isLoading }] = useUpdateUserRolesMutation();
  const [selected, setSelected] = useState<ManageableRole[]>(currentRoles);

  const changed =
    selected.length !== currentRoles.length ||
    selected.some((role) => !currentRoles.includes(role));

  const toggle = (role: ManageableRole) =>
    setSelected((current) =>
      current.includes(role)
        ? current.filter((item) => item !== role)
        : [...current, role],
    );

  async function save() {
    if (selected.length === 0) {
      toast.error(tx("An account must keep at least one role."));
      return;
    }

    try {
      await updateRoles({
        keycloakUserId,
        body: { roles: selected },
      }).unwrap();
      toast.success(tx("Roles updated."));
    } catch (error) {
      toast.error(getApiErrorMessage(error, tx("Unable to update the roles.")));
    }
  }

  return (
    <Panel>
      <PanelHeader
        title="Realm roles"
        icon={<ShieldCheck aria-hidden="true" className="size-5" />}
      />

      <p className="mb-4 text-sm text-ws-muted">
        {tx(
          "Roles decide what the account may reach. Revoking one leaves its existing data — a revoked recruiter keeps their companies and jobs, they simply lose access to them.",
        )}
      </p>

      <div className="flex flex-wrap gap-1.5">
        {ALL_ROLES.map((role) => (
          <RoleToggle
            key={role}
            role={role}
            selected={selected.includes(role)}
            onToggle={() => toggle(role)}
            disabled={isLoading}
          />
        ))}
      </div>

      <div className="mt-4 flex items-center gap-2">
        <Button disabled={!changed || isLoading} onClick={() => void save()}>
          {isLoading ? tx("Saving…") : tx("Save roles")}
        </Button>
        {changed ? (
          <Button
            variant="ghost"
            disabled={isLoading}
            onClick={() => setSelected(currentRoles)}
          >
            {tx("Reset")}
          </Button>
        ) : null}
      </div>
    </Panel>
  );
}

function StatusPanel({
  keycloakUserId,
  suspended,
}: {
  keycloakUserId: string;
  suspended: boolean;
}) {
  const tx = useWorkspaceTranslation();
  const [suspendUser, suspendState] = useSuspendUserMutation();
  const [reactivateUser, reactivateState] = useReactivateUserMutation();
  const [reason, setReason] = useState("");

  const pending = suspendState.isLoading || reactivateState.isLoading;

  async function submit() {
    if (!suspended && !reason.trim()) {
      toast.error(tx("Record why the account is being suspended."));
      return;
    }

    try {
      const body = { reason: reason.trim() || undefined };

      if (suspended) {
        await reactivateUser({ keycloakUserId, body }).unwrap();
        toast.success(tx("Account reactivated."));
      } else {
        await suspendUser({ keycloakUserId, body }).unwrap();
        toast.success(tx("Account suspended."));
      }

      setReason("");
    } catch (error) {
      toast.error(
        getApiErrorMessage(error, tx("Unable to change the account status.")),
      );
    }
  }

  return (
    <Panel>
      <PanelHeader
        title={suspended ? "Reactivate account" : "Suspend account"}
        icon={<KeyRound aria-hidden="true" className="size-5" />}
      />

      <p className="mb-4 text-sm text-ws-muted">
        {suspended
          ? tx(
              "Re-enables sign-in and clears the local suspension. The user can log in again immediately.",
            )
          : tx(
              "Disables sign-in in Keycloak and blocks any token the user already holds, from their next request onward.",
            )}
      </p>

      <Textarea
        value={reason}
        onChange={(event) => setReason(event.target.value)}
        placeholder={
          suspended
            ? tx("Why is this account being reinstated? (optional)")
            : tx("Why is this account being suspended?")
        }
        rows={3}
        maxLength={500}
      />

      <div className="mt-3">
        <Button
          variant={suspended ? "default" : "destructive"}
          disabled={pending}
          onClick={() => void submit()}
        >
          {pending
            ? tx("Working…")
            : suspended
              ? tx("Reactivate account")
              : tx("Suspend account")}
        </Button>
      </div>

      <p className="mt-3 text-xs text-ws-faint">
        {tx(
          "You cannot suspend your own account or change your own roles — only another administrator can undo either.",
        )}
      </p>
    </Panel>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  const tx = useWorkspaceTranslation();

  return (
    <div className="rounded-[18px] bg-ws-card-hover px-4 py-3">
      <dt className="text-xs font-semibold text-ws-muted">{tx(label)}</dt>
      <dd className="mt-0.5 truncate text-sm text-ws-fg">{value}</dd>
    </div>
  );
}
