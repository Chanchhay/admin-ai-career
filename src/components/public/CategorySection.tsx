import Link from "next/link";
import { ArrowRight, Layers3 } from "lucide-react";
import type { PublicIndustryResponse, PublicJobCategoryResponse, PublicSkillResponse } from "@/contracts";
import { SectionHeader } from "@/components/shared/SectionHeader";

type CategorySectionProps = {
  categories: PublicJobCategoryResponse[];
  industries: PublicIndustryResponse[];
  skills: PublicSkillResponse[];
};

export function CategorySection({ categories, industries, skills }: CategorySectionProps) {
  return (
    <section className="bg-surface py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Explore public job data"
          description="Categories, industries, and skills come from the public lookup endpoints."
          action={
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand"
            >
              Browse all jobs
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          }
        />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/jobs?categoryId=${category.id}`}
              className="rounded-lg border border-border bg-surface p-5 transition hover:border-brand hover:shadow-[var(--shadow-card)]"
            >
              <span className="flex size-10 items-center justify-center rounded-md bg-brand-tint text-brand">
                <Layers3 aria-hidden="true" className="size-5" />
              </span>
              <h3 className="mt-4 font-semibold text-heading">{category.name}</h3>
              <p className="mt-2 text-sm leading-6 text-body">{category.description}</p>
            </Link>
          ))}
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold uppercase text-muted-fg">Industries</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {industries.map((industry) => (
                <Link
                  key={industry.id}
                  href="/jobs"
                  className="rounded-full border border-border px-3 py-1.5 text-sm text-body hover:border-brand hover:text-brand"
                >
                  {industry.name}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase text-muted-fg">Skills</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Link
                  key={skill.id}
                  href={`/jobs?skillIds=${skill.id}`}
                  className="rounded-full border border-border px-3 py-1.5 text-sm text-body hover:border-brand hover:text-brand"
                >
                  {skill.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
