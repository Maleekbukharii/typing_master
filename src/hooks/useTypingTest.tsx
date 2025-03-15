
import { useState, useEffect, useRef, useCallback } from 'react';
import { generateParagraph, ContentType } from '../utils/textGenerator';
import { 
  calculateWPM, 
  calculateAccuracy, 
  CharacterTiming, 
  TypingProgress, 
  processTypingProgress,
  playKeySound
} from '../utils/typingUtils';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';
export type TimeLimit = 15 | 30 | 60 | 120 | 0; // 0 means no time limit

interface UseTypingTestProps {
  initialDifficulty?: DifficultyLevel;
  initialTimeLimit?: TimeLimit;
  initialContentType?: ContentType;
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
  timeLimit: TimeLimit;
  contentType: ContentType;
  soundEnabled: boolean;
  cursorPosition: number;
  characterTimings: CharacterTiming[];
  previousTypingProgress: TypingProgress[] | null;
  paragraphId: string; // To identify the same paragraph for ghost cursor
  timeRemaining: number; // Time remaining in seconds for timed tests
}

export const useTypingTest = ({
  initialDifficulty = 'medium',
  initialTimeLimit = 0,
  initialContentType = 'mixed',
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
    timeLimit: initialTimeLimit,
    contentType: initialContentType,
    soundEnabled,
    cursorPosition: 0,
    characterTimings: [],
    previousTypingProgress: null,
    paragraphId: '',
    timeRemaining: initialTimeLimit
  });
  
  const intervalRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Generate a new paragraph
  const generateNewText = useCallback((
    difficulty: DifficultyLevel = state.difficulty,
    contentType: ContentType = state.contentType
  ) => {
    const text = generateParagraph(difficulty, contentType);
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
      contentType,
      cursorPosition: 0,
      characterTimings: [],
      previousTypingProgress: previousProgress ? JSON.parse(previousProgress) : null,
      paragraphId,
      timeRemaining: prev.timeLimit
    }));
    
    // Focus the input field
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [state.difficulty, state.contentType]);
  
  // Initialize with a paragraph
  useEffect(() => {
    generateNewText(initialDifficulty, initialContentType);
    
    // Cleanup interval on unmount
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, [initialDifficulty, initialContentType, generateNewText]);
  
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
  
  // Timer for time-limited tests
  useEffect(() => {
    if (state.timeLimit > 0 && state.startTime && !state.isComplete) {
      // Initialize timer
      timerRef.current = window.setInterval(() => {
        setState(prev => {
          const elapsedSeconds = Math.floor((Date.now() - (prev.startTime || Date.now())) / 1000);
          const remaining = Math.max(0, prev.timeLimit - elapsedSeconds);
          
          // End test if time is up
          if (remaining === 0 && !prev.isComplete) {
            if (timerRef.current) window.clearInterval(timerRef.current);
            return {
              ...prev,
              isComplete: true,
              endTime: Date.now(),
              timeRemaining: 0
            };
          }
          
          return {
            ...prev,
            timeRemaining: remaining
          };
        });
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, [state.timeLimit, state.startTime, state.isComplete]);
  
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
    setState(prev => ({
      ...prev,
      difficulty: newDifficulty
    }));
    generateNewText(newDifficulty, state.contentType);
  }, [generateNewText, state.contentType]);
  
  // Change time limit
  const changeTimeLimit = useCallback((newTimeLimit: TimeLimit) => {
    setState(prev => ({
      ...prev,
      timeLimit: newTimeLimit,
      timeRemaining: newTimeLimit
    }));
    
    // Reset the test with new time limit
    generateNewText(state.difficulty, state.contentType);
  }, [generateNewText, state.difficulty, state.contentType]);
  
  // Change content type
  const changeContentType = useCallback((newContentType: ContentType) => {
    setState(prev => ({
      ...prev,
      contentType: newContentType
    }));
    generateNewText(state.difficulty, newContentType);
  }, [generateNewText, state.difficulty]);
  
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
        previousTypingProgress: typingProgress,
        timeRemaining: prev.timeLimit
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
        characterTimings: [],
        timeRemaining: prev.timeLimit
      }));
    }
    
    // Focus the input field
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [state.characterTimings, state.startTime, state.paragraphId]);
  
  // Clear all interval timers when component unmounts
  useEffect(() => {
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, []);
  
  return {
    text: state.text,
    input: state.input,
    isComplete: state.isComplete,
    wpm: state.wpm,
    accuracy: state.accuracy,
    progress: state.progress,
    difficulty: state.difficulty,
    timeLimit: state.timeLimit,
    timeRemaining: state.timeRemaining,
    contentType: state.contentType,
    soundEnabled: state.soundEnabled,
    cursorPosition: state.cursorPosition,
    previousTypingProgress: state.previousTypingProgress,
    isPreviousAttempt: !!state.previousTypingProgress,
    handleInputChange,
    generateNewText,
    changeDifficulty,
    changeTimeLimit,
    changeContentType,
    toggleSound,
    retryText,
    inputRef
  };
};
