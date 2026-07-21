# Public Frontend Progress

## Current Verification Snapshot

- Branch: `frontend/public-ui-consolidation`.
- Active page route count: 31 page routes, including the conditional `/companies/[companyId]` route.
- Required target route count: 30 page routes.
- Conditional public route: `/companies/[companyId]`, retained because it uses only company data already present in `PublicJobResponse`.
- Layout count under `src/app`: 3 (`src/app/layout.tsx`, job seeker layout, recruiter layout).
- Route handlers under `src/app`: 0.
- Figma connection status: dashboard Figma source was already inspected and local assets exist under `public/figma`; this pass did not begin new Figma implementation.

## Exact Contract Files

- `src/contracts/index.ts`
- `src/contracts/api/auth.ts`
- `src/contracts/api/common.ts`
- `src/contracts/api/job-seeker.ts`
- `src/contracts/api/public.ts`
- `src/contracts/api/recruiter.ts`

## Exact Mock Files

- `src/mocks/api/common.ts`
- `src/mocks/api/index.ts`
- `src/mocks/api/job-seeker.ts`
- `src/mocks/api/public.ts`
- `src/mocks/api/recruiter.ts`

## Completed Work

- Read `build-plan/build-plan1.md`.
- Read `build-plan/public-frontend-project-structure.md`.
- Read `AGENTS.md`.
- Read local Next App Router docs from `node_modules/next/dist/docs/01-app/index.md`.
- Inspected current repository files.
- Inspected git status, remotes, branches, and commit graph.
- Compared current branch against `origin/Lyna-dev` and `kanhchana`.
- Read OpenAPI source at `docs/api/openapi.json`.
- Created audit and API page map docs.
- Added OpenAPI-shaped contracts under `src/contracts`.
- Added API-shaped static mock data under `src/mocks/api`.
- Added target public, job-seeker, and recruiter route trees.
- Removed stale dashboard, auth, landing-page, and fake backend route files.
- Removed empty placeholder component files.
- Copied the OpenAPI source to `docs/api/openapi.json`.
- Updated documentation to reference `docs/api/openapi.json` instead of a user-machine absolute path.
- Removed unused legacy mock files after confirming active pages import only `src/mocks/api`.
- Removed the Redux provider wrapper from the active root layout for the static UI phase.
- Cleaned stale auth and sidebar links that pointed at removed routes.
- Fixed lint warnings in retained legacy components without deleting useful teammate UI.

## Files Deleted

- Removed stale dashboard pages/layout: `src/app/(dashboard)/ats/page.tsx`, `src/app/(dashboard)/discovery/new/page.tsx`, `src/app/(dashboard)/jobs/new/page.tsx`, `src/app/(dashboard)/layout.tsx`, `src/app/(dashboard)/page.tsx`, `src/app/(dashboard)/profile/page.tsx`, `src/app/(dashboard)/verification/page.tsx`, `src/app/(dashboard)/watchlist/page.tsx`.
- Removed obsolete fake backend route handlers: `src/app/api/companies/portfolio-quality/route.ts`, `src/app/api/companies/required-docs/route.ts`, `src/app/api/companies/route.ts`, `src/app/api/jobs/allotment/route.ts`, `src/app/api/jobs/route.ts`, `src/app/api/profile/route.ts`, plus `src/app/api/loading.tsx`.
- Removed obsolete auth and landing routes: `src/app/auth/layout.tsx`, `src/app/auth/login/loading.tsx`, `src/app/auth/login/page.tsx`, `src/app/auth/register/loading.tsx`, `src/app/auth/register/page.tsx`, `src/app/landing-page/page.tsx`.
- Removed empty components: `src/components/auth/SocialLogin.tsx`, `src/components/company/VerificationToggle.tsx`, `src/components/shared/DocumentRow.tsx`, `src/components/shared/LoadingCard.tsx`, `src/components/shared/StatCard.tsx`.
- Removed unused legacy mocks after `src/mocks/api` replacement was confirmed: `src/mocks/company.mock.ts`, `src/mocks/job.mock.ts`, `src/mocks/profile.mock.ts`, `src/mocks/delay.ts`.

## Files Restored

- None.

## Remaining Warnings

- No lint warnings remain.
- `README.md` is still a pre-existing modified file relative to `main`.

## Remaining Legacy Code

- Retained but inactive recruiter-era components under `src/components/jobs`, `src/components/company`, `src/components/profile`, and `src/components/layout/AppShell.tsx`/`MobileNav.tsx`/`Sidebar.tsx`.
- Retained but inactive RTK Query and Redux files under `src/redux`; active root layout no longer depends on them.
- Retained older local types under `src/types` for legacy component compilation until those components are replaced or removed.
- Retained monolithic public/auth visual components as reusable teammate UI until the visual implementation phase confirms replacements.

## Validation Snapshot

- `npm run lint`: passes with zero warnings.
- `npx next typegen`: passes.
- `npx tsc --noEmit`: passes.
- `npm run build`: sandbox run is blocked by Turbopack creating a process and binding to a port; the same command passes outside the sandbox.

## Next Implementation Steps

1. Replace remaining legacy landing/dashboard components with refined domain components.
2. Extract form components for register, resume, portfolio, company, and job flows.
3. Add richer mock data for all OpenAPI states and empty/error states.
4. Rework visual styling against Figma once the source design is available.
5. Remove remaining legacy RTK Query code if the static phase does not need it.
