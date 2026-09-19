'use client';
import { useState, useEffect } from 'react';
import { useTranslations } from 'use-intl';
const TYPING_SPEED = 150; 

const LoadingSpinner = () => {
  const [displayText, setDisplayText] = useState('');
  const t = useTranslations('Herafy')
  const LOADER_TEXT = t('Herafy');

  useEffect(() => {
    let currentIndex = 0;

    const intervalId = setInterval(() => {
      setDisplayText(LOADER_TEXT.substring(0, currentIndex + 1));
      currentIndex++;
      if (currentIndex >= LOADER_TEXT.length) {
        setTimeout(() => {
          setDisplayText('');
          currentIndex = 0;
        }, 800); 
      }
    }, TYPING_SPEED);

    return () => clearInterval(intervalId);
  }, []);  

  return (
    <div className="flex min-h-[100dvh] items-center justify-center" role="status" aria-live="polite">
      <div className="flex items-end gap-1.5">
        <p className="font-display text-4xl text-orange-700" aria-label={LOADER_TEXT}>
          {displayText}
        </p>
        <div className="mb-1.5 h-8 w-0.5 rounded-full bg-orange-600 animate-pulse" aria-hidden="true"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;