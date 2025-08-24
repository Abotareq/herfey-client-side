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
    <div className="flex justify-center items-center h-screen bg-slate-50">
      <div className="flex items-end space-x-2">
        <p className="text-4xl font-bold font-mono text-orange-500 tracking-wider">
          {displayText}
        </p>
        <div className="w-1.5 h-10 bg-orange-500 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;