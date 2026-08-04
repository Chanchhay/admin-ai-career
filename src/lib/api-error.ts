import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

/**
 * Pulls the readable message out of a failed request. The backend answers with
 * `ApiResponse.message`, but validation failures can arrive as a field map, so
 * both shapes are unpacked before falling back to a generic string.
 */
export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (typeof error === "object" && error !== null && "data" in error) {
    const { data } = error as FetchBaseQueryError & { data?: unknown };

    if (typeof data === "string" && data.trim()) return data;

    if (typeof data === "object" && data !== null) {
      const body = data as Record<string, unknown>;

      if (typeof body.message === "string" && body.message.trim()) {
        return body.message;
      }

      // { errors: { title: "must not be blank", … } }
      if (typeof body.errors === "object" && body.errors !== null) {
        const fieldErrors = Object.entries(body.errors as Record<string, unknown>)
          .filter(([, message]) => typeof message === "string")
          .map(([field, message]) => `${field}: ${message as string}`);
        if (fieldErrors.length > 0) return fieldErrors.join(" · ");
      }

      // { errors: [{ field, defaultMessage }, …] }
      if (Array.isArray(body.errors)) {
        const fieldErrors = body.errors
          .map((entry) => {
            if (typeof entry === "string") return entry;
            if (typeof entry === "object" && entry !== null) {
              const item = entry as Record<string, unknown>;
              const message = item.defaultMessage ?? item.message;
              if (typeof message !== "string") return null;
              return typeof item.field === "string"
                ? `${item.field}: ${message}`
                : message;
            }
            return null;
          })
          .filter((entry): entry is string => Boolean(entry));
        if (fieldErrors.length > 0) return fieldErrors.join(" · ");
      }
    }
  }

  if (error instanceof Error && error.message) return error.message;

  return fallback;
}
