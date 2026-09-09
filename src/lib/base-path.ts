/**
 * The prefix this console is served under.
 *
 * Imported by `next.config.ts` so the framework and the app cannot disagree
 * about it. `next/link` and the router apply it on their own; a `next/image`
 * with `unoptimized`, a plain `<img>`, and a raw `fetch` do not — which is
 * exactly what keeps `/api/v1/**`, `/bff/session` and `/logout` pointing at the
 * gateway instead of at this app. Anything loading a file out of `public/`
 * therefore has to add it, and {@link asset} is how.
 */
export const BASE_PATH = "/admin";

/** Resolves a path under `public/` to a URL the gateway routes back here. */
export function asset(path: string) {
  return `${BASE_PATH}${path}`;
}
