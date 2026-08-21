"use client";

import { ArrowRight, ShieldAlert } from "lucide-react";

/**
 * Replaces the whole shell when `/bff/session` couldn't be reached at all.
 * Nothing else on this console works in that state either — every `/api/**`
 * call 401s the same way — so rather than let each screen render its own
 * wall of dashes, this explains the one fix once and links straight to it.
 */
export function GatewayNotice() {
  const gatewayUrl = guessGatewayUrl();

  return (
    <div className="flex min-h-screen items-center justify-center bg-ws-canvas p-6 text-ws-fg">
      <div className="ws-panel w-full max-w-md rounded-[28px] p-7 text-center shadow-(--shadow-dropdown)">
        <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-chip-alert text-chip-alert-fg">
          <ShieldAlert aria-hidden="true" className="size-6" />
        </span>

        <h1 className="mt-4 text-lg font-semibold tracking-tight">
          Wrong address
        </h1>
        <p className="mt-2 text-sm leading-6 text-ws-muted">
          This console only signs in and calls the API through the gateway.
          Opened directly like this, the page still renders, but every
          request comes back unauthenticated — that&apos;s why every number
          you see is a dash.
        </p>

        <a
          href={gatewayUrl}
          className="mt-5 flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-[var(--primary-hover)]"
        >
          Open via the gateway
          <ArrowRight aria-hidden="true" className="size-4" />
        </a>

        <p className="mt-3 break-all text-xs text-ws-faint">{gatewayUrl}</p>
        <p className="mt-1 text-xs text-ws-faint">
          Running the gateway on a different port? Swap{" "}
          <span className="font-medium text-ws-muted">8090</span> in that
          address for the port you configured.
        </p>
      </div>
    </div>
  );
}

/** Same host, gateway's default port, the `/admin` path preserved. */
function guessGatewayUrl(): string {
  if (typeof window === "undefined") return "http://localhost:8090/admin";
  const { protocol, hostname, pathname } = window.location;
  const path = pathname.startsWith("/admin") ? pathname : "/admin";
  return `${protocol}//${hostname}:8090${path}`;
}
