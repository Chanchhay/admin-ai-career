# UI Registry

## Batch 1 Visual Foundation

| Component | Path | Purpose | Variants / size options | Token usage | Responsive behavior | Accessibility behavior |
| --- | --- | --- | --- | --- | --- | --- |
| `PublicShell` | `src/components/layout/PublicShell.tsx` | Public header wrapper for anonymous routes. | Desktop nav and mobile sheet. | background, surface, border, primary, primary-hover, primary-foreground, shadow-card. | Desktop inline nav; mobile drawer below `md`. | Uses landmarks, `aria-label`, active `aria-current`, keyboard-accessible sheet trigger/close. |
| `PublicFooter` | `src/components/layout/PublicShell.tsx` | Shared public footer. | Single compact variant. | surface-muted, border, text-primary, text-secondary. | Stacks naturally on small screens. | Footer landmark. |
| `RoleShell` | `src/components/layout/RoleShell.tsx` | Shared authenticated workspace shell for job seeker and recruiter routes. | `job-seeker` and `recruiter` role nav data. | background, surface, border, primary, info, shadow-card. | Desktop sidebar and topbar; mobile topbar with sheet drawer. | Uses navigation landmarks, `aria-current`, labelled notification/menu controls. |
| `PageContainer` | `src/components/shared/PageContainer.tsx` | Width and horizontal padding wrapper. | Single size. | No direct colors. | Constrained `max-w-7xl` with responsive padding. | Structural only. |
| `SectionHeader` | `src/components/shared/SectionHeader.tsx` | Reusable section title, description, action layout. | Optional description and action. | text-primary, text-secondary. | Stacks on mobile, aligns action on wider screens. | Semantic heading. |
| `SearchInput` | `src/components/shared/SearchInput.tsx` | Search field with leading icon. | Inherits `Input` props. | surface, muted text. | Full-width by parent. | Native search input and decorative icon hidden from assistive tech. |
| `FilterBar` | `src/components/shared/FilterBar.tsx` | Shared filter container. | Child-composed. | surface, border, shadow-card. | Stacks on mobile, row layout on wider screens. | Structural group container. |
| `StatusBadge` | `src/components/shared/StatusBadge.tsx` | OpenAPI status display for job, application, company, publication, interview, and generic entity statuses. | Status-driven tone. | success, warning, error, info, surface-muted, border. | Inline, no layout shift. | Text status remains visible; no color-only meaning. |
| `DataTable` | `src/components/shared/DataTable.tsx` | Generic typed table renderer. | Column-composed. | surface, surface-muted, border, text-secondary. | Horizontal scroll on narrow screens. | Uses native table, `scope="col"`. |
| `ConfirmDialog` | `src/components/shared/ConfirmDialog.tsx` | Reusable confirmation modal. | Default and destructive confirm action. | surface, border, error, shadow-dropdown. | Fixed centered modal capped to viewport width. | Base UI dialog semantics, labelled title/description, keyboard dismiss. |
| `LoadingState` | `src/components/shared/LoadingState.tsx` | Shared skeleton list state. | Configurable row count. | surface, border. | Fills parent width. | Uses existing skeleton visual primitive. |
| `EmptyState` | `src/components/shared/EmptyState.tsx` | Shared empty state. | Optional description and action. | surface, surface-muted, border, text-primary, text-secondary. | Centered content with constrained text. | Decorative icon hidden from assistive tech. |
| `Button` | `src/components/ui/button.tsx` | Base action primitive. | `default`, `outline`, `secondary`, `ghost`, `destructive`, `link`; sizes `xs`, `sm`, `default`, `lg`, icon sizes. | primary, primary-hover, primary-foreground, secondary, border, ring, destructive, shadow-card. | Stable fixed heights prevent layout shift. | Focus-visible ring, disabled state, native button behavior. |
| `Input` | `src/components/ui/input.tsx` | Base text input. | Native input types through props. | surface, input, muted text, ring, destructive. | Full-width by default. | Focus-visible ring, disabled and invalid states. |
| `Textarea` | `src/components/ui/textarea.tsx` | Base multiline input. | Native textarea props. | surface, input, muted text, ring, destructive. | Full-width by default. | Focus-visible ring, disabled and invalid states. |
| `Card` | `src/components/ui/card.tsx` | Base surface primitive. | `default`, `sm`; header/content/footer slots. | surface, border, text-primary, surface-muted, shadow-card. | Width controlled by parent. | Structural component, semantic tags supplied by caller. |

## Batch 1 Component Classification

| Component area | Classification | Notes |
| --- | --- | --- |
| `src/components/landingPage.tsx` | Defer | Useful teammate visual work, but homepage rewrite is outside Batch 1. |
| `src/components/navbar.tsx` | Defer | Legacy public nav retained until feature-page visual work confirms replacement. |
| `src/components/footer.tsx` | Defer | Legacy footer retained; `PublicFooter` is now the active public shell footer. |
| `src/components/auth/*` | Defer | Retained visual work; active `/login` and `/register` now use shared shell and primitives. |
| `src/components/layout/PublicShell.tsx` | Refactor | Refactored for Figma-aligned public header and mobile navigation. |
| `src/components/layout/RoleShell.tsx` | Refactor | Refactored for centralized role navigation, desktop sidebar, topbar, and mobile drawer. |
| `src/components/layout/AppShell.tsx`, `MobileNav.tsx`, `Sidebar.tsx`, `Topbar.tsx` | Defer | Inactive recruiter-era shell components retained until replacement is fully confirmed. |
| `src/components/ui/*` | Keep / Refactor | Existing primitives kept; Button, Input, Textarea, and Card were token-aligned in Batch 1. |
| `public/figma/*` | Keep | Local Figma-exported brand/profile assets remain available. |
| `public/images/*` | Defer | Directory is not present in this checkout. |

## Batch 2 Public And Auth Components

| Component | Path | Purpose | Variants / size options | Token usage | Responsive behavior | Accessibility behavior |
| --- | --- | --- | --- | --- | --- | --- |
| `HeroSection` | `src/components/public/HeroSection.tsx` | Homepage public hero and job search CTA. | Single homepage variant. | canvas, surface, border, brand, brand-tint, shadow-card. | Two-column desktop, single-column mobile, full-width search controls. | Semantic `h1`, labelled search inputs, native form submit to `/jobs`. |
| `CategorySection` | `src/components/public/CategorySection.tsx` | Category, industry, and skill discovery from public lookup mocks. | Category cards and tag links. | surface, border, brand, brand-tint. | Three-column desktop cards, stacked mobile cards, wrapping tags. | Links use real routes/query strings and visible focus styles from browser/Tailwind. |
| `FeaturedJobs` | `src/components/public/FeaturedJobs.tsx` | Homepage recent job grid. | Compact job cards. | canvas and shared card tokens. | Two-column desktop, stacked mobile. | Uses `PublicJobCard` link semantics. |
| `PublicJobCard` | `src/components/public/PublicJobCard.tsx` | API-shaped public job summary card. | Compact and default. | surface, border, brand, brand-tint, shadow-card/dropdown. | Flex sections wrap on mobile without horizontal overflow. | Job title and details are links; metadata remains visible as text. |
| `PublicJobExplorer` | `src/components/public/PublicJobExplorer.tsx` | Client-side static job filtering, state demos, and pagination. | Populated, loading, error, empty, active-filter, first-page, later-page states. | Delegates to shared primitives. | Filter grid collapses across mobile/tablet/desktop. | Buttons have explicit types; state controls are keyboard-accessible. |
| `PublicJobFilters` | `src/components/public/PublicJobFilters.tsx` | Public job query controls matching OpenAPI query parameters. | keyword, location, categoryId, skillIds, workMode, jobType. | surface, input, ring. | Six-column desktop, two-column tablet, stacked mobile. | Labels are present through `sr-only`; native selects and inputs. |
| `PublicJobPagination` | `src/components/public/PublicJobPagination.tsx` | Static Spring-style pagination control. | Previous/next with disabled first/last states. | surface, border. | Stacks summary/actions on mobile. | `nav` landmark with `aria-label`; disabled buttons reflect first/later pages. |
| `PublicJobList` | `src/components/public/PublicJobList.tsx` | Job result renderer for populated, empty, loading, and error states. | State-driven. | Delegates to shared `LoadingState`, `EmptyState`, `ErrorState`. | Fills parent width. | Error state uses `role="alert"`. |
| `PublicJobDetails` | `src/components/public/PublicJobDetails.tsx` | Public job detail screen from `PublicJobResponse`. | Main detail and related jobs. | canvas, surface, border, brand, brand-tint. | Two-column desktop, stacked mobile. | Semantic sections/headings and company/job links. |
| `ApplyJobDialog` | `src/components/public/ApplyJobDialog.tsx` | Static apply preview matching `JobApplicationCreateRequest`. | Open/closed state. | surface, border, brand-tint, shadow-dropdown. | Centered modal capped to viewport. | `role="dialog"`, `aria-modal`, labelled title, close button. |
| `PublicCompanySummary` | `src/components/public/PublicCompanySummary.tsx` | Conditional public company page using only `PublicJobResponse` data. | Jobs present and empty states. | canvas, surface, border, brand-tint. | Stacked content with responsive job cards. | Avoids private company fields; semantic headings and links. |
| `AuthShell` | `src/components/auth/AuthShell.tsx` | Shared login/register split-panel auth layout. | Login/register content slot. | canvas, surface, border, brand, shadow-dropdown. | Illustration hides on small screens; form remains centered. | Main landmark, semantic headings, decorative illustration icons hidden. |
| `PasswordInput` | `src/components/auth/PasswordInput.tsx` | Password field with visibility control. | Hidden/visible state, optional error. | input, ring, error. | Full-width by parent. | Label, `aria-invalid`, and labelled show/hide button. |
| `RoleSelector` | `src/components/auth/RoleSelector.tsx` | `SEEKER`/`RECRUITER` selection matching OpenAPI role enum. | Selected/unselected cards. | surface, border, brand, brand-tint, error. | Two-column desktop/tablet, stacked mobile. | Fieldset/legend, `aria-pressed`, keyboard-accessible buttons. |
| `LoginForm` | `src/components/auth/LoginForm.tsx` | Static login form because OpenAPI has no login endpoint. | Remember-me and social visual buttons. | brand, border, surface. | Social buttons wrap to one/two columns. | Labels, checkbox, correct button types, no fake submit. |
| `RegisterForm` | `src/components/auth/RegisterForm.tsx` | Static `RegisterRequest` form with local validation. | Required/optional fields and loading demonstration. | brand, input, error. | Two-column fields collapse on mobile. | Human-readable validation, required indicators, labels, `role="alert"`. |

## Batch 2 Legacy Component Classification

| Component area | Classification | Notes |
| --- | --- | --- |
| `src/components/landingPage.tsx` | Replace | Active homepage is now componentized under `src/components/public`; legacy file retained until deletion is separately confirmed. |
| `src/components/navbar.tsx` | Replace | Active public navigation uses `PublicShell`; legacy file retained because deletion was not requested. |
| `src/components/footer.tsx` | Replace | Active public footer uses `PublicFooter`; legacy file retained because deletion was not requested. |
| `src/components/auth/AuthLayout.tsx` | Replace | Active auth pages use `AuthShell`; legacy layout retained for now. |
| `src/components/auth/LoginIllustration.tsx` | Keep | Useful teammate illustration concept, but active auth shell uses tokenized CSS illustration to avoid temporary MCP assets. |
| `src/components/auth/LoginForm.tsx` | Refactor | Replaced file implementation with static login UI and kept default export for inactive legacy layout compatibility. |
| `src/components/auth/RegisterForm.tsx` | Refactor | Replaced file implementation with `RegisterRequest`-aligned static form. |
