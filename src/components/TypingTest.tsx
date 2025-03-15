
import React, { useState, useEffect } from 'react';
import { useTypingTest } from '../hooks/useTypingTest';
import TypingInput from './TypingInput';
import StatDisplay from './StatDisplay';
import GhostCursor from './GhostCursor';
import { X, Check, RefreshCw, Volume2, VolumeX, Keyboard } from 'lucide-react';

const TypingTest: React.FC = () => {
  const {
    text,
    input,
    isComplete,
    wpm,
    accuracy,
    progress,
    difficulty,
    soundEnabled,
    cursorPosition,
    previousTypingProgress,
    isPreviousAttempt,
    handleInputChange,
    generateNewText,
    changeDifficulty,
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
  
  // Controls for difficulty and sound
  const renderControls = () => {
    return (
      <div className="w-full max-w-2xl mx-auto mb-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button 
            className={`px-4 py-2 rounded-md transition-all ${difficulty === 'easy' ? 'bg-typing-accent text-black font-medium' : 'bg-white/5 hover:bg-white/10'}`}
            onClick={() => changeDifficulty('easy')}
          >
            Easy
          </button>
          <button 
            className={`px-4 py-2 rounded-md transition-all ${difficulty === 'medium' ? 'bg-typing-accent text-black font-medium' : 'bg-white/5 hover:bg-white/10'}`}
            onClick={() => changeDifficulty('medium')}
          >
            Medium
          </button>
          <button 
            className={`px-4 py-2 rounded-md transition-all ${difficulty === 'hard' ? 'bg-typing-accent text-black font-medium' : 'bg-white/5 hover:bg-white/10'}`}
            onClick={() => changeDifficulty('hard')}
          >
            Hard
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            className="p-2 rounded-md bg-white/5 hover:bg-white/10 transition-all"
            onClick={toggleSound}
            aria-label={soundEnabled ? "Disable sound" : "Enable sound"}
          >
            {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
          
          <button 
            className="p-2 rounded-md bg-white/5 hover:bg-white/10 transition-all"
            onClick={retryText}
            aria-label="Retry text"
          >
            <RefreshCw size={20} />
          </button>
          
          <button 
            className="p-2 rounded-md bg-white/5 hover:bg-white/10 transition-all"
            onClick={() => generateNewText()}
            aria-label="New text"
          >
            <Keyboard size={20} />
          </button>
        </div>
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
      
      <StatDisplay wpm={wpm} accuracy={accuracy} progress={progress} />
      
      {renderProgressBar()}
      {renderCompletionMessage()}
      {renderText()}
      {renderControls()}
      
      {/* Attribution */}
      <div className="text-center text-typing-muted text-sm mt-16">
        <p>Type to start the test. Previous progress will show as a ghost cursor.</p>
      </div>
    </div>
  );
};

export default TypingTest;
