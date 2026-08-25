"use client";

import { MessagesWorkspace } from "@/components/messages/MessagesWorkspace";
import { useSetPageHeading } from "@/components/layout/PageHeader";

export default function MessagesPage() {
  useSetPageHeading("Messages");
  return <MessagesWorkspace basePath="/messages" />;
}
