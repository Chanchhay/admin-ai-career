"use client";

import { useState } from "react";
import { Shield } from "lucide-react";
import { DashboardStats } from "@/components/admin/dashboard/DashboardStats";
import { UserDirectoryTable } from "@/components/admin/dashboard/UserDirectoryTable";
import { UserDirectoryFilters, type StatusFilter } from "@/components/admin/dashboard/UserDirectoryFilters";
import { useSetPageHeading } from "@/components/layout/PageHeader";

export default function AdminsPage() {
  useSetPageHeading("Administrators");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>("all");

  return <div className="space-y-6">
    <DashboardStats stats={[{ label: "Total Admins", value: 0, icon: <Shield className="h-5 w-5" />, variant: "primary" }]} />
    <UserDirectoryFilters searchQuery={searchQuery} selectedRole="Admin" selectedStatus={selectedStatus} onSearchChange={setSearchQuery} onRoleChange={() => undefined} onStatusChange={setSelectedStatus} showRoleFilter={false} showActions={false} />
    <UserDirectoryTable users={[]} showActions={false} />
  </div>;
}
