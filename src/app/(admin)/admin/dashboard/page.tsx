"use client";

import { useState } from "react";
import { toast } from "sonner";
import { AdminWorkspace } from "@/components/admin/workspace/AdminWorkspace";
import {
  useApproveCompanyMutation,
  useGetModeratorCompaniesQuery,
  useRejectCompanyMutation,
} from "@/services/adminApi";
import type { CompanyVerificationStatus } from "@/contracts/api/common";

export default function AdminDashboardPage() {
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
      await refetch();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to update verification status.";
      toast.error(message);
    }
  };

  return (
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
  );
}
