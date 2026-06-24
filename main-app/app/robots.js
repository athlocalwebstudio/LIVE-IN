// app/robots.js
export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"], // Prevents engines from scanning secure calculation backends
    },
    sitemap: "https://playtiktoklive.com/sitemap.xml",
  };
}