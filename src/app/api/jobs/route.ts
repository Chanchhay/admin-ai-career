import { NextResponse } from "next/server";
import { delay } from "@/mocks/delay";
import { mockAllotment } from "@/mocks/job.mock";
import type { ApiError } from "@/types/api";
import type { CreateJobRequest, Job } from "@/types/job";

export const dynamic = "force-dynamic";

function fail(message: string, status: number, field?: string) {
  const error: ApiError = { message, status, field };
  return NextResponse.json(error, { status });
}

export async function POST(request: Request) {
  await delay(700);

  if (mockAllotment.used >= mockAllotment.total) {
    return fail(
      "Weekly posting limit reached. Upgrade your plan to publish more roles.",
      429,
    );
  }

  const body = (await request.json()) as Partial<CreateJobRequest>;

  if (!body.title || body.title.trim().length < 5) {
    return fail("Job title must be at least 5 characters.", 400, "title");
  }

  if (
    typeof body.salaryMin !== "number" ||
    typeof body.salaryMax !== "number" ||
    body.salaryMax <= body.salaryMin
  ) {
    return fail(
      "Maximum salary must be greater than minimum salary.",
      400,
      "salaryMax",
    );
  }

  if (!body.description || body.description.trim().length < 50) {
    return fail(
      "Job description must be at least 50 characters.",
      400,
      "description",
    );
  }

  const job: Job = {
    id: `job_${Date.now().toString(36)}`,
    title: body.title.trim(),
    category: body.category ?? "ENGINEERING",
    location: body.location ?? "",
    workMode: body.workMode ?? "REMOTE",
    salaryMin: body.salaryMin,
    salaryMax: body.salaryMax,
    experienceLevel: body.experienceLevel ?? "ENTRY",
    jobType: body.jobType ?? "FULL_TIME",
    description: body.description.trim(),
    requirements: body.requirements?.trim() ?? "",
    publishedAt: new Date().toISOString(),
  };

  return NextResponse.json(job, { status: 201 });
}