import type { ApiError } from "@/types/api";

type FetchBaseQueryErrorLike = { status: number | string; data?: unknown };

function isFetchBaseQueryErrorLike(
  error: unknown,
): error is FetchBaseQueryErrorLike {
  return typeof error === "object" && error !== null && "status" in error;
}

export function isApiError(error: unknown): error is ApiError {
  if (typeof error !== "object" || error === null) return false;
  const candidate = error as Record<string, unknown>;
  return (
    typeof candidate.message === "string" &&
    typeof candidate.status === "number"
  );
}

export function toApiError(error: unknown): ApiError {
  if (isFetchBaseQueryErrorLike(error) && isApiError(error.data)) {
    return error.data;
  }
  if (isApiError(error)) {
    return error;
  }
  return { message: "Something went wrong. Please try again.", status: 500 };
}