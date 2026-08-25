"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { baseApi } from "@/services/baseApi";

/**
 * The app's single live connection: one Server-Sent Events stream, feeding both
 * the notification bell and any open conversation.
 *
 * <p>Deliberately does not push payloads into the RTK Query cache. An
 * invalidation makes the affected queries re-read from the database, which is
 * the only place that knows the truth — so a dropped, duplicated or out-of-order
 * event costs a refetch rather than a wrong badge or a message in the wrong
 * place.
 *
 * <p>`EventSource` cannot set an Authorization header. This works only because
 * the gateway holds the session cookie and attaches the token to forwarded
 * requests; it also reconnects on its own after a drop, and the refetch on
 * reconnect covers anything missed while disconnected.
 */
export function useLiveUpdates(enabled: boolean) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    const source = new EventSource("/api/v1/notifications/stream");

    const refreshNotifications = () => {
      dispatch(baseApi.util.invalidateTags(["Notifications", "UnreadCount"]));
    };

    /*
     * Without an id every conversation is refreshed, which is what a reconnect
     * needs: it cannot know which threads moved while the stream was down.
     */
    const refreshMessages = (conversationId?: number) => {
      dispatch(
        baseApi.util.invalidateTags([
          "Conversations",
          conversationId == null
            ? "Messages"
            : { type: "Messages" as const, id: conversationId },
        ]),
      );
    };

    source.addEventListener("notification", refreshNotifications);

    /*
     * The backend sends this to every recipient of a new message, including
     * those who muted the thread — muting silences the bell, it does not freeze
     * the transcript someone may be reading right now.
     *
     * Named "message" deliberately: an SSE event with no name arrives under
     * that name too, so this also catches anything unnamed rather than dropping
     * it silently.
     */
    source.addEventListener("message", (event) => {
      refreshMessages(conversationIdOf(event));
    });

    // A reconnect may have missed events; re-read rather than assume.
    source.addEventListener("connected", () => {
      refreshNotifications();
      refreshMessages();
    });

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

/**
 * The conversation a stream event refers to, or undefined if it did not say.
 *
 * Anything unreadable falls back to refreshing every conversation, which is
 * correct but heavier — better than throwing inside an event listener and
 * killing the rest of the stream.
 */
function conversationIdOf(event: MessageEvent): number | undefined {
  try {
    const payload: unknown = JSON.parse(event.data as string);

    if (payload && typeof payload === "object" && "conversationId" in payload) {
      const id = Number((payload as { conversationId: unknown }).conversationId);
      return Number.isFinite(id) ? id : undefined;
    }
  } catch {
    // Not JSON, or not the shape we expected.
  }

  return undefined;
}
