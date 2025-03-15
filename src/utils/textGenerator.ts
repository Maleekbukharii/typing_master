
// Common words for different difficulty levels
const simpleWords = [
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "I", 
  "it", "for", "not", "on", "with", "he", "as", "you", "do", "at", 
  "this", "but", "his", "by", "from", "they", "we", "say", "her", "she", 
  "or", "an", "will", "my", "one", "all", "would", "there", "their", "what"
];

const mediumWords = [
  "about", "which", "when", "there", "other", "were", "into", "more", "your", "than",
  "first", "some", "time", "could", "these", "two", "may", "then", "over", "like",
  "also", "people", "year", "last", "most", "out", "after", "work", "use", "no",
  "way", "new", "many", "such", "great", "think", "same", "high", "every", "being"
];

const complexWords = [
  "experience", "technology", "development", "consider", "government", "particular", "environment", "opportunity",
  "important", "significant", "different", "available", "information", "management", "understanding", "community",
  "performance", "knowledge", "generation", "organization", "quality", "structure", "authority", "individual",
  "challenge", "relationship", "university", "strategy", "beautiful", "establish", "necessary", "recognize"
];

// Punctuation marks to make text more natural
const punctuation = [".", ".", ".", ".", ",", ",", ",", "!", "?"];

/**
 * Generate a random paragraph with a mix of words based on difficulty
 */
export const generateParagraph = (
  difficulty: 'easy' | 'medium' | 'hard',
  wordCount: number = 50
): string => {
  let words: string[] = [];
  let result: string[] = [];
  
  // Select words based on difficulty
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
  
  // Generate sentences until we have enough words
  while (result.length < wordCount) {
    // Sentence length between 5-12 words
    const sentenceLength = Math.floor(Math.random() * 8) + 5;
    const sentence: string[] = [];
    
    // Generate sentence
    for (let i = 0; i < sentenceLength && result.length + sentence.length < wordCount; i++) {
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
    
    // Add end punctuation
    const punctuationMark = punctuation[Math.floor(Math.random() * punctuation.length)];
    sentence[sentence.length - 1] += punctuationMark;
    
    // Add sentence to result
    result = [...result, ...sentence];
  }
  
  return result.join(" ");
};

/**
 * Generate multiple paragraphs
 */
export const generateParagraphs = (
  count: number,
  difficulty: 'easy' | 'medium' | 'hard',
  wordsPerParagraph: number = 50
): string[] => {
  const paragraphs: string[] = [];
  
  for (let i = 0; i < count; i++) {
    paragraphs.push(generateParagraph(difficulty, wordsPerParagraph));
  }
  
  return paragraphs;
};
