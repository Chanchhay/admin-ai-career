"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}: PaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const pages = [];
  const maxPages = 7;

  if (totalPages <= maxPages) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push(-1); // ellipsis
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (!pages.includes(i)) pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push(-1); // ellipsis
    pages.push(totalPages);
  }

  return (
    <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4 dark:border-gray-800">
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Showing {startItem} to {endItem} of {totalItems.toLocaleString()} results
      </p>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={cn(
            "rounded-lg p-2 transition-colors",
            currentPage === 1
              ? "cursor-not-allowed text-gray-400 dark:text-gray-600"
              : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          )}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-1">
          {pages.map((page, idx) => {
            if (page === -1) {
              return (
                <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">
                  ...
                </span>
              );
            }

            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={cn(
                  "h-8 w-8 rounded-lg text-sm font-medium transition-colors",
                  page === currentPage
                    ? "bg-green-600 text-white dark:bg-green-700"
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                )}
              >
                {page}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={cn(
            "rounded-lg p-2 transition-colors",
            currentPage === totalPages
              ? "cursor-not-allowed text-gray-400 dark:text-gray-600"
              : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          )}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
