import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/pixel-mob-admin", "/pixel-mob-test", "/pixel-mob-user", "/api/"],
      },
    ],
    sitemap: "https://dans-events.com/sitemap.xml",
  };
}
