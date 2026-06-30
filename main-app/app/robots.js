// app/robots.js
export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/api/", // Stops bots from scanning backend code
    },
    // FIXED: Corrected domain spelling so Google can actually find your map!
    sitemap: "https://playlivetiktok.com/sitemap.xml",
  };
}