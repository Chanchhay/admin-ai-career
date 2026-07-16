import { NextResponse } from "next/server";
import { delay } from "@/mocks/delay";
import {
  mockDocuments,
  mockProfile,
  mockScore,
  mockSecurity,
} from "@/mocks/profile.mock";
import type { ProfileOverview } from "@/types/profile";

export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse<ProfileOverview>> {
  await delay();

  return NextResponse.json({
    profile: mockProfile,
    score: mockScore,
    security: mockSecurity,
    documents: mockDocuments,
  });
}