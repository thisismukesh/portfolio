import type { Metadata } from "next";
import { Manrope, JetBrains_Mono } from "next/font/google";
import { getPortfolioContent } from "@/sanity/queries";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mukeshsaravanan.dev";

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getPortfolioContent();
  const title = "Hey, I'm Mukesh!";
  const description = settings.tagline;
  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      url: SITE_URL,
      title,
      description,
      siteName: settings.name,
    },
    twitter: { card: "summary_large_image", title, description },
    robots: { index: true, follow: true },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${manrope.variable} ${jetbrains.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
