LIVE IN LEMON SQUEEZY CHANGES

Copy these files into your Next.js app.

REPLACE:
app/page.js
app/components/LandingPage.jsx
app/components/Games.jsx
app/components/Card.jsx
app/components/FAQs.jsx
app/components/Footer.jsx
app/components/Head.jsx
app/LandingPage.module.css
app/games.module.css
app/Card.module.css

ADD:
app/components/Pricing.jsx
app/pricing.module.css
app/access/page.jsx
app/access/access.module.css
app/api/validate-license/route.js
.env.local.example

IMPORTANT ENV VARIABLES:
NEXT_PUBLIC_LEMONSQUEEZY_MONTHLY_URL
NEXT_PUBLIC_LEMONSQUEEZY_LIFETIME_URL
NEXT_PUBLIC_DISCORD_URL
LEMONSQUEEZY_STORE_ID
LEMONSQUEEZY_PRODUCT_ID
LEMONSQUEEZY_VARIANT_ID

NOTE:
The /access page currently shows a download button after a valid license, but the real protected download route is not included yet because the game files/storage location is not decided.
Do not put game ZIP files in /public.
Use private storage like Cloudflare R2, Supabase Storage, AWS S3, or a protected backend route later.
