import { PageIntro, PlainCard, StatusPill } from "@/components/shared/ApiCards";
import { company } from "@/mocks/api";

export default function RecruiterCompanyPage() {
  return (
    <>
      <PageIntro
        eyebrow="GET /api/v1/recruiter/companies/me"
        title="Company profile"
        description="Company verification applies to the company. Submission uses POST /submit-verification."
      />
      <PlainCard>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-heading">{company.name}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              {company.description}
            </p>
          </div>
          <StatusPill>{company.verificationStatus}</StatusPill>
        </div>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="font-medium text-heading">Industry</dt>
            <dd className="text-slate-600">{company.industryName}</dd>
          </div>
          <div>
            <dt className="font-medium text-heading">Business registration</dt>
            <dd className="text-slate-600">{company.businessRegistrationNo}</dd>
          </div>
        </dl>
      </PlainCard>
    </>
  );
}
