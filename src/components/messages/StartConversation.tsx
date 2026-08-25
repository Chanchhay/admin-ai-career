"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { MessagesSquare, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Panel, PanelHeader } from "@/components/workspace/primitives";
import { getApiErrorMessage } from "@/lib/api-error";
import { useCreateConversationMutation } from "@/services/conversationsApi";

/**
 * Opens a moderator thread with whoever is behind an application or a company.
 *
 * <p>Addressed by the record on screen rather than by an account id: the
 * recipient is derived server-side from the application's candidate or the
 * company's recruiter, so there is no way to aim a thread at the wrong person.
 *
 * <p>The backend reuses an existing open thread for the same target, so
 * pressing this twice continues one conversation instead of starting a second.
 */
export function StartConversation({
  applicationId,
  companyId,
  label,
}: {
  applicationId?: number;
  companyId?: number;
  label: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [createConversation, { isLoading }] = useCreateConversationMutation();

  async function submit() {
    if (!message.trim()) {
      toast.error("Write the first message.");
      return;
    }

    try {
      const conversation = await createConversation({
        applicationId,
        companyId,
        message: message.trim(),
      }).unwrap();

      toast.success("Message sent.");
      setMessage("");
      setOpen(false);
      router.push(`/messages/${conversation.id}`);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to start the conversation."));
    }
  }

  if (!open) {
    return (
      <Button variant="secondary" onClick={() => setOpen(true)}>
        <MessagesSquare aria-hidden="true" /> {label}
      </Button>
    );
  }

  return (
    <Panel>
      <PanelHeader
        title={label}
        icon={<MessagesSquare aria-hidden="true" className="size-5" />}
        action={
          <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
            <X aria-hidden="true" /> Cancel
          </Button>
        }
      />

      <Textarea
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        placeholder="Write your message"
        rows={4}
        maxLength={4000}
      />

      <div className="mt-3">
        <Button disabled={isLoading} onClick={() => void submit()}>
          {isLoading ? "Sending…" : "Send message"}
        </Button>
      </div>
    </Panel>
  );
}
