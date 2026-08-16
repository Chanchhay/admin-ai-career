"use client";

import { Search, Download, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export type RoleFilter = "all" | "Admin" | "Recruiter" | "Job Seeker" | "Moderator";
export type StatusFilter = "all" | "Verified" | "Pending" | "Unverified";

interface UserDirectoryFiltersProps {
  searchQuery: string;
  selectedRole: RoleFilter;
  selectedStatus: StatusFilter;
  onSearchChange: (query: string) => void;
  onRoleChange: (role: RoleFilter) => void;
  onStatusChange: (status: StatusFilter) => void;
  onExport?: () => void;
}

const roles: { label: string; value: RoleFilter }[] = [
  { label: "All Roles", value: "all" },
  { label: "Admin", value: "Admin" },
  { label: "Recruiter", value: "Recruiter" },
  { label: "Job Seeker", value: "Job Seeker" },
  { label: "Moderator", value: "Moderator" },
];

const statuses: { label: string; value: StatusFilter }[] = [
  { label: "All Statuses", value: "all" },
  { label: "Verified", value: "Verified" },
  { label: "Pending", value: "Pending" },
  { label: "Unverified", value: "Unverified" },
];

export function UserDirectoryFilters({
  searchQuery,
  selectedRole,
  selectedStatus,
  onSearchChange,
  onRoleChange,
  onStatusChange,
  onExport,
}: UserDirectoryFiltersProps) {
  return (
    <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900/50">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, email or ID..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-2 text-sm placeholder-gray-500 transition-colors focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:border-green-400 dark:focus:ring-green-400"
        />
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Role Filter */}
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase text-gray-600 dark:text-gray-400">
            Role
          </label>
          <select
            value={selectedRole}
            onChange={(e) => onRoleChange(e.target.value as RoleFilter)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm transition-colors focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-green-400 dark:focus:ring-green-400"
          >
            {roles.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase text-gray-600 dark:text-gray-400">
            Status
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value as StatusFilter)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm transition-colors focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-green-400 dark:focus:ring-green-400"
          >
            {statuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 sm:col-span-2 lg:col-span-2">
          <button
            onClick={onExport}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
          <button className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
            <Settings className="h-4 w-4" />
            More
          </button>
        </div>
      </div>
    </div>
  );
}
