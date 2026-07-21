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
