export const dynamic = "force-dynamic";

/** A local-only stand-in for the gateway session endpoint. */
export function GET() {
  return Response.json({
    authenticated: true,
    username: "Demo Administrator",
    email: "admin@aicareer.local",
  });
}
