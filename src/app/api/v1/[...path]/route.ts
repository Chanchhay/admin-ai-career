import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

type Company = { id: number; name: string; industryName: string; verificationStatus: string; contactEmail: string };
type Review = { id: number; reviewStatus: string; decisionNote: string; reviewedAt: string; approvedAt: string; forwardedAt: string };

const now = () => new Date().toISOString();
const ok = (data: unknown) => Response.json({ success: true, message: "", data });
const page = (content: unknown[]) => ({ totalElements: content.length, totalPages: 1, size: 12, content, number: 0, first: true, last: true, numberOfElements: content.length, pageable: { offset: 0, paged: true, pageNumber: 0, pageSize: 12, sort: { empty: false, sorted: true, unsorted: false }, unpaged: false }, sort: { empty: false, sorted: true, unsorted: false }, empty: content.length === 0 });

const companies: Company[] = [
  { id: 101, name: "Mekong Digital", industryName: "Technology", verificationStatus: "PENDING_VERIFICATION", contactEmail: "hello@mekongdigital.example" },
  { id: 102, name: "Angkor Logistics", industryName: "Logistics", verificationStatus: "PENDING_VERIFICATION", contactEmail: "contact@angkorlogistics.example" },
  { id: 103, name: "Lotus Hospitality", industryName: "Hospitality", verificationStatus: "APPROVED", contactEmail: "team@lotushospitality.example" },
];
const verificationHistory: Record<number, Array<Record<string, unknown>>> = {};
const reviews: Record<number, Review> = {
  201: { id: 701, reviewStatus: "PENDING", decisionNote: "", reviewedAt: "", approvedAt: "", forwardedAt: "" },
  202: { id: 702, reviewStatus: "HUMAN_INTERVIEW_SCHEDULED", decisionNote: "Strong profile; interview scheduled.", reviewedAt: now(), approvedAt: "", forwardedAt: "" },
};
const industries = [{ id: 1, name: "Technology", description: "Software, data and digital services", status: "ACTIVE", createdAt: now(), updatedAt: now() }, { id: 2, name: "Finance", description: "Banking, insurance and fintech", status: "ACTIVE", createdAt: now(), updatedAt: now() }, { id: 3, name: "Hospitality", description: "Hotels, tourism and guest services", status: "ACTIVE", createdAt: now(), updatedAt: now() }];
const categories = [{ id: 1, name: "Software Engineering", description: "Development and quality engineering", createdAt: now(), updatedAt: now() }, { id: 2, name: "Product & Design", description: "Product, UX and visual design", createdAt: now(), updatedAt: now() }, { id: 3, name: "Operations", description: "Business operations and support", createdAt: now(), updatedAt: now() }];
const skills = [{ id: 1, name: "React", skillType: "TECHNICAL", createdAt: now(), updatedAt: now() }, { id: 2, name: "Communication", skillType: "SOFT", createdAt: now(), updatedAt: now() }, { id: 3, name: "SQL", skillType: "TECHNICAL", createdAt: now(), updatedAt: now() }];

function application(id: number) {
  const review = reviews[id] ?? { id: 700 + id, reviewStatus: "PENDING", decisionNote: "", reviewedAt: "", approvedAt: "", forwardedAt: "" };
  return { application: { id, jobId: 501, jobTitle: id === 201 ? "Frontend Engineer" : "Product Designer", coverLetter: "I am excited to contribute my experience and grow with this team.", status: "MODERATOR_REVIEW_PENDING", appliedAt: "2026-08-15T08:30:00Z" }, candidate: { id: id + 1000, headline: id === 201 ? "Frontend developer with React experience" : "Product designer focused on usable systems", currentPosition: "Associate", preferredLocation: "Phnom Penh", availabilityStatus: "Available" }, submittedResume: { id: id + 2000, title: "Candidate resume.pdf", resumeFileUrl: "", visibility: "PRIVATE" }, review };
}

function detailCompany(id: number) {
  const base = companies.find((item) => item.id === id) ?? companies[0];
  return { company: { ...base, recruiterProfileId: 1, industryId: 1, websiteUrl: "https://example.com", businessRegistrationNo: "CAM-2026-" + base.id, status: "ACTIVE", description: "A verified demo company used for local administration testing.", address: "Phnom Penh, Cambodia", contactPhone: "+855 12 345 678", logoUrl: "" }, documents: [{ id: 1, companyId: base.id, uploadedByRecruiterProfileId: 1, documentType: "Business registration", documentUrl: "", status: "ACTIVE", createdAt: now() }], verificationHistory: verificationHistory[base.id] ?? [] };
}

export async function GET(request: NextRequest, context: RouteContext<"/api/v1/[...path]">) {
  const { path } = await context.params;
  const key = path.join("/");
  if (key === "me") return ok({ id: 1, fullName: "Demo Administrator", email: "admin@aicareer.local", avatarUrl: "", roles: ["SUPER_ADMIN"] });
  if (key === "admin/industries") return ok(industries);
  if (key === "admin/job-categories") return ok(categories);
  if (key === "admin/skills") return ok(skills);
  if (key === "moderator/companies") {
    const status = request.nextUrl.searchParams.get("verificationStatus");
    return ok(page(companies.filter((item) => !status || item.verificationStatus === status)));
  }
  if (key.startsWith("moderator/companies/")) return ok(detailCompany(Number(path[2])));
  if (key === "moderator/candidate-applications") {
    const status = request.nextUrl.searchParams.get("status");
    return ok(page([application(201), application(202)].filter((item) => !status || item.review.reviewStatus === status)));
  }
  if (key.startsWith("moderator/candidate-applications/")) return ok({ ...application(Number(path[2])), aiResult: null, humanInterviews: [], projectAssignments: [] });
  return Response.json({ success: false, message: "Demo endpoint not found", data: null }, { status: 404 });
}

export async function POST(request: NextRequest, context: RouteContext<"/api/v1/[...path]">) {
  const { path } = await context.params;
  const key = path.join("/");
  const body = await request.json().catch(() => ({})) as { decisionNote?: string };
  if (key.startsWith("moderator/companies/")) {
    const id = Number(path[2]); const action = path[3]; const company = companies.find((item) => item.id === id);
    if (company) company.verificationStatus = action === "approve" ? "APPROVED" : action === "reject" ? "REJECTED" : "PENDING_VERIFICATION";
    const verification = { id: Date.now(), companyId: id, moderatorProfileId: 1, decision: action === "approve" ? "APPROVED" : action === "reject" ? "REJECTED" : "NEEDS_REVISION", note: body.decisionNote ?? "", verifiedAt: now() };
    (verificationHistory[id] ??= []).push(verification);
    return ok(verification);
  }
  if (key.startsWith("moderator/candidate-applications/")) {
    const id = Number(path[2]); const action = path[3]; const review = reviews[id] ?? (reviews[id] = { id: 700 + id, reviewStatus: "PENDING", decisionNote: "", reviewedAt: "", approvedAt: "", forwardedAt: "" });
    review.reviewStatus = action === "approve" ? "APPROVED" : action === "reject" ? "REJECTED" : action === "forward" ? "FORWARDED" : "HUMAN_INTERVIEW_SCHEDULED";
    review.decisionNote = body.decisionNote ?? review.decisionNote; review.reviewedAt = now();
    if (action === "approve") review.approvedAt = now(); if (action === "forward") review.forwardedAt = now();
    return ok(review);
  }
  return ok({});
}
