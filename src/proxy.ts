import { getSessionCookie } from "better-auth/cookies";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  if (getSessionCookie(request)) return NextResponse.next();

  // No login page — unauthenticated visitors go straight to Keycloak and come
  // back to whatever they were trying to reach.
  const signInUrl = new URL("/api/auth/keycloak/login", request.url);
  signInUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
  return NextResponse.redirect(signInUrl);
}

export const config = {
  matcher: ["/profile", "/job-seeker/:path*", "/recruiter/:path*"],
};
