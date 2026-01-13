import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { defaultMetadata } from "@/lib/metadata";
import StructuredData from "@/components/StructuredData";
import { generateOrganizationSchema, generateWebsiteSchema } from "@/lib/schema";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import GoogleAdSense from "@/components/GoogleAdSense";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  ...defaultMetadata,
  verification: {
    google: 'your-google-verification-code', // TODO: Add actual verification code
    other: {
      'google-adsense-account': 'ca-pub-3761489603441542',
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#002b5c',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="en">
      <head>
        <GoogleAdSense />
        <StructuredData data={generateOrganizationSchema()} />
        <StructuredData data={generateWebsiteSchema()} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-white`}
      >
        {gaId && <GoogleAnalytics gaId={gaId} />}
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8 bg-white">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
