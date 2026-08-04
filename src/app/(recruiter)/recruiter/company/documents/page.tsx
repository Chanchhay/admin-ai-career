"use client";

import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api-error";
import { Trash2 } from "lucide-react";
import { PageIntro, PlainCard, StatusPill } from "@/components/shared/ApiCards";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { CompanyDocumentForm } from "@/components/recruiter/CompanyDocumentForm";
import { Button } from "@/components/ui/button";
import {
  useDeleteCompanyDocumentMutation,
  useGetCompanyDocumentsQuery,
  useGetRecruiterCompanyQuery,
} from "@/services/recruiterApi";

export default function CompanyDocumentsPage() {
  const company = useGetRecruiterCompanyQuery();
  const documents = useGetCompanyDocumentsQuery(company.data?.id ?? 0, {
    skip: !company.data,
  });
  const [deleteDocument, deletion] = useDeleteCompanyDocumentMutation();

  if (company.isLoading || documents.isLoading) return <LoadingState rows={5} />;
  if (company.isError || !company.data) {
    return <ErrorState message="Create a company before adding documents." />;
  }
  if (documents.isError) {
    return <ErrorState message="Unable to load company documents." />;
  }

  const companyId = company.data.id;
  const companyDocuments = documents.data ?? [];

  const onDelete = async (documentId: number) => {
    try {
      await deleteDocument({ companyId, documentId }).unwrap();
      toast.success("Document removed.");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to remove the document."));
    }
  };

  return (
    <>
      <PageIntro
        title="Company documents"
        description="Supporting documents a moderator reviews when verifying your company."
      />
      <div className="grid gap-6">
        <PlainCard>
          <CompanyDocumentForm companyId={companyId} />
        </PlainCard>

        {companyDocuments.length === 0 ? (
          <EmptyState
            title="No documents yet"
            description="Add one above to start the verification process."
          />
        ) : (
          <div className="grid gap-4">
            {companyDocuments.map((document) => (
              <PlainCard key={document.id}>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="min-w-0">
                    <h2 className="font-semibold text-heading">
                      {document.documentType}
                    </h2>
                    <a
                      href={document.documentUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 block truncate text-sm text-body underline-offset-2 hover:text-brand hover:underline"
                    >
                      {document.documentUrl}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusPill>{document.status}</StatusPill>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      aria-label={`Remove ${document.documentType}`}
                      className="size-11 rounded-lg text-body hover:border-destructive/40 hover:text-destructive"
                      disabled={deletion.isLoading}
                      onClick={() => onDelete(document.id)}
                    >
                      <Trash2 aria-hidden="true" className="size-4" />
                    </Button>
                  </div>
                </div>
              </PlainCard>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
