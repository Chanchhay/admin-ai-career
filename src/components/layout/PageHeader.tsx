import type { ReactNode } from "react";
import { Folder } from "lucide-react";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
};

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  actions,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 pb-6 md:flex-row md:items-start md:justify-between">
      <div className="space-y-1.5">
        {eyebrow ? (
          <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-brand">
            <Folder aria-hidden="true" className="size-3.5" />
            {eyebrow}
          </p>
        ) : null}

        <h1 className="text-2xl font-bold tracking-tight text-heading">
          {title}
        </h1>

        {subtitle ? (
          <p className="max-w-xl text-sm leading-relaxed text-slate-500">
            {subtitle}
          </p>
        ) : null}
      </div>

      {actions ? (
        <div className="flex shrink-0 items-center gap-2.5">{actions}</div>
      ) : null}
    </div>
  );
}
