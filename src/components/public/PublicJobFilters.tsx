"use client";

import type { PublicJobCategoryResponse, PublicSkillResponse } from "@/contracts";
import { FilterBar } from "@/components/shared/FilterBar";
import { SearchInput } from "@/components/shared/SearchInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
        <Input
          value={values.location}
          onChange={(event) => update("location", event.target.value)}
          placeholder="Location"
          className="h-11 bg-surface"
        />
      </label>
      <label>
        <span className="sr-only">Category</span>
        <Select
          value={values.categoryId || null}
          onValueChange={(value) => update("categoryId", value ?? "")}
        >
          <SelectTrigger className="h-11 w-full bg-surface">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={String(category.id)}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </label>
      <label>
        <span className="sr-only">Skill</span>
        <Select
          value={values.skillId || null}
          onValueChange={(value) => update("skillId", value ?? "")}
        >
          <SelectTrigger className="h-11 w-full bg-surface">
            <SelectValue placeholder="All skills" />
          </SelectTrigger>
          <SelectContent>
            {skills.map((skill) => (
              <SelectItem key={skill.id} value={String(skill.id)}>
                {skill.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </label>
      <div className="grid grid-cols-[1fr_1fr_auto] gap-2 md:col-span-2 lg:col-span-6">
        <label>
          <span className="sr-only">Work mode</span>
          <Select
            value={values.workMode || null}
            onValueChange={(value) => update("workMode", value ?? "")}
          >
            <SelectTrigger className="h-11 w-full bg-surface">
              <SelectValue placeholder="Work mode" />
            </SelectTrigger>
            <SelectContent>
              {workModes.map((mode) => (
                <SelectItem key={mode} value={mode}>
                  {mode}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>
        <label>
          <span className="sr-only">Job type</span>
          <Select
            value={values.jobType || null}
            onValueChange={(value) => update("jobType", value ?? "")}
          >
            <SelectTrigger className="h-11 w-full bg-surface">
              <SelectValue placeholder="Job type" />
            </SelectTrigger>
            <SelectContent>
              {jobTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>
        <Button type="button" variant="outline" onClick={onClear}>
          Clear
        </Button>
      </div>
    </FilterBar>
  );
}
