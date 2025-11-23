// src/components/Typewriter.tsx
'use client';
import { useState, useEffect } from 'react';

export function Typewriter({ text, speed = 50 }: { text: string, speed?: number }) {
  const [displayedText, setDisplayedText] = useState('');
  
  // Split the roast into multiple lines based on the intended structure
  const lines = text.split('\n').filter(line => line.trim() !== '');

  useEffect(() => {
    let charIndex = 0;
    const type = () => {
      if (charIndex < text.length) {
        setDisplayedText(text.substring(0, charIndex + 1));
        charIndex++;
        setTimeout(type, speed);
      }
    };
    type();
  }, [text, speed]);

  return (
    <div className="whitespace-pre-wrap">
        {lines.map((line, index) => (
            <p key={index}>{line}</p>
        ))}
    </div>
  );
}
