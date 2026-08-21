/**
 * Files live in MinIO and are addressed by the app-relative URL the backend
 * stores — `/api/v1/public/files/…` for logos, `/api/v1/files/…` for resumes
 * and verification documents.
 *
 * The gateway serves this console and the backend on one origin, so those URLs
 * are already fetchable by the browser as-is. They must not be run through
 * Next's `basePath`: they are backend paths, not routes of this app, which is
 * why nothing here prefixes `/admin`.
 */

/** Returns a file URL the browser can fetch, or `""` when there is none. */
export function resolveFileUrl(url: string | null | undefined): string {
  return url ?? "";
}
