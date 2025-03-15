
import { useEffect, useRef } from 'react';
import { calculateWPM, calculateAccuracy } from '../utils/typingUtils';

interface UseTypingStatsProps {
  text: string;
  input: string;
  cursorPosition: number;
  startTime: number | null;
  isComplete: boolean;
  onStatsUpdate: (wpm: number, accuracy: number, progress: number) => void;
}

export const useTypingStats = ({
  text,
  input,
  cursorPosition,
  startTime,
  isComplete,
  onStatsUpdate
}: UseTypingStatsProps) => {
  const intervalRef = useRef<number | null>(null);

  // Update stats while typing
  useEffect(() => {
    if (startTime && !isComplete) {
      intervalRef.current = window.setInterval(() => {
        const currentTime = Date.now();
        const timeElapsed = (currentTime - startTime) / 1000;
        
        // Calculate current stats
        const correctChars = input.split('').filter((char, i) => 
          char === text[i]
        ).length;
        
        const currentWpm = calculateWPM(cursorPosition, timeElapsed);
        const currentAccuracy = calculateAccuracy(correctChars, input.length);
        const currentProgress = (cursorPosition / text.length) * 100;
        
        onStatsUpdate(currentWpm, currentAccuracy, currentProgress);
      }, 500);
    } else if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
    }
    
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, [startTime, isComplete, input, text, cursorPosition, onStatsUpdate]);

  return {
    clearStatsInterval: () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  };
};
