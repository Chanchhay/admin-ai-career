# Public Frontend Project Structure

## Repository Scope

This repository contains the frontend for:

- Public visitors
- Job seekers
- Recruiters

It must not contain:

- Admin
- Moderator
- Finance

The frontend should use the current API as the source of truth for fields, statuses, actions, and workflows. Figma should be used for visual layout and styling only.

---

## Recommended Structure

```text
public-frontend/
├── public/
│   ├── images/
│   ├── icons/
│   ├── logos/
│   └── fonts/
│
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   ├── not-found.tsx
│   │   ├── loading.tsx
│   │   ├── error.tsx
│   │   │
│   │   ├── (public)/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   │
│   │   │   ├── jobs/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [jobId]/
│   │   │   │       └── page.tsx
│   │   │   │
│   │   │   ├── companies/
│   │   │   │   └── [companyId]/
│   │   │   │       └── page.tsx
│   │   │   │
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   └── register/
│   │   │       └── page.tsx
│   │   │
│   │   ├── (job-seeker)/
│   │   │   └── job-seeker/
│   │   │       ├── layout.tsx
│   │   │       │
│   │   │       ├── dashboard/
│   │   │       │   └── page.tsx
│   │   │       │
│   │   │       ├── profile/
│   │   │       │   └── page.tsx
│   │   │       │
│   │   │       ├── resumes/
│   │   │       │   ├── page.tsx
│   │   │       │   ├── new/
│   │   │       │   │   └── page.tsx
│   │   │       │   └── [resumeId]/
│   │   │       │       └── page.tsx
│   │   │       │
│   │   │       ├── portfolios/
│   │   │       │   ├── page.tsx
│   │   │       │   ├── new/
│   │   │       │   │   └── page.tsx
│   │   │       │   └── [portfolioId]/
│   │   │       │       └── page.tsx
│   │   │       │
│   │   │       ├── applications/
│   │   │       │   ├── page.tsx
│   │   │       │   └── [applicationId]/
│   │   │       │       └── page.tsx
│   │   │       │
│   │   │       └── interviews/
│   │   │           ├── page.tsx
│   │   │           └── [sessionId]/
│   │   │               ├── page.tsx
│   │   │               └── result/
│   │   │                   └── page.tsx
│   │   │
│   │   └── (recruiter)/
│   │       └── recruiter/
│   │           ├── layout.tsx
│   │           │
│   │           ├── dashboard/
│   │           │   └── page.tsx
│   │           │
│   │           ├── profile/
│   │           │   └── page.tsx
│   │           │
│   │           ├── company/
│   │           │   ├── page.tsx
│   │           │   └── documents/
│   │           │       └── page.tsx
│   │           │
│   │           ├── jobs/
│   │           │   ├── page.tsx
│   │           │   ├── new/
│   │           │   │   └── page.tsx
│   │           │   └── [jobId]/
│   │           │       ├── page.tsx
│   │           │       └── edit/
│   │           │           └── page.tsx
│   │           │
│   │           ├── talent/
│   │           │   ├── page.tsx
│   │           │   └── [publicProfileSlug]/
│   │           │       └── page.tsx
│   │           │
│   │           └── forwarded-candidates/
│   │               ├── page.tsx
│   │               └── [applicationId]/
│   │                   └── page.tsx
│   │
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Textarea.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Table.tsx
│   │   │   ├── Pagination.tsx
│   │   │   ├── Tabs.tsx
│   │   │   ├── Skeleton.tsx
│   │   │   └── EmptyState.tsx
│   │   │
│   │   ├── layout/
│   │   │   ├── PublicHeader.tsx
│   │   │   ├── PublicFooter.tsx
│   │   │   ├── DashboardHeader.tsx
│   │   │   ├── JobSeekerSidebar.tsx
│   │   │   ├── RecruiterSidebar.tsx
│   │   │   ├── MobileNavigation.tsx
│   │   │   └── PageContainer.tsx
│   │   │
│   │   ├── shared/
│   │   │   ├── PageHeader.tsx
│   │   │   ├── SearchInput.tsx
│   │   │   ├── FilterBar.tsx
│   │   │   ├── StatusBadge.tsx
│   │   │   ├── DataTable.tsx
│   │   │   ├── ConfirmDialog.tsx
│   │   │   └── FileUpload.tsx
│   │   │
│   │   ├── public/
│   │   │   ├── HeroSection.tsx
│   │   │   ├── FeaturedJobs.tsx
│   │   │   ├── JobSearchForm.tsx
│   │   │   └── CompanyPreview.tsx
│   │   │
│   │   ├── jobs/
│   │   │   ├── JobCard.tsx
│   │   │   ├── JobList.tsx
│   │   │   ├── JobFilters.tsx
│   │   │   ├── JobDetails.tsx
│   │   │   ├── JobStatusBadge.tsx
│   │   │   └── JobForm.tsx
│   │   │
│   │   ├── profiles/
│   │   │   ├── ProfileHeader.tsx
│   │   │   ├── ProfileForm.tsx
│   │   │   ├── ProfilePublicationCard.tsx
│   │   │   └── TalentProfileCard.tsx
│   │   │
│   │   ├── resumes/
│   │   │   ├── ResumeCard.tsx
│   │   │   ├── ResumeList.tsx
│   │   │   ├── ResumeForm.tsx
│   │   │   └── ResumePublicationCard.tsx
│   │   │
│   │   ├── portfolios/
│   │   │   ├── PortfolioCard.tsx
│   │   │   ├── PortfolioForm.tsx
│   │   │   ├── PortfolioProjectCard.tsx
│   │   │   └── PortfolioPublicationCard.tsx
│   │   │
│   │   ├── applications/
│   │   │   ├── ApplicationCard.tsx
│   │   │   ├── ApplicationList.tsx
│   │   │   ├── ApplicationDetails.tsx
│   │   │   ├── ApplicationStatusBadge.tsx
│   │   │   └── ApplyJobDialog.tsx
│   │   │
│   │   ├── interviews/
│   │   │   ├── InterviewCard.tsx
│   │   │   ├── InterviewQuestion.tsx
│   │   │   ├── InterviewProgress.tsx
│   │   │   ├── InterviewResult.tsx
│   │   │   └── InterviewStatusBadge.tsx
│   │   │
│   │   ├── companies/
│   │   │   ├── CompanyCard.tsx
│   │   │   ├── CompanyProfileForm.tsx
│   │   │   ├── CompanyDocumentList.tsx
│   │   │   ├── CompanyDocumentUpload.tsx
│   │   │   └── CompanyVerificationStatus.tsx
│   │   │
│   │   ├── job-seeker/
│   │   │   ├── JobSeekerDashboardStats.tsx
│   │   │   ├── RecentApplications.tsx
│   │   │   └── UpcomingInterviews.tsx
│   │   │
│   │   └── recruiter/
│   │       ├── RecruiterDashboardStats.tsx
│   │       ├── RecruiterJobTable.tsx
│   │       ├── TalentSearchResults.tsx
│   │       ├── ForwardedCandidateCard.tsx
│   │       └── ForwardedCandidateDetails.tsx
│   │
│   ├── contracts/
│   │   ├── api/
│   │   │   ├── common.ts
│   │   │   ├── public.ts
│   │   │   ├── job-seeker.ts
│   │   │   └── recruiter.ts
│   │   │
│   │   ├── enums/
│   │   │   ├── account-status.ts
│   │   │   ├── application-status.ts
│   │   │   ├── company-verification-status.ts
│   │   │   ├── interview-status.ts
│   │   │   ├── job-status.ts
│   │   │   ├── publication-status.ts
│   │   │   └── work-mode.ts
│   │   │
│   │   └── index.ts
│   │
│   ├── mocks/
│   │   ├── public/
│   │   │   ├── jobs.ts
│   │   │   ├── job-details.ts
│   │   │   ├── categories.ts
│   │   │   ├── skills.ts
│   │   │   └── industries.ts
│   │   │
│   │   ├── job-seeker/
│   │   │   ├── profile.ts
│   │   │   ├── resumes.ts
│   │   │   ├── portfolios.ts
│   │   │   ├── applications.ts
│   │   │   └── interviews.ts
│   │   │
│   │   └── recruiter/
│   │       ├── profile.ts
│   │       ├── company.ts
│   │       ├── company-documents.ts
│   │       ├── jobs.ts
│   │       ├── talent.ts
│   │       └── forwarded-candidates.ts
│   │
│   ├── services/
│   │   ├── api-client.ts
│   │   ├── public-service.ts
│   │   ├── job-seeker-service.ts
│   │   └── recruiter-service.ts
│   │
│   ├── hooks/
│   │   ├── use-debounce.ts
│   │   ├── use-pagination.ts
│   │   ├── use-disclosure.ts
│   │   └── use-role-navigation.ts
│   │
│   ├── lib/
│   │   ├── navigation.ts
│   │   ├── permissions.ts
│   │   ├── constants.ts
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   └── utils.ts
│   │
│   ├── config/
│   │   ├── app.ts
│   │   ├── routes.ts
│   │   └── environment.ts
│   │
│   └── styles/
│       └── tokens.css
│
├── docs/
│   ├── public-frontend-audit.md
│   ├── public-frontend-structure-plan.md
│   ├── public-frontend-api-page-map.md
│   ├── public-frontend-progress.md
│   └── ui-registry.md
│
├── .env.example
├── .gitignore
├── components.json
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── tsconfig.json
└── README.md
```

---

## Folder Responsibilities

### `src/app`

Contains routes, route layouts, page composition, loading states, and error boundaries.

Pages should remain small. Business display sections should be extracted into `components`.

### `src/components/ui`

Contains generic reusable UI primitives only.

Examples:

- Button
- Input
- Select
- Badge
- Card
- Modal
- Table
- Pagination

These components must not contain recruiter-specific or job-seeker-specific logic.

### `src/components/shared`

Contains components reused across multiple domains or roles.

Examples:

- Page headers
- Search bars
- Status badges
- Data tables
- Empty states
- File uploads

### `src/components/public`

Contains homepage and anonymous browsing components.

### `src/components/job-seeker`

Contains job-seeker dashboard components that are not reusable in other domains.

### `src/components/recruiter`

Contains recruiter dashboard components that are not reusable in other domains.

### Domain Component Folders

The following folders organize reusable components by business domain:

```text
jobs/
profiles/
resumes/
portfolios/
applications/
interviews/
companies/
```

A domain component may be reused by multiple roles when permissions and actions are passed through props.

### `src/contracts`

Contains TypeScript types that match the current OpenAPI request and response schemas.

Do not define duplicate API types inside page files.

### `src/mocks`

Contains static mock responses that match the actual API response structures.

Mock data must remain separate from components and pages.

### `src/services`

Contains API client functions for later backend integration.

During the static UI phase, services may remain empty or provide typed interfaces only. Do not create fake asynchronous APIs that pretend backend integration is complete.

### `src/hooks`

Contains generic reusable React hooks.

Do not move simple component-local state into a custom hook unless the logic is reused.

### `src/lib`

Contains shared utilities, navigation definitions, permissions, validators, constants, and formatters.

### `src/config`

Contains application-wide configuration and route constants.

### `src/styles`

Contains shared design tokens extracted and normalized from Figma.

### `docs`

Contains repository audit, structure decisions, API mappings, UI registry, and progress tracking.

---

## Route Ownership

### Public Routes

```text
/
/jobs
/jobs/[jobId]
/companies/[companyId]
/login
/register
```

### Job Seeker Routes

```text
/job-seeker/dashboard
/job-seeker/profile
/job-seeker/resumes
/job-seeker/resumes/new
/job-seeker/resumes/[resumeId]
/job-seeker/portfolios
/job-seeker/portfolios/new
/job-seeker/portfolios/[portfolioId]
/job-seeker/applications
/job-seeker/applications/[applicationId]
/job-seeker/interviews
/job-seeker/interviews/[sessionId]
/job-seeker/interviews/[sessionId]/result
```

### Recruiter Routes

```text
/recruiter/dashboard
/recruiter/profile
/recruiter/company
/recruiter/company/documents
/recruiter/jobs
/recruiter/jobs/new
/recruiter/jobs/[jobId]
/recruiter/jobs/[jobId]/edit
/recruiter/talent
/recruiter/talent/[publicProfileSlug]
/recruiter/forwarded-candidates
/recruiter/forwarded-candidates/[applicationId]
```

---

## Structure Rules

1. Do not place Admin, Moderator, or Finance pages in this repository.
2. Do not keep mock data directly inside large page components.
3. Do not duplicate API types across pages.
4. Do not create multiple components for the same UI pattern.
5. Use Figma for visual design, not business workflow.
6. Use the current OpenAPI for fields, enums, actions, and statuses.
7. Public talent discovery and private applications must remain separate.
8. Recruiters may access private candidate applications only after moderator forwarding.
9. Company verification applies to the company, not every individual job.
10. Keep pages small and move reusable UI into domain component folders.
11. Keep role layouts separate but reuse generic UI primitives.
12. Do not add real backend integration during the static UI consolidation phase.

---

## Existing Project Without `src`

When the current repository does not use a `src` directory, keep the same structure at the root:

```text
app/
components/
contracts/
mocks/
services/
hooks/
lib/
config/
styles/
docs/
```

Do not introduce `src` only for appearance when it would create unnecessary path changes near the deadline.
