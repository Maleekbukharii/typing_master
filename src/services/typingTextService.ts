
import { DifficultyLevel, TypingProgress } from '../types/typingTypes';
import { ContentType, generateParagraph } from '../utils/textGenerator';

export const generateTypingText = (
  difficulty: DifficultyLevel,
  contentType: ContentType
): { text: string; paragraphId: string; previousProgress: TypingProgress[] | null } => {
  const text = generateParagraph(difficulty, contentType);
  const paragraphId = btoa(text.substring(0, 20)); // Create a simple ID from the start of text
  
  // Check if we have previous progress for this exact paragraph
  const previousProgressData = localStorage.getItem(`typing-progress-${paragraphId}`);
  const previousProgress = previousProgressData ? JSON.parse(previousProgressData) : null;
  
  return { text, paragraphId, previousProgress };
};

export const saveTypingProgress = (
  paragraphId: string,
  typingProgress: TypingProgress[]
): void => {
  localStorage.setItem(
    `typing-progress-${paragraphId}`,
    JSON.stringify(typingProgress)
  );
};
