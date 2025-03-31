
import React from 'react';
import { SplitSquareVertical, SplitSquareHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface StatusBarProps {
  language: string;
  lineCount: number;
  currentLine: number;
  branch: string;
  editorMode: 'default' | 'agent';
  onModeChange: (mode: 'default' | 'agent') => void;
  splitViewActive?: boolean;
  onToggleSplitView?: () => void;
  splitViewLayout?: 'horizontal' | 'vertical';
  onToggleSplitLayout?: () => void;
}

const StatusBar: React.FC<StatusBarProps> = ({
  language,
  lineCount,
  currentLine,
  branch,
  editorMode,
  onModeChange,
  splitViewActive = false,
  onToggleSplitView,
  splitViewLayout = 'horizontal',
  onToggleSplitLayout
}) => {
  return (
    <div className="bg-sidebar-background h-8 border-t border-border flex items-center justify-between px-4 text-xs">
      <div className="flex items-center space-x-4">
        <span>{language.toUpperCase()}</span>
        <span>Lines: {lineCount}</span>
        <span>Line: {currentLine}</span>
        <span>Branch: {branch}</span>
      </div>
      
      <div className="flex items-center space-x-2">
        {onToggleSplitView && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                className={cn(
                  "p-1 rounded hover:bg-sidebar-accent",
                  splitViewActive && "text-primary"
                )}
                onClick={onToggleSplitView}
              >
                <SplitSquareVertical size={14} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">
              {splitViewActive ? 'Disable Split View' : 'Enable Split View'}
            </TooltipContent>
          </Tooltip>
        )}
        
        {splitViewActive && onToggleSplitLayout && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                className="p-1 rounded hover:bg-sidebar-accent"
                onClick={onToggleSplitLayout}
              >
                <SplitSquareHorizontal size={14} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">
              Change Split Layout
            </TooltipContent>
          </Tooltip>
        )}
        
        <div className="flex items-center border border-border rounded overflow-hidden">
          <button
            className={cn(
              "px-2 py-0.5",
              editorMode === 'default' ? "bg-primary text-primary-foreground" : "bg-transparent hover:bg-sidebar-accent"
            )}
            onClick={() => onModeChange('default')}
          >
            Default
          </button>
          <button
            className={cn(
              "px-2 py-0.5",
              editorMode === 'agent' ? "bg-primary text-primary-foreground" : "bg-transparent hover:bg-sidebar-accent"
            )}
            onClick={() => onModeChange('agent')}
          >
            Agent
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatusBar;
