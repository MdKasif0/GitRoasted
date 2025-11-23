import type {Metadata} from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { FirebaseAnalytics } from '@/components/FirebaseAnalytics';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

const title = 'GitRoasted | Savage AI Roasts for GitHub Profiles';
const description = 'Get a savage but friendly AI-generated roast of any GitHub profile based on their stats, commit history, and more. How hard can you get roasted?';
const url = 'https://gitroasted.app'; // Replace with your actual domain

export const metadata: Metadata = {
  title: {
    default: title,
    template: '%s | GitRoasted',
  },
  description: description,
  metadataBase: new URL(url),
  openGraph: {
    title: title,
    description: description,
    url: url,
    siteName: 'GitRoasted',
    images: [
      {
        url: '/og-image.png', // Path to your OG image in the `public` folder
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        <FirebaseAnalytics />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
