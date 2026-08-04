import Link from "next/link";
import { ChevronDown, Search, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const testimonials = [
  "Superb job matching service",
  "Found my perfect role fast",
  "Helped me find work quickly",
];

const quickLinks = [
  { id: 1, name: "Remote", href: "/jobs?workMode=REMOTE" },
  { id: 2, name: "Work from home", href: "/jobs?workMode=REMOTE" },
  { id: 3, name: "Part-time", href: "/jobs?jobType=PART_TIME" },
  { id: 4, name: "Design", href: "/jobs?keyword=design" },
];

/**
 * The hand-drawn ribbons that frame the headline. Mirrored on the left so the
 * two curves lean into the centre of the section.
 */
function HeroRibbon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 160 260"
      fill="none"
      className={className}
    >
      <path
        d="M158 2C158 2 116 26 116 66c0 40 42 48 42 92 0 44-52 46-78 76-14 16-16 22-16 22"
        stroke="url(#hero-ribbon)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <defs>
        <linearGradient id="hero-ribbon" x1="80" y1="0" x2="80" y2="260">
          <stop stopColor="#22d3ee" />
          <stop offset="1" stopColor="#22c55e" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-landing-tint/60 via-surface to-surface pb-20 pt-16 sm:pt-20 lg:pb-24">
      <HeroRibbon className="pointer-events-none absolute -right-10 top-10 hidden h-65 w-40 lg:block" />
      <HeroRibbon className="pointer-events-none absolute -left-10 top-64 hidden h-65 w-40 -scale-x-100 lg:block" />

      <div className="relative mx-auto max-w-[1240px] px-4 text-center sm:px-6 lg:px-8">
        <h1 className="mx-auto max-w-[1200px] text-[clamp(3rem,7vw,6rem)] font-bold leading-[.98] tracking-[-0.045em]">
          <span className="text-brand">Explore new </span>
          <span className="text-warning">job vacancies all over the world</span>
        </h1>
        <p className="mx-auto mt-8 max-w-4xl text-base leading-7 text-muted-fg sm:text-xl sm:leading-8">
          Our platform features more than 1.2 million job vacancies worldwide,
          connecting you with employers who value your skills and experience.
        </p>

        <div className="mx-auto mt-14 grid max-w-160 gap-5 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial}
              className="rounded-lg bg-landing-tint px-4 py-3 text-body"
            >
              <div className="mb-1.5 flex justify-center gap-1 text-warning">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} aria-hidden="true" className="size-3.5 fill-current" />
                ))}
              </div>
              <p className="text-sm">“{testimonial}”</p>
            </div>
          ))}
        </div>

        <form
          action="/jobs"
          className="mx-auto mt-14 grid max-w-[610px] gap-3 sm:grid-cols-[minmax(0,1fr)_130px]"
        >
          <div className="flex h-[60px] items-center rounded-xl bg-landing-tint px-5 text-body">
            <Search aria-hidden="true" className="size-5 shrink-0 text-muted-fg" />
            <label htmlFor="landing-keyword" className="sr-only">
              Company, industry, or job title
            </label>
            <Input
              id="landing-keyword"
              name="keyword"
              placeholder="Company or industry"
              className="h-full border-0 bg-transparent px-3 shadow-none focus-visible:ring-0 dark:bg-transparent"
            />
            <span className="hidden h-7 w-px bg-muted-fg/50 sm:block" />
            <span className="hidden whitespace-nowrap px-3 text-sm sm:inline">20 mi</span>
            <ChevronDown aria-hidden="true" className="hidden size-5 sm:block" />
          </div>
          <Button type="submit" className="h-[60px] rounded-xl text-base">
            Search
          </Button>
        </form>

        <div className="mt-12 flex flex-wrap justify-center gap-3">
          {quickLinks.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="rounded-md bg-landing-tint px-4 py-1.5 text-sm font-medium text-brand transition hover:bg-brand hover:text-white"
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
