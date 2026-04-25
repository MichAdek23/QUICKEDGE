import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import PwaRegister from "@/components/PwaRegister";
import InstallPrompt from "@/components/InstallPrompt";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://quick-hedgeconsulting.com'),
  title: {
    default: "Quick-Hedge Consulting",
    template: "%s | Quick-Hedge Consulting"
  },
  description: "Expert consultancy, real-time webhooks, and advanced learning materials",
  applicationName: "Quick-Hedge",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Quick-Hedge",
  },
  openGraph: {
    type: "website",
    siteName: "Quick-Hedge Consulting",
    locale: "en_US",
    url: "https://quick-hedgeconsulting.com"
  },
  twitter: {
    card: "summary_large_image",
  }
};

export const viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Quick-Hedge Consulting",
    "url": "https://quick-hedgeconsulting.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://quick-hedgeconsulting.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <script 
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script 
          dangerouslySetInnerHTML={{ 
            __html: `
              window.deferredPWAInstallPrompt = null;
              window.addEventListener('beforeinstallprompt', (e) => {
                e.preventDefault();
                window.deferredPWAInstallPrompt = e;
              });
            ` 
          }} 
        />
      </head>
      <body>
        <PwaRegister />
        <InstallPrompt />
        {children}
      </body>
    </html>
  );
}
