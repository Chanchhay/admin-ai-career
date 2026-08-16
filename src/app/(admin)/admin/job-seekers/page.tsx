"use client";

import { useState } from "react";
import { Briefcase } from "lucide-react";
import { DashboardStats } from "@/components/admin/dashboard/DashboardStats";
import { UserDirectoryTable } from "@/components/admin/dashboard/UserDirectoryTable";
import { UserDirectoryFilters, type StatusFilter } from "@/components/admin/dashboard/UserDirectoryFilters";
import { useSetPageHeading } from "@/components/layout/PageHeader";

export default function JobSeekersPage() {
  useSetPageHeading("Job Seekers");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>("all");

  return <div className="space-y-6">
    <DashboardStats stats={[
      { label: "Total Job Seekers", value: 0, icon: <Briefcase className="h-5 w-5" />, variant: "primary" },
      { label: "Active", value: 0, icon: <Briefcase className="h-5 w-5" />, variant: "success" },
      { label: "Verified", value: 0, icon: <Briefcase className="h-5 w-5" />, variant: "success" },
    ]} />
    <UserDirectoryFilters searchQuery={searchQuery} selectedRole="Job Seeker" selectedStatus={selectedStatus} onSearchChange={setSearchQuery} onRoleChange={() => undefined} onStatusChange={setSelectedStatus} showRoleFilter={false} showActions={false} />
    <UserDirectoryTable users={[]} showActions={false} />
  </div>;
}
