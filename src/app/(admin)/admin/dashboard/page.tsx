"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Clock } from "lucide-react";
import { DashboardStats } from "@/components/admin/dashboard/DashboardStats";
import { AdminWorkspace } from "@/components/admin/workspace/AdminWorkspace";
import { useSetPageHeading } from "@/components/layout/PageHeader";
import {
  useApproveCompanyMutation,
  useGetModeratorCompaniesQuery,
  useRejectCompanyMutation,
} from "@/services/adminApi";
import type { CompanyVerificationStatus } from "@/contracts/api/common";

export default function AdminDashboardPage() {
  useSetPageHeading("Dashboard");
  const [status, setStatus] = useState<CompanyVerificationStatus>("PENDING_VERIFICATION");
  const { data, isLoading, isError, refetch } = useGetModeratorCompaniesQuery({
    status,
    page: 0,
    size: 12,
  });
  const [approveCompany, { isLoading: isApproving }] = useApproveCompanyMutation();
  const [rejectCompany, { isLoading: isRejecting }] = useRejectCompanyMutation();
  const companies = data?.content ?? [];
  const totalCount = data?.totalElements ?? 0;

  const handleCompany = async (companyId: number, action: "approve" | "reject") => {
    try {
      if (action === "approve") {
        await approveCompany(companyId).unwrap();
        toast.success("Company approved.");
      } else {
        await rejectCompany(companyId).unwrap();
        toast.success("Company rejected.");
      }
    } catch {
      toast.error("Unable to update verification status.");
    }
  };

  return <div className="space-y-8">
    <DashboardStats stats={[{
      label: "Companies Pending Review",
      value: totalCount,
      icon: <Clock className="h-5 w-5" />,
      variant: "warning",
    }]} />
    <div className="border-t border-gray-200 pt-8 dark:border-gray-800">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Company Verification Reviews</h2>
      <AdminWorkspace
        companies={companies}
        totalCount={totalCount}
        status={status}
        isLoading={isLoading}
        isError={isError}
        onStatusChange={setStatus}
        onRefresh={() => void refetch()}
        onApprove={(companyId) => void handleCompany(companyId, "approve")}
        onReject={(companyId) => void handleCompany(companyId, "reject")}
        isApproving={isApproving}
        isRejecting={isRejecting}
      />
    </div>
  </div>;
}
