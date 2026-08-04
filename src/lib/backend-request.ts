import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

const PUBLIC_PREFIXES = ["public/"];
const PUBLIC_PATHS = new Set(["auth/register"]);
const PROTECTED_PREFIXES = ["job-seeker/", "recruiter/"];
const PROTECTED_PATHS = new Set(["me"]);

function isAllowedPath(path: string) {
  return (
    PUBLIC_PATHS.has(path) ||
    PROTECTED_PATHS.has(path) ||
    PUBLIC_PREFIXES.some((prefix) => path.startsWith(prefix)) ||
    PROTECTED_PREFIXES.some((prefix) => path.startsWith(prefix))
  );
}

function isPublicPath(path: string) {
  return (
    PUBLIC_PATHS.has(path) ||
    PUBLIC_PREFIXES.some((prefix) => path.startsWith(prefix))
  );
}

export async function backendRequest(
  request: NextRequest,
  segments: string[],
) {
  const path = segments.map(decodeURIComponent).join("/");
  if (!path || path.includes("..") || !isAllowedPath(path)) {
    return Response.json({ message: "Backend route not allowed." }, { status: 404 });
  }

  const apiBaseUrl = (
    process.env.API_BASE_URL ??
    "http://localhost:8080"
  ).replace(/\/$/, "");
  const target = new URL(`/api/v1/${path}`, apiBaseUrl);
  target.search = request.nextUrl.search;

  const requestHeaders = new Headers({ accept: "application/json" });
  const contentType = request.headers.get("content-type");
  if (contentType) requestHeaders.set("content-type", contentType);

  if (!isPublicPath(path)) {
    try {
      const token = await auth.api.getAccessToken({
        body: { providerId: "keycloak" },
        headers: request.headers,
      });
      if (!token.accessToken) {
        return Response.json({ message: "Unauthorized." }, { status: 401 });
      }
      requestHeaders.set("authorization", `Bearer ${token.accessToken}`);
    } catch {
      return Response.json({ message: "Unauthorized." }, { status: 401 });
    }
  }

  const hasBody = request.method !== "GET" && request.method !== "HEAD";
  const response = await fetch(target, {
    method: request.method,
    headers: requestHeaders,
    body: hasBody ? await request.arrayBuffer() : undefined,
    cache: "no-store",
  });

  const responseHeaders = new Headers();
  const responseContentType = response.headers.get("content-type");
  if (responseContentType) {
    responseHeaders.set("content-type", responseContentType);
  }

  return new Response(response.body, {
    status: response.status,
    headers: responseHeaders,
  });
}
