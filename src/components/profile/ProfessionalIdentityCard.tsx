import { UserRound } from "lucide-react";
import { SectionCard } from "@/components/layout/SectionCard";
import type { RecruiterProfile } from "@/types/profile";

function IdentityField({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="label-section">{label}</p>
      <p className="mt-1 truncate text-sm font-semibold text-heading">
        {value}
      </p>
    </div>
  );
}

export function ProfessionalIdentityCard({
  profile,
}: {
  profile: RecruiterProfile;
}) {
  return (
    <SectionCard
      title="Professional Identity"
      icon={<UserRound aria-hidden="true" className="size-4 text-brand" />}
      action={
        <span className="text-[11px] font-medium text-slate-400">
          Schema ID: {profile.schemaId}
        </span>
      }
      bodyClassName="p-5 sm:p-6"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <IdentityField label="Legal Full Name" value={profile.legalFullName} />
        <IdentityField label="Professional Title" value={profile.title} />
        <IdentityField label="Primary Email" value={profile.email} />
        <IdentityField label="Internal Phone" value={profile.phone} />
      </div>

      <div className="mt-6">
        <p className="label-section">Recruitment Specializations</p>
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {profile.specializations.map((item) => (
            <li
              key={item}
              className="rounded-md bg-brand-tint px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-green-700"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </SectionCard>
  );
}