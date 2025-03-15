
import React, { useState, useEffect } from 'react';
import { useTypingTest } from '../hooks/useTypingTest';
import TypingInput from './TypingInput';
import StatDisplay from './StatDisplay';
import TestSettings from './TestSettings';
import GhostCursor from './GhostCursor';
import { Check } from 'lucide-react';

const TypingTest: React.FC = () => {
  const {
    text,
    input,
    isComplete,
    wpm,
    accuracy,
    progress,
    difficulty,
    timeLimit,
    timeRemaining,
    contentType,
    soundEnabled,
    cursorPosition,
    previousTypingProgress,
    isPreviousAttempt,
    handleInputChange,
    generateNewText,
    changeDifficulty,
    changeTimeLimit,
    changeContentType,
    toggleSound,
    retryText,
    inputRef
  } = useTypingTest();
  
  // Display the text with highlighting for typed characters
  const renderText = () => {
    return (
      <div className="relative mb-8 p-6 glass-panel typing-text min-h-[200px]">
        {/* Ghost cursor from previous attempt */}
        {isPreviousAttempt && (
          <GhostCursor 
            previousProgress={previousTypingProgress} 
            text={text} 
            isActive={!isComplete}
          />
        )}
        
        {/* Current typing content */}
        <div className="relative">
          {text.split('').map((char, index) => {
            let className = '';
            
            if (index < input.length) {
              // Character has been typed
              className = char === input[index] ? 'correct-char' : 'error-char';
            }
            
            return (
              <span key={index} className={className}>
                {char}
                {index === cursorPosition && !isComplete && (
                  <span className="cursor"></span>
                )}
              </span>
            );
          })}
          
          {/* Show cursor at the end if we've typed all text */}
          {cursorPosition >= text.length && !isComplete && (
            <span className="cursor"></span>
          )}
        </div>
        
        {/* Text input for typing */}
        <TypingInput
          value={input}
          onChange={handleInputChange}
          disabled={isComplete}
          inputRef={inputRef}
        />
      </div>
    );
  };
  
  // Progress bar
  const renderProgressBar = () => {
    return (
      <div className="w-full max-w-2xl mx-auto mb-8 bg-white/5 rounded-full h-2 overflow-hidden">
        <div 
          className="h-full bg-typing-accent transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    );
  };
  
  // Completion message
  const renderCompletionMessage = () => {
    if (!isComplete) return null;
    
    const message = accuracy >= 95 
      ? "Excellent! Your typing skills are impressive." 
      : accuracy >= 85 
        ? "Good job! Keep practicing to improve your speed and accuracy."
        : "Nice try! Regular practice will help you improve.";
    
    return (
      <div className="w-full max-w-2xl mx-auto p-4 mb-6 rounded-md bg-white/5 border border-typing-accent/20 flex items-center animate-fade-in">
        <Check className="text-typing-correct mr-2" size={20} />
        <span>{message}</span>
      </div>
    );
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <header className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-semibold mb-2 tracking-tight">Typing Master</h1>
        <p className="text-typing-muted">Practice typing with real-time stats and ghost replay</p>
      </header>
      
      <StatDisplay 
        wpm={wpm} 
        accuracy={accuracy} 
        progress={progress} 
        timeRemaining={timeRemaining} 
        timeLimit={timeLimit} 
      />
      
      {renderProgressBar()}
      {renderCompletionMessage()}
      {renderText()}
      
      <TestSettings 
        difficulty={difficulty}
        timeLimit={timeLimit}
        contentType={contentType}
        soundEnabled={soundEnabled}
        changeDifficulty={changeDifficulty}
        changeTimeLimit={changeTimeLimit}
        changeContentType={changeContentType}
        toggleSound={toggleSound}
        retryText={retryText}
        generateNewText={generateNewText}
      />
      
      {/* Attribution */}
      <div className="text-center text-typing-muted text-sm mt-16">
        <p>Type to start the test. Previous progress will show as a ghost cursor.</p>
      </div>
    </div>
  );
};

export default TypingTest;
