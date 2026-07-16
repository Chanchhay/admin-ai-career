import Image from "next/image";
import { CalendarDays, CheckCircle2, Mail, MapPin, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatMonthYear } from "@/lib/format";
import type { RecruiterProfile } from "@/types/profile";

type ProfileHeroCardProps = {
  profile: RecruiterProfile;
  onEdit: () => void;
};

function InfoChip({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 px-2.5 py-1 text-xs text-slate-600">
      {icon}
      {children}
    </span>
  );
}

export function ProfileHeroCard({ profile, onEdit }: ProfileHeroCardProps) {
  return (
    <section className="surface-card flex flex-col items-center gap-6 p-6 text-center sm:flex-row sm:items-start sm:text-left">
      <div className="relative shrink-0">
        <Image
          src={profile.avatarUrl}
          alt={profile.displayName}
          width={112}
          height={112}
          className="size-28 rounded-xl object-cover ring-1 ring-slate-200"
        />
        {profile.verified ? (
          <span className="absolute -bottom-1.5 -right-1.5 flex size-6 items-center justify-center rounded-full bg-white shadow-sm">
            <CheckCircle2
              aria-label="Verified recruiter"
              className="size-5 text-brand"
            />
          </span>
        ) : null}
      </div>

      <div className="min-w-0 flex-1">
        <h1 className="text-2xl font-bold tracking-tight text-heading">
          {profile.displayName}
        </h1>
        <p className="mt-0.5 text-sm font-semibold text-brand">
          {profile.headline}
        </p>

        <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
          <InfoChip icon={<MapPin aria-hidden="true" className="size-3" />}>
            {profile.location}
          </InfoChip>
          <InfoChip icon={<Mail aria-hidden="true" className="size-3" />}>
            {profile.email}
          </InfoChip>
          <InfoChip icon={<CalendarDays aria-hidden="true" className="size-3" />}>
            {`Joined ${formatMonthYear(profile.joinedAt)}`}
          </InfoChip>
        </div>
      </div>

      <Button
        type="button"
        onClick={onEdit}
        className="h-10 w-full shrink-0 bg-brand font-semibold text-white hover:bg-brand-hover sm:w-auto"
      >
        <Pencil aria-hidden="true" className="mr-2 size-4" />
        Edit Profile
      </Button>
    </section>
  );
}