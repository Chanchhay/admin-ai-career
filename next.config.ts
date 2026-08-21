import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * The gateway routes `/admin/**` here and everything else to the main
   * frontend, so this app must own that whole prefix — pages *and* its
   * `/admin/_next/**` chunks. Without the basePath the pages would load and
   * then request `/_next/**`, which the gateway hands to the other app, and the
   * console would render blank.
   *
   * `next/link` and the router prefix it automatically; raw fetches and plain
   * anchors do not, which is what keeps `/api/v1/**`, `/bff/session`, `/logout`
   * and `/oauth2/**` pointing at the gateway instead of at this app.
   */
  basePath: "/admin",
};

export default nextConfig;
