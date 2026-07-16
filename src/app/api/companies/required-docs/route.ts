import { NextResponse } from "next/server";
import { delay } from "@/mocks/delay";
import { mockRequiredDocs } from "@/mocks/company.mock";
import type { RequiredDoc } from "@/types/company";

export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse<RequiredDoc[]>> {
  await delay();
  return NextResponse.json(mockRequiredDocs); // <- array, not { docs: ... }
}