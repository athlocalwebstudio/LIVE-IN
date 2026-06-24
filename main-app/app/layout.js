import { Montserrat } from "next/font/google";
import "./globals.css";
import Header from "./components/Head";
import ClientLoaderWrapper from "@/app/components/ClientLoaderWrapper"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

// app/layout.js

export const metadata = {
  metadataBase: new URL("https://playlivetiktok.com"), // Change to your live domain
  title: {
    default: "TikTok LIVE Games | Interactive Games for TikTok Streamers",
    template: "%s | Live In"
  },
  description:
    "Boost engagement, gifts, and watch time with interactive TikTok LIVE games. Racing, battles, spacecraft games, and more.",
  keywords: [
    "TikTok LIVE games",
    "interactive TikTok games",
    "TikTok LIVE engagement",
    "TikTok gift games",
    "TikTok streamer tools",
    "TikTok LIVE battles"
  ],
  icons: {
    icon: "/logo.png",
  },
  alternates: {
    canonical: "/", // Tells Google this is the absolute authority link
  },
  openGraph: {
    type: "website",
    url: "https://playlivetiktok.com",
    title: "Live In - Interactive TikTok Live Games",
    description: "Boost engagement, gifts, and watch time with interactive TikTok LIVE games. Racing, battles, and more.", // Aligned description
    images: [
      {
        url: "/og-image.jpg", // Kept relative to metadataBase
        width: 1200,
        height: 630,
        alt: "Live In TikTok Live Games Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Live In - TikTok Live Games",
    description: "Boost engagement, gifts, and watch time with interactive TikTok LIVE games.",
    images: ["/twitter-image.jpg"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={montserrat.className}>
        <ClientLoaderWrapper>
          <Header />
          {children}
        </ClientLoaderWrapper>
      </body>
    </html>
  );
}
