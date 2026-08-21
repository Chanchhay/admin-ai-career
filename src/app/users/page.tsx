"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronRight, Search, UsersRound } from "lucide-react";
import { NotImplementedNotice } from "@/components/console/NotImplementedNotice";
import { Pager } from "@/components/console/Pager";
import { UserRoleChip, UserStatusChip } from "@/components/console/StatusChip";
import { useSetPageHeading } from "@/components/layout/PageHeader";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { Input } from "@/components/ui/input";
import { Panel, PanelHeader, PillTabs } from "@/components/workspace/primitives";
import type { EntityStatus } from "@/contracts";
import { formatDate, orDash } from "@/lib/format";
import { useGetAdminUsersQuery } from "@/services/adminApi";

const TABS = ["All", "Active", "Pending", "Suspended", "Inactive"] as const;
type Tab = (typeof TABS)[number];

const tabStatus: Record<Tab, EntityStatus | undefined> = {
  All: undefined,
  Active: "ACTIVE",
  Pending: "PENDING",
  Suspended: "SUSPENDED",
  Inactive: "INACTIVE",
};

export default function UsersPage() {
  useSetPageHeading("Users", "Every account on the platform, and the role and status each holds.");

  const [tab, setTab] = useState<Tab>("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  const { data, isLoading, isError, refetch } = useGetAdminUsersQuery({
    status: tabStatus[tab],
    search,
    page,
  });

  const selectTab = (next: Tab) => {
    setTab(next);
    setPage(0);
  };

  const users = data?.content ?? [];

  return (
    <div className="flex flex-col gap-5">
      <NotImplementedNotice endpoint="GET /api/v1/admin/users" />

      <Panel>
        <PanelHeader
          title="Accounts"
          icon={<UsersRound aria-hidden="true" className="size-5" />}
        />

        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <PillTabs
            tabs={TABS}
            value={tab}
            onChange={selectTab}
            className="rounded-full bg-ws-card-hover p-1"
          />

          <label className="relative w-full sm:w-64">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ws-faint"
            />
            <Input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(0);
              }}
              placeholder="Search name, username, email…"
              className="h-10 pl-9"
            />
          </label>
        </div>

        {isLoading ? (
          <LoadingState rows={6} />
        ) : isError ? (
          <ErrorState message="Unable to load users." onRetry={refetch} />
        ) : users.length === 0 ? (
          <p className="rounded-[22px] bg-ws-card-hover px-5 py-8 text-center text-sm text-ws-faint">
            No {tab === "All" ? "" : tab.toLowerCase() + " "}accounts found.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {users.map((user) => (
              <li key={user.id}>
                <Link
                  href={`/users/${user.id}`}
                  className="flex items-center gap-3 rounded-[18px] bg-ws-card-hover px-4 py-3.5 transition-colors hover:bg-ws-panel"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-ws-fg">
                      {orDash(user.fullName) || user.username}
                    </span>
                    <span className="block truncate text-xs text-ws-faint">
                      {user.email} · Joined {formatDate(user.createdAt)}
                    </span>
                  </span>

                  <span className="hidden items-center gap-1.5 sm:flex">
                    {user.roles.map((role) => (
                      <UserRoleChip key={role} role={role} />
                    ))}
                  </span>
                  <UserStatusChip status={user.status} />
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
