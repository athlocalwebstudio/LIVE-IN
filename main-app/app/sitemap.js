// app/sitemap.js
export default async function sitemap() {
  const baseUrl = "https://playlivetiktok.com";

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0, // Your primary money page gets maximum priority
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8, // FAQs are great for organic search answers
    },
    {
      url: `${baseUrl}/access`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5, // Lower priority since it's a utility gate
    },
    // ADDED: Legal pages so Google sees a completely verified site layout
    {
      url: `${baseUrl}/Terms-of-service`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/Disclaimer`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
