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

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-landing-tint/60 via-surface to-surface pb-20 pt-16 sm:pt-20 lg:pb-24">
      <div className="relative mx-auto max-w-[1240px] px-4 text-center sm:px-6 lg:px-8">
        <h1 className="mx-auto max-w-[1200px] text-[clamp(4rem,7vw,5rem)] font-bold leading-[.98] tracking-[-0.045em]">
          <span className="text-brand">Explore new </span>
          <span className="text-warning">job vacancies all over the world</span>
        </h1>
        <p className="mx-auto mt-8 max-w-4xl text-base leading-7 text-muted-fg sm:text-xl sm:leading-8">
          Our platform features more than 1.2 million job vacancies worldwide,
          connecting you with employers who value your skills and experience.
        </p>

        {/* <div className="mx-auto mt-14 grid max-w-200 gap-5 md:grid-cols-3">
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
        </div> */}

        {/* Testimonial / Rating Cards */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6">
          {/* Card 1 */}
          <div className="w-72 rounded-2xl bg-[#E8F5E9]/60 py-4 px-6 text-center shadow-sm backdrop-blur-sm">
            <div className="flex justify-center gap-1 text-[#F3C623]">
              {'★'.repeat(5)}
            </div>
            <p className="mt-2 text-sm font-medium text-slate-600">
              “Superb job matching service”
            </p>
          </div>

          {/* Card 2 */}
          <div className="w-72 rounded-2xl bg-[#E8F5E9]/60 py-4 px-6 text-center shadow-sm backdrop-blur-sm">
            <div className="flex justify-center gap-1 text-[#F3C623]">
              {'★'.repeat(5)}
            </div>
            <p className="mt-2 text-sm font-medium text-slate-600">
              “Found my perfect role fast”
            </p>
          </div>

          {/* Card 3 */}
          <div className="w-72 rounded-2xl bg-[#E8F5E9]/60 py-4 px-6 text-center shadow-sm backdrop-blur-sm">
            <div className="flex justify-center gap-1 text-[#F3C623]">
              {'★'.repeat(5)}
            </div>
            <p className="mt-2 text-sm font-medium text-slate-600">
              “Helped me find work quickly”
            </p>
          </div>
        </div>

        <form
          action="/jobs"
          className="mx-auto mt-14 grid max-w-[610px] gap-3 sm:grid-cols-[minmax(0,1fr)_130px]"
        >
          <div className="flex h-[40px] items-center rounded-xl bg-landing-tint px-5 text-body">
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
          <Button type="submit" className="h-[40px] rounded-xl text-base">
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