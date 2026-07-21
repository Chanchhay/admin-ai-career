import { PublicFooter, PublicShell } from "@/components/layout/PublicShell";
import { PageContainer } from "@/components/shared/PageContainer";
import { PublicJobExplorer } from "@/components/public/PublicJobExplorer";
import {
  publicJobCategoriesResponse,
  publicJobsResponse,
  publicSkillsResponse,
} from "@/mocks/api";

export default function PublicJobsPage() {
  return (
    <PublicShell>
      <main className="bg-canvas py-10">
        <PageContainer>
          <PublicJobExplorer
            jobs={publicJobsResponse.data.content}
            categories={publicJobCategoriesResponse.data}
            skills={publicSkillsResponse.data}
          />
        </PageContainer>
      </main>
      <PublicFooter />
    </PublicShell>
  );
}
