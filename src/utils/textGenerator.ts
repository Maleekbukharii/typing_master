
// Common words for different difficulty levels
const simpleWords = [
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "I", 
  "it", "for", "not", "on", "with", "he", "as", "you", "do", "at", 
  "this", "but", "his", "by", "from", "they", "we", "say", "her", "she", 
  "or", "an", "will", "my", "one", "all", "would", "there", "their", "what",
  "so", "up", "out", "if", "about", "who", "get", "which", "go", "me",
  "when", "make", "can", "like", "time", "no", "just", "him", "know", "take"
];

const mediumWords = [
  "about", "which", "when", "there", "other", "were", "into", "more", "your", "than",
  "first", "some", "time", "could", "these", "two", "may", "then", "over", "like",
  "also", "people", "year", "last", "most", "out", "after", "work", "use", "no",
  "way", "new", "many", "such", "great", "think", "same", "high", "every", "being",
  "during", "before", "through", "between", "those", "should", "because", "where", "school", "world",
  "family", "while", "country", "always", "though", "found", "until", "against", "might", "system"
];

const complexWords = [
  "experience", "technology", "development", "consider", "government", "particular", "environment", "opportunity",
  "important", "significant", "different", "available", "information", "management", "understanding", "community",
  "performance", "knowledge", "generation", "organization", "quality", "structure", "authority", "individual",
  "challenge", "relationship", "university", "strategy", "beautiful", "establish", "necessary", "recognize",
  "substantial", "comprehensive", "perspective", "international", "requirement", "investigation", "predominantly", "acknowledge",
  "considerable", "extraordinary", "determination", "approximately", "sophisticated", "implementation", "subsequently", "conventional"
];

// Numbers for number-only content
const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

// Punctuation marks to make text more natural
const punctuation = [".", ".", ".", ".", ",", ",", ",", "!", "?", ";", ":", "-", "(", ")", "\"", "'"];

// Content type options
export type ContentType = 'words' | 'punctuation' | 'numbers' | 'mixed';

/**
 * Generate a random paragraph with a mix of words based on difficulty and content type
 */
export const generateParagraph = (
  difficulty: 'easy' | 'medium' | 'hard',
  contentType: ContentType = 'mixed',
  wordCount: number = 50
): string => {
  let words: string[] = [];
  let result: string[] = [];
  
  // Select words based on difficulty for word-containing content types
  if (contentType === 'words' || contentType === 'mixed') {
    switch(difficulty) {
      case 'easy':
        words = [...simpleWords];
        break;
      case 'medium':
        words = [...simpleWords, ...mediumWords];
        break;
      case 'hard':
        words = [...simpleWords, ...mediumWords, ...complexWords];
        break;
      default:
        words = [...simpleWords];
    }
  }
  
  // Handle different content types
  switch (contentType) {
    case 'punctuation':
      // Generate random punctuation sequences
      while (result.length < wordCount) {
        const seqLength = Math.floor(Math.random() * 8) + 3;
        let sequence = "";
        for (let i = 0; i < seqLength && result.length < wordCount; i++) {
          sequence += punctuation[Math.floor(Math.random() * punctuation.length)];
        }
        result.push(sequence);
      }
      return result.join(" ");
      
    case 'numbers':
      // Generate random number sequences
      while (result.length < wordCount) {
        const seqLength = Math.floor(Math.random() * 8) + 2;
        let sequence = "";
        for (let i = 0; i < seqLength && result.length < wordCount; i++) {
          sequence += numbers[Math.floor(Math.random() * numbers.length)];
        }
        result.push(sequence);
      }
      return result.join(" ");
      
    case 'words':
      // Generate sentences with only words, no punctuation
      while (result.length < wordCount) {
        const sentenceLength = Math.floor(Math.random() * 8) + 5;
        for (let i = 0; i < sentenceLength && result.length < wordCount; i++) {
          const randomWord = words[Math.floor(Math.random() * words.length)];
          result.push(randomWord);
        }
      }
      return result.join(" ");
      
    case 'mixed':
    default:
      // Generate sentences with mix of words, punctuation, and some numbers
      while (result.length < wordCount) {
        // Sentence length between 5-12 words
        const sentenceLength = Math.floor(Math.random() * 8) + 5;
        const sentence: string[] = [];
        
        // Generate sentence
        for (let i = 0; i < sentenceLength && result.length + sentence.length < wordCount; i++) {
          // 10% chance to add a number
          if (Math.random() < 0.1) {
            const numberSeq = numbers[Math.floor(Math.random() * numbers.length)] + 
                            numbers[Math.floor(Math.random() * numbers.length)];
            sentence.push(numberSeq);
          } else {
            const randomWord = words[Math.floor(Math.random() * words.length)];
            
            // Capitalize first word in sentence
            if (i === 0) {
              sentence.push(randomWord.charAt(0).toUpperCase() + randomWord.slice(1));
            } else {
              // Add commas occasionally
              if (i > 2 && i < sentenceLength - 1 && Math.random() < 0.2) {
                const lastWord = sentence[sentence.length - 1];
                sentence[sentence.length - 1] = lastWord + ",";
              }
              
              sentence.push(randomWord);
            }
          }
        }
        
        // Add end punctuation
        const punctuationMark = punctuation[Math.floor(Math.random() * punctuation.length)];
        sentence[sentence.length - 1] += punctuationMark;
        
        // Add sentence to result
        result = [...result, ...sentence];
      }
      
      return result.join(" ");
  }
};

/**
 * Generate multiple paragraphs
 */
export const generateParagraphs = (
  count: number,
  difficulty: 'easy' | 'medium' | 'hard',
  contentType: ContentType = 'mixed',
  wordsPerParagraph: number = 50
): string[] => {
  const paragraphs: string[] = [];
  
  for (let i = 0; i < count; i++) {
    paragraphs.push(generateParagraph(difficulty, contentType, wordsPerParagraph));
  }
  
  return paragraphs;
};
