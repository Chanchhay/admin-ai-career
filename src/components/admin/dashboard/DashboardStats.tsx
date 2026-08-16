"use client";

import { TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

type StatCard = {
  label: string;
  value: number;
  trend?: number;
  trendLabel?: string;
  icon: React.ReactNode;
  variant: "primary" | "success" | "warning" | "error";
};

const variantStyles: Record<
  string,
  { bg: string; iconBg: string; icon: string; text: string }
> = {
  primary: {
    bg: "bg-blue-50 dark:bg-blue-950",
    iconBg: "bg-blue-100 dark:bg-blue-900",
    icon: "text-blue-600 dark:text-blue-400",
    text: "text-blue-600 dark:text-blue-400",
  },
  success: {
    bg: "bg-emerald-50 dark:bg-emerald-950",
    iconBg: "bg-emerald-100 dark:bg-emerald-900",
    icon: "text-emerald-600 dark:text-emerald-400",
    text: "text-emerald-600 dark:text-emerald-400",
  },
  warning: {
    bg: "bg-amber-50 dark:bg-amber-950",
    iconBg: "bg-amber-100 dark:bg-amber-900",
    icon: "text-amber-600 dark:text-amber-400",
    text: "text-amber-600 dark:text-amber-400",
  },
  error: {
    bg: "bg-red-50 dark:bg-red-950",
    iconBg: "bg-red-100 dark:bg-red-900",
    icon: "text-red-600 dark:text-red-400",
    text: "text-red-600 dark:text-red-400",
  },
};

interface DashboardStatsProps {
  stats: StatCard[];
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const styles = variantStyles[stat.variant];
        return (
          <div
            key={stat.label}
            className={cn(
              "rounded-xl border border-gray-200 p-6 dark:border-gray-800",
              styles.bg
            )}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.label}
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                  {stat.value.toLocaleString()}
                </p>
                {stat.trend !== undefined && (
                  <div className={cn("mt-2 flex items-center gap-1 text-sm font-medium", styles.text)}>
                    <TrendingUp className="h-4 w-4" />
                    <span>
                      {stat.trend > 0 ? "+" : ""}
                      {stat.trend}% {stat.trendLabel || "this month"}
                    </span>
                  </div>
                )}
              </div>
              <div className={cn("rounded-lg p-3", styles.iconBg)}>
                <div className={cn("h-6 w-6", styles.icon)}>{stat.icon}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
