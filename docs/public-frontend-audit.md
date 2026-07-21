# Public Frontend Audit

Audit source: `build-plan/build-plan1.md`, `build-plan/public-frontend-project-structure.md`, local Next docs in `node_modules/next/dist/docs/01-app/index.md`, current checkout, teammate branches, and `docs/api/openapi.json`.

## Repository State

- Current branch: `frontend/public-ui-consolidation`.
- Remote: `origin https://github.com/Year2Semester2/findjob-ui.git`.
- Branches inspected: `chanchhay-dev`, `main`, `kanhchana`, `origin/Lyna-dev`, `origin/chanchhay-dev`, `origin/kanhchana`, `origin/main`.
- Pre-existing local changes before consolidation:
  - `README.md` is emptied relative to `main`.

## Branch Findings

### Original `chanchhay-dev` Snapshot

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

## Deleted-File Review

| Deleted file group | Reason | Replacement | Useful UI or logic lost | Active imports |
| --- | --- | --- | --- | --- |
| `src/app/(dashboard)/ats/page.tsx`, `watchlist/page.tsx`, `verification/page.tsx`, `(dashboard)/page.tsx` | Obsolete flat recruiter dashboard routes and placeholder screens outside the target route tree. | `/recruiter/dashboard`, `/recruiter/forwarded-candidates`, `/recruiter/company`. | No confirmed feature loss; these were placeholders or wrong-scope surfaces. | None. |
| `src/app/(dashboard)/discovery/new/page.tsx` | Wrong route/name for company setup. | `/recruiter/company`. | Company form component was retained separately. | None. |
| `src/app/(dashboard)/jobs/new/page.tsx` | Wrong flat route. | `/recruiter/jobs/new`. | Job form component was retained separately. | None. |
| `src/app/(dashboard)/profile/page.tsx`, `(dashboard)/layout.tsx` | Replaced by role-scoped recruiter shell/routes. | `/recruiter/profile`, `src/components/layout/RoleShell.tsx`. | Useful shell/profile patterns retained in components. | None. |
| `src/app/api/**/route.ts`, `src/app/api/loading.tsx` | Obsolete fake backend route handlers for the no-backend consolidation phase. | API-shaped static data in `src/mocks/api`. | No frontend UI lost; fake backend behavior intentionally removed. | None. |
| `src/app/auth/**`, `src/app/landing-page/page.tsx` | Routes moved to target public routes. | `/login`, `/register`, `/`. | Auth and landing visual components retained. | None. |
| Empty shared/auth/company components | Files had no implementation. | Current page-local UI and retained primitives. | None. | None. |
| Legacy mock files in `src/mocks/*.mock.ts` and `src/mocks/delay.ts` | Superseded by `src/mocks/api` and not imported by active pages. | `src/mocks/api/common.ts`, `public.ts`, `job-seeker.ts`, `recruiter.ts`. | No useful active mock behavior lost. | None. |

## Pre-Consolidation Validation

`npm run lint` fails.

Main errors:

- `src/components/auth/LoginForm.tsx`: unescaped apostrophe.
- `src/components/footer.tsx`: raw `<a href="/">`; use `next/link`.
- `src/components/shared/FileDropzone.tsx`: React Compiler flags synchronous state update in effect.
- `src/redux/StoreProvider.tsx`: React Compiler flags ref access during render.

`npx tsc --noEmit` fails because stale `.next` validator files reference old flat app paths.

`npm run build` fails because `next/font/google` cannot fetch Inter in the restricted environment. This is an environment/font dependency blocker, separate from app-code lint failures.

## Post-Consolidation Validation

- `npm run lint`: passes with zero warnings.
- `npx next typegen`: passes.
- `npx tsc --noEmit`: passes.
- `npm run build`: sandbox run is blocked by Turbopack trying to create a process and bind to a port; the same command passes outside the sandbox.
- Current route tree contains 31 active page routes: the 30 required routes plus `/companies/[companyId]`, which is backed only by `PublicJobResponse` data.
- Current route tree contains 3 layouts and 0 route handlers.
- Active contracts are limited to auth, common, public, job-seeker, and recruiter modules.
- Active mocks use the `ApiResponse<T>` wrapper and Spring pagination property names.

## Consolidation Rules

- Exclude all moderator/admin/finance API paths from this frontend.
- Use OpenAPI names, schemas, statuses, and actions for all screen content.
- Keep public talent discovery separate from forwarded applications.
- Recruiter candidate screens must use `/api/v1/recruiter/forwarded-applications`.
- Do not model job-by-job moderator approval. Recruiters may publish, pause, resume, and close their company jobs directly once company approval is satisfied by workflow.
- Keep pages small and move reusable content into role/domain components.
