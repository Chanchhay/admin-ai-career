"use client";

import { useState } from "react";
import { Building2 } from "lucide-react";
import { DashboardStats } from "@/components/admin/dashboard/DashboardStats";
import { UserDirectoryTable, type UserDirectoryRow } from "@/components/admin/dashboard/UserDirectoryTable";
import { UserDirectoryFilters, type RoleFilter, type StatusFilter } from "@/components/admin/dashboard/UserDirectoryFilters";
import { Pagination } from "@/components/admin/dashboard/Pagination";
import { useSetPageHeading } from "@/components/layout/PageHeader";

const MOCK_RECRUITERS: UserDirectoryRow[] = [
  {
    id: 2,
    name: "Marcus Sterling",
    email: "m.sterling@talent-hub.com",
    role: "Recruiter",
    verification: "Verified",
    joinedDate: "Nov 03, 2023",
    isActive: true,
  },
  {
    id: 6,
    name: "Emma Wilson",
    email: "emma.wilson@techcorp.com",
    role: "Recruiter",
    verification: "Verified",
    joinedDate: "Apr 05, 2024",
    isActive: true,
  },
  {
    id: 8,
    name: "David Lee",
    email: "david.lee@startupco.com",
    role: "Recruiter",
    verification: "Pending",
    joinedDate: "May 20, 2024",
    isActive: true,
  },
];

export default function RecruitersPage() {
  useSetPageHeading("Recruiters");

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<RoleFilter>("all");
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>("all");

  const itemsPerPage = 10;

  let filteredUsers = MOCK_RECRUITERS;

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

  const verifiedCount = MOCK_RECRUITERS.filter((u) => u.verification === "Verified").length;
  const pendingCount = MOCK_RECRUITERS.filter((u) => u.verification === "Pending").length;

  return (
    <div className="space-y-6">
      <DashboardStats
        stats={[
          {
            label: "Total Recruiters",
            value: MOCK_RECRUITERS.length,
            icon: <Building2 className="h-5 w-5" />,
            variant: "primary",
          },
          {
            label: "Verified",
            value: verifiedCount,
            icon: <Building2 className="h-5 w-5" />,
            variant: "success",
          },
          {
            label: "Pending",
            value: pendingCount,
            icon: <Building2 className="h-5 w-5" />,
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
          console.log(`Recruiter ${userId} action: ${action}`);
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
