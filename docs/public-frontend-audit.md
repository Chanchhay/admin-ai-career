# Public Frontend Audit

Audit source: `build-plan/build-plan1.md`, `build-plan/public-frontend-project-structure.md`, local Next docs in `node_modules/next/dist/docs/01-app/index.md`, current checkout, teammate branches, and `/home/chanchhay/Downloads/api-docs.json`.

## Repository State

- Current branch: `chanchhay-dev`.
- Remote: `origin https://github.com/Year2Semester2/findjob-ui.git`.
- Branches inspected: `chanchhay-dev`, `main`, `kanhchana`, `origin/Lyna-dev`, `origin/chanchhay-dev`, `origin/kanhchana`, `origin/main`.
- Existing local changes before consolidation:
  - `README.md` is emptied.
  - `src/components/landingPage.tsx` has a small quote escape edit.
  - `build-plan/` is untracked.

## Branch Findings

### Current `chanchhay-dev`

Current code mixes:

- a recruiter-style dashboard under `src/app/(dashboard)`
- a public landing page under `/landing-page`
- auth pages under `/auth/login` and `/auth/register`
- Next Route Handlers under `src/app/api` used as a fake backend

This does not yet match the target route ownership:

- public routes: `/`, `/jobs`, `/jobs/[jobId]`, `/companies/[companyId]`, `/login`, `/register`
- job seeker routes: `/job-seeker/*`
- recruiter routes: `/recruiter/*`

### `origin/Lyna-dev`

Classification: **REFACTOR selectively**.

Useful work:

- recruiter dashboard components
- company form pieces
- job form pieces
- profile display components
- AppShell/sidebar/topbar structure
- typed RTK Query pattern

Issues:

- routes are flattened to `/jobs/new`, `/profile`, `/ats`, `/watchlist`, `/verification`
- still recruiter-only, not public/job-seeker/recruiter scoped
- contains stale recruiter workflow assumptions
- includes lint/type defects, for example `contro={form.control}` in `JobForm`

Do not merge the full branch.

### `kanhchana`

Classification: **REFACTOR selectively** for landing/auth assets; **REMOVE** broad deletion strategy.

Useful work:

- public landing page visual direction
- auth form visual direction
- images in `public/images`

Issues:

- deletes most dashboard/API/type/component structure
- `src/app/page.tsx` imports `@/src/components/landingPage`, which is incompatible with this checkout path alias
- auth forms use local state and do not match the OpenAPI `RegisterRequest` fields exactly
- keeps large monolithic landing JSX and hardcoded mock data inside components

Do not merge the full branch.

## Current File Classification

### KEEP

- `src/components/ui/*`: keep as primitive baseline, but verify Base UI usage during edits.
- `src/lib/utils.ts`: keep.
- `src/lib/format.ts`: keep if still needed by forms.
- `src/app/error.tsx`, `src/app/not-found.tsx`: keep style pattern, but update links/copy to public frontend routes.
- `src/components/shared/ErrorState.tsx`, `FieldWrapper.tsx`, `ComingSoon.tsx`: keep/refine.

### REFACTOR

- `src/components/landingPage.tsx`: useful visual content, but monolithic and contains inline mock data, manual SVG icons, raw `img`, hardcoded categories/jobs, and public route mismatch.
- `src/components/navbar.tsx`, `src/components/footer.tsx`: useful public shell direction, but need Next `Link`/`Image`, target routes, and role-safe navigation.
- `src/components/auth/LoginForm.tsx`, `RegisterForm.tsx`, `AuthLayout.tsx`, `LoginIllustration.tsx`: useful visual direction, but route paths and API fields need alignment.
- `src/components/layout/*`: useful recruiter shell, but must move under `/recruiter` and remove wrong-role entries.
- `src/components/jobs/*`: useful recruiter create-job form pieces, but current fields must align to `JobPostRequest`.
- `src/components/company/*`: useful company form/document pieces, but current fields must align to `CompanyCreateRequest`, `CompanyUpdateRequest`, and `CompanyDocumentRequest`.
- `src/components/profile/*`: useful recruiter profile display patterns, but current data shape does not match `RecruiterProfileResponse`.
- `src/redux/*`: useful single API pattern, but the static phase should not depend on fake async route handlers. Prefer typed services or direct static mock imports until real backend integration starts.
- `src/types/*`: replace with OpenAPI-shaped contracts.
- `src/mocks/*`: replace with API-shaped mock responses and keep mocks out of page components.

### REWRITE

- `src/app/(dashboard)/ats/page.tsx`: ATS board is not a confirmed recruiter capability. Recruiter candidate area must show forwarded applications only.
- `src/app/(dashboard)/watchlist/page.tsx`: not in OpenAPI or target route map.
- `src/app/(dashboard)/verification/page.tsx`: generic verification center implies moderator/compliance workflows. Replace with recruiter company verification submission under `/recruiter/company`.
- `src/app/(dashboard)/page.tsx`: recruiter dashboard placeholder can be rewritten into `/recruiter/dashboard`.
- `src/app/(dashboard)/discovery/new/page.tsx`: current "Add New Company" route/name does not match `/recruiter/company`.
- `src/app/(dashboard)/jobs/new/page.tsx`: route should be `/recruiter/jobs/new`.
- `src/app/(dashboard)/profile/page.tsx`: route should be `/recruiter/profile`.

### REMOVE

- `src/components/shared/DocumentRow.tsx`, `LoadingCard.tsx`, `StatCard.tsx`: empty.
- `src/components/auth/SocialLogin.tsx`: empty.
- `src/components/company/VerificationToggle.tsx`: empty.
- Moderator, admin, or finance routes/components if introduced later.
- `src/app/api/*` route handlers after replacing them with static API-shaped mocks for the no-backend phase.

## Current Validation

`npm run lint` fails.

Main errors:

- `src/components/auth/LoginForm.tsx`: unescaped apostrophe.
- `src/components/footer.tsx`: raw `<a href="/">`; use `next/link`.
- `src/components/shared/FileDropzone.tsx`: React Compiler flags synchronous state update in effect.
- `src/redux/StoreProvider.tsx`: React Compiler flags ref access during render.

`npx tsc --noEmit` fails because stale `.next` validator files reference old flat app paths.

`npm run build` fails because `next/font/google` cannot fetch Inter in the restricted environment. This is an environment/font dependency blocker, separate from app-code lint failures.

## Consolidation Rules

- Exclude all moderator/admin/finance API paths from this frontend.
- Use OpenAPI names, schemas, statuses, and actions for all screen content.
- Keep public talent discovery separate from forwarded applications.
- Recruiter candidate screens must use `/api/v1/recruiter/forwarded-applications`.
- Do not model job-by-job moderator approval. Recruiters may publish, pause, resume, and close their company jobs directly once company approval is satisfied by workflow.
- Keep pages small and move reusable content into role/domain components.
