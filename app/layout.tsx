import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { IntroLoader } from "@/components/IntroLoader";
import { site } from "@/lib/site";

/**
 * next/font downloads Archivo at build time and self-hosts it: no runtime
 * request to Google, no layout shift, and one fewer third-party connection.
 */
const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-archivo",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name}: ${site.role}`,
    template: `%s: ${site.name}`,
  },
  description: site.tagline,
  keywords: [
    "3D artist",
    "Blender",
    "3D modelling",
    "character modelling",
    "environment art",
    "rigging",
    "portfolio",
    site.name,
  ],
  authors: [{ name: site.name }],
  creator: site.name,
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: site.url,
    siteName: `${site.name}: ${site.role}`,
    title: `${site.name}: ${site.role}`,
    description: site.tagline,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name}: ${site.role}`,
    description: site.tagline,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Warm the connection to the asset CDN before the first render is requested.
  // DNS, TCP and TLS for a cross-origin host cost real milliseconds on the
  // first image, and the hero poster is the largest paint on the page.
  const assetOrigin = (() => {
    try {
      const base = process.env.NEXT_PUBLIC_ASSET_BASE_URL;
      return base ? new URL(base).origin : null;
    } catch {
      return null;
    }
  })();

  return (
    <html lang="en-GB" className={archivo.variable}>
      <head>
        {assetOrigin && (
          <>
            <link rel="preconnect" href={assetOrigin} crossOrigin="anonymous" />
            <link rel="dns-prefetch" href={assetOrigin} />
          </>
        )}
      </head>
      <body className="font-sans antialiased">
        {/* Keyboard users land here first. */}
        <a
          href="#main"
          className="t-button sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:bg-accent focus:px-4 focus:py-3 focus:text-white"
        >
          Skip to content
        </a>
        <IntroLoader />
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
