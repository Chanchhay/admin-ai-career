import { readFile } from "node:fs/promises";
import path from "node:path";

/**
 * Chrome's PDF viewer requests `/favicon.ico` directly instead of reading the
 * icon metadata from the surrounding application pages. Serve the brand asset
 * at that conventional URL so regular pages and uploaded PDFs share an icon.
 */
export async function GET() {
  const icon = await readFile(
    path.join(process.cwd(), "public", "figma", "brand-logo.png"),
  );

  return new Response(icon, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
