
import { useEffect, useRef } from 'react';
import { TimeLimit } from '../types/typingTypes';

interface UseTypingTimerProps {
  timeLimit: TimeLimit;
  startTime: number | null;
  isComplete: boolean;
  onTimerComplete: () => void;
  onTimerTick: (remainingTime: number) => void;
}

export const useTypingTimer = ({
  timeLimit,
  startTime,
  isComplete,
  onTimerComplete,
  onTimerTick
}: UseTypingTimerProps) => {
  const timerRef = useRef<number | null>(null);

  // Timer for time-limited tests
  useEffect(() => {
    if (timeLimit > 0 && startTime && !isComplete) {
      // Initialize timer
      timerRef.current = window.setInterval(() => {
        const elapsedSeconds = Math.floor((Date.now() - (startTime || Date.now())) / 1000);
        const remaining = Math.max(0, timeLimit - elapsedSeconds);
        
        // Update remaining time
        onTimerTick(remaining);
        
        // End test if time is up
        if (remaining === 0 && !isComplete) {
          if (timerRef.current) window.clearInterval(timerRef.current);
          onTimerComplete();
        }
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, [timeLimit, startTime, isComplete, onTimerComplete, onTimerTick]);

  return {
    clearTimer: () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };
};
