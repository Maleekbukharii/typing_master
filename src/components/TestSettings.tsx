
import React from 'react';
import { 
  Settings, 
  Volume2, 
  VolumeX, 
  RefreshCw, 
  Keyboard,
  SignalLow,
  SignalMedium,
  SignalHigh,
  Clock,
  Hash,
  Percent,
  Calculator,
  FileText
} from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from './ui/toggle-group';
import { DifficultyLevel, TimeLimit } from '../hooks/useTypingTest';
import { ContentType } from '../utils/textGenerator';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from './ui/sheet';

interface TestSettingsProps {
  difficulty: DifficultyLevel;
  timeLimit: TimeLimit;
  contentType: ContentType;
  soundEnabled: boolean;
  changeDifficulty: (difficulty: DifficultyLevel) => void;
  changeTimeLimit: (timeLimit: TimeLimit) => void;
  changeContentType: (contentType: ContentType) => void;
  toggleSound: () => void;
  retryText: () => void;
  generateNewText: () => void;
}

const TestSettings: React.FC<TestSettingsProps> = ({
  difficulty,
  timeLimit,
  contentType,
  soundEnabled,
  changeDifficulty,
  changeTimeLimit,
  changeContentType,
  toggleSound,
  retryText,
  generateNewText
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto mb-8 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Sheet>
          <SheetTrigger className="p-2 rounded-md bg-white/5 hover:bg-white/10 transition-all">
            <Settings size={20} />
          </SheetTrigger>
          <SheetContent side="left" className="bg-typing-background border-r border-typing-accent/20 text-typing-foreground w-[300px]">
            <SheetHeader>
              <SheetTitle className="text-typing-accent">Test Settings</SheetTitle>
            </SheetHeader>
            
            {/* Difficulty Settings */}
            <div className="py-4">
              <h3 className="text-sm font-medium mb-2 text-typing-muted">Difficulty</h3>
              <ToggleGroup type="single" value={difficulty} onValueChange={(value) => value && changeDifficulty(value as DifficultyLevel)}>
                <ToggleGroupItem value="easy" className="flex items-center gap-1">
                  <SignalLow size={16} />
                  Easy
                </ToggleGroupItem>
                <ToggleGroupItem value="medium" className="flex items-center gap-1">
                  <SignalMedium size={16} />
                  Medium
                </ToggleGroupItem>
                <ToggleGroupItem value="hard" className="flex items-center gap-1">
                  <SignalHigh size={16} />
                  Hard
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            
            {/* Time Limit Settings */}
            <div className="py-4">
              <h3 className="text-sm font-medium mb-2 text-typing-muted">Time Limit</h3>
              <ToggleGroup type="single" value={timeLimit.toString()} onValueChange={(value) => value && changeTimeLimit(Number(value) as TimeLimit)}>
                <ToggleGroupItem value="0" className="flex items-center gap-1">
                  <Clock size={16} />
                  None
                </ToggleGroupItem>
                <ToggleGroupItem value="15" className="flex items-center gap-1">
                  15s
                </ToggleGroupItem>
                <ToggleGroupItem value="30" className="flex items-center gap-1">
                  30s
                </ToggleGroupItem>
                <ToggleGroupItem value="60" className="flex items-center gap-1">
                  60s
                </ToggleGroupItem>
                <ToggleGroupItem value="120" className="flex items-center gap-1">
                  120s
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            
            {/* Content Type Settings */}
            <div className="py-4">
              <h3 className="text-sm font-medium mb-2 text-typing-muted">Content Type</h3>
              <ToggleGroup type="single" value={contentType} onValueChange={(value) => value && changeContentType(value as ContentType)}>
                <ToggleGroupItem value="words" className="flex items-center gap-1">
                  <FileText size={16} />
                  Words
                </ToggleGroupItem>
                <ToggleGroupItem value="punctuation" className="flex items-center gap-1">
                  <Percent size={16} />
                  Punctuation
                </ToggleGroupItem>
                <ToggleGroupItem value="numbers" className="flex items-center gap-1">
                  <Calculator size={16} />
                  Numbers
                </ToggleGroupItem>
                <ToggleGroupItem value="mixed" className="flex items-center gap-1">
                  <Hash size={16} />
                  Mixed
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </SheetContent>
        </Sheet>
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

export default TestSettings;
