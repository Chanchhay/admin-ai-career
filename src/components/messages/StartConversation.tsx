"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { MessagesSquare, Send, User } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
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
  recipientName,
  triggerVariant = "secondary",
  triggerClassName,
}: {
  applicationId?: string;
  companyId?: string;
  label: string;
  recipientName?: string;
  triggerVariant?: "secondary" | "default" | "outline" | "ghost";
  triggerClassName?: string;
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

  return (
    <>
      <Button
        variant={triggerVariant}
        className={triggerClassName}
        onClick={() => setOpen(true)}
      >
        <MessagesSquare aria-hidden="true" className="size-4" />
        {label}
      </Button>

      <Dialog
        open={open}
        onOpenChange={(next) => {
          if (!isLoading) {
            setOpen(next);
            if (!next) setMessage("");
          }
        }}
        title={label}
        description={
          recipientName
            ? `Send a direct message to ${recipientName}. They will receive your message and can reply in the thread.`
            : "Send a message to begin a direct conversation thread."
        }
      >
        <div className="flex flex-col gap-4">
          {recipientName ? (
            <div className="flex items-center gap-2 rounded-xl bg-ws-card-hover/80 px-3 py-2 text-xs font-medium text-ws-muted">
              <User aria-hidden="true" className="size-3.5 text-primary" />
              <span>Recipient:</span>
              <span className="font-semibold text-ws-fg">{recipientName}</span>
            </div>
          ) : null}

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="start-conversation-message"
              className="text-xs font-medium text-ws-muted"
            >
              First message
            </label>
            <Textarea
              id="start-conversation-message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Write your message here…"
              rows={5}
              maxLength={4000}
              autoFocus
            />
            <div className="flex justify-end text-[11px] text-ws-faint">
              {message.length} / 4000
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-ws-line/60 pt-3">
            <Button
              type="button"
              variant="ghost"
              disabled={isLoading}
              onClick={() => {
                setOpen(false);
                setMessage("");
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={isLoading || !message.trim()}
              onClick={() => void submit()}
            >
              <Send aria-hidden="true" className="size-3.5" />
              {isLoading ? "Sending…" : "Send message"}
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
}
