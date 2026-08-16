"use client";

import { MoreVertical, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export type UserRole = "Admin" | "Recruiter" | "Job Seeker" | "Moderator";
export type VerificationStatus = "Verified" | "Pending" | "Unverified";

export type UserDirectoryRow = {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  verification: VerificationStatus;
  joinedDate: string;
  isActive?: boolean;
};

const roleColorMap: Record<UserRole, string> = {
  Admin: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  Recruiter: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  "Job Seeker": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  Moderator: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
};

const verificationIcons: Record<VerificationStatus, React.ReactNode> = {
  Verified: <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />,
  Pending: <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />,
  Unverified: <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />,
};

const verificationLabels: Record<VerificationStatus, string> = {
  Verified: "Verified",
  Pending: "Pending",
  Unverified: "Unverified",
};

interface UserDirectoryTableProps {
  users: UserDirectoryRow[];
  isLoading?: boolean;
  onUserAction?: (userId: number, action: string) => void;
  showActions?: boolean;
}

export function UserDirectoryTable({
  users,
  isLoading = false,
  onUserAction,
  showActions = true,
}: UserDirectoryTableProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-600 dark:text-gray-400">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
      <table className="w-full">
        <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              Profile
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              Role
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              Verification
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              Joined Date
            </th>
            {showActions ? <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              Actions
            </th> : null}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
          {users.map((user) => (
            <tr
              key={user.id}
              className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-900/50"
            >
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-purple-600 text-sm font-semibold text-white">
                      {getInitials(user.name)}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {user.name}
                    </p>
                    {user.isActive !== undefined && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {user.isActive ? "Active" : "Inactive"}
                      </p>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                {user.email}
              </td>
              <td className="px-6 py-4">
                <span
                  className={cn(
                    "inline-flex rounded-full px-3 py-1 text-xs font-medium",
                    roleColorMap[user.role]
                  )}
                >
                  {user.role}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  {verificationIcons[user.verification]}
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {verificationLabels[user.verification]}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                {user.joinedDate}
              </td>
              {showActions ? <td className="px-6 py-4 text-right">
                <button
                  onClick={() => onUserAction?.(user.id, "menu")}
                  className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                  aria-label="More actions"
                >
                  <MoreVertical className="h-4 w-4" />
                </button>
              </td> : null}
            </tr>
          ))}
        </tbody>
      </table>
      {users.length === 0 && (
        <div className="flex items-center justify-center py-12">
          <p className="text-gray-600 dark:text-gray-400">No users found</p>
        </div>
      )}
    </div>
  );
}
