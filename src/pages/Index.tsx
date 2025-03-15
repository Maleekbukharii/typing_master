
import React from 'react';
import TypingTest from '../components/TypingTest';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-typing-background text-typing-foreground overflow-auto py-10">
      <TypingTest />
    </div>
  );
};

export default Index;
