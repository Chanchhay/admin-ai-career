import Image from "next/image";
import Link from "next/link";
import {
  Award,
  BookOpen,
  Briefcase,
  BriefcaseBusiness,
  Building2,
  ChevronLeft,
  ChevronRight,
  FileText,
  Globe2,
  GraduationCap,
  HandCoins,
  Hotel,
  Landmark,
  MapPin,
  Network,
  Newspaper,
  RadioTower,
  ShoppingBag,
  Stethoscope,
  Target,
  Trophy,
  Truck,
  Wallet,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Company records carry no logo, so the card is keyed off the line of business
 * instead. Anything unmapped falls back to a generic building.
 */
const businessTypeIcons = {
  BANKING: Landmark,
  MICROFINANCE: HandCoins,
  FINTECH: Wallet,
  TELECOM: RadioTower,
  HOSPITALITY: Hotel,
  EDUCATION: GraduationCap,
  HEALTHCARE: Stethoscope,
  RETAIL: ShoppingBag,
  LOGISTICS: Truck,
  MEDIA: Newspaper,
  MANUFACTURING: Wrench,
  TECHNOLOGY: Network,
  CONSULTING: Briefcase,
  OTHER: Building2,
} as const;

type BusinessType = keyof typeof businessTypeIcons;

type CompanySummary = {
  name: string;
  location: string;
  businessType: BusinessType;
  featured?: boolean;
  active?: boolean;
};

const businessTypeLabels: Record<BusinessType, string> = {
  BANKING: "Banking",
  MICROFINANCE: "Microfinance",
  FINTECH: "Fintech",
  TELECOM: "Telecom",
  HOSPITALITY: "Hospitality",
  EDUCATION: "Education",
  HEALTHCARE: "Healthcare",
  RETAIL: "Retail",
  LOGISTICS: "Logistics",
  MEDIA: "Media",
  MANUFACTURING: "Manufacturing",
  TECHNOLOGY: "Technology",
  CONSULTING: "Consulting",
  OTHER: "Company",
};

const companies: CompanySummary[] = [
  {
    name: "BANK",
    location: "Phnom Penh Tmey",
    businessType: "BANKING",
    featured: true,
  },
  {
    name: "Hotel",
    location: "Siem Reap",
    businessType: "HOSPITALITY",
  },
  {
    name: "BANK",
    location: "Phnom Penh",
    businessType: "BANKING",
    active: true,
  },
  {
    name: "BANK",
    location: "Banteay Meanchey",
    businessType: "MICROFINANCE",
  },
  {
    name: "BANK",
    location: "Kampot",
    businessType: "FINTECH",
    featured: true,
  },
  {
    name: "BANK",
    location: "Angkor",
    businessType: "EDUCATION",
  },
  {
    name: "TELE",
    location: "Kampongsom",
    businessType: "TELECOM",
  },
  {
    name: "TELE",
    location: "Siem Reap",
    businessType: "TELECOM",
  },
];

const popularJobs = [
  "Project Manager",
  "Data Entry",
  "Customer Service",
  "Web Design",
  "Bookkeeping",
  "App Development",
  "Communication",
  "Analyst",
  "Graphic Design",
  "Education",
  "Sales",
  "Virtual Assistant",
  "Developer",
  "UI/UX Design",
  "Marketing",
  "Call Center",
  "Accounting",
];

const newestJobs = [
  "UX Designer",
  "Full-Stack",
  "Data Analysis",
  "Spring Boot",
  "Cyber Security",
  "Networking",
];

const showcaseCompanies = [
  "Shopify",
  "Medium",
  "Slack",
  "Pinterest",
  "Wise",
  "Amazon",
  "Spotify",
  "Walmart",
  "DocuSign",
  "Framer",
  "Webflow",
  "Notion",
];

const orbitImages = Array.from(
  { length: 10 },
  (_, index) =>
    `/landing-assets/orbit-${String(index + 1).padStart(2, "0")}.png`,
);

const orbitPositions = [
  [50, 2],
  [90, 29],
  [79, 76],
  [20, 77],
  [5, 29],
  [50, 27],
  [71, 51],
  [29, 51],
  [50, 51],
  [50, 94],
];

/**
 * Ordered clockwise from the top — the index drives each point's angle around
 * the ring, so reordering this list reflows the whole graphic.
 */
const profilePoints = [
  { label: "Skills", Icon: Award },
  { label: "Experience", Icon: BriefcaseBusiness },
  { label: "Portfolio", Icon: BookOpen },
  { label: "Education", Icon: GraduationCap },
  { label: "Publications", Icon: Newspaper },
  { label: "Goals", Icon: Target },
  { label: "Achievements", Icon: Trophy },
  { label: "Languages", Icon: Globe2 },
  { label: "Projects", Icon: FileText },
  { label: "Networking", Icon: Network },
];

const workSteps = [
  {
    title: "Create account",
    description:
      "Aliquam facilisis egestas sapien, nec tempor leo tristique at.",
    icon: "/landing-assets/step-account.svg",
  },
  {
    title: "Upload CV/Resume",
    description:
      "Curabitur sit amet maximus ligula. Nam a nulla ante. Nam sodales",
    icon: "/landing-assets/step-upload.svg",
  },
  {
    title: "Find suitable job",
    description: "Phasellus quis eleifend ex. Morbi nec fringilla nibh.",
    icon: "/landing-assets/step-search.svg",
  },
  {
    title: "Apply job",
    description:
      "Curabitur sit amet maximus ligula. Nam a nulla ante, Nam sodales purus.",
    icon: "/landing-assets/step-apply.svg",
  },
];

export function LandingSections() {
  return (
    <>
      <TopCompanies companies={companies} />
      <ProfileShowcase />
      <PopularJobs />
      <HowItWorks />
      <GlobalReach />
      <NewestJobs />
      <Testimonial />
    </>
  );
}

function TopCompanies({ companies }: { companies: CompanySummary[] }) {
  return (
    <section className="bg-surface py-16 lg:py-20">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6">
        <h2 className="text-3xl font-medium text-heading sm:text-4xl">
          Top companies
        </h2>
        {companies.length > 0 ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {companies.map((company) => {
              const BusinessIcon = businessTypeIcons[company.businessType];

              return (
                <article
                  key={`${company.name}-${company.location}`}
                  className={
                    company.active
                      ? "rounded-xl border border-brand bg-surface p-8 shadow-[var(--shadow-card)]"
                      : "rounded-xl border border-border bg-surface p-8"
                  }
                >
                  <div className="flex min-w-0 items-start gap-4">
                    <span
                      aria-hidden="true"
                      className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-landing-tint text-brand"
                    >
                      <BusinessIcon className="size-7" />
                    </span>
                    <div className="min-w-0">
                      <div className="flex min-w-0 items-center gap-2">
                        <h3 className="truncate text-lg font-medium text-heading">
                          {company.name}
                        </h3>
                        {company.featured ? (
                          <span className="rounded-full bg-[#fceeee] px-3 py-1 text-xs text-[#e05151]">
                            Featured
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-1 truncate text-sm text-brand">
                        {businessTypeLabels[company.businessType]}
                      </p>
                      <p className="mt-1 flex items-center gap-1 truncate text-sm text-muted-fg">
                        <MapPin
                          aria-hidden="true"
                          className="size-3.5 shrink-0"
                        />
                        {company.location || "Location available on role"}
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/jobs"
                    className={
                      company.active
                        ? "mt-8 flex h-12 items-center justify-center rounded-sm bg-brand px-4 text-sm font-semibold text-white"
                        : "mt-8 flex h-12 items-center justify-center rounded-sm bg-brand-tint px-4 text-sm font-semibold text-brand"
                    }
                  >
                    Open Position
                  </Link>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mt-10 rounded-xl border border-dashed border-border bg-surface-muted p-10 text-center text-body">
            No company openings are available yet.
          </div>
        )}
      </div>
    </section>
  );
}

function ProfileShowcase() {
  return (
    <section id="about" className="bg-surface py-16 lg:py-0">
      <div className="mx-auto grid max-w-[1348px] items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <ProfileGraphic />
        <div>
          <div className="flex items-center gap-3 text-sm">
            <span className="rounded-lg bg-brand-tint px-4 py-2 font-medium text-brand">
              Profile
            </span>
            <span className="text-muted-fg">built to help you stand out</span>
          </div>
          <h2 className="mt-8 max-w-xl text-[40px] font-semibold leading-[1.35] text-warning">
            Be the candidate employers are looking for
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-8 text-body sm:text-xl">
            Create a comprehensive profile and start receiving interview invites
            and job offers that align with your unique skills.
          </p>
          <p className="mt-4 max-w-xl text-lg leading-8 text-body sm:text-xl">
            Don&apos;t miss out on your dream job—get started today and make
            your profile stand out.
          </p>
          <Button
            render={<Link href="/register" />}
            size="lg"
            className="mt-10 rounded-lg px-8"
          >
            Create now
          </Button>
        </div>
      </div>

      <div className="mx-auto mt-24 grid max-w-[1348px] items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="rounded-lg bg-brand-tint px-4 py-2 font-medium text-brand">
              Companies
            </span>
            <span className="text-warning">
              trusted opportunities in one place
            </span>
          </div>
          <h2 className="mt-8 max-w-xl text-[40px] font-semibold leading-[1.35] text-warning">
            Get noticed by leading companies
          </h2>
          <p className="mt-7 max-w-xl text-lg leading-8 text-body">
            We collaborate with top organizations to bring you the best job
            opportunities, connecting you with leading employers who value your
            skills and expertise.
          </p>
          <ol className="mt-8 space-y-5 text-body">
            {[
              "Over 150,000 new job postings added every month",
              "Access job listings from 1,200+ leading companies",
              "Receive personalized job alerts for 100+ job categories.",
            ].map((item, index) => (
              <li key={item} className="flex items-center gap-4">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-semibold text-warning">
                  {index + 1}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="rounded-xl bg-landing-tint p-7 sm:p-10">
          <p className="text-center text-sm font-semibold uppercase tracking-wide text-warning">
            Top companies
          </p>
          <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-9 text-center sm:grid-cols-3">
            {showcaseCompanies.map((company) => (
              <Link
                key={company}
                href="/jobs"
                className="text-lg font-semibold text-heading transition hover:text-brand"
              >
                {company}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/** Polar placement helper: 0deg is the top of the ring, angles run clockwise. */
function polarPercent(angleDeg: number, radiusPercent: number) {
  const radians = ((angleDeg - 90) * Math.PI) / 180;
  return {
    left: `${50 + Math.cos(radians) * radiusPercent}%`,
    top: `${50 + Math.sin(radians) * radiusPercent}%`,
  };
}

function ProfileGraphic() {
  const step = 360 / profilePoints.length;

  return (
    <div className="relative mx-auto aspect-square w-full max-w-132 rounded-xl bg-landing-tint p-5">
      {/* Ring: thick yellow band with a thin brand outline inside it. */}
      <div className="absolute left-1/2 top-1/2 size-[46%] -translate-x-1/2 -translate-y-1/2 rounded-full border-14 border-warning sm:border-18" />
      <div className="absolute left-1/2 top-1/2 size-[34%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand" />

      {/* Centre mark. */}
      <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1">
        <span className="size-6 rounded-full bg-brand sm:size-7" />
        <span className="size-5 rounded-full border-5 border-brand bg-surface sm:size-6" />
      </div>

      {profilePoints.map(({ label, Icon }, index) => {
        const angle = index * step;
        // Right half reads outward from the ring; left half mirrors it.
        const isRightSide = angle > 0 && angle < 180;
        const isLeftSide = angle > 180;

        return (
          <div key={label}>
            <span
              aria-hidden="true"
              className="absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand"
              style={polarPercent(angle, 23)}
            />
            <div
              className="absolute flex -translate-y-1/2 items-center gap-1.5 whitespace-nowrap border-b border-brand pb-0.5 text-xs font-semibold uppercase tracking-wide text-brand sm:text-sm"
              style={{
                ...polarPercent(angle, 38),
                transform: isRightSide
                  ? "translate(0, -50%)"
                  : isLeftSide
                    ? "translate(-100%, -50%)"
                    : "translate(-50%, -50%)",
              }}
            >
              {isRightSide ? null : (
                <Icon aria-hidden="true" className="size-3.5 shrink-0" />
              )}
              <span>{label}</span>
              {isRightSide ? (
                <Icon aria-hidden="true" className="size-3.5 shrink-0" />
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function PopularJobs() {
  return (
    <section className="bg-surface px-4 py-16 sm:px-6 lg:py-20">
      <div className="mx-auto max-w-[1260px]">
        <h2 className="text-center text-3xl font-semibold text-warning sm:text-4xl">
          Popular jobs in Cambodia
        </h2>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          {popularJobs.map((topic) => (
            <Link
              key={topic}
              href={`/jobs?keyword=${encodeURIComponent(topic)}`}
              className="rounded-md bg-brand px-7 py-3.5 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-brand-hover"
            >
              {topic}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section className="bg-[#fef3c7] py-16 text-[#18191c] dark:bg-[#3d3314] dark:text-white lg:py-20">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6">
        <h2 className="text-center text-3xl font-medium sm:text-4xl">
          How Find work
        </h2>
        <div className="relative mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <div
            className="pointer-events-none absolute left-[17%] right-[17%] top-5 hidden justify-between lg:flex"
            aria-hidden="true"
          >
            {[0, 1, 2].map((arrow, index) => (
              <span
                key={arrow}
                className={
                  index === 1
                    ? "relative h-12 w-[24%] translate-y-28 rotate-180"
                    : "relative h-12 w-[24%]"
                }
              >
                <Image
                  src="/landing-assets/process-arrows.svg"
                  alt=""
                  fill
                  sizes="222px"
                  loading="eager"
                  unoptimized
                  className="object-contain"
                />
              </span>
            ))}
          </div>
          {workSteps.map(({ title, description, icon }, index) => (
            <article
              key={title}
              className={
                index === 1
                  ? "rounded-xl bg-surface p-7 text-center shadow-[var(--shadow-card)]"
                  : "rounded-xl p-7 text-center"
              }
            >
              <span
                className={
                  index === 1
                    ? "mx-auto flex size-[72px] items-center justify-center rounded-full bg-brand text-white"
                    : "mx-auto flex size-[72px] items-center justify-center rounded-full bg-surface text-brand"
                }
              >
                <Image
                  src={icon}
                  alt=""
                  width={32}
                  height={32}
                  loading="eager"
                  unoptimized
                  className="size-8 object-contain"
                />
              </span>
              <h3 className="mt-6 text-lg font-medium">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-body">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function GlobalReach() {
  return (
    <section className="bg-surface py-20">
      <div className="mx-auto max-w-[1090px] px-4 sm:px-6">
        <h2 className="text-center text-3xl font-medium text-heading sm:text-4xl">
          Countries for Job Seekers
        </h2>
        <div className="mt-12 grid items-center gap-10 lg:grid-cols-2">
          <div>
            <h3 className="text-4xl leading-tight sm:text-5xl">
              <span className="text-brand">So Many People Are </span>
              <span className="text-warning">Engaged </span>
              <span className="text-brand">All Over The World</span>
            </h3>
            <p className="mt-6 max-w-lg text-lg leading-8 text-body">
              A Land Of Opportunity With A Diverse Job Market And A Wide Range
              Of Industries Offering Countless Career Paths.
            </p>
            <Button
              render={<Link href="/recruiter/jobs/new" />}
              className="mt-8 bg-warning px-10 text-brand hover:bg-warning/90"
            >
              Post a job
            </Button>
          </div>
          <div className="relative mx-auto aspect-square w-full max-w-[540px]">
            <div className="absolute inset-[5%] rounded-full border-2 border-dashed border-warning" />
            <div className="absolute inset-[34%] rounded-full border-2 border-dashed border-warning" />
            {orbitImages.map((src, index) => (
              <div
                key={src}
                className="absolute size-[54px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border-2 border-surface bg-brand-tint shadow-sm sm:size-[60px]"
                style={{
                  left: `${orbitPositions[index][0]}%`,
                  top: `${orbitPositions[index][1]}%`,
                }}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="60px"
                  loading="eager"
                  unoptimized
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function NewestJobs() {
  const tabs = [
    "All Recent",
    "Finance",
    "Development",
    "Marketing",
    "Specialist",
  ];

  return (
    <section className="bg-surface py-16 lg:py-20">
      <div className="mx-auto max-w-[1090px] px-4 sm:px-6">
        <h2 className="text-center text-4xl font-bold text-brand">
          Newest <span className="text-warning">Jobs</span> For You
        </h2>
        <p className="mt-3 text-center text-base text-brand">
          Get The Fastest Application So That Your Name Is Above Other
          Application
        </p>
        <div className="mt-10 flex gap-8 overflow-x-auto border-b border-border pb-3 text-sm sm:justify-center sm:text-base">
          {tabs.map((tab, index) => (
            <Link
              key={tab}
              href={
                index === 0
                  ? "/jobs"
                  : `/jobs?keyword=${encodeURIComponent(tab)}`
              }
              className={
                index === 0
                  ? "shrink-0 border-b-2 border-brand pb-3 font-medium text-brand"
                  : "shrink-0 pb-3 text-muted-fg hover:text-brand"
              }
            >
              {tab}
            </Link>
          ))}
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {newestJobs.map((job) => (
            <article
              key={job}
              className="relative min-h-[235px] overflow-hidden bg-brand p-5 text-white"
            >
              <div className="absolute -bottom-14 -right-10 size-44 rounded-full bg-white/5" />
              <div className="relative flex flex-wrap gap-3 text-xs">
                {["Fulltime", "Onsite", "$200K"].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md border border-white/80 px-4 py-2.5"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h3 className="relative mt-6 text-xl font-semibold">{job}</h3>
              <p className="relative mt-1 text-sm text-white/80">
                Advoit Digital Agency
              </p>
              <div className="relative mt-6 flex items-center justify-between gap-4">
                <Button
                  render={
                    <Link href={`/jobs?keyword=${encodeURIComponent(job)}`} />
                  }
                  className="bg-warning text-white hover:bg-warning/90"
                >
                  Apply
                </Button>
                <span className="flex items-center gap-2 text-xs">
                  ♧ 24 Applied
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonial() {
  return (
    <section className="bg-surface py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-center text-3xl font-medium text-heading sm:text-4xl">
          Clients Testimonial
        </h2>
        <div className="mt-4 flex justify-center gap-2" aria-hidden="true">
          {[0, 1, 2, 3, 4].map((dot) => (
            <span
              key={dot}
              className={
                dot === 2
                  ? "h-2 w-5 rounded-full bg-brand"
                  : "size-2 rounded-full bg-[#27e06b]"
              }
            />
          ))}
        </div>
        <div className="mt-14 grid items-center gap-10 md:grid-cols-[250px_1fr]">
          <div className="relative mx-auto size-[220px] rounded-[48px] bg-brand p-5 shadow-[var(--shadow-dropdown)]">
            <div className="relative size-full overflow-hidden rounded-full border-4 border-white">
              <Image
                src="/landing-assets/testimonial-profile.jpg"
                alt="Lut Lyna"
                fill
                sizes="180px"
                loading="eager"
                unoptimized
                className="object-cover object-top"
              />
            </div>
            <span className="absolute -bottom-3 -right-3 flex size-11 items-center justify-center rounded-full bg-red-500 text-2xl font-bold text-white">
              ”
            </span>
          </div>
          <div className="relative">
            <span
              aria-hidden="true"
              className="absolute -left-4 top-1/2 hidden size-10 -translate-x-full -translate-y-1/2 items-center justify-center rounded-full bg-surface shadow-[var(--shadow-card)] md:flex"
            >
              <ChevronLeft className="size-5" />
            </span>
            <p className="text-2xl font-semibold text-warning">Lut Lyna</p>
            <p className="mt-1 text-base text-red-500">Fullstack Developer</p>
            <blockquote className="mt-5 max-w-3xl text-xl leading-8 text-body">
              “This is a good website for learning IT with a great environment
              and mentors. A perfect place to start your IT career.”
            </blockquote>
            <span
              aria-hidden="true"
              className="absolute -right-4 top-1/2 hidden size-10 translate-x-full -translate-y-1/2 items-center justify-center rounded-full bg-surface shadow-[var(--shadow-card)] md:flex"
            >
              <ChevronRight className="size-5" />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
