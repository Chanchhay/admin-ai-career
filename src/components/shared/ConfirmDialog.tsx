"use client";

import type { ReactElement } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ConfirmDialogProps = {
  trigger: ReactElement;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
};

export function ConfirmDialog({
  trigger,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger render={trigger} />
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm" />
        <Dialog.Popup className="fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-surface p-5 shadow-[var(--shadow-dropdown)]">
          <Dialog.Title className="text-lg font-semibold text-heading">{title}</Dialog.Title>
          {description ? (
            <Dialog.Description className="mt-2 text-sm leading-6 text-body">
              {description}
            </Dialog.Description>
          ) : null}
          <div className="mt-5 flex justify-end gap-2">
            <Dialog.Close render={<Button type="button" variant="outline" />}>
              {cancelLabel}
            </Dialog.Close>
            <Dialog.Close
              render={
                <Button
                  type="button"
                  variant={destructive ? "destructive" : "default"}
                  className={cn(destructive && "bg-error text-white hover:bg-error/90")}
                  onClick={onConfirm}
                />
              }
            >
              {confirmLabel}
            </Dialog.Close>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
