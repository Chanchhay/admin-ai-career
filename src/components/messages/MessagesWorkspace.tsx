"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare, SendHorizontal, Trash2 } from "lucide-react";
import type {
  ConversationResponse,
  MessageResponse,
} from "@/contracts";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import {
  useCloseConversationMutation,
  useDeleteMessageMutation,
  useGetConversationsQuery,
  useGetMessagesQuery,
  useMarkConversationReadMutation,
  useSendMessageMutation,
} from "@/services/conversationsApi";

/**
 * The inbox: thread list on the left, the open thread on the right.
 *
 * `basePath` is the role's messages route, so selecting a thread updates the
 * URL and a notification can deep-link straight into one.
 */
export function MessagesWorkspace({
  basePath,
  conversationId,
}: {
  basePath: string;
  conversationId?: number;
}) {
  const router = useRouter();
  const conversations = useGetConversationsQuery({ size: 30 });

  const threads = useMemo(
    () => conversations.data?.content ?? [],
    [conversations.data?.content],
  );

  const selected =
    threads.find((thread) => thread.id === conversationId) ?? threads[0];

  if (conversations.isLoading) return <LoadingState rows={6} />;
  if (conversations.isError) {
    return (
      <ErrorState
        message="Unable to load conversations."
        onRetry={conversations.refetch}
      />
    );
  }

  if (threads.length === 0) {
    return (
      <div className="rounded-[24px] bg-ws-card px-6 py-16 text-center">
        <MessageSquare className="mx-auto size-10 text-ws-faint" />
        <h2 className="mt-4 font-semibold text-ws-fg">No conversations</h2>
        <p className="mt-2 text-sm text-ws-muted">
          Open one from a candidate application or a company.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
      <ul className="flex max-h-[70vh] flex-col gap-1.5 overflow-y-auto">
        {threads.map((thread) => (
          <li key={thread.id}>
            <ThreadRow
              thread={thread}
              active={thread.id === selected?.id}
              onSelect={() => router.push(`${basePath}/${thread.id}`)}
            />
          </li>
        ))}
      </ul>

      {selected ? (
        <Thread key={selected.id} conversation={selected} />
      ) : null}
    </div>
  );
}

function ThreadRow({
  thread,
  active,
  onSelect,
}: {
  thread: ConversationResponse;
  active: boolean;
  onSelect: () => void;
}) {
  const other = thread.participants.find((participant) => !participant.self);

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-current={active}
      className={`w-full rounded-[18px] px-4 py-3 text-left transition-colors ${
        active ? "bg-ws-panel" : "bg-ws-card hover:bg-ws-card-hover"
      }`}
    >
      <span className="flex items-center gap-2">
        <span className="min-w-0 flex-1 truncate text-sm font-semibold text-ws-fg">
          {thread.title || "Conversation"}
        </span>
        {thread.unreadCount > 0 ? (
          <span className="rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground">
            {thread.unreadCount}
          </span>
        ) : null}
      </span>
      <span className="mt-1 block truncate text-xs text-ws-muted">
        {other ? other.displayLabel : "No other participant"}
      </span>
      {thread.lastMessage ? (
        <span className="mt-1 block truncate text-xs text-ws-faint">
          {thread.lastMessage.content ?? "Message deleted"}
        </span>
      ) : null}
      {thread.status !== "OPEN" ? (
        <span className="mt-1 inline-block rounded-full bg-chip-quiet px-2 py-0.5 text-[10px] font-semibold text-chip-quiet-fg">
          {thread.status.toLowerCase()}
        </span>
      ) : null}
    </button>
  );
}

function Thread({ conversation }: { conversation: ConversationResponse }) {
  const messages = useGetMessagesQuery({
    conversationId: conversation.id,
    size: 50,
  });
  const [sendMessage, sendState] = useSendMessageMutation();
  const [markRead] = useMarkConversationReadMutation();
  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const unread = conversation.unreadCount;

  useEffect(() => {
    // Opening a thread with something unread is reading it. Guarded so an
    // already-read thread does not fire a write on every render.
    if (unread > 0) void markRead(conversation.id);
  }, [conversation.id, unread, markRead]);

  // The API returns newest first for cheap paging; a transcript reads oldest
  // first, so the order is reversed here rather than in the query.
  const ordered = useMemo(
    () => [...(messages.data?.content ?? [])].reverse(),
    [messages.data?.content],
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [ordered.length]);

  const closed = conversation.status !== "OPEN";

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const content = draft.trim();
    if (!content) return;

    try {
      await sendMessage({
        conversationId: conversation.id,
        body: { content },
      }).unwrap();
      setDraft("");
    } catch {
      // The draft is deliberately kept on failure — retyping a message the
      // user already wrote is worse than a stale textarea.
    }
  }

  return (
    <section className="flex max-h-[70vh] flex-col rounded-[22px] bg-ws-card">
      <header className="flex items-start gap-3 px-5 py-4">
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-sm font-semibold text-ws-fg">
            {conversation.title || "Conversation"}
          </h2>
          <p className="mt-0.5 truncate text-xs text-ws-muted">
            {conversation.participants
              .filter((participant) => !participant.self)
              .map((participant) => participant.displayLabel)
              .join(", ")}
          </p>
        </div>
        {conversation.status === "OPEN" ? <CloseThread id={conversation.id} /> : null}
      </header>

      <div className="flex-1 space-y-2 overflow-y-auto px-5 pb-4">
        {messages.isLoading ? (
          <LoadingState rows={4} />
        ) : messages.isError ? (
          <ErrorState message="Unable to load messages." />
        ) : ordered.length === 0 ? (
          <p className="py-8 text-center text-sm text-ws-faint">
            No messages yet.
          </p>
        ) : (
          ordered.map((message) => (
            <Bubble
              key={message.id}
              message={message}
              conversationId={conversation.id}
            />
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {closed ? (
        <p className="px-5 py-4 text-xs text-ws-faint">
          This conversation is {conversation.status.toLowerCase()} and no longer
          accepts messages.
        </p>
      ) : (
        <form className="flex items-end gap-2 px-5 py-4" onSubmit={submit}>
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              // Enter sends, Shift+Enter breaks the line — the convention
              // everyone already has in their fingers.
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                void submit(event);
              }
            }}
            rows={2}
            maxLength={4000}
            placeholder="Write a message"
            className="min-w-0 flex-1 resize-none rounded-xl bg-ws-panel px-3.5 py-2.5 text-sm text-ws-fg outline-none placeholder:text-ws-faint"
          />
          <button
            type="submit"
            disabled={sendState.isLoading || !draft.trim()}
            aria-label="Send message"
            className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground disabled:opacity-40"
          >
            <SendHorizontal aria-hidden="true" className="size-4" />
          </button>
        </form>
      )}
    </section>
  );
}

/** Closing is a moderator's call — the other side can reply until it is closed. */
function CloseThread({ id }: { id: number }) {
  const [closeConversation, { isLoading }] = useCloseConversationMutation();

  return (
    <button
      type="button"
      onClick={() => void closeConversation(id)}
      disabled={isLoading}
      className="shrink-0 rounded-full bg-ws-card-hover px-3 py-1.5 text-xs font-semibold text-ws-muted transition-colors hover:text-ws-fg disabled:opacity-50"
    >
      {isLoading ? "Closing…" : "Close thread"}
    </button>
  );
}

function Bubble({
  message,
  conversationId,
}: {
  message: MessageResponse;
  conversationId: number;
}) {
  const [remove, removeState] = useDeleteMessageMutation();
  const deleted = message.status === "DELETED";

  return (
    <div
      className={`group/msg flex items-end gap-2 ${
        message.mine ? "justify-end" : "justify-start"
      }`}
    >
      {message.mine && !deleted ? (
        <button
          type="button"
          onClick={() => void remove({ conversationId, messageId: message.id })}
          disabled={removeState.isLoading}
          aria-label="Delete message"
          className="mb-1 flex size-7 items-center justify-center rounded-lg text-ws-faint opacity-0 transition hover:text-ws-fg focus-visible:opacity-100 group-hover/msg:opacity-100 disabled:opacity-30"
        >
          <Trash2 aria-hidden="true" className="size-3.5" />
        </button>
      ) : null}

      <div
        className={`max-w-[75%] rounded-2xl px-3.5 py-2.5 ${
          message.mine
            ? "bg-primary text-primary-foreground"
            : "bg-ws-panel text-ws-fg"
        }`}
      >
        <p
          className={`text-sm leading-6 whitespace-pre-wrap ${
            deleted ? "italic opacity-60" : ""
          }`}
        >
          {deleted ? "This message was deleted" : message.content}
        </p>
        <p
          className={`mt-1 text-[10px] ${
            message.mine ? "text-primary-foreground/70" : "text-ws-faint"
          }`}
        >
          {formatTime(message.sentAt)}
        </p>
      </div>
    </div>
  );
}

function formatTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
