"use client";

import { useState } from "react";
import {
  ChevronRight,
  KeyRound,
  Lock,
  MonitorSmartphone,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { SectionCard } from "@/components/layout/SectionCard";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import type { SecuritySettings } from "@/types/profile";

type SecuritySettingsCardProps = {
  security: SecuritySettings;
};

export function SecuritySettingsCard({ security }: SecuritySettingsCardProps) {
  const [twoFactor, setTwoFactor] = useState(security.twoFactorEnabled);

  const handleToggle = (checked: boolean) => {
    setTwoFactor(checked);
    toast.success(
      checked
        ? "Two-factor authentication enabled."
        : "Two-factor authentication disabled.",
    );
  };

  const rows = [
    {
      icon: KeyRound,
      label: "Change Password",
      hint: `Last changed ${security.lastPasswordChange}`,
    },
    {
      icon: MonitorSmartphone,
      label: "Manage Logged Devices",
      hint: `${security.activeDevices} active devices`,
    },
  ];

  return (
    <SectionCard
      title="Security Settings"
      icon={<Lock aria-hidden="true" className="size-4 text-brand" />}
      bodyClassName="p-5 sm:p-6"
    >
      <div className="flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-slate-100">
          <ShieldCheck aria-hidden="true" className="size-4 text-slate-500" />
        </span>

        <div className="min-w-0 flex-1">
          <label
            htmlFor="two-factor"
            className="text-sm font-semibold text-heading"
          >
            Two-Factor Authentication (2FA)
          </label>
          <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
            Protect your account with an extra layer of security.
          </p>
        </div>

        <Switch
          id="two-factor"
          checked={twoFactor}
          onCheckedChange={handleToggle}
          aria-label="Toggle two-factor authentication"
          className="mt-0.5 shrink-0 data-[state=checked]:bg-brand"
        />
      </div>

      <Separator className="my-5 bg-slate-100" />

      <ul className="space-y-1">
        {rows.map(({ icon: Icon, label, hint }) => (
          <li key={label}>
            <button
              type="button"
              onClick={() => toast(`${label} — ${hint}.`)}
              className="flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left transition-colors duration-200 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
            >
              <Icon aria-hidden="true" className="size-4 shrink-0 text-slate-400" />
              <span className="flex-1 text-sm font-medium text-heading">
                {label}
              </span>
              <ChevronRight
                aria-hidden="true"
                className="size-4 shrink-0 text-slate-400"
              />
            </button>
          </li>
        ))}
      </ul>
    </SectionCard>
  );
}