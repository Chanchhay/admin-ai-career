"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useWorkspaceTranslation } from "@/i18n/useWorkspaceTranslation";

export function ThemeToggle({ className }: { className?: string }) {
  const tx = useWorkspaceTranslation();
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={cn(
        "relative size-9 shrink-0 rounded-full border border-transparent text-heading hover:border-brand/20 hover:bg-brand-tint hover:text-brand",
        className,
      )}
      aria-label={
        resolvedTheme === "dark"
          ? tx("Switch to light mode")
          : tx("Switch to dark mode")
      }
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <Moon aria-hidden="true" className="size-4.5 dark:hidden" />
      <Sun aria-hidden="true" className="hidden size-4.5 dark:block" />
    </Button>
  );
}
