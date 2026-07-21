import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type JobStatus =
  | "DRAFT"
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "PUBLISHED"
  | "PAUSED"
  | "CLOSED"
  | "EXPIRED";

type ApplicationStatus =
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "AI_INTERVIEW_REQUIRED"
  | "AI_INTERVIEW_IN_PROGRESS"
  | "AI_INTERVIEW_FAILED"
  | "MODERATOR_REVIEW_PENDING"
  | "AI_INTERVIEW_PASSED"
  | "SHORTLISTED"
  | "HUMAN_INTERVIEW_SCHEDULED"
  | "HIRED"
  | "REJECTED"
  | "WITHDRAWN";

type CompanyStatus =
  | "PENDING_VERIFICATION"
  | "APPROVED"
  | "REJECTED"
  | "SUSPENDED";

type PublicationStatus = "PUBLIC" | "PRIVATE" | "HIDDEN";

type InterviewStatus =
  | "PREPARING"
  | "READY"
  | "PENDING"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "FAILED"
  | "CANCELLED";

type EntityStatus = "ACTIVE" | "INACTIVE" | "PENDING" | "SUSPENDED";

export type StatusBadgeValue =
  | JobStatus
  | ApplicationStatus
  | CompanyStatus
  | PublicationStatus
  | InterviewStatus
  | EntityStatus;

const toneByStatus: Record<StatusBadgeValue, string> = {
  ACTIVE: "bg-success/10 text-success border-success/20",
  AI_INTERVIEW_FAILED: "bg-error/10 text-error border-error/20",
  AI_INTERVIEW_IN_PROGRESS: "bg-info/10 text-info border-info/20",
  AI_INTERVIEW_PASSED: "bg-success/10 text-success border-success/20",
  AI_INTERVIEW_REQUIRED: "bg-warning/20 text-heading border-warning/40",
  APPROVED: "bg-success/10 text-success border-success/20",
  CANCELLED: "bg-surface-muted text-body border-border",
  CLOSED: "bg-surface-muted text-body border-border",
  COMPLETED: "bg-success/10 text-success border-success/20",
  DRAFT: "bg-surface-muted text-body border-border",
  EXPIRED: "bg-surface-muted text-body border-border",
  FAILED: "bg-error/10 text-error border-error/20",
  HIDDEN: "bg-surface-muted text-body border-border",
  HIRED: "bg-success/10 text-success border-success/20",
  HUMAN_INTERVIEW_SCHEDULED: "bg-info/10 text-info border-info/20",
  INACTIVE: "bg-surface-muted text-body border-border",
  IN_PROGRESS: "bg-info/10 text-info border-info/20",
  MODERATOR_REVIEW_PENDING: "bg-warning/20 text-heading border-warning/40",
  PAUSED: "bg-warning/20 text-heading border-warning/40",
  PENDING: "bg-warning/20 text-heading border-warning/40",
  PENDING_VERIFICATION: "bg-warning/20 text-heading border-warning/40",
  PREPARING: "bg-info/10 text-info border-info/20",
  PRIVATE: "bg-surface-muted text-body border-border",
  PUBLIC: "bg-success/10 text-success border-success/20",
  PUBLISHED: "bg-success/10 text-success border-success/20",
  READY: "bg-success/10 text-success border-success/20",
  REJECTED: "bg-error/10 text-error border-error/20",
  SHORTLISTED: "bg-info/10 text-info border-info/20",
  SUBMITTED: "bg-info/10 text-info border-info/20",
  SUSPENDED: "bg-error/10 text-error border-error/20",
  UNDER_REVIEW: "bg-warning/20 text-heading border-warning/40",
  WITHDRAWN: "bg-surface-muted text-body border-border",
};

export function StatusBadge({
  status,
  className,
}: {
  status: StatusBadgeValue;
  className?: string;
}) {
  return (
    <Badge
      variant="outline"
      className={cn("h-6 rounded-full px-2.5 capitalize", toneByStatus[status], className)}
    >
      {status.toLowerCase().replaceAll("_", " ")}
    </Badge>
  );
}
