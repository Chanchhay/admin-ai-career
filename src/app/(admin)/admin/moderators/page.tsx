"use client";

import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { DashboardStats } from "@/components/admin/dashboard/DashboardStats";
import { UserDirectoryTable, type UserDirectoryRow } from "@/components/admin/dashboard/UserDirectoryTable";
import { UserDirectoryFilters, type RoleFilter, type StatusFilter } from "@/components/admin/dashboard/UserDirectoryFilters";
import { Pagination } from "@/components/admin/dashboard/Pagination";
import { useSetPageHeading } from "@/components/layout/PageHeader";

const MOCK_MODERATORS: UserDirectoryRow[] = [
  {
    id: 4,
    name: "Sarah Chen",
    email: "s.chen@interact.ai",
    role: "Moderator",
    verification: "Verified",
    joinedDate: "Feb 20, 2024",
    isActive: true,
  },
  {
    id: 7,
    name: "Michael Brown",
    email: "michael.brown@example.com",
    role: "Moderator",
    verification: "Verified",
    joinedDate: "Mar 15, 2024",
    isActive: true,
  },
];

export default function ModeratorsPage() {
  useSetPageHeading("Moderators");

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<RoleFilter>("all");
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>("all");

  const itemsPerPage = 10;

  let filteredUsers = MOCK_MODERATORS;

  if (searchQuery) {
    filteredUsers = filteredUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  if (selectedStatus !== "all") {
    filteredUsers = filteredUsers.filter((user) => user.verification === selectedStatus);
  }

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIdx, startIdx + itemsPerPage);

  return (
    <div className="space-y-6">
      <DashboardStats
        stats={[
          {
            label: "Total Moderators",
            value: MOCK_MODERATORS.length,
            icon: <ShieldCheck className="h-5 w-5" />,
            variant: "warning",
          },
        ]}
      />

      <UserDirectoryFilters
        searchQuery={searchQuery}
        selectedRole={selectedRole}
        selectedStatus={selectedStatus}
        onSearchChange={setSearchQuery}
        onRoleChange={setSelectedRole}
        onStatusChange={setSelectedStatus}
      />

      <UserDirectoryTable
        users={paginatedUsers}
        onUserAction={(userId, action) => {
          console.log(`Moderator ${userId} action: ${action}`);
        }}
      />

      {filteredUsers.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredUsers.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
