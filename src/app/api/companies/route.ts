import { NextResponse } from "next/server";
import { delay } from "@/mocks/delay";
import { MAX_LOGO_SIZE_BYTES } from "@/lib/constants";
import type { ApiError } from "@/types/api";
import type { Company, CompanySize, Industry } from "@/types/company";

export const dynamic = "force-dynamic";

function fail(message: string, status: number, field?: string) {
  const error: ApiError = { message, status, field };
  return NextResponse.json(error, { status });
}

export async function POST(request: Request) {
  await delay(700);

  const formData = await request.formData();

  const name = formData.get("name");
  const websiteUrl = formData.get("websiteUrl");
  const industry = formData.get("industry");
  const size = formData.get("size");
  const selfVerified = formData.get("selfVerified") === "true";
  const logo = formData.get("logo");

  if (typeof name !== "string" || name.trim().length < 2) {
    return fail("Company name must be at least 2 characters.", 400, "name");
  }

  if (typeof websiteUrl !== "string" || !websiteUrl.trim()) {
    return fail("Website URL is required.", 400, "websiteUrl");
  }

  if (typeof industry !== "string" || !industry) {
    return fail("Industry is required.", 400, "industry");
  }

  if (typeof size !== "string" || !size) {
    return fail("Company size is required.", 400, "size");
  }

  if (logo instanceof File && logo.size > MAX_LOGO_SIZE_BYTES) {
    return fail("Logo exceeds the 5MB limit.", 400, "logo");
  }

  const company: Company = {
    id: `cmp_${Date.now().toString(36)}`,
    name: name.trim(),
    websiteUrl: websiteUrl.trim(),
    industry: industry as Industry,
    size: size as CompanySize,
    logoUrl: logo instanceof File && logo.size > 0 ? `/uploads/${logo.name}` : undefined,
    selfVerified,
    createdAt: new Date().toISOString(),
  };

  return NextResponse.json(company, { status: 201 });
}