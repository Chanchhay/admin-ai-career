"use client";

import { MessagesWorkspace } from "@/components/messages/MessagesWorkspace";
import { useSetPageHeading } from "@/components/layout/PageHeader";
import { useWorkspaceTranslation } from "@/i18n/useWorkspaceTranslation";

export default function MessagesPage() {
  const tx = useWorkspaceTranslation();
  useSetPageHeading(tx("Messages"));
  return <MessagesWorkspace basePath="/messages" />;
}
