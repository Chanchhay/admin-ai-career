"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, IdCard, ShieldCheck, UserCog } from "lucide-react";
import { toast } from "sonner";
import { NotImplementedNotice } from "@/components/console/NotImplementedNotice";
import { UserRoleChip, UserStatusChip } from "@/components/console/StatusChip";
import { useSetPageHeading } from "@/components/layout/PageHeader";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { Button } from "@/components/ui/button";
import { Panel, PanelHeader } from "@/components/workspace/primitives";
import type { EntityStatus, UserRole } from "@/contracts";
import { getApiErrorMessage } from "@/lib/api-error";
import { formatDateTime, humanizeEnum, orDash } from "@/lib/format";
import {
  useGetAdminUserQuery,
  useUpdateUserRoleMutation,
  useUpdateUserStatusMutation,
} from "@/services/adminApi";

const STATUS_OPTIONS: EntityStatus[] = ["ACTIVE", "PENDING", "SUSPENDED", "INACTIVE"];
const ROLE_OPTIONS: UserRole[] = [
  "JOB_SEEKER",
  "RECRUITER",
  "MODERATOR",
  "FINANCE",
  "ADMIN",
  "SUPER_ADMIN",
];

export default function UserDetailPage() {
  const { userId } = useParams<{ userId: string }>();
  const id = Number(userId);

  const { data: user, isLoading, isError, refetch } = useGetAdminUserQuery(id, {
    skip: Number.isNaN(id),
  });

  useSetPageHeading(user ? orDash(user.fullName) || user.username : "User");

  if (isLoading) return <LoadingState rows={6} />;
  if (isError || !user) {
    return <ErrorState message="Unable to load this user." onRetry={refetch} />;
  }

  return (
    <div className="flex flex-col gap-5">
      <Link
        href="/users"
        className="inline-flex w-fit items-center gap-1.5 text-xs font-medium text-ws-faint transition-colors hover:text-ws-fg"
      >
        <ArrowLeft aria-hidden="true" className="size-3.5" />
        Back to users
      </Link>

      <NotImplementedNotice endpoint={`PATCH /api/v1/admin/users/${id}/status`} />

      <Panel>
        <div className="flex flex-wrap items-start gap-4">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-ws-card-hover text-lg font-bold text-ws-muted">
            {initials(user.fullName || user.username)}
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-semibold tracking-tight text-ws-fg">
              {orDash(user.fullName) || user.username}
            </h2>
            <p className="mt-1 text-sm text-ws-faint">{user.email}</p>
          </div>
          <UserStatusChip status={user.status} />
        </div>

        <dl className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <Field label="Username" value={user.username} />
          <Field label="Phone" value={user.phoneNumber} />
          <Field label="Registration source" value={humanizeEnum(user.registrationSource)} />
          <Field label="Joined" value={formatDateTime(user.createdAt)} />
          <Field
            label="Last sign-in"
            value={user.lastLoginAt ? formatDateTime(user.lastLoginAt) : "Never"}
          />
          <Field label="Keycloak ID" value={user.keycloakUserId} />
        </dl>
      </Panel>

      <RoleEditor userId={id} currentRoles={user.roles} />
      <StatusEditor userId={id} currentStatus={user.status} />

      <Panel>
        <PanelHeader
          title="Profiles"
          icon={<IdCard aria-hidden="true" className="size-5" />}
        />
        <dl className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <Field label="Job seeker profile" value={idOrNone(user.profiles.jobSeekerProfileId)} />
          <Field label="Recruiter profile" value={idOrNone(user.profiles.recruiterProfileId)} />
          <Field label="Moderator profile" value={idOrNone(user.profiles.moderatorProfileId)} />
          <Field label="Admin profile" value={idOrNone(user.profiles.adminProfileId)} />
          <Field label="Finance profile" value={idOrNone(user.profiles.financeProfileId)} />
        </dl>
      </Panel>
    </div>
  );
}

function RoleEditor({
  userId,
  currentRoles,
}: {
  userId: number;
  currentRoles: UserRole[];
}) {
  const [role, setRole] = useState<UserRole>(currentRoles[0] ?? "JOB_SEEKER");
  const [updateRole, { isLoading }] = useUpdateUserRoleMutation();

  const submit = async () => {
    try {
      await updateRole({ userId, body: { role } }).unwrap();
      toast.success(`Role updated to ${humanizeEnum(role)}.`);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to update the role."));
    }
  };

  return (
    <Panel>
      <PanelHeader
        title="Role"
        icon={<ShieldCheck aria-hidden="true" className="size-5" />}
      />

      <div className="mb-3 flex flex-wrap items-center gap-1.5">
        {currentRoles.length === 0 ? (
          <span className="text-xs text-ws-faint">No role assigned.</span>
        ) : (
          currentRoles.map((r) => <UserRoleChip key={r} role={r} />)
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <select
          value={role}
          onChange={(event) => setRole(event.target.value as UserRole)}
          className="h-10 rounded-md border border-input bg-surface px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
        >
          {ROLE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {humanizeEnum(option)}
            </option>
          ))}
        </select>
        <Button disabled={isLoading} onClick={() => void submit()}>
          Set role
        </Button>
      </div>
    </Panel>
  );
}

function StatusEditor({
  userId,
  currentStatus,
}: {
  userId: number;
  currentStatus: EntityStatus;
}) {
  const [status, setStatus] = useState<EntityStatus>(currentStatus);
  const [updateStatus, { isLoading }] = useUpdateUserStatusMutation();

  const submit = async () => {
    try {
      await updateStatus({ userId, body: { status } }).unwrap();
      toast.success(`Status updated to ${humanizeEnum(status)}.`);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to update the status."));
    }
  };

  return (
    <Panel>
      <PanelHeader
        title="Status"
        icon={<UserCog aria-hidden="true" className="size-5" />}
      />

      <div className="flex flex-wrap items-center gap-2">
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value as EntityStatus)}
          className="h-10 rounded-md border border-input bg-surface px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {humanizeEnum(option)}
            </option>
          ))}
        </select>
        <Button
          variant={status === "SUSPENDED" ? "destructive" : "default"}
          disabled={isLoading}
          onClick={() => void submit()}
        >
          Set status
        </Button>
      </div>
    </Panel>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[18px] bg-ws-card-hover px-4 py-3">
      <dt className="text-[11px] uppercase tracking-[0.18em] text-ws-faint">
        {label}
      </dt>
      <dd className="mt-1.5 break-words text-sm font-semibold text-ws-fg">
        {orDash(value)}
      </dd>
    </div>
  );
}

function idOrNone(id: number | undefined): string {
  return id === undefined ? "—" : `#${id}`;
}

function initials(name: string): string {
  const letters = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
  return letters || "U";
}
