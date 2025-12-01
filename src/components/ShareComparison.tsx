
'use client';
import { useState } from 'react';
import { Button } from './ui/button';
import { FaTwitter } from 'react-icons/fa';

export function ShareComparison({ user1, user2, winner }: { user1: any, user2: any, winner: any }) {
  const [copied, setCopied] = useState(false);
  
  if (!user1?.username || !user2?.username) return null;

  const comparisonUrl = `https://gitroasted.netlify.app/compare/${user1.username}/vs/${user2.username}`;

  const copyLink = () => {
    navigator.clipboard.writeText(comparisonUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareToTwitter = () => {
    const text = `I compared my GitHub profile with @${user2.username} on GitRoasted! 🔥\n\n${winner.username === user1.username ? '🏆 I won!' : '💪 Time to level up!'}\n\nCompare yours:`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(comparisonUrl)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="share-section text-center mt-12">
      <h2 className='text-3xl font-bold mb-6'>📤 Share This Comparison</h2>
      
      <div className="share-buttons flex flex-col sm:flex-row items-center justify-center gap-4">
        <Button onClick={shareToTwitter} className="share-btn twitter w-full sm:w-auto">
          <FaTwitter className="mr-2" /> Share on X
        </Button>
        
        <Button onClick={copyLink} className="share-btn copy w-full sm:w-auto" variant="secondary">
          {copied ? '✓ Copied!' : '🔗 Copy Link'}
        </Button>
        
        <Button 
          onClick={() => window.print()} 
          className="share-btn print w-full sm:w-auto"
          variant="outline"
        >
          🖨️ Export PDF
        </Button>
      </div>

      <div className="card-generator mt-8">
        <h3 className='text-xl font-semibold mb-4'>Generate Comparison Card</h3>
        <Button className="generate-card-btn" disabled>
          Create Shareable Image → (Coming Soon)
        </Button>
      </div>
    </div>
  );
}
