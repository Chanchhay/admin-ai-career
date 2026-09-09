"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Bell, CheckCheck, Trash2 } from "lucide-react";
import type { NotificationResponse } from "@/contracts";
import { useLiveUpdates } from "@/hooks/useLiveUpdates";
import {
  useDeleteNotificationMutation,
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
} from "@/services/notificationsApi";
import { cn } from "@/lib/utils";
import { useWorkspaceTranslation } from "@/i18n/useWorkspaceTranslation";

/**
 * The header bell and its dropdown.
 *
 * `pathPrefix` is the set of app-relative paths this front end can actually
 * route to. The backend addresses one inbox shared by every app, so a
 * notification aimed at the admin console must render as text here rather than
 * as a link into a page that does not exist.
 */
export function NotificationBell({
  pathPrefixes,
  className,
}: {
  pathPrefixes: string[];
  className?: string;
}) {
  const tx = useWorkspaceTranslation();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useLiveUpdates(true);

  const unread = useGetUnreadCountQuery();
  // The list is only fetched while the panel is open — the badge alone does not
  // need twenty rows behind it.
  const list = useGetNotificationsQuery({ size: 15 }, { skip: !open });
  const [markAllRead, markAllState] = useMarkAllNotificationsReadMutation();

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const count = unread.data?.unreadCount ?? 0;
  const notifications = list.data?.content ?? [];

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-label={
          count > 0
            ? tx("Notifications, {count} unread", { count })
            : tx("Notifications")
        }
        aria-expanded={open}
        className={cn(
          "relative flex size-9 shrink-0 items-center justify-center rounded-full bg-ws-card text-ws-muted transition-colors hover:bg-ws-card-hover hover:text-ws-fg",
          className,
        )}
      >
        <Bell aria-hidden="true" className="size-4.5" />
        {count > 0 ? (
          <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-sm leading-none font-bold text-primary-foreground">
            {count > 99 ? "99+" : count}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="absolute right-0 z-50 mt-2 w-88 max-w-[calc(100vw-2rem)] max-lg:fixed max-lg:inset-x-4 max-lg:top-18 max-lg:mx-auto max-lg:w-auto max-lg:max-w-none max-lg:max-h-[calc(100dvh-10rem)] max-lg:overflow-y-auto overflow-hidden rounded-2xl bg-ws-panel shadow-[var(--shadow-dropdown)]">
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-base font-semibold text-ws-fg">
              {tx("Notifications")}
            </span>
            {count > 0 ? (
              <button
                type="button"
                onClick={() => void markAllRead()}
                disabled={markAllState.isLoading}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-ws-muted transition-colors hover:text-ws-fg disabled:opacity-50"
              >
                <CheckCheck aria-hidden="true" className="size-3.5" />{" "}
                {tx("Mark all read")}
              </button>
            ) : null}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {list.isLoading ? (
              <p className="px-4 py-8 text-center text-base text-ws-faint">
                {tx("Loading…")}
              </p>
            ) : list.isError ? (
              <p className="px-4 py-8 text-center text-base text-ws-faint">
                {tx("Unable to load notifications.")}
              </p>
            ) : notifications.length === 0 ? (
              <p className="px-4 py-8 text-center text-base text-ws-faint">
                {tx("Nothing yet.")}
              </p>
            ) : (
              <ul>
                {notifications.map((notification) => (
                  <NotificationRow
                    key={notification.id}
                    notification={notification}
                    pathPrefixes={pathPrefixes}
                    onNavigate={() => setOpen(false)}
                  />
                ))}
              </ul>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function NotificationRow({
  notification,
  pathPrefixes,
  onNavigate,
}: {
  notification: NotificationResponse;
  pathPrefixes: string[];
  onNavigate: () => void;
}) {
  const tx = useWorkspaceTranslation();
  const [markRead] = useMarkNotificationReadMutation();
  const [remove, removeState] = useDeleteNotificationMutation();

  const href =
    notification.actionUrl &&
    pathPrefixes.some((prefix) => notification.actionUrl?.startsWith(prefix))
      ? notification.actionUrl
      : null;

  const body = (
    <>
      <span className="flex items-center gap-2">
        {!notification.read ? (
          <span
            aria-hidden="true"
            className="size-1.5 shrink-0 rounded-full bg-primary"
          />
        ) : null}
        <span
          className={cn(
            "truncate text-base",
            notification.read
              ? "text-ws-muted"
              : "font-semibold text-ws-fg",
          )}
        >
          {notification.title}
        </span>
      </span>
      {notification.body ? (
        <span className="mt-1 block text-sm leading-5 text-ws-muted">
          {notification.body}
        </span>
      ) : null}
      <span className="mt-1 block text-sm text-ws-faint">
        {formatRelative(notification.createdAt, tx)}
      </span>
    </>
  );

  return (
    <li className="group/row flex items-start gap-2 px-2 hover:bg-ws-card">
      {href ? (
        <Link
          href={href}
          onClick={() => {
            if (!notification.read) void markRead(notification.id);
            onNavigate();
          }}
          className="min-w-0 flex-1 rounded-xl px-2 py-3"
        >
          {body}
        </Link>
      ) : (
        <button
          type="button"
          onClick={() => {
            if (!notification.read) void markRead(notification.id);
          }}
          className="min-w-0 flex-1 rounded-xl px-2 py-3 text-left"
        >
          {body}
        </button>
      )}

      <button
        type="button"
        onClick={() => void remove(notification.id)}
        disabled={removeState.isLoading}
        aria-label={tx("Dismiss: {title}", { title: notification.title })}
        className="mt-3 flex size-7 shrink-0 items-center justify-center rounded-lg text-ws-faint opacity-0 transition hover:text-ws-fg focus-visible:opacity-100 group-hover/row:opacity-100 disabled:opacity-30"
      >
        <Trash2 aria-hidden="true" className="size-3.5" />
      </button>
    </li>
  );
}

function formatRelative(
  value: string,
  tx: (value: string, params?: Record<string, unknown>) => string,
) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const seconds = Math.round((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return tx("just now");

  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return tx("{minutes}m ago", { minutes });

  const hours = Math.round(minutes / 60);
  if (hours < 24) return tx("{hours}h ago", { hours });

  const days = Math.round(hours / 24);
  if (days < 7) return tx("{days}d ago", { days });

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(date);
}
