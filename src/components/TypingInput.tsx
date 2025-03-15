
import React, { useRef, useEffect } from 'react';

interface TypingInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
}

const TypingInput: React.FC<TypingInputProps> = ({ 
  value, 
  onChange, 
  disabled = false,
  inputRef
}) => {
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);
  
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };
  
  // Prevent default behavior for certain keys to avoid browser shortcuts
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow keys that are needed for typing
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
    
    // Prevent browser shortcuts with modifier keys
    if ((e.ctrlKey || e.metaKey || e.altKey) && !allowedKeys.includes(e.key)) {
      e.preventDefault();
    }
    
    // Prevent Tab key default behavior but still allow it for typing
    if (e.key === 'Tab') {
      e.preventDefault();
      const newValue = value + '\t';
      onChange(newValue);
    }
  };
  
  return (
    <input
      ref={inputRef}
      type="text"
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      className="opacity-0 absolute left-0 w-full h-24 z-10 cursor-default"
      autoComplete="off"
      autoCapitalize="off"
      autoCorrect="off"
      spellCheck="false"
      aria-label="Typing input"
    />
  );
};

export default TypingInput;
