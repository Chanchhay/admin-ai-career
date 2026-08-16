"use client";

import { BarChart3, TrendingUp, DollarSign, CreditCard } from "lucide-react";
import { DashboardStats } from "@/components/admin/dashboard/DashboardStats";
import { useSetPageHeading } from "@/components/layout/PageHeader";

export default function FinancePage() {
  useSetPageHeading("Finance");

  return (
    <div className="space-y-6">
      <DashboardStats
        stats={[
          {
            label: "Total Revenue",
            value: 125400,
            trend: 14.2,
            trendLabel: "this month",
            icon: <DollarSign className="h-5 w-5" />,
            variant: "success",
          },
          {
            label: "Active Subscriptions",
            value: 342,
            trend: 8.1,
            trendLabel: "this month",
            icon: <CreditCard className="h-5 w-5" />,
            variant: "primary",
          },
          {
            label: "Pending Payments",
            value: 18,
            trend: -5.2,
            trendLabel: "since last week",
            icon: <TrendingUp className="h-5 w-5" />,
            variant: "warning",
          },
          {
            label: "Refunds",
            value: 2,
            trend: -3.0,
            trendLabel: "this month",
            icon: <BarChart3 className="h-5 w-5" />,
            variant: "error",
          },
        ]}
      />

      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Revenue Over Time</h3>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Finance reporting and analytics coming soon...
        </p>
      </div>
    </div>
  );
}
