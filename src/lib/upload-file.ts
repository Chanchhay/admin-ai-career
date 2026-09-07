/**
 * Sends an image to the backend's file store and resolves to the stored URL.
 *
 * <p>Unlike the recruiter app's deferred uploads, the console uploads on pick:
 * the one caller is a single-field panel with no surrounding form to save, so
 * there is no later moment to defer to.
 */

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

/** The image subset of what the backend's FileStorageService accepts. */
const ALLOWED_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/svg+xml",
]);

/**
 * Checks a picked file before it is sent, so the user is told at pick time.
 *
 * @returns an error message, or null when the file is acceptable
 */
export function validateImage(file: File): string | null {
  if (file.size === 0) return "The file is empty.";
  if (file.size > MAX_UPLOAD_BYTES) return "Images must be 5 MB or smaller.";
  if (!ALLOWED_TYPES.has(file.type)) {
    return "Only PNG, JPG, WebP, and SVG images are accepted.";
  }
  return null;
}

/**
 * @param visibility PUBLIC for anything a candidate's browser loads directly;
 *        a private object would 302 to a presigned URL that expires.
 * @throws Error carrying the backend's message when the upload fails
 */
export async function uploadFile(
  file: File,
  visibility: "PUBLIC" | "PRIVATE",
): Promise<string> {
  const body = new FormData();
  body.append("file", file);
  body.append("visibility", visibility);

  const response = await fetch("/api/v1/files", { method: "POST", body });

  let payload: unknown = null;
  try {
    payload = await response.json();
  } catch {
    // A proxy error or a crash can answer with a non-JSON body.
  }

  const message =
    payload && typeof payload === "object" && "message" in payload
      ? String((payload as { message: unknown }).message)
      : null;

  if (!response.ok) {
    throw new Error(message ?? `Upload failed (${response.status}).`);
  }

  // The backend wraps successful responses in { success, message, data }.
  const data =
    payload && typeof payload === "object" && "data" in payload
      ? (payload as { data: { url?: string } }).data
      : (payload as { url?: string } | null);

  if (!data?.url) throw new Error("Upload succeeded but returned no URL.");
  return data.url;
}
