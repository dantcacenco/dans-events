import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      // The couple music picker is private: keep it out of search results even if the link leaks.
      { source: "/songs/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }] },
      // Preview clips never change; the browser can keep them.
      { source: "/setlist/clips/:file*", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
    ];
  },
};

export default nextConfig;
