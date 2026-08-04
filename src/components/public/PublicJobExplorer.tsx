"use client";

import { useMemo, useState } from "react";
import type { PublicJobCategoryResponse, PublicJobResponse, PublicSkillResponse } from "@/contracts";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { PublicJobFilters, type PublicJobFilterValues } from "./PublicJobFilters";
import { PublicJobList } from "./PublicJobList";
import { PublicJobPagination } from "./PublicJobPagination";

type PublicJobExplorerProps = {
  jobs: PublicJobResponse[];
  categories: PublicJobCategoryResponse[];
  skills: PublicSkillResponse[];
};

const emptyFilters: PublicJobFilterValues = {
  keyword: "",
  location: "",
  categoryId: "",
  skillId: "",
  workMode: "",
  jobType: "",
};

const pageSize = 3;

export function PublicJobExplorer({ jobs, categories, skills }: PublicJobExplorerProps) {
  const [filters, setFilters] = useState(emptyFilters);
  const [page, setPage] = useState(0);

  const filteredJobs = useMemo(() => {
    const keyword = filters.keyword.trim().toLowerCase();
    const location = filters.location.trim().toLowerCase();

    return jobs.filter((job) => {
      const matchesKeyword =
        !keyword ||
        job.title.toLowerCase().includes(keyword) ||
        job.companyName.toLowerCase().includes(keyword) ||
        job.skills.some((skill) => skill.skillName.toLowerCase().includes(keyword));
      const matchesLocation = !location || job.location.toLowerCase().includes(location);
      const matchesCategory =
        !filters.categoryId || job.categoryId === Number(filters.categoryId);
      const matchesSkill =
        !filters.skillId ||
        job.skills.some((skill) => skill.skillId === Number(filters.skillId));
      const matchesWorkMode = !filters.workMode || job.workMode === filters.workMode;
      const matchesJobType = !filters.jobType || job.jobType === filters.jobType;

      return (
        matchesKeyword &&
        matchesLocation &&
        matchesCategory &&
        matchesSkill &&
        matchesWorkMode &&
        matchesJobType
      );
    });
  }, [filters, jobs]);

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / pageSize));
  const safePage = Math.min(page, totalPages - 1);
  const visibleJobs = filteredJobs.slice(safePage * pageSize, safePage * pageSize + pageSize);
  const hasActiveFilters = Object.values(filters).some(Boolean);
  const listState = visibleJobs.length === 0 ? "empty" : "populated";

  const updateFilters = (nextFilters: PublicJobFilterValues) => {
    setFilters(nextFilters);
    setPage(0);
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Published jobs"
        description="Filter published jobs by keyword, location, category, skill, work mode, and job type."
      />
      <PublicJobFilters
        values={filters}
        categories={categories}
        skills={skills}
        onChange={updateFilters}
        onClear={() => {
          setFilters(emptyFilters);
          setPage(0);
        }}
      />
      {hasActiveFilters ? (
        <p className="text-sm text-body">
          Filters active · {filteredJobs.length} matching jobs
        </p>
      ) : null}
      <PublicJobList jobs={visibleJobs} state={listState} />
      {visibleJobs.length > 0 ? (
        <PublicJobPagination
          page={safePage}
          totalPages={totalPages}
          totalItems={filteredJobs.length}
          onPageChange={setPage}
        />
      ) : null}
    </div>
  );
}
