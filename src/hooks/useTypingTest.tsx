
import { useState, useEffect, useRef, useCallback } from 'react';
import { generateParagraph } from '../utils/textGenerator';
import { 
  calculateWPM, 
  calculateAccuracy, 
  CharacterTiming, 
  TypingProgress, 
  processTypingProgress,
  playKeySound
} from '../utils/typingUtils';

type DifficultyLevel = 'easy' | 'medium' | 'hard';

interface UseTypingTestProps {
  initialDifficulty?: DifficultyLevel;
  soundEnabled?: boolean;
}

interface TypingTestState {
  text: string;
  input: string;
  isComplete: boolean;
  startTime: number | null;
  endTime: number | null;
  wpm: number;
  accuracy: number;
  progress: number;
  difficulty: DifficultyLevel;
  soundEnabled: boolean;
  cursorPosition: number;
  characterTimings: CharacterTiming[];
  previousTypingProgress: TypingProgress[] | null;
  paragraphId: string; // To identify the same paragraph for ghost cursor
}

export const useTypingTest = ({
  initialDifficulty = 'medium',
  soundEnabled = true
}: UseTypingTestProps = {}) => {
  const [state, setState] = useState<TypingTestState>({
    text: '',
    input: '',
    isComplete: false,
    startTime: null,
    endTime: null,
    wpm: 0,
    accuracy: 0,
    progress: 0,
    difficulty: initialDifficulty,
    soundEnabled,
    cursorPosition: 0,
    characterTimings: [],
    previousTypingProgress: null,
    paragraphId: ''
  });
  
  const intervalRef = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Generate a new paragraph
  const generateNewText = useCallback((difficulty: DifficultyLevel = state.difficulty) => {
    const text = generateParagraph(difficulty);
    const paragraphId = btoa(text.substring(0, 20)); // Create a simple ID from the start of text
    
    // Check if we have previous progress for this exact paragraph
    const previousProgress = localStorage.getItem(`typing-progress-${paragraphId}`);
    
    setState(prev => ({
      ...prev,
      text,
      input: '',
      isComplete: false,
      startTime: null,
      endTime: null,
      wpm: 0,
      accuracy: 0,
      progress: 0,
      difficulty,
      cursorPosition: 0,
      characterTimings: [],
      previousTypingProgress: previousProgress ? JSON.parse(previousProgress) : null,
      paragraphId
    }));
    
    // Focus the input field
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [state.difficulty]);
  
  // Initialize with a paragraph
  useEffect(() => {
    generateNewText(initialDifficulty);
    
    // Cleanup interval on unmount
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, [initialDifficulty, generateNewText]);
  
  // Update stats while typing
  useEffect(() => {
    if (state.startTime && !state.isComplete) {
      intervalRef.current = window.setInterval(() => {
        const currentTime = Date.now();
        const timeElapsed = (currentTime - state.startTime) / 1000;
        
        // Calculate current stats
        const correctChars = state.input.split('').filter((char, i) => 
          char === state.text[i]
        ).length;
        
        const currentWpm = calculateWPM(state.cursorPosition, timeElapsed);
        const currentAccuracy = calculateAccuracy(correctChars, state.input.length);
        const currentProgress = (state.cursorPosition / state.text.length) * 100;
        
        setState(prev => ({
          ...prev,
          wpm: currentWpm,
          accuracy: currentAccuracy,
          progress: currentProgress
        }));
      }, 500);
    } else if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
    }
    
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, [state.startTime, state.isComplete, state.input, state.text, state.cursorPosition]);
  
  // Handle input changes
  const handleInputChange = useCallback((inputValue: string) => {
    // Start the timer on first input
    const currentTime = Date.now();
    const isFirstInput = !state.startTime;
    
    if (isFirstInput) {
      setState(prev => ({
        ...prev,
        startTime: currentTime
      }));
    }
    
    // Record character timing
    const newCharacterTimings = [...state.characterTimings];
    if (inputValue.length > state.input.length) {
      const newChar = inputValue[inputValue.length - 1];
      newCharacterTimings.push({
        char: newChar,
        timestamp: currentTime,
        position: inputValue.length - 1
      });
      
      // Play sound if enabled
      if (state.soundEnabled) {
        const isCorrect = newChar === state.text[inputValue.length - 1];
        playKeySound(isCorrect);
      }
    }
    
    // Check if typing is complete
    const isComplete = inputValue.length >= state.text.length;
    
    // Update state
    setState(prev => ({
      ...prev,
      input: inputValue,
      cursorPosition: inputValue.length,
      isComplete,
      endTime: isComplete ? currentTime : prev.endTime,
      characterTimings: newCharacterTimings
    }));
    
    // Save progress if complete
    if (isComplete) {
      const typingProgress = processTypingProgress(newCharacterTimings);
      localStorage.setItem(
        `typing-progress-${state.paragraphId}`,
        JSON.stringify(typingProgress)
      );
    }
  }, [state.input, state.startTime, state.text, state.characterTimings, state.soundEnabled, state.paragraphId]);
  
  // Change difficulty level
  const changeDifficulty = useCallback((newDifficulty: DifficultyLevel) => {
    generateNewText(newDifficulty);
  }, [generateNewText]);
  
  // Toggle sound
  const toggleSound = useCallback(() => {
    setState(prev => ({
      ...prev,
      soundEnabled: !prev.soundEnabled
    }));
  }, []);
  
  // Retry the same paragraph
  const retryText = useCallback(() => {
    // Save current progress before resetting
    if (state.characterTimings.length > 0 && state.startTime) {
      const typingProgress = processTypingProgress(state.characterTimings);
      localStorage.setItem(
        `typing-progress-${state.paragraphId}`,
        JSON.stringify(typingProgress)
      );
      
      // Reset with the same text but with previous progress
      setState(prev => ({
        ...prev,
        input: '',
        isComplete: false,
        startTime: null,
        endTime: null,
        wpm: 0,
        accuracy: 0,
        progress: 0,
        cursorPosition: 0,
        characterTimings: [],
        previousTypingProgress: typingProgress
      }));
    } else {
      // Just reset the current text
      setState(prev => ({
        ...prev,
        input: '',
        isComplete: false,
        startTime: null,
        endTime: null,
        wpm: 0,
        accuracy: 0,
        progress: 0,
        cursorPosition: 0,
        characterTimings: []
      }));
    }
    
    // Focus the input field
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [state.characterTimings, state.startTime, state.paragraphId]);
  
  return {
    text: state.text,
    input: state.input,
    isComplete: state.isComplete,
    wpm: state.wpm,
    accuracy: state.accuracy,
    progress: state.progress,
    difficulty: state.difficulty,
    soundEnabled: state.soundEnabled,
    cursorPosition: state.cursorPosition,
    previousTypingProgress: state.previousTypingProgress,
    isPreviousAttempt: !!state.previousTypingProgress,
    handleInputChange,
    generateNewText,
    changeDifficulty,
    toggleSound,
    retryText,
    inputRef
  };
};
