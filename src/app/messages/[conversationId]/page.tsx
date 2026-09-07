"use client";

import { useParams } from "next/navigation";
import { MessagesWorkspace } from "@/components/messages/MessagesWorkspace";
import { useSetPageHeading } from "@/components/layout/PageHeader";
import { useWorkspaceTranslation } from "@/i18n/useWorkspaceTranslation";

export default function MessageThreadPage() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const tx = useWorkspaceTranslation();
  useSetPageHeading(tx("Messages"));

  return (
    <MessagesWorkspace
      basePath="/messages"
      conversationId={Number(conversationId)}
    />
  );
}
