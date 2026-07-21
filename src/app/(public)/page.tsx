import Link from "next/link";
import { PublicFooter, PublicShell } from "@/components/layout/PublicShell";
import { CategorySection } from "@/components/public/CategorySection";
import { FeaturedJobs } from "@/components/public/FeaturedJobs";
import { HeroSection } from "@/components/public/HeroSection";
import { Button } from "@/components/ui/button";
import {
  publicIndustriesResponse,
  publicJobCategoriesResponse,
  publicJobsResponse,
  publicSkillsResponse,
} from "@/mocks/api";

export default function HomePage() {
  const jobs = publicJobsResponse.data.content;
  const categories = publicJobCategoriesResponse.data;
  const industries = publicIndustriesResponse.data;
  const skills = publicSkillsResponse.data;

  return (
    <PublicShell>
      <main>
        <HeroSection jobs={jobs} categories={categories} industries={industries} />
        <FeaturedJobs jobs={jobs} />
        <CategorySection
          categories={categories}
          industries={industries}
          skills={skills}
        />
        <section className="bg-canvas py-12">
          <div className="mx-auto grid max-w-7xl gap-4 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div className="rounded-lg border border-border bg-surface p-6 shadow-[var(--shadow-card)]">
              <h2 className="text-xl font-semibold text-heading">For job seekers</h2>
              <p className="mt-2 text-sm leading-6 text-body">
                Create public profile material, manage applications, and keep
                private application data inside seeker-only routes.
              </p>
              <Button render={<Link href="/register" />} className="mt-5">
                Create seeker account
              </Button>
            </div>
            <div className="rounded-lg border border-border bg-surface p-6 shadow-[var(--shadow-card)]">
              <h2 className="text-xl font-semibold text-heading">For recruiters</h2>
              <p className="mt-2 text-sm leading-6 text-body">
                Recruiters can manage company jobs and review only candidates
                forwarded by the confirmed workflow.
              </p>
              <Button render={<Link href="/register" />} variant="outline" className="mt-5">
                Create recruiter account
              </Button>
            </div>
          </div>
        </section>
      </main>
      <PublicFooter />
    </PublicShell>
  );
}
