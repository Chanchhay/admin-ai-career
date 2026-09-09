"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useAppDispatch } from "@/store/hooks";
import { baseApi } from "@/services/baseApi";
import { isUuid } from "@/lib/uuid";

type LiveStatus = "connecting" | "connected" | "reconnecting";
let status: LiveStatus = "connecting";
const listeners = new Set<() => void>();
function setStatus(value: LiveStatus) {
  status = value;
  listeners.forEach((listener) => listener());
}
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};
export function useLiveStatus() {
  return useSyncExternalStore(
    subscribe,
    () => status,
    () => "connecting" as LiveStatus,
  );
}

/** One authenticated socket owned by the app shell. Re-read after reconnect so
 * a lost event never leaves the inbox stale. Tokens remain in the gateway. */
export function useLiveUpdates(enabled: boolean) {
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!enabled) return;
    let disposed = false;
    let socket: WebSocket | undefined;
    let retry: ReturnType<typeof setTimeout> | undefined;
    let attempt = 0;
    let lastSeen = Date.now();
    const refresh = () =>
      dispatch(
        baseApi.util.invalidateTags([
          "Notifications",
          "UnreadCount",
          "Conversations",
          "Messages",
        ]),
      );
    const connect = () => {
      if (disposed) return;
      setStatus(attempt ? "reconnecting" : "connecting");
      const url = new URL("/api/v1/notifications/ws", window.location.href);
      url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
      socket = new WebSocket(url);
      lastSeen = Date.now();
      socket.onmessage = (event) => {
        if (disposed) return;
        lastSeen = Date.now();
        try {
          const payload = JSON.parse(event.data);
          if (payload.type === "connected") {
            attempt = 0;
            setStatus("connected");
            refresh();
          } else if (payload.type === "notification") {
            dispatch(
              baseApi.util.invalidateTags(["Notifications", "UnreadCount"]),
            );
          } else if (payload.type === "message") {
            const id = payload.data?.conversationId;
            dispatch(
              baseApi.util.invalidateTags([
                "Conversations",
                typeof id === "string" && isUuid(id)
                  ? { type: "Messages", id }
                  : "Messages",
              ]),
            );
          }
        } catch {
          /* Ignore malformed events; reconnect also resynchronizes. */
        }
      };
      socket.onerror = () => socket?.close();
      socket.onclose = () => {
        if (disposed) return;
        setStatus("reconnecting");
        retry = setTimeout(
          connect,
          Math.min(30000, 1000 * 2 ** Math.min(attempt++, 5)) +
            Math.random() * 500,
        );
      };
    };
    connect();
    const watchdog = setInterval(() => {
      if (Date.now() - lastSeen > 60000) socket?.close();
    }, 15000);
    const onVisible = () => {
      if (document.visibilityState === "visible") {
        refresh();
        if (Date.now() - lastSeen > 60000) socket?.close();
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      disposed = true;
      clearTimeout(retry);
      clearInterval(watchdog);
      document.removeEventListener("visibilitychange", onVisible);
      socket?.close();
      setStatus("connecting");
    };
  }, [dispatch, enabled]);
}
