
import React from 'react';
import { GitBranch, Wifi, Bell, Terminal, Zap } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface StatusBarProps {
  language: string;
  lineCount: number;
  currentLine: number;
  branch?: string;
  editorMode: 'default' | 'agent';
  onModeChange: (mode: 'default' | 'agent') => void;
}

const StatusBar: React.FC<StatusBarProps> = ({ 
  language, 
  lineCount, 
  currentLine,
  branch = 'main',
  editorMode,
  onModeChange
}) => {
  return (
    <div className="h-6 bg-sidebar-background text-sidebar-foreground text-xs border-t border-border flex items-center px-4">
      <div className="flex-1 flex items-center space-x-4">
        <div className="flex items-center">
          <GitBranch size={12} className="mr-1" />
          <span>{branch}</span>
        </div>
        
        <div className="flex items-center">
          <span>Ln {currentLine}, Col 1</span>
        </div>
        
        <ToggleGroup 
          type="single" 
          value={editorMode}
          onValueChange={(value) => {
            if (value) onModeChange(value as 'default' | 'agent');
          }}
          className="h-4 bg-sidebar-accent rounded-sm"
        >
          <ToggleGroupItem value="default" size="sm" className="h-4 px-1.5 py-0 text-[9px]">
            Default
          </ToggleGroupItem>
          <ToggleGroupItem value="agent" size="sm" className="h-4 px-1.5 py-0 text-[9px]">
            <Zap size={8} className="mr-0.5" />
            Agent
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      
      <div className="flex items-center space-x-4">
        <div>{language}</div>
        <div>UTF-8</div>
        <div>
          <Wifi size={12} className="text-green-500" />
        </div>
        <div>
          <Bell size={12} />
        </div>
      </div>
    </div>
  );
};

export default StatusBar;
