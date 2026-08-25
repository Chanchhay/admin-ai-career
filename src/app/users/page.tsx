"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronRight, Plus, Search, UserRound, X } from "lucide-react";
import { toast } from "sonner";
import { Pager } from "@/components/console/Pager";
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

export default function UsersPage() {
  useSetPageHeading("Users");

  const [roleTab, setRoleTab] = useState<RoleTab>("All");
  const [statusTab, setStatusTab] = useState<StatusTab>("Any status");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [creating, setCreating] = useState(false);

  const { data, isLoading, isError, refetch } = useGetUsersQuery({
    role: tabRole[roleTab],
    status: tabStatus[statusTab],
    search: search || undefined,
    page,
  });

  // Any change of filter is a different result set, not a further page of the
  // current one.
  const reset = <T,>(setter: (value: T) => void) => (value: T) => {
    setter(value);
    setPage(0);
  };

  const users = data?.content ?? [];

  return (
    <div className="flex flex-col gap-5">
      <Panel tone="soft">
        <p className="text-sm leading-6">
          Accounts live in Keycloak; this console changes their roles and
          whether they may sign in. Suspending an account disables the Keycloak
          user and blocks its existing tokens on the next request.
        </p>
      </Panel>

      {creating ? (
        <CreateUserPanel onClose={() => setCreating(false)} />
      ) : null}

      <Panel>
        <PanelHeader
          title="Accounts"
          icon={<UserRound aria-hidden="true" className="size-5" />}
          action={
            creating ? null : (
              <Button size="sm" onClick={() => setCreating(true)}>
                <Plus aria-hidden="true" /> New staff account
              </Button>
            )
          }
        />

        <form
          className="mb-4 flex items-center gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            setSearch(searchInput.trim());
            setPage(0);
          }}
        >
          <div className="relative flex-1">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ws-faint"
            />
            <Input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search by username, email, or name"
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

        <PillTabs
          tabs={ROLE_TABS}
          value={roleTab}
          onChange={reset(setRoleTab)}
          className="mb-2 rounded-full bg-ws-card-hover p-1"
        />
        <PillTabs
          tabs={STATUS_TABS}
          value={statusTab}
          onChange={reset(setStatusTab)}
          className="mb-4 rounded-full bg-ws-card-hover p-1"
        />

        {isLoading ? (
          <LoadingState rows={5} />
        ) : isError ? (
          <ErrorState message="Unable to load users." onRetry={refetch} />
        ) : users.length === 0 ? (
          <p className="rounded-[22px] bg-ws-card-hover px-5 py-8 text-center text-sm text-ws-faint">
            No accounts match these filters.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {users.map((user) => (
              <li key={user.keycloakUserId}>
                <Link
                  href={`/users/${user.keycloakUserId}`}
                  className="flex items-center gap-3 rounded-[18px] bg-ws-card-hover px-4 py-3.5 transition-colors hover:bg-ws-panel"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-ws-fg">
                      {orDash(user.username)}
                    </span>
                    <span className="block truncate text-xs text-ws-faint">
                      {orDash(user.email)}
                    </span>
                  </span>

                  <span className="hidden flex-wrap items-center gap-1.5 sm:flex">
                    <RoleChips roles={user.roles} />
                  </span>
                  <AccountStatusChip status={user.status} />
                  <ChevronRight
                    aria-hidden="true"
                    className="size-4 shrink-0 text-ws-faint"
                  />
                </Link>
              </li>
            ))}
          </ul>
        )}

        {data ? <Pager page={data} onPageChange={setPage} /> : null}
      </Panel>
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
        icon={<Plus aria-hidden="true" className="size-5" />}
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
