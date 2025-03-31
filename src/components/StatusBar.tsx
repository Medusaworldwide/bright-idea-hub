
import React, { useState } from 'react';
import { GitBranch, Wifi, Bell, Terminal, Zap, ChevronDown, Command } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';

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
  const [showAgentSettings, setShowAgentSettings] = useState(false);
  const [autoRun, setAutoRun] = useState(true);
  const [autoFixErrors, setAutoFixErrors] = useState(true);

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
        
        <DropdownMenu open={showAgentSettings} onOpenChange={setShowAgentSettings}>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center">
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
                <ToggleGroupItem value="agent" size="sm" className="h-4 px-1.5 py-0 text-[9px] flex items-center">
                  <Zap size={8} className="mr-0.5" />
                  Agent 
                  {editorMode === 'agent' && <ChevronDown size={10} className="ml-0.5 opacity-70" />}
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </DropdownMenuTrigger>
          
          {editorMode === 'agent' && (
            <DropdownMenuContent className="w-64 bg-sidebar-background border-sidebar-border text-sidebar-foreground">
              <div className="flex items-center px-3 py-2 border-b border-sidebar-border">
                <button className="text-sidebar-foreground opacity-70 mr-2">
                  <ChevronDown size={16} className="transform rotate-90" />
                </button>
                <div className="flex items-center">
                  <Zap size={14} className="mr-2" /> 
                  <span className="font-medium">Agent</span>
                </div>
                <button className="ml-auto text-sidebar-foreground opacity-70">
                  Done
                </button>
              </div>
              
              <div className="py-1">
                <div className="flex items-center justify-between px-3 py-2">
                  <span>Model</span>
                  <div className="flex items-center text-sidebar-foreground/70">
                    <span>Set</span>
                    <ChevronDown size={14} className="ml-1 transform -rotate-90" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between px-3 py-2">
                  <span>Keybinding</span>
                  <div className="flex items-center text-sidebar-foreground/70">
                    <Command size={14} className="mr-1" />
                    <span>I</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between px-3 py-2">
                  <span>Auto-run</span>
                  <Switch 
                    checked={autoRun}
                    onCheckedChange={setAutoRun}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
                
                <div className="flex items-center justify-between px-3 py-2">
                  <span>Auto-fix errors</span>
                  <Switch 
                    checked={autoFixErrors} 
                    onCheckedChange={setAutoFixErrors}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
              </div>
            </DropdownMenuContent>
          )}
        </DropdownMenu>
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
