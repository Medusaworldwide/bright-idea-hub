
import React from 'react';
import { GitBranch, Wifi, Bell, Terminal } from 'lucide-react';

interface StatusBarProps {
  language: string;
  lineCount: number;
  currentLine: number;
  branch?: string;
}

const StatusBar: React.FC<StatusBarProps> = ({ 
  language, 
  lineCount, 
  currentLine,
  branch = 'main'
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
