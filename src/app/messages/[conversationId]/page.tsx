"use client";

import { useParams } from "next/navigation";
import { MessagesWorkspace } from "@/components/messages/MessagesWorkspace";
import { useSetPageHeading } from "@/components/layout/PageHeader";

export default function MessageThreadPage() {
  const { conversationId } = useParams<{ conversationId: string }>();
  useSetPageHeading("Messages");

  return (
    <MessagesWorkspace
      basePath="/messages"
      conversationId={conversationId}
    />
  );
}
