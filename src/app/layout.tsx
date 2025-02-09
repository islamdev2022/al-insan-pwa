import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const APP_NAME = "Next.js PWA";
const APP_DEFAULT_TITLE = "Next.js PWA Starter Template";
const APP_TITLE_TEMPLATE = "%s - Next.js PWA";
const APP_DESCRIPTION = "This is a minimal template for creating a Progressive Web App (PWA) using Next.js 15, TailwindCSS v4.0 and Serwist.";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  keywords: [
    "Nextjs PWA",
    "Nextjs 15 PWA",
    "Nextjs 15 PWA Template",
    "Minimal PWA Template Next.js 15",
    "Tailwind CSS PWA Template Next.js 15",
    "Serwist PWA Template Next.js 15",
    "Next.js 15 PWA Boilerplate",
    "Create PWA with Next.js 15",
    "Fast Next.js 15 PWA",
    "Offline Next.js 15 PWA",
    "Lightweight Next.js 15 PWA Template",
    "Next.js 15 PWA Starter",
    "Minimal Next.js 15 Tailwind CSS PWA",
    "Next.js 15 Serwist Tailwind PWA Template",
    "Best Next.js 15 PWA Template",
    "Easy Next.js 15 PWA Setup",
    "Next.js 15 PWA GitHub",
    "Free Next.js 15 PWA Template",
    "Open Source Next.js 15 PWA"
  ],
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
