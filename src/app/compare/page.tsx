
import { Metadata } from 'next';
import CompareClient from './CompareClient';

export const metadata: Metadata = {
  title: "GitClash: Battle of the Devs - Compare GitHub Profiles",
  description: "See who reigns supreme! Compare GitHub profiles on GitClash and settle the ultimate developer debate. Analyze stats, skills, and activity. Who's the real MVP?",
  keywords: ["github", "compare", "developer", "stats", "skills", "activity", "battle", "versus", "gitclash"],
  openGraph: {
    title: "GitClash: Battle of the Devs",
    description: "Put two GitHub profiles head-to-head and see who comes out on top.",
    url: "https://gitroasted.netlify.app/compare",
    type: "website",
    images: [
      {
        url: "https://gitroasted.netlify.app/og-gitclash.png",
        width: 1200,
        height: 630,
        alt: "GitClash - Compare GitHub Profiles",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GitClash: Battle of the Devs",
    description: "Put two GitHub profiles head-to-head and see who comes out on top.",
    images: ["https://gitroasted.netlify.app/og-gitclash.png"],
  },
};

export default function ComparePage() {
    return <CompareClient />
}
