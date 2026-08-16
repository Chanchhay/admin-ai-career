"use client";

import { useState } from "react";
import { Shield } from "lucide-react";
import { DashboardStats } from "@/components/admin/dashboard/DashboardStats";
import { UserDirectoryTable, type UserDirectoryRow } from "@/components/admin/dashboard/UserDirectoryTable";
import { UserDirectoryFilters, type RoleFilter, type StatusFilter } from "@/components/admin/dashboard/UserDirectoryFilters";
import { Pagination } from "@/components/admin/dashboard/Pagination";
import { useSetPageHeading } from "@/components/layout/PageHeader";

const MOCK_ADMINS: UserDirectoryRow[] = [
  {
    id: 1,
    name: "Jane Doe",
    email: "jane.doe@example.com",
    role: "Admin",
    verification: "Verified",
    joinedDate: "Oct 12, 2023",
    isActive: true,
  },
  {
    id: 2,
    name: "Robert Smith",
    email: "robert.smith@example.com",
    role: "Admin",
    verification: "Verified",
    joinedDate: "Nov 01, 2023",
    isActive: true,
  },
];

export default function AdminsPage() {
  useSetPageHeading("Administrators");

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<RoleFilter>("all");
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>("all");

  const itemsPerPage = 10;

  let filteredUsers = MOCK_ADMINS;

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
            label: "Total Admins",
            value: MOCK_ADMINS.length,
            icon: <Shield className="h-5 w-5" />,
            variant: "primary",
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
          console.log(`Admin ${userId} action: ${action}`);
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
