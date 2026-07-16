This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


# TalentPulse

Recruiter / ATS workspace. Next.js 15 (App Router) · TypeScript · Tailwind ·
shadcn/ui (Base UI) · Redux Toolkit + RTK Query · React Hook Form + Zod.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000. With no `.env.local`, the app runs against a built-in
mock backend — no external services required.

## Mock backend strategy

The real Spring Boot API isn't wired in yet, so the frontend talks to a fake
backend that lives behind the same HTTP boundary the real one will use.

- **`NEXT_PUBLIC_API_URL` unset** → RTK Query calls `/api/*`, served by Next.js
  Route Handlers in `src/app/api/`, which return data from `src/mocks/`.
- **`NEXT_PUBLIC_API_URL` set** (e.g. `http://localhost:8080/api/v1`) → the exact
  same RTK Query hooks hit the real backend. No component changes.

```bash
# .env.local — point at Spring Boot when it's ready
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

### Cutover checklist

1. Confirm the Spring Boot responses match the contracts in `src/types/`.
2. Set `NEXT_PUBLIC_API_URL`.
3. Delete `src/mocks/` and `src/app/api/`.

That's it — nothing in `src/components/` imports mocks directly. The mock data is
consumed **only** by the route handlers, which is what makes the cutover clean.

## Folder structure

```
src/
  app/            Routes. /discovery/new /jobs/new /profile + stubs.
                  api/  <- fake backend (delete at cutover)
  components/
    layout/       AppShell, Sidebar, Topbar, PageHeader, SectionCard
    company/      Add New Company page pieces
    job/          Post New Job page pieces
    profile/      Profile page pieces
    shared/       FieldWrapper, FileDropzone, ErrorState, ComingSoon
    ui/           shadcn primitives (generated — don't hand-edit)
  redux/
    store.ts, StoreProvider.tsx, hooks.ts
    api/          baseApi + injected endpoints per feature
    features/     client-only UI slices
  lib/            constants, schemas (zod), format, api-error, utils
  types/          the API contract — source of truth shared with backend
  mocks/          fake data (delete at cutover)
```

## Adding an RTK Query endpoint

One `baseApi`, one cache. Every feature file injects into it — never call
`createApi` again.

```ts
// src/redux/api/candidateApi.ts
import { baseApi } from "./baseApi";
import type { Candidate } from "@/types/candidate";

export const candidateApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCandidates: builder.query<Candidate[], void>({
      query: () => "/candidates",
      providesTags: ["Candidate"],
    }),
  }),
});

export const { useGetCandidatesQuery } = candidateApi;
```

Then:

1. Add any new tag (`"Candidate"`) to `tagTypes` in `src/redux/api/baseApi.ts`.
2. Import the file for its side effects in `src/redux/store.ts` so the endpoint
   registers:
```ts
   import "./api/candidateApi";
```

## Heads up: shadcn here uses Base UI, not Radix

This project's shadcn components are the **Base UI** dialect. Base UI does **not**
support the `asChild` prop — passing it renders a nested `<button><button>` (or
`<button><a>`) and throws a hydration error.

- ❌ `<SheetTrigger asChild><Button/></SheetTrigger>`
- ✅ Control open state yourself: `useState` + `open` / `onOpenChange`.
- ✅ For a link that looks like a button, style the `<Link>` directly — don't
  wrap it in `<Button>`.

Most shadcn snippets online assume Radix, so watch for `asChild` when copying
code in.