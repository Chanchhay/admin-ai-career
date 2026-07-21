import Link from "next/link";
import { Search, Sparkles } from "lucide-react";
import type {
  PublicIndustryResponse,
  PublicJobCategoryResponse,
  PublicJobResponse,
} from "@/contracts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type HeroSectionProps = {
  jobs: PublicJobResponse[];
  categories: PublicJobCategoryResponse[];
  industries: PublicIndustryResponse[];
};

export function HeroSection({ jobs, categories, industries }: HeroSectionProps) {
  const recentJob = jobs[0];

  return (
    <section className="bg-canvas">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_430px] lg:px-8 lg:py-16">
        <div className="flex flex-col justify-center">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-brand-tint px-3 py-1 text-sm font-medium text-brand">
            <Sparkles aria-hidden="true" className="size-4" />
            Public job discovery
          </span>
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight text-heading sm:text-5xl">
            Find published roles that match your skills and career direction.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-body">
            Search API-shaped public jobs by keyword, location, category, skills,
            work mode, and job type. No private company or application data is
            shown on public routes.
          </p>
          <form action="/jobs" className="mt-8 grid gap-3 rounded-lg border border-border bg-surface p-3 shadow-[var(--shadow-card)] sm:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)_auto]">
            <label className="sr-only" htmlFor="home-keyword">
              Keyword
            </label>
            <div className="relative">
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-fg"
              />
              <Input
                id="home-keyword"
                name="keyword"
                placeholder="Job title or skill"
                className="pl-9"
              />
            </div>
            <label className="sr-only" htmlFor="home-location">
              Location
            </label>
            <Input id="home-location" name="location" placeholder="Location" />
            <Button type="submit" size="lg">
              Search jobs
            </Button>
          </form>
          <div className="mt-6 flex flex-wrap gap-2 text-sm text-body">
            {categories.slice(0, 3).map((category) => (
              <Link
                key={category.id}
                href={`/jobs?categoryId=${category.id}`}
                className="rounded-full border border-border bg-surface px-3 py-1.5 transition hover:border-brand hover:text-brand"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>

        <aside className="rounded-lg border border-border bg-surface p-6 shadow-[var(--shadow-card)]">
          <p className="text-sm font-semibold text-brand">Featured opening</p>
          <h2 className="mt-3 text-2xl font-semibold text-heading">{recentJob.title}</h2>
          <p className="mt-2 text-sm leading-6 text-body">{recentJob.description}</p>
          <dl className="mt-5 grid gap-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-fg">Company</dt>
              <dd className="font-medium text-heading">{recentJob.companyName}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-fg">Location</dt>
              <dd className="font-medium text-heading">{recentJob.location}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-fg">Industry examples</dt>
              <dd className="text-right font-medium text-heading">
                {industries.slice(0, 2).map((item) => item.name).join(", ")}
              </dd>
            </div>
          </dl>
          <Button render={<Link href={`/jobs/${recentJob.id}`} />} className="mt-6 w-full">
            View featured job
          </Button>
        </aside>
      </div>
    </section>
  );
}
