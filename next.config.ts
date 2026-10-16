import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      // The couple music picker is private: keep it out of search results even if the link leaks.
      { source: "/songs/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }] },
      { source: "/admin/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }, { key: "Cache-Control", value: "no-store" }] },
      // Preview clips: cache for a week (a clip may be swapped for Dan's own MP3 under the same name).
      { source: "/setlist/clips/:file*", headers: [{ key: "Cache-Control", value: "public, max-age=604800" }] },
    ];
  },
};

export default nextConfig;
