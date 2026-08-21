import { Chip, type Tone } from "@/components/workspace/primitives";
import type {
  ApplicationStatus,
  CandidateApplicationReviewStatus,
  CompanyVerificationStatus,
  EntityStatus,
  InterviewResult,
  InterviewStatus,
  UserRole,
} from "@/contracts";
import { humanizeEnum } from "@/lib/format";

/**
 * One place deciding how a backend status reads. Emphasis comes from tone, not
 * hue: `solid` is a settled positive outcome, `soft` something still moving,
 * `alert` a refusal, `quiet` everything neutral.
 */

const companyTone: Record<CompanyVerificationStatus, Tone> = {
  PENDING_VERIFICATION: "soft",
  APPROVED: "solid",
  REJECTED: "alert",
  SUSPENDED: "alert",
};

const reviewTone: Record<CandidateApplicationReviewStatus, Tone> = {
  PENDING: "soft",
  IN_REVIEW: "soft",
  HUMAN_INTERVIEW_SCHEDULED: "soft",
  DECISION_PENDING: "soft",
  APPROVED: "solid",
  FORWARDED: "solid",
  REJECTED: "alert",
};

const interviewTone: Record<InterviewStatus, Tone> = {
  PREPARING: "quiet",
  READY: "soft",
  PENDING: "soft",
  IN_PROGRESS: "soft",
  COMPLETED: "solid",
  FAILED: "alert",
  CANCELLED: "alert",
};

const resultTone: Record<InterviewResult, Tone> = {
  PASSED: "solid",
  FAILED: "alert",
  NEEDS_REVIEW: "soft",
};

export function CompanyStatusChip({
  status,
}: {
  status: CompanyVerificationStatus;
}) {
  return <Chip tone={companyTone[status]}>{humanizeEnum(status)}</Chip>;
}

export function ReviewStatusChip({
  status,
}: {
  status: CandidateApplicationReviewStatus;
}) {
  return <Chip tone={reviewTone[status]}>{humanizeEnum(status)}</Chip>;
}

export function InterviewStatusChip({ status }: { status: InterviewStatus }) {
  return <Chip tone={interviewTone[status]}>{humanizeEnum(status)}</Chip>;
}

export function ResultChip({ result }: { result: InterviewResult | null }) {
  if (!result) return null;
  return <Chip tone={resultTone[result]}>{humanizeEnum(result)}</Chip>;
}

/** The candidate's own application status, which the console only reports. */
export function ApplicationStatusChip({ status }: { status: ApplicationStatus }) {
  const tone: Tone =
    status === "HIRED"
      ? "solid"
      : status === "REJECTED" || status === "WITHDRAWN"
        ? "alert"
        : "quiet";

  return <Chip tone={tone}>{humanizeEnum(status)}</Chip>;
}

const entityTone: Record<EntityStatus, Tone> = {
  ACTIVE: "solid",
  PENDING: "soft",
  INACTIVE: "quiet",
  SUSPENDED: "alert",
};

/** A user account's own lifecycle status — active, suspended, and so on. */
export function UserStatusChip({ status }: { status: EntityStatus }) {
  return <Chip tone={entityTone[status]}>{humanizeEnum(status)}</Chip>;
}

/** Elevated roles read as `solid`, ordinary account types stay `quiet`. */
export function UserRoleChip({ role }: { role: UserRole }) {
  const tone: Tone =
    role === "SUPER_ADMIN" || role === "ADMIN"
      ? "solid"
      : role === "MODERATOR" || role === "FINANCE"
        ? "soft"
        : "quiet";

  return <Chip tone={tone}>{humanizeEnum(role)}</Chip>;
}
