// src/components/Typewriter.tsx
'use client';
import { useState, useEffect } from 'react';

export function Typewriter({ text, speed = 50 }: { text: string, speed?: number }) {
  const [displayedText, setDisplayedText] = useState('');
  
  // Split the roast into multiple lines based on the intended structure
  const lines = text.split('\n').filter(line => line.trim() !== '');

  useEffect(() => {
    let i = 0;
    let currentLine = 0;
    let currentText = '';

    const type = () => {
      if (currentLine >= lines.length) {
        return;
      }
      
      const line = lines[currentLine];

      if (i < line.length) {
        currentText += line.charAt(i);
        setDisplayedText(currentText);
        i++;
        setTimeout(type, speed);
      } else {
        // End of line, move to next line
        currentText += '\n';
        setDisplayedText(currentText);
        currentLine++;
        i = 0;
        setTimeout(type, speed * 5); // Pause between lines
      }
    };

    type();

  }, [text, speed, lines]);

  return (
    <div className="whitespace-pre-wrap">
      {displayedText}
      <span className="animate-ping">|</span>
    </div>
  );
}
