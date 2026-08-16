"use client";

import { useState } from "react";
import { Briefcase } from "lucide-react";
import { DashboardStats } from "@/components/admin/dashboard/DashboardStats";
import { UserDirectoryTable, type UserDirectoryRow } from "@/components/admin/dashboard/UserDirectoryTable";
import { UserDirectoryFilters, type RoleFilter, type StatusFilter } from "@/components/admin/dashboard/UserDirectoryFilters";
import { Pagination } from "@/components/admin/dashboard/Pagination";
import { useSetPageHeading } from "@/components/layout/PageHeader";

const MOCK_JOB_SEEKERS: UserDirectoryRow[] = [
  {
    id: 3,
    name: "Leo Liang",
    email: "leo.liang@cloudsys.net",
    role: "Job Seeker",
    verification: "Verified",
    joinedDate: "Jan 15, 2024",
    isActive: true,
  },
  {
    id: 5,
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    role: "Job Seeker",
    verification: "Verified",
    joinedDate: "Mar 10, 2024",
    isActive: true,
  },
  {
    id: 9,
    name: "Jessica Martinez",
    email: "jessica.martinez@example.com",
    role: "Job Seeker",
    verification: "Verified",
    joinedDate: "Jun 01, 2024",
    isActive: true,
  },
  {
    id: 10,
    name: "Chris Thompson",
    email: "chris.thompson@example.com",
    role: "Job Seeker",
    verification: "Pending",
    joinedDate: "Jun 15, 2024",
    isActive: false,
  },
];

export default function JobSeekersPage() {
  useSetPageHeading("Job Seekers");

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<RoleFilter>("all");
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>("all");

  const itemsPerPage = 10;

  let filteredUsers = MOCK_JOB_SEEKERS;

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

  const activeCount = MOCK_JOB_SEEKERS.filter((u) => u.isActive).length;
  const verifiedCount = MOCK_JOB_SEEKERS.filter((u) => u.verification === "Verified").length;

  return (
    <div className="space-y-6">
      <DashboardStats
        stats={[
          {
            label: "Total Job Seekers",
            value: MOCK_JOB_SEEKERS.length,
            icon: <Briefcase className="h-5 w-5" />,
            variant: "primary",
          },
          {
            label: "Active",
            value: activeCount,
            icon: <Briefcase className="h-5 w-5" />,
            variant: "success",
          },
          {
            label: "Verified",
            value: verifiedCount,
            icon: <Briefcase className="h-5 w-5" />,
            variant: "success",
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
          console.log(`Job Seeker ${userId} action: ${action}`);
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
