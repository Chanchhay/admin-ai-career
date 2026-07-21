"use client";

import type { PublicJobCategoryResponse, PublicSkillResponse } from "@/contracts";
import { FilterBar } from "@/components/shared/FilterBar";
import { SearchInput } from "@/components/shared/SearchInput";
import { Button } from "@/components/ui/button";

export type PublicJobFilterValues = {
  keyword: string;
  location: string;
  categoryId: string;
  skillId: string;
  workMode: string;
  jobType: string;
};

type PublicJobFiltersProps = {
  values: PublicJobFilterValues;
  categories: PublicJobCategoryResponse[];
  skills: PublicSkillResponse[];
  onChange: (nextValues: PublicJobFilterValues) => void;
  onClear: () => void;
};

const workModes = ["HYBRID", "ONSITE", "REMOTE"];
const jobTypes = ["FULL_TIME", "CONTRACT"];

export function PublicJobFilters({
  values,
  categories,
  skills,
  onChange,
  onClear,
}: PublicJobFiltersProps) {
  const update = (name: keyof PublicJobFilterValues, value: string) => {
    onChange({ ...values, [name]: value });
  };

  return (
    <FilterBar className="grid gap-3 md:grid-cols-2 lg:grid-cols-6">
      <label className="lg:col-span-2">
        <span className="sr-only">Keyword</span>
        <SearchInput
          value={values.keyword}
          onChange={(event) => update("keyword", event.target.value)}
          placeholder="Keyword"
        />
      </label>
      <label>
        <span className="sr-only">Location</span>
        <input
          value={values.location}
          onChange={(event) => update("location", event.target.value)}
          placeholder="Location"
          className="h-11 w-full rounded-md border border-input bg-surface px-3 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </label>
      <label>
        <span className="sr-only">Category</span>
        <select
          value={values.categoryId}
          onChange={(event) => update("categoryId", event.target.value)}
          className="h-11 w-full rounded-md border border-input bg-surface px-3 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span className="sr-only">Skill</span>
        <select
          value={values.skillId}
          onChange={(event) => update("skillId", event.target.value)}
          className="h-11 w-full rounded-md border border-input bg-surface px-3 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <option value="">All skills</option>
          {skills.map((skill) => (
            <option key={skill.id} value={skill.id}>
              {skill.name}
            </option>
          ))}
        </select>
      </label>
      <div className="grid grid-cols-[1fr_1fr_auto] gap-2 md:col-span-2 lg:col-span-6">
        <label>
          <span className="sr-only">Work mode</span>
          <select
            value={values.workMode}
            onChange={(event) => update("workMode", event.target.value)}
            className="h-11 w-full rounded-md border border-input bg-surface px-3 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="">Work mode</option>
            {workModes.map((mode) => (
              <option key={mode} value={mode}>
                {mode}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="sr-only">Job type</span>
          <select
            value={values.jobType}
            onChange={(event) => update("jobType", event.target.value)}
            className="h-11 w-full rounded-md border border-input bg-surface px-3 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="">Job type</option>
            {jobTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
        <Button type="button" variant="outline" onClick={onClear}>
          Clear
        </Button>
      </div>
    </FilterBar>
  );
}
