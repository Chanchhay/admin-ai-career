"use client";

import { BriefcaseBusiness, GraduationCap } from "lucide-react";
import type { RegistrationRole } from "@/contracts";
import { cn } from "@/lib/utils";

type RoleSelectorProps = {
  value: RegistrationRole;
  onChange: (role: RegistrationRole) => void;
};

const roles: Array<{
  value: RegistrationRole;
  title: string;
  description: string;
  icon: typeof GraduationCap;
}> = [
  {
    value: "SEEKER",
    title: "Job seeker",
    description: "People looking for work by company",
    icon: GraduationCap,
  },
  {
    value: "RECRUITER",
    title: "Recruiter",
    description: "Companies that need to recruit individuals",
    icon: BriefcaseBusiness,
  },
];

export function RoleSelector({ value, onChange }: RoleSelectorProps) {
  return (
    <fieldset>
      <legend className="text-sm font-medium text-heading">
        Account type <span className="text-error">*</span>
      </legend>
      <div className="mt-2 grid gap-3 sm:grid-cols-2">
        {roles.map((role) => {
          const Icon = role.icon;
          const selected = value === role.value;

          return (
            <button
              key={role.value}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(role.value)}
              className={cn(
                "rounded-2xl border p-4 text-left outline-none transition focus-visible:ring-2 focus-visible:ring-ring",
                selected
                  ? "border-brand bg-landing-tint text-brand"
                  : "border-border bg-surface text-body hover:border-brand/50",
              )}
            >
              <Icon aria-hidden="true" className="size-7" />
              <span className="mt-3 block text-sm font-semibold">{role.title}</span>
              <span className="mt-1 block text-xs leading-5">{role.description}</span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
