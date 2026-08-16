"use client";

import { useState } from "react";
import { Building2 } from "lucide-react";
import { DashboardStats } from "@/components/admin/dashboard/DashboardStats";
import { UserDirectoryTable } from "@/components/admin/dashboard/UserDirectoryTable";
import { UserDirectoryFilters, type StatusFilter } from "@/components/admin/dashboard/UserDirectoryFilters";
import { useSetPageHeading } from "@/components/layout/PageHeader";

export default function RecruitersPage() {
  useSetPageHeading("Recruiters");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>("all");

  return <div className="space-y-6">
    <DashboardStats stats={[
      { label: "Total Recruiters", value: 0, icon: <Building2 className="h-5 w-5" />, variant: "primary" },
      { label: "Verified", value: 0, icon: <Building2 className="h-5 w-5" />, variant: "success" },
      { label: "Pending", value: 0, icon: <Building2 className="h-5 w-5" />, variant: "warning" },
    ]} />
    <UserDirectoryFilters searchQuery={searchQuery} selectedRole="Recruiter" selectedStatus={selectedStatus} onSearchChange={setSearchQuery} onRoleChange={() => undefined} onStatusChange={setSelectedStatus} showRoleFilter={false} showActions={false} />
    <UserDirectoryTable users={[]} showActions={false} />
  </div>;
}
