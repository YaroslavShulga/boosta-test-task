import type { NextConfig } from "next";

const backendUrl = process.env.BACKEND_URL ?? "http://localhost:3000";

const nextConfig: NextConfig = {
  // Self-contained server (.next/standalone/server.js) for the production Docker image.
  output: "standalone",
  // The browser only talks to this origin: `/api/*` is proxied to the NestJS API,
  // so its httpOnly cookies are first-party (no CORS, no cross-site cookie rules).
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${backendUrl}/:path*` }];
  },
};

export default nextConfig;
