import type { Metadata } from "next";

import { siteConfig } from "@/lib/constants/site";
import "@/app/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: "Be Home Cascais WiFi",
    template: "%s | Be Home Cascais",
  },
  description: siteConfig.description,
  applicationName: siteConfig.shortName,
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    title: "Be Home Cascais WiFi",
    description: siteConfig.description,
    url: siteConfig.siteUrl,
    siteName: "Be Home Cascais",
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Be Home Cascais WiFi",
    description: siteConfig.description,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
