import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { genericOAuth, keycloak } from "better-auth/plugins/generic-oauth";

const issuer = process.env.KEYCLOAK_ISSUER;
const clientId = process.env.KEYCLOAK_CLIENT_ID;

if (!issuer || !clientId) {
  console.warn(
    "Better Auth Keycloak login requires KEYCLOAK_ISSUER and KEYCLOAK_CLIENT_ID.",
  );
}

export const auth = betterAuth({
  appName: "AI Career Platform",
  account: {
    storeAccountCookie: true,
    storeStateStrategy: "cookie",
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24 * 7,
      strategy: "jwe",
    },
  },
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
  },
  plugins: [
    genericOAuth({
      config:
        issuer && clientId
          ? [
              keycloak({
                issuer,
                clientId,
                clientSecret: process.env.KEYCLOAK_CLIENT_SECRET ?? "",
                pkce: true,
                scopes: ["openid", "profile", "email"],
              }),
            ]
          : [],
    }),
    nextCookies(),
  ],
});

export type AuthSession = typeof auth.$Infer.Session;
