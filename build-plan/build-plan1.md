Read the entire repository before changing any files.

You are working only on the PUBLIC FRONTEND repository for the AI Career
Platform.

REPOSITORY OWNERSHIP

This repository contains:

- Anonymous/public visitors
- Job seekers
- Recruiters

This repository must not contain:

- Admin
- Moderator
- Finance

PROJECT GOAL

Consolidate the existing frontend code and useful teammate contributions into
one clean static frontend.

The result must:

- have a clear and maintainable project structure
- reuse existing teammate code when it is genuinely usable
- fix inaccurate or inconsistent UI
- follow Figma for visual design
- follow the current OpenAPI for fields, actions, statuses and workflows
- use static API-shaped mock data
- contain no real backend integration yet
- pass lint, TypeScript checking and production build

SOURCE-OF-TRUTH PRIORITY

Use this priority when information conflicts:

1. Current OpenAPI JSON
2. Confirmed project workflows and role permissions
3. Current domain names and enum values
4. Existing frontend implementation when technically usable
5. Figma for visual layout and styling

Figma is not the source of truth for business logic.

When Figma conflicts with the API:

- preserve the useful visual layout
- replace incorrect fields
- replace unsupported actions
- use actual API statuses
- use the confirmed workflow

CONFIRMED BUSINESS RULES

1. Public visitors can browse published jobs.
2. Job seekers manage only their own:
   - profile
   - profile publication
   - resumes
   - resume publication
   - portfolios
   - portfolio projects
   - portfolio publication
   - applications
   - AI interviews
   - AI interview results
3. Recruiters can manage:
   - recruiter profile
   - company profile
   - company documents
   - company verification submission
   - company job posts
   - public talent discovery
   - forwarded candidates
4. Recruiters may browse profiles, resumes and portfolios only when the job
   seeker explicitly publishes them.
5. Public talent discovery is separate from private job applications.
6. Recruiters cannot see private applications or AI interview results until a
   moderator explicitly forwards the application.
7. The recruiter candidate area must show forwarded applications only.
8. Company verification applies to the company.
9. Once a company is approved, its recruiter may publish, pause, update and
   close jobs directly.
10. Do not implement moderator approval for every job post.
11. Do not add Admin, Moderator or Finance routes to this repository.

CURRENT TASK

First inspect and consolidate the current frontend and teammate work.

Do not immediately rewrite everything.

PHASE 1 — GIT AND TEAM CODE AUDIT

Inspect:

- git status
- git remote -v
- git branch -a
- git log --oneline --all --decorate --graph
- relevant differences between the current branch and teammate branches

Do not perform a full merge before reviewing the code.

For every existing page and important component, classify it as:

KEEP
- clean
- reusable
- follows current project terminology
- close to Figma
- compatible with the target structure

REFACTOR
- useful implementation
- needs cleanup
- needs naming changes
- needs API alignment
- needs visual corrections
- needs component extraction

REWRITE
- incorrect workflow
- strongly inconsistent with Figma
- monolithic
- duplicated
- poorly structured
- difficult to maintain

REMOVE
- obsolete
- duplicated
- belongs to Admin, Moderator or Finance
- unrelated to the current platform
- unused after consolidation

Do not keep weak code merely because a teammate created it.

Prefer:

- selectively reusing files
- moving useful components
- cherry-picking clean commits
- refactoring reusable sections

Avoid merging a complete teammate branch unless most of it is clean and
compatible.

PHASE 2 — INSPECT THE CURRENT PROJECT

Inspect all:

- App Router pages
- layouts
- components
- UI primitives
- hooks
- context providers
- state management
- mock data
- API clients
- services
- TypeScript types
- enums
- styles
- assets
- navigation definitions
- role checks
- configuration files

Identify:

- duplicate components
- duplicate layouts
- pages containing large amounts of inline JSX
- mock data inside page components
- hardcoded role permissions
- raw status strings
- inconsistent route naming
- wrong-role pages
- unused files
- broken imports
- incomplete pages
- Figma/API conflicts

PHASE 3 — API CAPABILITY MAP

Read the current OpenAPI JSON.

If the current OpenAPI JSON is not available in the repository, stop and ask
me for its location. Do not invent API contracts.

Map the following capabilities.

PUBLIC

- public job list
- public job details
- job categories
- skills
- industries
- company details when supported
- login UI
- registration UI

JOB SEEKER

- dashboard
- profile
- profile publication
- resumes
- resume details
- resume publication
- portfolios
- portfolio details
- portfolio projects
- portfolio publication
- applications
- application details
- application withdrawal
- AI interview list
- AI interview session
- AI interview questions
- AI interview results

RECRUITER

- dashboard
- recruiter profile
- company profile
- company documents
- company verification submission
- job list
- create job
- job details
- update job
- publish job
- pause job
- resume job
- close job
- public talent search
- public talent details
- published resume download
- forwarded candidate list
- forwarded candidate details

For every screen, determine:

- related endpoint
- HTTP method
- request schema
- response schema
- enum values
- supported actions
- existing route
- existing component
- missing UI

PHASE 4 — FIGMA REVIEW

Use the configured Figma MCP server.

Inspect only the frames belonging to:

- public pages
- job-seeker pages
- recruiter pages

Do not inspect or implement Admin, Moderator or Finance frames.

Use Figma for:

- spacing
- colors
- typography
- borders
- shadows
- responsive behavior
- component appearance
- layout composition
- icons and assets

Do not copy inaccurate Figma workflows.

When the API contains information missing from Figma, add it using the nearest
existing Figma component pattern.

When Figma contains unsupported actions, remove or replace them.

TARGET PROJECT STRUCTURE

Use this as the target structure.

If the repository currently does not use a `src` directory, keep the same
folders at the project root. Do not introduce `src` only for appearance.

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
│   │   │   ├── jobs/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [jobId]/
│   │   │   │       └── page.tsx
│   │   │   ├── companies/
│   │   │   │   └── [companyId]/
│   │   │   │       └── page.tsx
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── register/
│   │   │       └── page.tsx
│   │   │
│   │   ├── (job-seeker)/
│   │   │   └── job-seeker/
│   │   │       ├── layout.tsx
│   │   │       ├── dashboard/
│   │   │       ├── profile/
│   │   │       ├── resumes/
│   │   │       │   ├── new/
│   │   │       │   └── [resumeId]/
│   │   │       ├── portfolios/
│   │   │       │   ├── new/
│   │   │       │   └── [portfolioId]/
│   │   │       ├── applications/
│   │   │       │   └── [applicationId]/
│   │   │       └── interviews/
│   │   │           └── [sessionId]/
│   │   │               └── result/
│   │   │
│   │   └── (recruiter)/
│   │       └── recruiter/
│   │           ├── layout.tsx
│   │           ├── dashboard/
│   │           ├── profile/
│   │           ├── company/
│   │           │   └── documents/
│   │           ├── jobs/
│   │           │   ├── new/
│   │           │   └── [jobId]/
│   │           │       └── edit/
│   │           ├── talent/
│   │           │   └── [publicProfileSlug]/
│   │           └── forwarded-candidates/
│   │               └── [applicationId]/
│   │
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   ├── shared/
│   │   ├── public/
│   │   ├── jobs/
│   │   ├── profiles/
│   │   ├── resumes/
│   │   ├── portfolios/
│   │   ├── applications/
│   │   ├── interviews/
│   │   ├── companies/
│   │   ├── job-seeker/
│   │   └── recruiter/
│   │
│   ├── contracts/
│   │   ├── api/
│   │   │   ├── common.ts
│   │   │   ├── public.ts
│   │   │   ├── job-seeker.ts
│   │   │   └── recruiter.ts
│   │   ├── enums/
│   │   └── index.ts
│   │
│   ├── mocks/
│   │   ├── public/
│   │   ├── job-seeker/
│   │   └── recruiter/
│   │
│   ├── services/
│   │   ├── api-client.ts
│   │   ├── public-service.ts
│   │   ├── job-seeker-service.ts
│   │   └── recruiter-service.ts
│   │
│   ├── hooks/
│   ├── lib/
│   ├── config/
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
├── next.config.ts
├── package.json
├── tsconfig.json
└── README.md

FOLDER RESPONSIBILITIES

`app/`
- routes
- route layouts
- page composition
- loading states
- error boundaries
- minimal page-level logic

`components/ui/`
- generic primitives only
- no recruiter-specific or seeker-specific logic

`components/shared/`
- reusable cross-domain components
- page headers
- search inputs
- filter bars
- status badges
- tables
- confirmation dialogs
- file uploads

Domain folders:

- jobs
- profiles
- resumes
- portfolios
- applications
- interviews
- companies

Place components in domain folders when they may be reused across roles.

`components/job-seeker/`
- seeker-only dashboard components

`components/recruiter/`
- recruiter-only dashboard components

`contracts/`
- types matching OpenAPI
- shared API wrappers
- real enum values
- no duplicate API types inside pages

`mocks/`
- static responses matching OpenAPI
- no mock data inside page files

`services/`
- future backend integration boundary
- do not pretend the backend is connected
- during this phase, services may contain typed contracts only

`hooks/`
- reusable hooks only
- do not extract one-use local state unnecessarily

`lib/`
- navigation
- permissions
- constants
- formatters
- validators
- utilities

`config/`
- application configuration
- route constants
- environment validation

`styles/`
- normalized Figma design tokens

`docs/`
- audit
- structure decisions
- API mapping
- progress
- UI registry

ROUTE OWNERSHIP

PUBLIC

/
/jobs
/jobs/[jobId]
/companies/[companyId]
/login
/register

JOB SEEKER

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

RECRUITER

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

STATIC MOCK DATA RULES

Use a common API wrapper:

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

Every mock must match a current OpenAPI schema.

Use real backend enum values.

Do not create simplified mock fields such as:

{
  name: "Developer",
  status: "Open"
}

when the API uses fields such as:

{
  id,
  title,
  companyName,
  location,
  jobType,
  workMode,
  status,
  salaryMin,
  salaryMax,
  publishedAt,
  expiredAt
}

Place mocks in:

- mocks/public
- mocks/job-seeker
- mocks/recruiter

Components must receive typed props.

Do not import page-specific mocks directly inside deeply reusable UI
primitives.

DESIGN SYSTEM RULES

1. Extract shared tokens from Figma.
2. Store normalized tokens in `styles/tokens.css` or the existing global
   Tailwind token location.
3. Do not hardcode hex colors inside components.
4. Do not use raw Tailwind colors when a project token exists.
5. Use consistent:
   - button styles
   - inputs
   - selects
   - badges
   - cards
   - tables
   - modals
   - spacing
   - border radius
   - shadows
6. Reuse existing design primitives when they are accurate.
7. Correct inaccurate teammate UI instead of layering more CSS on top of it.
8. Do not create duplicate versions such as:
   - Button2
   - NewButton
   - JobCardUpdated
   - JobCardFinal

COMPONENT RULES

- TypeScript strict mode
- no `any`
- named component exports
- one main component per file
- Server Components by default
- add `"use client"` only when required
- keep pages small
- move reusable sections into components
- do not place API calls inside visual components
- do not hardcode role permissions inside generic components
- actions and visibility must be passed through props or derived from a
  centralized permission helper
- do not create abstractions used only once
- do not add unnecessary dependencies

IMPLEMENTATION ORDER

Complete the work in batches.

BATCH 1 — FOUNDATION

- inspect and normalize global styles
- create design tokens
- consolidate UI primitives
- consolidate shared components
- consolidate navigation definitions
- implement public layout
- implement job-seeker layout
- implement recruiter layout
- remove wrong-role navigation

BATCH 2 — PUBLIC

- homepage
- job listing
- job details
- company details when supported
- login UI
- registration UI

BATCH 3 — JOB SEEKER PROFILE

- seeker dashboard
- profile
- publication controls
- resumes
- resume details
- portfolios
- portfolio projects

BATCH 4 — JOB SEEKER RECRUITMENT FLOW

- applications
- application details
- withdraw state
- AI interview list
- interview session
- interview result

BATCH 5 — RECRUITER COMPANY AND JOBS

- recruiter dashboard
- recruiter profile
- company profile
- company documents
- verification submission state
- job list
- create job
- job details
- edit job
- publish/pause/resume/close states

BATCH 6 — RECRUITER TALENT

- public talent search
- public talent details
- published resume access state
- forwarded candidate list
- forwarded candidate details

STATE REQUIREMENTS

For pages where relevant, support static examples of:

- populated state
- empty state
- loading state
- error state
- disabled action state
- pending verification state
- approved state
- rejected state
- suspended state
- published state
- paused state
- closed state
- forwarded state

Buttons may change local display state for demonstration.

Do not create fake persistence.

DOCUMENTATION REQUIREMENTS

Create and maintain:

docs/public-frontend-audit.md
docs/public-frontend-structure-plan.md
docs/public-frontend-api-page-map.md
docs/public-frontend-progress.md
docs/ui-registry.md

The audit document must include:

- branches reviewed
- current route map
- target route map
- files classified KEEP
- files classified REFACTOR
- files classified REWRITE
- files classified REMOVE
- reusable teammate code
- duplicate code
- Figma/API conflicts
- risks

The API page map must include:

| Role | Page | Route | Endpoint | Schema | Existing status | UI status |

The progress document must include:

- completed batch
- current batch
- next batch
- files changed
- checks passed
- remaining known issues

The UI registry must record reusable component patterns after they are
consolidated.

VALIDATION

After each batch run the repository’s available commands for:

- formatting
- lint
- TypeScript checking
- tests
- production build

Use the package manager already configured in the repository.

Do not switch package managers.

Do not ignore failures.

Do not continue to the next batch while the current batch has:

- TypeScript errors
- unresolved imports
- build failures
- duplicated active routes
- broken navigation

GIT SAFETY

Work on a separate branch named:

frontend/public-ui-consolidation

Before creating it:

- inspect git status
- do not overwrite uncommitted work
- stash or commit existing work when necessary

Do not:

- force push
- reset shared branches
- delete teammate branches
- rewrite remote history
- push before validation passes

Do not automatically push.

At the end, report the recommended commit plan.

EXPECTED FINAL REPORT

At the end of every batch, report:

1. Pages completed
2. Files reused from teammate work
3. Files refactored
4. Files rewritten
5. Files removed
6. Components consolidated
7. OpenAPI schemas represented
8. Figma differences corrected
9. Validation results
10. Remaining work

FIRST ACTION

Start with audit and planning only.

Do not modify implementation files yet.

Create:

- docs/public-frontend-audit.md
- docs/public-frontend-structure-plan.md
- docs/public-frontend-api-page-map.md

Then stop and show me the findings before beginning Batch 1.
