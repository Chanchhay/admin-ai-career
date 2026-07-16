import { NextResponse } from "next/server";
import { delay } from "@/mocks/delay";
import { mockAllotment } from "@/mocks/job.mock";
import type { JobAllotment } from "@/types/job";

export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse<JobAllotment>> {
  await delay();
  return NextResponse.json(mockAllotment);
}