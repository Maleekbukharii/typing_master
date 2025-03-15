
import React, { useState, useEffect } from 'react';
import { TypingProgress } from '../utils/typingUtils';

interface GhostCursorProps {
  previousProgress: TypingProgress[] | null;
  text: string;
  isActive: boolean;
}

const GhostCursor: React.FC<GhostCursorProps> = ({ previousProgress, text, isActive }) => {
  const [position, setPosition] = useState<number>(-1);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  
  useEffect(() => {
    if (!isActive || !previousProgress || previousProgress.length === 0) {
      setIsVisible(false);
      return;
    }
    
    setIsVisible(true);
    
    // Reset position when starting a new attempt
    setPosition(-1);
    
    // Reference time when this effect started
    const startTime = Date.now();
    
    // Array of timeouts to clean up
    const timeouts: number[] = [];
    
    // Schedule position updates based on previous timing data
    previousProgress.forEach((progress) => {
      const timeout = window.setTimeout(() => {
        setPosition(progress.position);
      }, progress.timestamp);
      
      timeouts.push(timeout);
    });
    
    // Cleanup timeouts on unmount or when progress changes
    return () => {
      timeouts.forEach(window.clearTimeout);
    };
  }, [previousProgress, isActive]);
  
  if (!isVisible || position < 0) {
    return null;
  }
  
  // Calculate ghost cursor position
  const ghostText = text.substring(0, position);
  const remainingText = text.substring(position);
  
  return (
    <div className="absolute pointer-events-none opacity-30 top-0 left-0 right-0 typing-text" aria-hidden="true">
      <span>{ghostText}</span>
      <span className="ghost-cursor"></span>
      <span>{remainingText}</span>
    </div>
  );
};

export default GhostCursor;
