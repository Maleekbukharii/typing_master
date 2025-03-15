
import { ContentType } from '../utils/textGenerator';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';
export type TimeLimit = 15 | 30 | 60 | 120 | 0; // 0 means no time limit

export interface CharacterTiming {
  char: string;
  timestamp: number;
  position: number;
}

export interface TypingProgress {
  timestamp: number;
  position: number;
}

export interface TypingTestState {
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

export interface TypingTestHookReturn {
  text: string;
  input: string;
  isComplete: boolean;
  wpm: number;
  accuracy: number;
  progress: number;
  difficulty: DifficultyLevel;
  timeLimit: TimeLimit;
  timeRemaining: number;
  contentType: ContentType;
  soundEnabled: boolean;
  cursorPosition: number;
  previousTypingProgress: TypingProgress[] | null;
  isPreviousAttempt: boolean;
  handleInputChange: (inputValue: string) => void;
  generateNewText: (difficulty?: DifficultyLevel, contentType?: ContentType) => void;
  changeDifficulty: (newDifficulty: DifficultyLevel) => void;
  changeTimeLimit: (newTimeLimit: TimeLimit) => void;
  changeContentType: (newContentType: ContentType) => void;
  toggleSound: () => void;
  retryText: () => void;
  inputRef: React.RefObject<HTMLInputElement>;
}
