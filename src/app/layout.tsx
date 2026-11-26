import type { Metadata } from "next";
import { Host_Grotesk, JetBrains_Mono, Noto_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SmoothScroll } from "@/components/smooth-scroll";
import { LocaleProvider } from "@/components/locale-provider";
import { publicAsset } from "@/lib/public-asset";
import { site, socialLinks } from "@/data/portfolio";

const iconUrl = publicAsset("/icon-48.png");
const appleIconUrl = publicAsset("/icon-192.png");

const hostGrotesk = Host_Grotesk({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-host-grotesk",
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  weight: "variable",
  variable: "--font-noto-sans-arabic",
  display: "swap",
  preload: false,
  adjustFontFallback: true,
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-jetbrains-mono",
  display: "swap",
  preload: false,
  adjustFontFallback: true,
});

const title = "Abdallah Zaghloul — Frontend Engineer & Technical Lead";
const description =
  "Frontend Engineer & Technical Lead (React, Next.js, TypeScript) with 4+ years building real-time dashboards, interactive builders and RTL web apps.";
const ogImage = publicAsset("/og-image.png");

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: title,
    template: "%s | Abdallah Zaghloul",
  },
  description,
  keywords: [
    "Abdallah Zaghloul",
    "Frontend Engineer",
    "Technical Lead",
    "React",
    "Next.js",
    "TypeScript",
    "Remote Frontend Engineer",
    "RTL",
    "Dashboards",
    "Portfolio",
  ],
  authors: [{ name: site.name, url: "https://github.com/AbdallahZagh" }],
  creator: site.name,
  publisher: site.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: site.url,
    siteName: "Abdallah Zaghloul",
    title,
    description,
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "Abdallah Zaghloul, Frontend Engineer & Technical Lead",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: site.url,
  },
  icons: {
    icon: [{ url: iconUrl, type: "image/png" }],
    shortcut: [{ url: iconUrl, type: "image/png" }],
    apple: [{ url: appleIconUrl, type: "image/png" }],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  jobTitle: site.role,
  description,
  url: site.url,
  sameAs: socialLinks.map((link) => link.url),
  email: site.email,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Damascus",
    addressCountry: "SY",
  },
  knowsAbout: ["React", "Next.js", "TypeScript", "Frontend Development", "Technical Leadership", "RTL"],
  worksFor: { "@type": "Organization", name: "Elathr Business", jobTitle: "Technical Lead" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${hostGrotesk.variable} ${notoSansArabic.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className="antialiased bg-background text-foreground">
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <LocaleProvider>
            <SmoothScroll>{children}</SmoothScroll>
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
