"use client";

import { useState } from "react";
import {
  UsersRound,
  UserCheck,
  Clock,
  AlertCircle,
} from "lucide-react";
import { DashboardStats } from "@/components/admin/dashboard/DashboardStats";
import { UserDirectoryTable, type UserDirectoryRow } from "@/components/admin/dashboard/UserDirectoryTable";
import { UserDirectoryFilters, type RoleFilter, type StatusFilter } from "@/components/admin/dashboard/UserDirectoryFilters";
import { Pagination } from "@/components/admin/dashboard/Pagination";
import { useSetPageHeading } from "@/components/layout/PageHeader";

// Mock data - in a real app, this would come from an API
const MOCK_USERS: UserDirectoryRow[] = [
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
    name: "Marcus Sterling",
    email: "m.sterling@talent-hub.com",
    role: "Recruiter",
    verification: "Pending",
    joinedDate: "Nov 03, 2023",
    isActive: true,
  },
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
    id: 4,
    name: "Sarah Chen",
    email: "s.chen@interact.ai",
    role: "Moderator",
    verification: "Unverified",
    joinedDate: "Feb 20, 2024",
    isActive: false,
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
    id: 6,
    name: "Emma Wilson",
    email: "emma.wilson@techcorp.com",
    role: "Recruiter",
    verification: "Verified",
    joinedDate: "Apr 05, 2024",
    isActive: true,
  },
];

export default function UsersPage() {
  useSetPageHeading("User Directory");

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<RoleFilter>("all");
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>("all");

  const itemsPerPage = 10;

  // Filter users
  let filteredUsers = MOCK_USERS;

  if (searchQuery) {
    filteredUsers = filteredUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  if (selectedRole !== "all") {
    filteredUsers = filteredUsers.filter((user) => user.role === selectedRole);
  }

  if (selectedStatus !== "all") {
    filteredUsers = filteredUsers.filter((user) => user.verification === selectedStatus);
  }

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIdx, startIdx + itemsPerPage);

  // Statistics
  const totalUsers = MOCK_USERS.length;
  const activeUsers = MOCK_USERS.filter((u) => u.isActive).length;
  const pendingVerification = MOCK_USERS.filter((u) => u.verification === "Pending").length;
  const unverified = MOCK_USERS.filter((u) => u.verification === "Unverified").length;

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log("Exporting users data...");
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <DashboardStats
        stats={[
          {
            label: "Total Users",
            value: totalUsers,
            trend: 12.4,
            trendLabel: "this month",
            icon: <UsersRound className="h-5 w-5" />,
            variant: "primary",
          },
          {
            label: "Active",
            value: activeUsers,
            trend: 7.2,
            trendLabel: "activity rate",
            icon: <UserCheck className="h-5 w-5" />,
            variant: "success",
          },
          {
            label: "Pending",
            value: pendingVerification,
            trend: -2.1,
            trendLabel: "since last week",
            icon: <Clock className="h-5 w-5" />,
            variant: "warning",
          },
          {
            label: "Unverified",
            value: unverified,
            trend: 3.5,
            trendLabel: "since last week",
            icon: <AlertCircle className="h-5 w-5" />,
            variant: "error",
          },
        ]}
      />

      {/* Filters */}
      <UserDirectoryFilters
        searchQuery={searchQuery}
        selectedRole={selectedRole}
        selectedStatus={selectedStatus}
        onSearchChange={setSearchQuery}
        onRoleChange={setSelectedRole}
        onStatusChange={setSelectedStatus}
        onExport={handleExport}
      />

      {/* Users Table */}
      <UserDirectoryTable
        users={paginatedUsers}
        onUserAction={(userId, action) => {
          console.log(`User ${userId} action: ${action}`);
        }}
      />

      {/* Pagination */}
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
