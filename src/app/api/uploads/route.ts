import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

/**
 * Local file storage for company logos and verification documents.
 *
 * The backend API stores these as plain URL strings and exposes no upload
 * endpoint, so files are written to `public/uploads` and served statically.
 * Replace the body of this handler with a call to the real upload endpoint (or
 * a bucket presign) once one exists — the response shape is all the client uses.
 */

const MAX_BYTES = 5 * 1024 * 1024;

const ALLOWED_TYPES = new Map([
  ["application/pdf", ".pdf"],
  ["image/png", ".png"],
  ["image/jpeg", ".jpg"],
  ["image/webp", ".webp"],
  ["image/svg+xml", ".svg"],
]);

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      return Response.json({ message: "Unauthorized." }, { status: 401 });
    }
  } catch {
    return Response.json({ message: "Unauthorized." }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return Response.json({ message: "No file provided." }, { status: 400 });
  }
  if (file.size === 0) {
    return Response.json({ message: "The file is empty." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return Response.json(
      { message: "Files must be 5 MB or smaller." },
      { status: 413 },
    );
  }

  const extension = ALLOWED_TYPES.get(file.type);
  if (!extension) {
    return Response.json(
      { message: "Only PDF, PNG, JPG, WebP, and SVG files are accepted." },
      { status: 415 },
    );
  }

  const storedName = `${randomUUID()}${extension}`;
  const directory = path.join(process.cwd(), "public", "uploads");

  try {
    await mkdir(directory, { recursive: true });
    await writeFile(
      path.join(directory, storedName),
      Buffer.from(await file.arrayBuffer()),
    );
  } catch {
    return Response.json({ message: "Unable to store the file." }, { status: 500 });
  }

  // Absolute, so the stored URL still resolves from other origins.
  const url = new URL(`/uploads/${storedName}`, request.nextUrl.origin).toString();

  return Response.json({ url, name: file.name, size: file.size });
}
