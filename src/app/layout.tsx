import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SmoothScroll } from "@/components/smooth-scroll";
import { publicAsset } from "@/lib/public-asset";

const iconUrl = publicAsset("/logo.png");

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://abdallahzagh.github.io/portfolio"),
  title: {
    default: "Abdallah Zaghloul - Frontend Developer & Team Lead | React, Next.js, Three.js",
    template: "%s | Abdallah Zaghloul Portfolio",
  },
  description:
    "Frontend Developer with 3+ years shipping production React and Next.js apps. Led a 3-person remote team at PawsPalConnect, now building IoT dashboards and motion-heavy marketing sites at Sama-Tech. Also ships API and mobile when needed — including Nova across web, Expo, and NestJS.",
  keywords: [
    "Abdallah Zaghloul",
    "Frontend Developer",
    "React",
    "Next.js",
    "TypeScript",
    "Redux",
    "Tailwind CSS",
    "Framer Motion",
    "Three.js",
    "Remote Frontend Engineer",
    "Team Lead",
    "React Developer",
    "Web Developer",
    "JavaScript",
    "UI/UX",
    "Portfolio",
    "Frontend Architecture",
    "GSAP",
    "Performance Optimization",
  ],
  authors: [{ name: "Abdallah Zaghloul", url: "https://github.com/AbdallahZagh" }],
  creator: "Abdallah Zaghloul",
  publisher: "Abdallah Zaghloul",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://abdallahzagh.github.io/portfolio/",
    siteName: "Abdallah Zaghloul Portfolio",
    title: "Abdallah Zaghloul - Frontend Developer & Team Lead",
    description:
      "Frontend Developer with 3+ years shipping production React and Next.js apps. IoT dashboards at Sama-Tech, team lead at PawsPalConnect, and Nova across web, Expo, and NestJS.",
    images: [
      {
        url: "/og-image.jpg", // Add your OG image
        width: 1200,
        height: 630,
        alt: "Abdallah Zaghloul - Frontend Developer Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Abdallah Zaghloul - Frontend Developer & Team Lead",
    description:
      "Frontend Developer with 3+ years shipping React and Next.js apps — IoT dashboards, team leadership, and full-stack product work including Nova.",
    creator: "@AbdallahZagh", // Update with your Twitter handle
    images: ["/twitter-image.jpg"], // Add your Twitter image
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
  verification: {
    google: "your-google-verification-code", // Add if you have one
  },
  alternates: {
    canonical: "https://abdallahzagh.github.io/portfolio/",
  },
  icons: {
    icon: [{ url: iconUrl, type: "image/png" }],
    shortcut: [{ url: iconUrl, type: "image/png" }],
    apple: [{ url: iconUrl, type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href={iconUrl} type="image/png" />
        <link rel="shortcut icon" href={iconUrl} type="image/png" />
        <link rel="apple-touch-icon" href={iconUrl} />
        <link rel="canonical" href="https://abdallahzagh.github.io/portfolio/" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Abdallah Zaghloul",
              jobTitle: "Frontend Developer & Team Lead",
              url: "https://abdallahzagh.github.io/portfolio/",
              sameAs: [
                "https://github.com/AbdallahZagh",
                "https://linkedin.com/in/abdallah-zaghloul",
              ],
              email: "f2002.a.z@gmail.com",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Damascus",
                addressCountry: "SY",
              },
              knowsAbout: [
                "React",
                "Next.js",
                "TypeScript",
                "Redux",
                "Tailwind CSS",
                "Three.js",
                "Frontend Development",
                "Team Leadership",
              ],
              worksFor: {
                "@type": "Organization",
                name: "Sama-Tech",
                jobTitle: "Frontend Web Developer",
              },
            }),
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <SmoothScroll>{children}</SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
