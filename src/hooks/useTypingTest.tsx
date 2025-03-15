
import { useState, useRef, useCallback } from 'react';
import { useTypingTimer } from './useTypingTimer';
import { useTypingStats } from './useTypingStats';
import { 
  DifficultyLevel, 
  TimeLimit, 
  TypingTestState, 
  TypingTestHookReturn,
  CharacterTiming
} from '../types/typingTypes';
import { ContentType } from '../utils/textGenerator';
import { playKeySound, processTypingProgress } from '../utils/typingUtils';
import { generateTypingText, saveTypingProgress } from '../services/typingTextService';

interface UseTypingTestProps {
  initialDifficulty?: DifficultyLevel;
  initialTimeLimit?: TimeLimit;
  initialContentType?: ContentType;
  soundEnabled?: boolean;
}

export const useTypingTest = ({
  initialDifficulty = 'medium',
  initialTimeLimit = 0,
  initialContentType = 'mixed',
  soundEnabled = true
}: UseTypingTestProps = {}): TypingTestHookReturn => {
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
  
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Generate a new paragraph
  const generateNewText = useCallback((
    difficulty: DifficultyLevel = state.difficulty,
    contentType: ContentType = state.contentType
  ) => {
    const { text, paragraphId, previousProgress } = generateTypingText(difficulty, contentType);
    
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
      previousTypingProgress: previousProgress,
      paragraphId,
      timeRemaining: prev.timeLimit
    }));
    
    // Focus the input field
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [state.difficulty, state.contentType]);
  
  // Handle timer completion
  const handleTimerComplete = useCallback(() => {
    setState(prev => ({
      ...prev,
      isComplete: true,
      endTime: Date.now(),
      timeRemaining: 0
    }));
  }, []);
  
  // Handle timer tick
  const handleTimerTick = useCallback((remainingTime: number) => {
    setState(prev => ({
      ...prev,
      timeRemaining: remainingTime
    }));
  }, []);
  
  // Initialize typing timer
  useTypingTimer({
    timeLimit: state.timeLimit,
    startTime: state.startTime,
    isComplete: state.isComplete,
    onTimerComplete: handleTimerComplete,
    onTimerTick: handleTimerTick
  });
  
  // Handle stats update
  const handleStatsUpdate = useCallback((wpm: number, accuracy: number, progress: number) => {
    setState(prev => ({
      ...prev,
      wpm,
      accuracy,
      progress
    }));
  }, []);
  
  // Initialize typing stats
  useTypingStats({
    text: state.text,
    input: state.input,
    cursorPosition: state.cursorPosition,
    startTime: state.startTime,
    isComplete: state.isComplete,
    onStatsUpdate: handleStatsUpdate
  });
  
  // Initialize with a paragraph
  useState(() => {
    generateNewText(initialDifficulty, initialContentType);
  });
  
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
      saveTypingProgress(state.paragraphId, typingProgress);
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
      saveTypingProgress(state.paragraphId, typingProgress);
      
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
