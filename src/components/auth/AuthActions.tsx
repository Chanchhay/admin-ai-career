"use client";

import { useState, type ComponentProps } from "react";
import { LogIn, LogOut } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

type KeycloakLoginButtonProps = Omit<
  ComponentProps<typeof Button>,
  "onError"
> & {
  onSignInError?: (message: string) => void;
};

export function KeycloakLoginButton({
  children = "Login",
  disabled,
  onClick,
  onSignInError,
  ...props
}: KeycloakLoginButtonProps) {
  const [isPending, setIsPending] = useState(false);

  const startSignIn = async () => {
    setIsPending(true);

    try {
      const result = await authClient.signIn.oauth2({
        providerId: "keycloak",
        callbackURL: "/auth/continue",
        errorCallbackURL: "/?error=keycloak",
      });

      if (result.error) {
        throw new Error(result.error.message ?? "Unable to start sign in.");
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to start sign in.";

      // Without a login page to fall back to, report in place.
      if (onSignInError) {
        onSignInError(message);
      } else {
        toast.error(message);
      }
      setIsPending(false);
    }
  };

  return (
    <Button
      type="button"
      disabled={disabled || isPending}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) void startSignIn();
      }}
      {...props}
    >
      <LogIn aria-hidden="true" className="size-4" />
      {isPending ? "Redirecting…" : children}
    </Button>
  );
}

export function KeycloakLogoutButton({
  children = "Sign out",
  ...props
}: ComponentProps<typeof Button>) {
  return (
    <form action="/api/auth/keycloak/logout" method="post">
      <Button type="submit" {...props}>
        <LogOut aria-hidden="true" className="size-4" />
        {children}
      </Button>
    </form>
  );
}
