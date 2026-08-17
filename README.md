# AI Career — Admin console

The moderation and reference-data console for the AI Career Platform. A separate
Next.js app from the main frontend, served by the same API gateway under the
`/admin` path.

It covers exactly three things, because those are the only ones the API exposes
to staff accounts:

| Section | Endpoints |
| --- | --- |
| Companies — verification queue and decisions | `/api/v1/moderator/companies/**` |
| Applications — candidate review, human interviews, forwarding | `/api/v1/moderator/candidate-applications/**`, `/api/v1/moderator/human-interviews/**` |
| Industries, job categories, skills | `/api/v1/admin/{industries,job-categories,skills}` |

There is no user administration, finance, or reporting screen: the backend has
no endpoints behind them. When those land, add the service slice and the page —
do not re-introduce a mock screen.

## Architecture

```
Browser  →  gateway :8090
               ├── /oauth2/**, /logout, /bff/session   the gateway itself
               ├── /api/**     → the backend API
               ├── /admin/**   → this console      (:3001, basePath /admin)
               └── /**         → the main frontend (:3000)
```

Two consequences worth remembering:

- **`basePath: "/admin"` is load-bearing.** It puts this app's chunks at
  `/admin/_next/**` so the gateway's single path predicate can route them here.
  Remove it and the console renders blank behind the gateway.
- **This app holds no auth code.** The gateway owns the session cookie and
  attaches the access token to `/api/**`. Sign-in is a link to
  `/oauth2/authorization/keycloak`, sign-out a form post to `/logout` — plain
  HTML rather than `next/link`, so `basePath` leaves them alone.

## Roles

**This console needs `MODERATOR` or `SUPER_ADMIN`.** Both the review queues and
the reference data are guarded by the backend, which enforces every rule in one
place — `SecurityConfig`'s URL patterns, not controller annotations:

| Path | Role |
| --- | --- |
| `/api/v1/moderator/**` | `MODERATOR` |
| `/api/v1/admin/**` | `MODERATOR` |
| `/api/v1/me` | any signed-in account |

`SUPER_ADMIN` reaches both through a role hierarchy (`SUPER_ADMIN > MODERATOR,
FINANCE`), so it never has to be named on a staff rule.

An account without either role gets 403s on every screen here. That check lives
on the backend on purpose — one this app performed would be one a direct API
call skips.

## Running it

See [docs/local-development.md](docs/local-development.md).

## Layout

```
src/
  app/            one route per console section; the shell is in the root layout
  components/
    console/      screen parts — status chips, pager, taxonomy CRUD
    layout/       AdminShell (rail, top bar, role banner) and page headings
    shared/       loading and error states
    ui/           base primitives (button, input, textarea, skeleton, toaster)
    workspace/    the design system's chips, panels, and tabs
  contracts/api/  request and response types, one file per API area
  lib/            formatting, error unwrapping, file URLs, navigation
  services/       RTK Query slices — baseApi, authApi, moderationApi, taxonomyApi
  store/          Redux store and provider
```
