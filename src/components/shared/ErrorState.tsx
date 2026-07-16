import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ErrorStateProps = {
  message?: string;
  onRetry?: () => void;
  className?: string;
};

export function ErrorState({
  message = "We couldn't load this content.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center gap-3 rounded-lg border border-dashed border-slate-200 px-4 py-6 text-center",
        className,
      )}
    >
      <AlertCircle aria-hidden="true" className="size-5 text-red-500" />
      <p className="text-xs text-slate-500">{message}</p>
      {onRetry ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="h-8 text-xs"
        >
          Try again
        </Button>
      ) : null}
    </div>
  );
}
