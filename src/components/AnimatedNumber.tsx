// src/components/AnimatedNumber.tsx
'use client';
import { useEffect, useState } from 'react';

export function AnimatedNumber({ value }: { value: number }) {
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    const targetValue = value;
    let animationFrameId: number;
    const duration = 1000;
    const startTime = performance.now();

    const updateValue = (timestamp: number) => {
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      
      setCurrentValue(Math.floor(easedProgress * targetValue));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(updateValue);
      } else {
        setCurrentValue(targetValue);
      }
    };

    animationFrameId = requestAnimationFrame(updateValue);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [value]);
  
  return <>{currentValue.toLocaleString()}</>;
}
