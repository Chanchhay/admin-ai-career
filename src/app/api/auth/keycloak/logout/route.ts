import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const signOutResponse = await auth.api.signOut({
    headers: request.headers,
    asResponse: true,
  });

  const appUrl = new URL(process.env.BETTER_AUTH_URL ?? request.nextUrl.origin);
  const issuer = process.env.KEYCLOAK_ISSUER;
  const clientId = process.env.KEYCLOAK_CLIENT_ID;
  const destination =
    issuer && clientId
      ? createKeycloakLogoutUrl(issuer, clientId, appUrl)
      : appUrl;
  const response = NextResponse.redirect(destination, 303);

  for (const cookie of signOutResponse.headers.getSetCookie()) {
    response.headers.append("set-cookie", cookie);
  }

  return response;
}

function createKeycloakLogoutUrl(
  issuer: string,
  clientId: string,
  postLogoutRedirectUri: URL,
) {
  const logoutUrl = new URL(
    `${issuer.replace(/\/$/, "")}/protocol/openid-connect/logout`,
  );
  logoutUrl.searchParams.set("client_id", clientId);
  logoutUrl.searchParams.set(
    "post_logout_redirect_uri",
    postLogoutRedirectUri.toString(),
  );
  return logoutUrl;
}
