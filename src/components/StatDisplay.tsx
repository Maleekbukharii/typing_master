
import React from 'react';
import { Clock, Percent, Trophy } from 'lucide-react';

interface StatDisplayProps {
  wpm: number;
  accuracy: number;
  progress: number;
}

const StatDisplay: React.FC<StatDisplayProps> = ({ wpm, accuracy, progress }) => {
  return (
    <div className="grid grid-cols-3 gap-4 w-full max-w-2xl mx-auto mb-8 animate-fade-in">
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
    </div>
  );
};

export default StatDisplay;
