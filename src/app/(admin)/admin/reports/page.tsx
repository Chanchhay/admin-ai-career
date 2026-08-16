"use client";

import { FileText, Download } from "lucide-react";
import { useSetPageHeading } from "@/components/layout/PageHeader";

export default function ReportsPage() {
  useSetPageHeading("Reports");

  const reports = [
    {
      id: 1,
      title: "Monthly Activity Report",
      description: "Comprehensive platform activity metrics",
      generatedDate: "Jun 01, 2024",
      size: "2.4 MB",
    },
    {
      id: 2,
      title: "User Growth Analysis",
      description: "User acquisition and retention metrics",
      generatedDate: "May 28, 2024",
      size: "1.8 MB",
    },
    {
      id: 3,
      title: "Revenue Report",
      description: "Detailed revenue and transaction analysis",
      generatedDate: "May 25, 2024",
      size: "3.1 MB",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Available Reports</h2>
        <button className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800">
          Generate Report
        </button>
      </div>

      <div className="space-y-3">
        {reports.map((report) => (
          <div
            key={report.id}
            className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800"
          >
            <div className="flex items-start gap-3">
              <FileText className="mt-1 h-5 w-5 text-gray-400" />
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">{report.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{report.description}</p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                  {report.generatedDate} • {report.size}
                </p>
              </div>
            </div>
            <button className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800">
              <Download className="h-5 w-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
