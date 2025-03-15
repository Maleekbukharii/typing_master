
import { CharacterTiming, TypingProgress } from '../types/typingTypes';

/**
 * Calculate words per minute
 * @param textLength - Number of characters typed
 * @param timeInSeconds - Time elapsed in seconds
 */
export const calculateWPM = (textLength: number, timeInSeconds: number): number => {
  // Using average word length of 5 characters including space
  const words = textLength / 5;
  const minutes = timeInSeconds / 60;
  
  // Avoid division by zero
  if (minutes === 0) return 0;
  
  return Math.round(words / minutes);
};

/**
 * Calculate accuracy percentage
 * @param correctChars - Number of correctly typed characters
 * @param totalChars - Total number of characters typed
 */
export const calculateAccuracy = (correctChars: number, totalChars: number): number => {
  if (totalChars === 0) return 100;
  return Math.round((correctChars / totalChars) * 100);
};

/**
 * Process typing progress for ghost cursor
 */
export const processTypingProgress = (
  typingTimings: CharacterTiming[]
): TypingProgress[] => {
  if (!typingTimings.length) return [];
  
  const startTime = typingTimings[0].timestamp;
  
  return typingTimings.map((timing) => ({
    timestamp: timing.timestamp - startTime,
    position: timing.position
  }));
};

/**
 * Generate keyboard sound
 */
export const playKeySound = (success: boolean = true): void => {
  const audio = new Audio(success ? '/key-press.mp3' : '/key-error.mp3');
  audio.volume = 0.2;
  audio.play().catch(() => {
    // Silently fail if audio can't play (e.g., if no sound files)
    console.log('Sound not available');
  });
};
