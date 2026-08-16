"use client";

import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { DashboardStats } from "@/components/admin/dashboard/DashboardStats";
import { UserDirectoryTable } from "@/components/admin/dashboard/UserDirectoryTable";
import { UserDirectoryFilters, type StatusFilter } from "@/components/admin/dashboard/UserDirectoryFilters";
import { useSetPageHeading } from "@/components/layout/PageHeader";

export default function ModeratorsPage() {
  useSetPageHeading("Moderators");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>("all");

  return <div className="space-y-6">
    <DashboardStats stats={[{ label: "Total Moderators", value: 0, icon: <ShieldCheck className="h-5 w-5" />, variant: "warning" }]} />
    <UserDirectoryFilters searchQuery={searchQuery} selectedRole="Moderator" selectedStatus={selectedStatus} onSearchChange={setSearchQuery} onRoleChange={() => undefined} onStatusChange={setSelectedStatus} showRoleFilter={false} showActions={false} />
    <UserDirectoryTable users={[]} showActions={false} />
  </div>;
}
