import type { ReactNode } from "react";
import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({ title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-surface px-4 py-10 text-center",
        className,
      )}
    >
      <span className="flex size-10 items-center justify-center rounded-md bg-surface-muted text-muted-fg">
        <Inbox aria-hidden="true" className="size-5" />
      </span>
      <h2 className="mt-3 text-sm font-semibold text-heading">{title}</h2>
      {description ? (
        <p className="mt-1 max-w-sm text-sm leading-6 text-body">{description}</p>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
