"use client";

import Link from "next/link";
import { useState } from "react";
import { Plus, Search, X } from "lucide-react";
import { toast } from "sonner";
import { Pager } from "@/components/console/Pager";
import { PageSizeSelect } from "@/components/console/PageSizeSelect";
import {
  AccountStatusChip,
  RoleChips,
  RoleToggle,
} from "@/components/console/UserChips";
import { useSetPageHeading } from "@/components/layout/PageHeader";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Panel, PanelHeader, PillTabs } from "@/components/workspace/primitives";
import type {
  AccountStatus,
  AdminUserCreateRequest,
  ManageableRole,
} from "@/contracts";
import { getApiErrorMessage } from "@/lib/api-error";
import { orDash } from "@/lib/format";
import { DEFAULT_PAGE_SIZE } from "@/services/moderationApi";
import { useCreateUserMutation, useGetUsersQuery } from "@/services/usersApi";

const ROLE_TABS = [
  "All",
  "Seekers",
  "Recruiters",
  "Moderators",
  "Finance",
  "Admins",
] as const;
type RoleTab = (typeof ROLE_TABS)[number];

const tabRole: Record<RoleTab, ManageableRole | undefined> = {
  All: undefined,
  Seekers: "SEEKER",
  Recruiters: "RECRUITER",
  Moderators: "MODERATOR",
  Finance: "FINANCE",
  Admins: "SUPER_ADMIN",
};

const STATUS_TABS = ["Any status", "Active", "Suspended"] as const;
type StatusTab = (typeof STATUS_TABS)[number];

const tabStatus: Record<StatusTab, AccountStatus | undefined> = {
  "Any status": undefined,
  Active: "ACTIVE",
  Suspended: "SUSPENDED",
};

const ASSIGNABLE_ROLES: ManageableRole[] = [
  "MODERATOR",
  "FINANCE",
  "SUPER_ADMIN",
  "RECRUITER",
  "SEEKER",
];

const COLUMNS = [
  { key: "username", label: "Username", className: "w-[22%]" },
  { key: "email", label: "Email", className: "w-[28%]" },
  { key: "roles", label: "Roles", className: "w-[23%]" },
  { key: "status", label: "Status", className: "w-[15%] text-right" },
  { key: "actions", label: "", className: "w-[12%]" },
] as const;

export default function UsersPage() {
  useSetPageHeading("Users");

  const [roleTab, setRoleTab] = useState<RoleTab>("All");
  const [statusTab, setStatusTab] = useState<StatusTab>("Any status");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(DEFAULT_PAGE_SIZE);
  const [creating, setCreating] = useState(false);

  const { data, isLoading, isError, refetch } = useGetUsersQuery({
    role: tabRole[roleTab],
    status: tabStatus[statusTab],
    search: search || undefined,
    page,
    size,
  });

  // Any change of filter is a different result set, not a further page of the
  // current one.
  const reset = <T,>(setter: (value: T) => void) => (value: T) => {
    setter(value);
    setPage(0);
  };

  const users = data?.content ?? [];

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <Panel tone="soft" className="shrink-0">
        <p className="text-sm leading-6">
          Accounts live in Keycloak; this console changes their roles and
          whether they may sign in. Suspending an account disables the Keycloak
          user and blocks its existing tokens on the next request.
        </p>
      </Panel>

      {creating ? (
        <CreateUserPanel onClose={() => setCreating(false)} />
      ) : null}

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-ws-line bg-ws-panel">
        <div className="flex shrink-0 flex-wrap items-center gap-3 px-4 py-3">
          <h2 className="font-semibold text-ws-fg">Accounts</h2>
          {data ? (
            <span className="rounded-md bg-ws-card px-2 py-0.5 text-xs font-medium text-ws-muted">
              {data.totalElements}
            </span>
          ) : null}
          {creating ? null : (
            <Button
              className="ml-auto"
              size="sm"
              onClick={() => setCreating(true)}
            >
              <Plus aria-hidden="true" /> New staff account
            </Button>
          )}
        </div>

        <form
          className="flex shrink-0 flex-wrap items-center gap-2 px-4 pb-3"
          onSubmit={(event) => {
            event.preventDefault();
            setSearch(searchInput.trim());
            setPage(0);
          }}
        >
          <div className="relative min-w-0 flex-1">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ws-faint"
            />
            <Input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search by username, email, or name"
              aria-label="Search by username, email, or name"
              className="pl-9"
            />
          </div>
          <Button type="submit" variant="secondary">
            Search
          </Button>
          {search ? (
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setSearchInput("");
                setSearch("");
                setPage(0);
              }}
            >
              <X aria-hidden="true" /> Clear
            </Button>
          ) : null}
        </form>

        <div className="flex shrink-0 flex-col gap-2 px-4 pb-3">
          <PillTabs
            tabs={ROLE_TABS}
            value={roleTab}
            onChange={reset(setRoleTab)}
            className="rounded-lg bg-ws-card p-1"
          />
          <PillTabs
            tabs={STATUS_TABS}
            value={statusTab}
            onChange={reset(setStatusTab)}
            className="rounded-lg bg-ws-card p-1"
          />
        </div>

        <div className="ws-scroll min-h-0 flex-1 overflow-auto border-t border-ws-line">
          <table
            aria-label="Accounts"
            className="w-full min-w-[800px] table-fixed border-collapse text-left"
          >
            <thead className="sticky top-0 z-10">
              <tr>
                {COLUMNS.map((column) => (
                  <th
                    key={column.key}
                    scope="col"
                    className={`${column.className} bg-ws-card px-4 py-2.5 text-xs font-semibold text-ws-muted shadow-[inset_0_-1px_0_var(--ws-line)]`}
                  >
                    {column.label || <span className="sr-only">Actions</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={COLUMNS.length} className="p-4">
                    <LoadingState rows={5} />
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={COLUMNS.length} className="p-4">
                    <ErrorState
                      message="Unable to load users."
                      onRetry={refetch}
                    />
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td
                    colSpan={COLUMNS.length}
                    className="px-4 py-14 text-center text-sm text-ws-faint"
                  >
                    No accounts match these filters.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.keycloakUserId}
                    className="border-b border-ws-line/70 transition-colors hover:bg-ws-card/60"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/users/${user.keycloakUserId}`}
                        className="block truncate text-sm font-semibold text-ws-fg hover:underline"
                        title={orDash(user.username)}
                      >
                        {orDash(user.username)}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="block truncate text-sm text-ws-muted"
                        title={orDash(user.email)}
                      >
                        {orDash(user.email)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <RoleChips roles={user.roles} />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end">
                        <AccountStatusChip status={user.status} />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Button
                        size="sm"
                        variant="ghost"
                        aria-label={`Open account ${user.username || user.email || user.keycloakUserId}`}
                        render={<Link href={`/users/${user.keycloakUserId}`} />}
                      >
                        Open
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-3 border-t border-ws-line px-4 py-2.5">
          <PageSizeSelect
            value={size}
            onChange={reset(setSize)}
            id="users-page-size"
          />
          {data ? (
            <div className="ml-auto">
              <Pager page={data} onPageChange={setPage} />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function CreateUserPanel({ onClose }: { onClose: () => void }) {
  const [createUser, { isLoading }] = useCreateUserMutation();
  const [form, setForm] = useState<AdminUserCreateRequest>({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    temporaryPassword: true,
    roles: ["MODERATOR"],
  });

  const set = <K extends keyof AdminUserCreateRequest>(
    key: K,
    value: AdminUserCreateRequest[K],
  ) => setForm((current) => ({ ...current, [key]: value }));

  const toggleRole = (role: ManageableRole) =>
    setForm((current) => ({
      ...current,
      roles: current.roles.includes(role)
        ? current.roles.filter((item) => item !== role)
        : [...current.roles, role],
    }));

  async function submit(event: React.FormEvent) {
    event.preventDefault();

    if (form.roles.length === 0) {
      toast.error("Give the account at least one role.");
      return;
    }

    if (form.password.length < 8) {
      toast.error("The password must be at least 8 characters.");
      return;
    }

    try {
      const created = await createUser(form).unwrap();
      toast.success(`Created ${created.username}.`);
      onClose();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to create the account."));
    }
  }

  return (
    <Panel>
      <PanelHeader
        title="New staff account"
        icon={<Plus aria-hidden="true" className="size-4" />}
        action={
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X aria-hidden="true" /> Cancel
          </Button>
        }
      />

      <p className="mb-4 text-sm text-ws-muted">
        Self-registration only issues seeker and recruiter accounts. Everything
        else is created here.
      </p>

      <form className="flex flex-col gap-3" onSubmit={submit}>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Username">
            <Input
              value={form.username}
              onChange={(event) => set("username", event.target.value)}
              required
            />
          </Field>
          <Field label="Email">
            <Input
              type="email"
              value={form.email}
              onChange={(event) => set("email", event.target.value)}
              required
            />
          </Field>
          <Field label="First name">
            <Input
              value={form.firstName ?? ""}
              onChange={(event) => set("firstName", event.target.value)}
            />
          </Field>
          <Field label="Last name">
            <Input
              value={form.lastName ?? ""}
              onChange={(event) => set("lastName", event.target.value)}
            />
          </Field>
          <Field label="Temporary password">
            <Input
              type="password"
              value={form.password}
              onChange={(event) => set("password", event.target.value)}
              required
              minLength={8}
            />
          </Field>
        </div>

        <label className="flex items-center gap-2 text-sm text-ws-muted">
          <input
            type="checkbox"
            checked={form.temporaryPassword ?? false}
            onChange={(event) => set("temporaryPassword", event.target.checked)}
          />
          Require a password change at first sign-in
        </label>

        <fieldset>
          <legend className="mb-2 text-xs font-semibold text-ws-muted">
            Roles
          </legend>
          <div className="flex flex-wrap gap-1.5">
            {ASSIGNABLE_ROLES.map((role) => (
              <RoleToggle
                key={role}
                role={role}
                selected={form.roles.includes(role)}
                onToggle={() => toggleRole(role)}
              />
            ))}
          </div>
        </fieldset>

        <div className="mt-1 flex gap-2">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Creating…" : "Create account"}
          </Button>
        </div>
      </form>
    </Panel>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-ws-muted">{label}</span>
      {children}
    </label>
  );
}
