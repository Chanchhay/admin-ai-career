import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

/**
 * Starts a Keycloak sign-in from a plain link or a proxy redirect. There is no
 * login page: hitting this route hands straight off to the identity provider.
 *
 * `?callbackUrl=` is where the user lands afterwards; it must be app-relative so
 * the parameter cannot be used to bounce someone to another origin.
 */
export async function GET(request: NextRequest) {
  const requested = request.nextUrl.searchParams.get("callbackUrl");
  const isSafe =
    Boolean(requested) &&
    requested!.startsWith("/") &&
    !requested!.startsWith("//");
  const next = isSafe ? requested! : "";

  try {
    const signIn = await auth.api.signInWithOAuth2({
      body: {
        providerId: "keycloak",
        callbackURL: next
          ? `/auth/continue?next=${encodeURIComponent(next)}`
          : "/auth/continue",
        errorCallbackURL: "/?error=keycloak",
      },
      headers: request.headers,
      asResponse: true,
    });

    const { url } = (await signIn.json()) as { url?: string };
    if (!url) throw new Error("Keycloak did not return an authorization URL.");

    const response = NextResponse.redirect(url, 302);
    // PKCE verifier and state live in cookies the sign-in call just issued.
    for (const cookie of signIn.headers.getSetCookie()) {
      response.headers.append("set-cookie", cookie);
    }

    return response;
  } catch {
    return NextResponse.redirect(new URL("/?error=keycloak", request.url), 302);
  }
}
