"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { baseApi } from "@/services/baseApi";

/**
 * Subscribes to the backend's Server-Sent Events stream and invalidates the
 * notification caches whenever something arrives.
 *
 * <p>Deliberately does not push the payload into the RTK Query cache. An
 * invalidation makes the list and the unread count re-read from the database,
 * which is the only place that knows the truth — and it means a dropped or
 * duplicated event costs a refetch rather than a wrong badge.
 *
 * <p>`EventSource` cannot set an Authorization header. This works only because
 * the gateway holds the session cookie and attaches the token to forwarded
 * requests; it also reconnects on its own after a drop, and the refetch on
 * reconnect covers anything missed while disconnected.
 */
export function useNotificationStream(enabled: boolean) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    const source = new EventSource("/api/v1/notifications/stream");

    const refresh = () => {
      dispatch(baseApi.util.invalidateTags(["Notifications", "UnreadCount"]));
    };

    source.addEventListener("notification", refresh);
    // A reconnect may have missed events; re-read rather than assume.
    source.addEventListener("connected", refresh);

    /*
     * EventSource retries on its own, so an error is not necessarily fatal and
     * closing here would defeat that. Only a permanently CLOSED source is worth
     * giving up on — the queries still refetch on navigation.
     */
    source.onerror = () => {
      if (source.readyState === EventSource.CLOSED) {
        source.close();
      }
    };

    return () => source.close();
  }, [dispatch, enabled]);
}
