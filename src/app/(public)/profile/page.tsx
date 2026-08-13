"use client";

import Link from "next/link";
import {
  BriefcaseBusiness,
  CalendarClock,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  UserRound,
  WalletCards,
} from "lucide-react";
import type {
  CurrentUserResponse,
  JobSeekerProfileResponse,
} from "@/contracts";
import { KeycloakLogoutButton } from "@/components/auth/AuthActions";
import { PublicFooter, PublicShell } from "@/components/layout/PublicShell";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { PageContainer } from "@/components/shared/PageContainer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGetCurrentUserQuery } from "@/services/authApi";
import { useGetJobSeekerProfileQuery } from "@/services/jobSeekerApi";
import { authClient } from "@/lib/auth-client";

export default function ProfilePage() {
  const { data: session } = authClient.useSession();
  const currentUser = useGetCurrentUserQuery();
  const isJobSeeker =
    currentUser.data?.roles.some((role) =>
      role.toUpperCase().includes("SEEKER"),
    ) ?? false;
  const jobSeekerProfile = useGetJobSeekerProfileQuery(undefined, {
    skip: !isJobSeeker,
  });

  const loading =
    currentUser.isLoading || (isJobSeeker && jobSeekerProfile.isLoading);
  const failed =
    currentUser.isError ||
    !currentUser.data ||
    (isJobSeeker && (jobSeekerProfile.isError || !jobSeekerProfile.data));

  return (
    <PublicShell>
      <main className="bg-canvas py-8 sm:py-12">
        <PageContainer className="max-w-6xl">
          {loading ? <LoadingState rows={8} /> : null}
          {!loading && failed ? (
            <ErrorState message="Unable to load your profile." />
          ) : null}
          {!loading && !failed && currentUser.data ? (
            <ProfileContent
              user={currentUser.data}
              jobSeekerProfile={jobSeekerProfile.data}
              image={session?.user.image}
            />
          ) : null}
        </PageContainer>
      </main>
      <PublicFooter />
    </PublicShell>
  );
}

function ProfileContent({
  user,
  jobSeekerProfile,
  image,
}: {
  user: CurrentUserResponse;
  jobSeekerProfile?: JobSeekerProfileResponse;
  image?: string | null;
}) {
  const isAdmin = user.roles.some((role) =>
    role.toUpperCase().includes("ADMIN"),
  );
  const isRecruiter = user.roles.some((role) =>
    role.toUpperCase().includes("RECRUITER"),
  );
  const isJobSeeker = user.roles.some((role) =>
    role.toUpperCase().includes("SEEKER"),
  );
  const workspaceHref = isAdmin
    ? "/admin/dashboard"
    : isRecruiter
      ? "/recruiter/dashboard"
      : isJobSeeker
        ? "/job-seeker/dashboard"
        : "/";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-brand">Account</p>
          <h1 className="text-3xl font-bold tracking-tight text-heading">
            My Profile
          </h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button render={<Link href={workspaceHref} />} variant="outline">
            Open workspace
          </Button>
          <KeycloakLogoutButton variant="outline" />
        </div>
      </div>

      <section className="overflow-hidden rounded-xl border border-border bg-surface shadow-[var(--shadow-card)]">
        <div className="bg-brand-tint px-5 py-6 sm:px-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div
              className="flex size-24 shrink-0 items-center justify-center rounded-full bg-surface bg-cover bg-center text-2xl font-bold text-brand shadow-sm ring-4 ring-white/70"
              style={image ? { backgroundImage: `url("${image}")` } : undefined}
            >
              {image ? (
                <span className="sr-only">Profile image</span>
              ) : (
                getInitials(user.fullName)
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-2xl font-bold text-heading">
                  {user.fullName}
                </h2>
                {/* {jobSeekerProfile ? (
                  <StatusPill>{jobSeekerProfile.verificationStatus}</StatusPill>
                ) : (
                  <StatusPill>{formatRoles(user.roles)}</StatusPill>
                )} */}
              </div>
              <p className="mt-1 font-semibold text-brand">
                {jobSeekerProfile?.headline}
              </p>
              {jobSeekerProfile?.bio ? (
                <p className="mt-2 max-w-3xl text-sm leading-6 text-body">
                  {jobSeekerProfile.bio}
                </p>
              ) : null}
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-body">
                <span className="inline-flex items-center gap-1.5">
                  <Mail aria-hidden="true" className="size-4 text-brand" />
                  {user.email}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Phone aria-hidden="true" className="size-4 text-brand" />
                  {displayValue(user.phoneNumber)}
                </span>
                {jobSeekerProfile?.preferredLocation ? (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin aria-hidden="true" className="size-4 text-brand" />
                    {jobSeekerProfile.preferredLocation}
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        <div className="space-y-6">
          <ProfileCard title="Personal Information" icon={UserRound}>
            <dl className="grid gap-5 sm:grid-cols-2">
              <ProfileField label="Username" value={user.username} />
              <ProfileField label="First name" value={user.firstName} />
              <ProfileField label="Last name" value={user.lastName} />
              <ProfileField label="Email" value={user.email} />
              <ProfileField label="Phone number" value={user.phoneNumber} />
              <ProfileField label="Gender" value={user.gender} />
              <ProfileField
                label="Registration source"
                value={user.registrationSource}
              />
            </dl>
          </ProfileCard>

          {jobSeekerProfile ? (
            <>
              <ProfileCard title="Professional Information" icon={BriefcaseBusiness}>
                <dl className="grid gap-5 sm:grid-cols-2">
                  <ProfileField label="Headline" value={jobSeekerProfile.headline} wide />
                  <ProfileField label="Bio" value={jobSeekerProfile.bio} wide />
                  <ProfileField
                    label="Current position"
                    value={jobSeekerProfile.currentPosition}
                  />
                  <ProfileField
                    label="Preferred location"
                    value={jobSeekerProfile.preferredLocation}
                  />
                  <ProfileField
                    label="Availability"
                    value={jobSeekerProfile.availabilityStatus}
                  />
                  <ProfileField
                    label="Profile slug"
                    value={jobSeekerProfile.publicProfileSlug}
                  />
                </dl>
              </ProfileCard>

              <ProfileCard title="Salary Expectations" icon={WalletCards}>
                <dl className="grid gap-5 sm:grid-cols-3">
                  <ProfileField
                    label="Minimum salary"
                    value={formatSalary(
                      jobSeekerProfile.expectedSalaryMin,
                      jobSeekerProfile.expectedSalaryCurrency,
                    )}
                  />
                  <ProfileField
                    label="Maximum salary"
                    value={formatSalary(
                      jobSeekerProfile.expectedSalaryMax,
                      jobSeekerProfile.expectedSalaryCurrency,
                    )}
                  />
                  <ProfileField
                    label="Visibility"
                    value={jobSeekerProfile.salaryVisibility}
                  />
                </dl>
              </ProfileCard>
            </>
          ) : null}
        </div>

        <div className="space-y-6">
          <ProfileCard title="Status & Visibility" icon={ShieldCheck}>
            <dl className="space-y-4">
              <ProfileField
                label="Account roles"
                value={formatRoles(user.roles)}
              />
              {jobSeekerProfile ? (
                <>
                  <ProfileField
                    label="Profile visibility"
                    value={jobSeekerProfile.profileVisibility}
                  />
                  <ProfileField
                    label="Verification status"
                    value={jobSeekerProfile.verificationStatus}
                  />
                  <ProfileField
                    label="Profile status"
                    value={jobSeekerProfile.status}
                  />
                </>
              ) : null}
            </dl>
          </ProfileCard>

          <ProfileCard title="Account Activity" icon={CalendarClock}>
            <dl className="space-y-4">
              <ProfileField
                label="Created at"
                value={formatDate(jobSeekerProfile?.createdAt)}
              />
              <ProfileField
                label="Last updated"
                value={formatDate(jobSeekerProfile?.updatedAt)}
              />
              <ProfileField
                label="Published at"
                value={formatDate(jobSeekerProfile?.publishedAt)}
              />
            </dl>
          </ProfileCard>
        </div>
      </div>
    </div>
  );
}

function ProfileCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: typeof UserRound;
  children: React.ReactNode;
}) {
  return (
    <Card className="gap-5 rounded-xl border border-border py-6 shadow-sm ring-0">
      <CardHeader className="px-6">
        <CardTitle className="flex items-center gap-2 text-xl font-semibold text-heading">
          <Icon aria-hidden="true" className="size-5 text-brand" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6">{children}</CardContent>
    </Card>
  );
}

function ProfileField({
  label,
  value,
  wide = false,
}: {
  label: string;
  value?: string | number | null;
  wide?: boolean;
}) {
  return (
    <div className={wide ? "sm:col-span-2" : undefined}>
      <dt className="text-xs font-semibold uppercase tracking-wide text-body">
        {label}
      </dt>
      <dd className="mt-1 rounded-lg border border-border bg-surface-muted px-3 py-2.5 text-sm leading-5 text-heading">
        {displayValue(value)}
      </dd>
    </div>
  );
}

function displayValue(value?: string | number | null) {
  return value === undefined || value === null || value === "" ? "—" : value;
}

function formatRoles(roles: string[]) {
  return roles.length
    ? roles
        .map((role) => role.replace(/^ROLE_/, "").replaceAll("_", " "))
        .join(", ")
    : "—";
}

function getInitials(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "U"
  );
}

function formatSalary(value?: number, currency?: string) {
  if (value === undefined || value === null) return "—";
  return `${currency ? `${currency} ` : ""}${new Intl.NumberFormat().format(value)}`;
}

function formatDate(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date);
}
