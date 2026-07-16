import { NextResponse } from "next/server";
import { delay } from "@/mocks/delay";
import { mockPortfolioQuality } from "@/mocks/company.mock";
import type { PortfolioQuality } from "@/types/company";

export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse<PortfolioQuality>> {
  await delay();
  return NextResponse.json(mockPortfolioQuality);
}