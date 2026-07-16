import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionCardProps = {
  title?: string;
  icon?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
};

export function SectionCard({
  title,
  icon,
  action,
  children,
  className,
  bodyClassName,
}: SectionCardProps) {
  return (
    <section className={cn("surface-card overflow-hidden", className)}>
      {title ? (
        <div className="surface-card-header">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-heading">
            {icon}
            {title}
          </h2>
          {action}
        </div>
      ) : null}

      <div className={cn("p-5", bodyClassName)}>{children}</div>
    </section>
  );
}