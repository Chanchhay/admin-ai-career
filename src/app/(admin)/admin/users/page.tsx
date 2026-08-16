"use client";

import { useState } from "react";
import { AlertCircle, Clock, UserCheck, UsersRound } from "lucide-react";
import { DashboardStats } from "@/components/admin/dashboard/DashboardStats";
import { UserDirectoryTable } from "@/components/admin/dashboard/UserDirectoryTable";
import { UserDirectoryFilters, type RoleFilter, type StatusFilter } from "@/components/admin/dashboard/UserDirectoryFilters";
import { useSetPageHeading } from "@/components/layout/PageHeader";

export default function UsersPage() {
  useSetPageHeading("User Directory");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<RoleFilter>("all");
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>("all");

  return <div className="space-y-6">
    <DashboardStats stats={[
      { label: "Total Users", value: 0, icon: <UsersRound className="h-5 w-5" />, variant: "primary" },
      { label: "Active", value: 0, icon: <UserCheck className="h-5 w-5" />, variant: "success" },
      { label: "Pending", value: 0, icon: <Clock className="h-5 w-5" />, variant: "warning" },
      { label: "Unverified", value: 0, icon: <AlertCircle className="h-5 w-5" />, variant: "error" },
    ]} />
    <UserDirectoryFilters searchQuery={searchQuery} selectedRole={selectedRole} selectedStatus={selectedStatus} onSearchChange={setSearchQuery} onRoleChange={setSelectedRole} onStatusChange={setSelectedStatus} showActions={false} />
    <UserDirectoryTable users={[]} showActions={false} />
  </div>;
}
