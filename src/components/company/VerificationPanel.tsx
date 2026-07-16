import { ShieldCheck } from "lucide-react";
import { Switch } from "@/components/ui/switch";

type VerificationPanelProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};

export function VerificationPanel({
  checked,
  onCheckedChange,
}: VerificationPanelProps) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-indigo-100 bg-indigo-50/60 p-5 sm:flex-row sm:items-center">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-tint">
        <ShieldCheck aria-hidden="true" className="size-[18px] text-brand" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-heading">
          Company Verification
        </p>
        <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
          Enable immediate status for trusted entities. Requires prior manual
          vetting.
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <label
          htmlFor="self-verified"
          className="text-xs font-medium text-slate-500"
        >
          Self-Verified
        </label>
        <Switch
          id="self-verified"
          checked={checked}
          onCheckedChange={onCheckedChange}
          aria-label="Mark company as self-verified"
          className="data-[state=checked]:bg-brand"
        />
      </div>
    </div>
  );
}