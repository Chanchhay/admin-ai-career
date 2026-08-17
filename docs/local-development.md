# Admin console local development

You edit this app on your machine, but it runs behind the **API gateway** and
talks to the **deployed API**. Nothing else needs installing — no database, no
Keycloak, no Java backend.

## The one rule

**Open `http://localhost:8090/admin`, never `http://localhost:3001`.**

Port 3001 renders pages and nothing else. Sign-in, sign-out and every `/api/**`
call are owned by the gateway on port 8090. Opening 3001 directly gives you a
console that 401s on every request and cannot log you in.

```
Browser  →  localhost:8090   gateway (auth + routing)
                 ├── /oauth2/**, /logout, /bff/session   handled by the gateway
                 ├── /api/**    → the deployed API
                 ├── /admin/**  → this console on :3001
                 └── /**        → the main frontend on :3000
```

The gateway holds the session cookie and attaches the access token to API calls,
so the browser never sees a token. That is why this app has no auth code.

## One-time setup

### 1. Clone the console and the gateway

```bash
git clone https://github.com/Chanchhay/admin-ai-career.git
git clone https://github.com/Chanchhay/kagea-gateway.git   # the gateway-bff repo
```

### 2. Configure the gateway

```bash
cd gateway-bff
cp .env.example .env
```

Fill in `.env` — ask the team lead for the client secret:

```properties
KEYCLOAK_ISSUER_URI=https://auth.chanchhay.site/realms/ai-career
KEYCLOAK_BFF_CLIENT_ID=ai-career-bff-local
KEYCLOAK_BFF_CLIENT_SECRET=<ask the team lead>
BACKEND_URI=https://aicareerinterviewapi-production.up.railway.app
FRONTEND_URI=http://localhost:3000
ADMIN_FRONTEND_URI=http://localhost:3001
PORT=8090
SESSION_COOKIE_SECURE=false
```

`SESSION_COOKIE_SECURE` must stay `false` locally. A `Secure` cookie is dropped
silently over plain HTTP, and login then appears to do nothing at all.

`ADMIN_FRONTEND_URI` is the only line specific to this console. The gateway
routes `/admin/**` there and everything else to `FRONTEND_URI`.

### 3. Install dependencies

```bash
cd admin-ai-career
npm install
```

This app needs **no** `.env` file. It holds no secrets and no API URL — every
request is same-origin through the gateway.

## Daily workflow

Two terminals:

```bash
# terminal 1 — the console you are editing (port 3001)
cd admin-ai-career && npm run dev

# terminal 2 — the gateway
cd gateway-bff && ./gradlew bootRun
```

Then open **http://localhost:8090/admin**.

The main frontend on :3000 does not have to be running. Only requests outside
`/admin/**` and `/api/**` go there, and the console makes none.

Hot reload works normally: the gateway proxies the HMR websocket, so saving a
file refreshes the browser exactly as if you were on port 3001.

### No Java installed?

Run the gateway with Docker instead:

```bash
cd gateway-bff
docker build -t kagea-gateway .
docker run --rm -p 8090:8090 --env-file .env \
  -e ADMIN_FRONTEND_URI=http://host.docker.internal:3001 \
  -e FRONTEND_URI=http://host.docker.internal:3000 \
  --add-host host.docker.internal:host-gateway \
  kagea-gateway
```

## Things worth knowing

**Your account needs `MODERATOR` or `SUPER_ADMIN`,** *and* rows in the API's
database. Creating a user in Keycloak is only half of it — the API keeps its own
`user_accounts` and profile rows, and staff accounts are not created by any
registration flow. The backend repo's `docs/staff-accounts.md` has the runbook
and the SQL.

Which failure you get tells you which half is missing:

| Response | Missing |
| --- | --- |
| `403` on every screen | the realm role in Keycloak |
| `404` *Moderator profile was not found for authenticated user* | the database rows |

**You are using production data.** The deployed API and real user accounts are
live. Approving a company or forwarding a candidate is a real decision someone
will act on. Use test rows.

**Decisions are one-way.** There is no undo endpoint. The note you write is the
only explanation the recruiter or candidate ever sees, so write it before
pressing the button.

**Reference data is shared.** Deleting an industry or a skill breaks the link
for every company, job and resume already pointing at it. Rename in place unless
you are sure nothing references the row.

## Troubleshooting

| Symptom | Cause |
| --- | --- |
| Console loads unstyled or blank | `basePath` was removed from `next.config.ts`, so `/admin/_next/**` chunks are being served by the main app. |
| Every page bounces to Keycloak and back | `SESSION_COOKIE_SECURE=true` in a local `.env`. Set it to `false`. |
| `502` / connection refused under `/admin` | The dev server is not running, or it is not on port 3001. |
| Every `/api/**` call returns `401` | The gateway session expired. Reload — you will be bounced through Keycloak and back. |
| Every screen returns `403` | The signed-in account has neither `MODERATOR` nor `SUPER_ADMIN` in the Keycloak realm. |
| `404` "Moderator profile was not found" on approve | The account exists in Keycloak but has no rows in the API database. Run the backend's `scripts/provision-staff-account.sql`. |
| Role was granted but nothing changed | Roles come from the access token. Sign out and back in so a new one is issued. |
| `Invalid parameter: redirect_uri` at Keycloak | Gateway is not on port 8090, or the client is missing the localhost redirect URI. |
