import type { ReactNode } from "react";

type SectionHeaderProps = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export function SectionHeader({ title, description, action }: SectionHeaderProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="text-lg font-semibold text-heading">{title}</h2>
        {description ? (
          <p className="mt-1 max-w-2xl text-sm leading-6 text-body">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
