
import React from 'react';
import { Clock, Percent, Trophy, Timer } from 'lucide-react';

interface StatDisplayProps {
  wpm: number;
  accuracy: number;
  progress: number;
  timeRemaining?: number;
  timeLimit?: number;
}

const StatDisplay: React.FC<StatDisplayProps> = ({ 
  wpm, 
  accuracy, 
  progress, 
  timeRemaining, 
  timeLimit 
}) => {
  // Format time remaining as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const isTimedTest = timeLimit && timeLimit > 0;

  return (
    <div className={`grid ${isTimedTest ? 'grid-cols-4' : 'grid-cols-3'} gap-4 w-full max-w-2xl mx-auto mb-8 animate-fade-in`}>
      <div className="stat-card">
        <Clock className="mb-2 text-typing-accent opacity-80" size={20} />
        <span className="stat-value">{wpm}</span>
        <span className="stat-label">WPM</span>
      </div>
      
      <div className="stat-card">
        <Percent className="mb-2 text-typing-accent opacity-80" size={20} />
        <span className="stat-value">{accuracy}%</span>
        <span className="stat-label">Accuracy</span>
      </div>
      
      <div className="stat-card">
        <Trophy className="mb-2 text-typing-accent opacity-80" size={20} />
        <span className="stat-value">{Math.round(progress)}%</span>
        <span className="stat-label">Progress</span>
      </div>
      
      {isTimedTest && timeRemaining !== undefined && (
        <div className="stat-card">
          <Timer className="mb-2 text-typing-accent opacity-80" size={20} />
          <span className={`stat-value ${timeRemaining <= 10 ? 'text-typing-error' : ''}`}>
            {formatTime(timeRemaining)}
          </span>
          <span className="stat-label">Time</span>
        </div>
      )}
    </div>
  );
};

export default StatDisplay;
