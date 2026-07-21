import { PageIntro, PlainCard, StatusPill } from "@/components/shared/ApiCards";
import { companyDocuments } from "@/mocks/api/recruiter";

export default function CompanyDocumentsPage() {
  return (
    <>
      <PageIntro
        eyebrow="GET/POST /api/v1/recruiter/companies/{companyId}/documents"
        title="Company documents"
        description="Document actions belong to the recruiter company workflow."
      />
      <div className="grid gap-4">
        {companyDocuments.map((document) => (
          <PlainCard key={document.id}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="font-semibold text-heading">{document.documentType}</h2>
                <p className="mt-1 text-sm text-slate-600">{document.documentUrl}</p>
              </div>
              <StatusPill>{document.status}</StatusPill>
            </div>
          </PlainCard>
        ))}
      </div>
    </>
  );
}
