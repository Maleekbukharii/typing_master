
import React, { useEffect, useState } from 'react';
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
  const [displayedWpm, setDisplayedWpm] = useState(wpm);
  const [displayedAccuracy, setDisplayedAccuracy] = useState(accuracy);
  const [displayedProgress, setDisplayedProgress] = useState(progress);
  const [displayedTimeRemaining, setDisplayedTimeRemaining] = useState(timeRemaining);
  
  // Update display values whenever props change
  useEffect(() => {
    setDisplayedWpm(wpm);
    setDisplayedAccuracy(accuracy);
    setDisplayedProgress(progress);
    setDisplayedTimeRemaining(timeRemaining);
  }, [wpm, accuracy, progress, timeRemaining]);
  
  // Format time remaining as MM:SS
  const formatTime = (seconds: number | undefined) => {
    if (seconds === undefined) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const isTimedTest = timeLimit && timeLimit > 0;
  
  // Determine time color based on remaining time
  const getTimeColor = () => {
    if (!displayedTimeRemaining) return '';
    if (displayedTimeRemaining <= 5) return 'text-red-500 animate-pulse';
    if (displayedTimeRemaining <= 10) return 'text-typing-error';
    return '';
  };

  return (
    <div className={`grid ${isTimedTest ? 'grid-cols-4' : 'grid-cols-3'} gap-4 w-full max-w-2xl mx-auto mb-8 animate-fade-in`}>
      <div className="stat-card">
        <Clock className="mb-2 text-typing-accent opacity-80" size={20} />
        <span className="stat-value">{displayedWpm}</span>
        <span className="stat-label">WPM</span>
      </div>
      
      <div className="stat-card">
        <Percent className="mb-2 text-typing-accent opacity-80" size={20} />
        <span className="stat-value">{displayedAccuracy}%</span>
        <span className="stat-label">Accuracy</span>
      </div>
      
      <div className="stat-card">
        <Trophy className="mb-2 text-typing-accent opacity-80" size={20} />
        <span className="stat-value">{Math.round(displayedProgress)}%</span>
        <span className="stat-label">Progress</span>
      </div>
      
      {isTimedTest && displayedTimeRemaining !== undefined && (
        <div className="stat-card">
          <Timer className="mb-2 text-typing-accent opacity-80" size={20} />
          <span className={`stat-value ${getTimeColor()}`}>
            {formatTime(displayedTimeRemaining)}
          </span>
          <span className="stat-label">Time</span>
        </div>
      )}
    </div>
  );
};

export default StatDisplay;
