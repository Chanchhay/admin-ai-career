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

export function TopCompanies({ companies }: { companies: CompanySummary[] }) {
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
                  className="group relative flex flex-col justify-between rounded-2xl border border-warning/20 bg-[#FFF8D6] p-8 shadow-2xs transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-brand/40 hover:shadow-xl hover:shadow-brand/10"
                >
                  <div className="flex min-w-0 items-start gap-4">
                    {/* Icon container with white background and hover fill animation */}
                    <span
                      aria-hidden="true"
                      className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-surface text-brand shadow-2xs transition-all duration-300 group-hover:scale-105 group-hover:bg-brand group-hover:text-white"
                    >
                      <BusinessIcon className="size-7" />
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex min-w-0 items-center gap-2">
                        {/* Title text hover effect */}
                        <h3 className="truncate text-lg font-semibold text-heading transition-colors duration-200 group-hover:text-brand">
                          {company.name}
                        </h3>
                        {company.featured && (
                          <span className="shrink-0 rounded-full bg-[#fceeee] px-2.5 py-0.5 text-xs font-medium text-[#e05151]">
                            Featured
                          </span>
                        )}
                      </div>
                      <p className="mt-1 truncate text-xs font-semibold text-brand">
                        {businessTypeLabels[company.businessType]}
                      </p>
                      <p className="mt-1 flex items-center gap-1 truncate text-xs text-muted-fg">
                        <MapPin
                          aria-hidden="true"
                          className="size-3.5 shrink-0 transition-transform duration-200 group-hover:scale-110"
                        />
                        {company.location || "Location available on role"}
                      </p>
                    </div>
                  </div>

                  {/* Button transition to blue background */}
                  <Link
                    href="/jobs"
                    className="mt-8 flex h-10 items-center justify-center rounded-xl bg-[#E8F0FE] px-4 text-sm font-semibold text-brand transition-all duration-300 group-hover:bg-brand group-hover:text-white group-hover:shadow-md active:scale-95"
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
    <section id="about" className="bg-surface py-16 lg:py-20">
      <div className="mx-auto grid max-w-[1348px] items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <ProfileGraphic />
        <div>
          <div className="flex items-center gap-3 text-sm">
            <span className="rounded-lg bg-[#E8F5E9] px-3.5 py-1.5 font-semibold text-[#16A34A]">
              Profile
            </span>
          </div>
          <h2 className="mt-5 max-w-2xl text-2xl font-extrabold leading-[1.25] text-[#F3C623] sm:text-4xl lg:text-5xl">
            Be the candidate employers are looking for
          </h2>
          <p className="mt-6 max-w-xl text-base leading-7 text-slate-500 sm:text-lg">
            Create a comprehensive profile and start receiving interview invites
            and job offers that align with your unique skills.
          </p>
          <p className="mt-4 max-w-xl text-base leading-7 text-slate-500 sm:text-lg">
            Don&apos;t miss out on your dream job—get started today and make
            your profile stand out.
          </p>
          <Button
            asChild
            size="lg"
            className="mt-8 rounded-xl bg-[#16A34A] px-8 text-base font-semibold text-white hover:bg-[#15803D]"
          >
            <Link href="/register">Create now</Link>
          </Button>
        </div>
      </div>

      <div className="mx-auto mt-24 grid max-w-[1348px] items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="rounded-lg bg-[#E8F5E9] px-3.5 py-1.5 font-semibold text-[#16A34A]">
              Companies
            </span>
            <span className="font-medium text-[#F3C623]">
              trusted opportunities in one place
            </span>
          </div>
          <h2 className="mt-6 max-w-xl text-3xl font-extrabold leading-[1.25] text-[#F3C623] sm:text-4xl lg:text-5xl">
            Get noticed by leading companies
          </h2>
          <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
            We collaborate with top organizations to bring you the best job
            opportunities, connecting you with leading employers who value your
            skills and expertise.
          </p>
          <ol className="mt-8 space-y-4 text-slate-700">
            {[
              "Over 150,000 new job postings added every month",
              "Access job listings from 1,200+ leading companies",
              "Receive personalized job alerts for 100+ job categories.",
            ].map((item, index) => (
              <li key={item} className="flex items-center gap-3.5">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#16A34A] text-xs font-bold text-white">
                  {index + 1}
                </span>
                <span className="text-sm font-medium sm:text-base">{item}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="rounded-2xl bg-[#E8F5E9]/60 p-7 sm:p-10">
          <p className="text-center text-xs font-bold uppercase tracking-wider text-[#16A34A]">
            Top companies
          </p>
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-6 text-center sm:grid-cols-3">
            {showcaseCompanies.map((company) => (
              <Link
                key={company}
                href="/jobs"
                className="flex items-center justify-center rounded-xl bg-surface px-4 py-3 text-sm font-semibold text-slate-800 shadow-2xs transition-all hover:-translate-y-0.5 hover:text-[#16A34A] hover:shadow-xs"
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

function ProfileGraphic() {
  return (
    <div className="relative mx-auto flex aspect-square w-full max-w-[520px] items-center justify-center rounded-2xl bg-[#E8F5E9]/70 p-6 shadow-2xs">
      <svg viewBox="0 0 500 500" className="size-full">
        {/* Main Yellow Ring */}
        <circle
          cx="250"
          cy="250"
          r="92"
          fill="none"
          stroke="#F3C623"
          strokeWidth="20"
        />

        {/* Inner Thin Accent Circle */}
        <circle
          cx="250"
          cy="250"
          r="70"
          fill="none"
          stroke="#16A34A"
          strokeWidth="1.5"
          strokeOpacity="0.4"
        />

        {/* Center White Circle */}
        <circle cx="250" cy="250" r="58" fill="#FFFFFF" />

        {/* Center Overlapping Circle Logo */}
        <g transform="translate(222, 236)">
          <circle cx="16" cy="14" r="14" fill="#16A34A" />
          <circle cx="34" cy="14" r="14" fill="#16A34A" />
          <circle cx="34" cy="14" r="8" fill="#FFFFFF" />
        </g>

        {/* Radial Spokes, Nodes, Brackets, and Labels */}
        {profilePoints.map(({ label, Icon }, index) => {
          const angleDeg = index * (360 / profilePoints.length) - 90;
          const rad = (angleDeg * Math.PI) / 180;

          // Point on the yellow ring
          const ringRadius = 92;
          const rx = 250 + ringRadius * Math.cos(rad);
          const ry = 250 + ringRadius * Math.sin(rad);

          // Intermediate knee bend
          const bendRadius = 125;
          const bx = 250 + bendRadius * Math.cos(rad);
          const by = 250 + bendRadius * Math.sin(rad);

          // End point horizontal extension
          const isRight = Math.cos(rad) >= 0;
          const extension = isRight ? 35 : -35;
          const ex = bx + extension;

          return (
            <g key={label}>
              {/* Connector Line with Knee Bend */}
              <path
                d={`M ${rx} ${ry} L ${bx} ${by} L ${ex} ${by}`}
                fill="none"
                stroke="#16A34A"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Node Dot on Yellow Ring */}
              <circle cx={rx} cy={ry} r="5" fill="#16A34A" />

              {/* Label Underline Bracket */}
              <line
                x1={ex}
                y1={by}
                x2={ex + (isRight ? 70 : -70)}
                y2={by}
                stroke="#16A34A"
                strokeWidth="1.75"
              />

              {/* Text and Icon Overlay */}
              <foreignObject
                x={isRight ? ex : ex - 130}
                y={by - 22}
                width="130"
                height="22"
              >
                <div
                  className={`flex h-full items-center gap-1 text-[10px] font-bold tracking-wider text-[#16A34A] ${
                    isRight ? "justify-start" : "justify-end"
                  }`}
                >
                  {!isRight && <Icon className="size-3 shrink-0" />}
                  <span>{label}</span>
                  {isRight && <Icon className="size-3 shrink-0" />}
                </div>
              </foreignObject>
            </g>
          );
        })}
      </svg>
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
              className=
               
                  
                   "rounded-xl p-7 text-center"
              
            >
              <span
                className=
                  
                    
                     "mx-auto flex size-[72px] items-center justify-center rounded-full bg-surface text-brand"
                
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
      {/* Inline styles for Infinite Orbit Animations */}
      <style>{`
        @keyframes orbitCW {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes orbitCCW {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        .animate-orbit-cw {
          animation: orbitCW 35s linear infinite;
        }
        .animate-orbit-ccw {
          animation: orbitCCW 25s linear infinite;
        }
        .animate-counter-cw {
          animation: orbitCCW 35s linear infinite;
        }
        .animate-counter-ccw {
          animation: orbitCW 25s linear infinite;
        }
      `}</style>

      <div className="mx-auto max-w-[1090px] px-4 sm:px-6">
        <h2 className="text-center text-3xl font-medium text-heading sm:text-4xl">
          Countries for Job Seekers
        </h2>
        <div className="mt-12 grid items-center gap-10 lg:grid-cols-2">
          {/* Left Text Block */}
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
              asChild
              className="mt-8 bg-warning px-10 text-brand transition-transform hover:scale-105 hover:bg-warning/90"
            >
              <Link href="/recruiter/jobs/new">Post a job</Link>
            </Button>
          </div>

          {/* Right Animated Orbit Graphic */}
          <div className="relative mx-auto aspect-square w-full max-w-[500px]">
            {/* Center Fixed Avatar */}
            <div className="absolute left-1/2 top-1/2 z-10 size-[64px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border-2 border-surface bg-brand-tint shadow-md transition-transform hover:scale-110">
              <Image
                src={orbitImages[8]}
                alt=""
                fill
                sizes="64px"
                loading="eager"
                unoptimized
                className="object-cover"
              />
            </div>

            {/* Inner Orbit (Dashed Line & Rotating Layer) */}
            <div className="absolute inset-[24%] rounded-full border-2 border-dashed border-warning/60">
              <div className="animate-orbit-ccw absolute inset-0 size-full">
                {/* Inner Node 1 */}
                <div className="absolute left-1/2 top-0 size-[52px] -translate-x-1/2 -translate-y-1/2">
                  <div className="animate-counter-ccw size-full overflow-hidden rounded-full border-2 border-surface bg-brand-tint shadow-sm transition-transform hover:scale-110">
                    <Image
                      src={orbitImages[5]}
                      alt=""
                      fill
                      sizes="52px"
                      loading="eager"
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Inner Node 2 */}
                <div className="absolute bottom-6 right-2 size-[52px] translate-x-1/2">
                  <div className="animate-counter-ccw size-full overflow-hidden rounded-full border-2 border-surface bg-brand-tint shadow-sm transition-transform hover:scale-110">
                    <Image
                      src={orbitImages[6]}
                      alt=""
                      fill
                      sizes="52px"
                      loading="eager"
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Inner Node 3 (Placeholder Soft Circle) */}
                <div className="absolute left-2 top-1/2 size-[44px] -translate-x-1/2 -translate-y-1/2">
                  <div className="animate-counter-ccw animate-pulse size-full rounded-full border border-sky-100 bg-sky-100/70 shadow-2xs" />
                </div>
              </div>
            </div>

            {/* Outer Orbit (Dashed Line & Rotating Layer) */}
            <div className="absolute inset-[4%] rounded-full border-2 border-dashed border-warning/70">
              <div className="animate-orbit-cw absolute inset-0 size-full">
                {/* Outer Node 1 */}
                <div className="absolute left-1/2 top-0 size-[58px] -translate-x-1/2 -translate-y-1/2">
                  <div className="animate-counter-cw size-full overflow-hidden rounded-full border-2 border-surface bg-brand-tint shadow-sm transition-transform hover:scale-110">
                    <Image
                      src={orbitImages[0]}
                      alt=""
                      fill
                      sizes="58px"
                      loading="eager"
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Outer Node 2 */}
                <div className="absolute right-0 top-1/3 size-[58px] translate-x-1/2 -translate-y-1/2">
                  <div className="animate-counter-cw animate-pulse size-full rounded-full border border-sky-100 bg-sky-100/70 shadow-2xs" />
                </div>

                {/* Outer Node 3 */}
                <div className="absolute bottom-8 right-12 size-[58px] translate-x-1/2 translate-y-1/2">
                  <div className="animate-counter-cw size-full overflow-hidden rounded-full border-2 border-surface bg-brand-tint shadow-sm transition-transform hover:scale-110">
                    <Image
                      src={orbitImages[2]}
                      alt=""
                      fill
                      sizes="58px"
                      loading="eager"
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Outer Node 4 */}
                <div className="absolute bottom-0 left-1/2 size-[58px] -translate-x-1/2 translate-y-1/2">
                  <div className="animate-counter-cw size-full overflow-hidden rounded-full border-2 border-surface bg-brand-tint shadow-sm transition-transform hover:scale-110">
                    <Image
                      src={orbitImages[9]}
                      alt=""
                      fill
                      sizes="58px"
                      loading="eager"
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Outer Node 5 */}
                <div className="absolute bottom-8 left-12 size-[58px] -translate-x-1/2 translate-y-1/2">
                  <div className="animate-counter-cw size-full overflow-hidden rounded-full border-2 border-surface bg-brand-tint shadow-sm transition-transform hover:scale-110">
                    <Image
                      src={orbitImages[4]}
                      alt=""
                      fill
                      sizes="58px"
                      loading="eager"
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Outer Node 6 */}
                <div className="absolute left-0 top-1/3 size-[58px] -translate-x-1/2 -translate-y-1/2">
                  <div className="animate-counter-cw size-full overflow-hidden rounded-full border-2 border-surface bg-brand-tint shadow-sm transition-transform hover:scale-110">
                    <Image
                      src={orbitImages[3]}
                      alt=""
                      fill
                      sizes="58px"
                      loading="eager"
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function NewestJobs() {
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

        {/* Tab Links with smooth indicator transition */}
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
                  ? "relative shrink-0 pb-3 font-medium text-brand after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-brand"
                  : "relative shrink-0 pb-3 text-muted-fg transition-colors duration-200 hover:text-brand after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-brand after:transition-all after:duration-300 hover:after:w-full"
              }
            >
              {tab}
            </Link>
          ))}
        </div>

        {/* Job Cards Grid with Interactive Hover Animations */}
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {newestJobs.map((job) => (
            <article
              key={job}
              className="group relative min-h-[235px] overflow-hidden rounded-xl bg-brand p-5 text-white shadow-xs transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-xl hover:shadow-brand/20"
            >
              {/* Animated Decorative Circle Effect */}
              <div className="absolute -bottom-14 -right-10 size-44 rounded-full bg-white/5 transition-transform duration-500 group-hover:scale-150 group-hover:bg-white/10" />

              {/* Tag Pills */}
              <div className="relative flex flex-wrap gap-3 text-xs">
                {["Fulltime", "Onsite", "$200K"].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md border border-white/80 px-4 py-2.5 transition-colors duration-200 group-hover:border-white group-hover:bg-white/10"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Job Title and Subtitle */}
              <h3 className="relative mt-6 text-xl font-semibold transition-colors duration-200 group-hover:text-warning">
                {job}
              </h3>
              <p className="relative mt-1 text-sm text-white/80">
                Advoit Digital Agency
              </p>

              {/* Bottom Action Section */}
              <div className="relative mt-6 flex items-center justify-between gap-4">
                <Button
                  asChild
                  className="bg-warning text-white transition-all duration-300 hover:scale-105 hover:bg-warning/90 active:scale-95"
                >
                  <Link href={`/jobs?keyword=${encodeURIComponent(job)}`}>
                    Apply
                  </Link>
                </Button>
                <span className="flex items-center gap-2 text-xs transition-opacity duration-200 group-hover:opacity-100 opacity-80">
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
