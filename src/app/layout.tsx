
import type {Metadata} from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { FirebaseProvider } from '@/firebase/provider';
import { FirebaseAnalytics } from '@/components/FirebaseAnalytics';
import { OfflineIndicator } from '@/components/OfflineIndicator';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

const title = 'GitRoasted | Savage AI Roasts for GitHub Profiles';
const description = 'Get your GitHub profile analyzed with a savage roast! Calculate your developer score out of 1000, compete on the leaderboard, and share your results.';
const url = 'https://gitroasted.netlify.app'; 

export const metadata: Metadata = {
  title: {
    default: title,
    template: '%s | GitRoasted',
  },
  description: description,
  keywords: ["github profile analyzer", "developer score", "github roast", "github stats", "contribution tracker", "github leaderboard"],
  manifest: '/manifest.json',
  metadataBase: new URL(url),
  openGraph: {
    title: title,
    description: description,
    url: url,
    siteName: 'GitRoasted',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'GitRoasted social sharing image',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: title,
    description: description,
    images: ['/og-image.png'],
    creator: '@YourTwitterHandle', // Add your twitter handle
    site: '@YourTwitterHandle',
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
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: title,
    startupImage: '/app-icon.png',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    viewportFit: 'cover',
  },
  themeColor: '#0F172A',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        <FirebaseProvider>
            <OfflineIndicator />
            {children}
        </FirebaseProvider>
        <Toaster />
        <FirebaseAnalytics />
      </body>
    </html>
  );
}
