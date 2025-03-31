
import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, ChevronRight, Circle } from 'lucide-react';

interface TerminalProps {
  visible: boolean;
}

const Terminal: React.FC<TerminalProps> = ({ visible }) => {
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [currentCommand, setCurrentCommand] = useState<string>('');
  const [outputHistory, setOutputHistory] = useState<{type: 'command' | 'output', content: string}[]>([
    { type: 'output', content: 'Welcome to IDE Terminal v1.0.0' },
    { type: 'output', content: 'Type "help" for available commands.' }
  ]);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  
  const handleCommand = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && currentCommand.trim()) {
      const command = currentCommand.trim();
      
      // Add command to history
      setCommandHistory(prev => [...prev, command]);
      setOutputHistory(prev => [...prev, { type: 'command', content: command }]);
      
      // Process command
      const output = processCommand(command);
      setOutputHistory(prev => [...prev, { type: 'output', content: output }]);
      
      // Clear current command
      setCurrentCommand('');
    }
  };
  
  const processCommand = (command: string): string => {
    const commands: Record<string, () => string> = {
      'help': () => 'Available commands: help, clear, echo, date, ls, pwd, whoami',
      'clear': () => {
        setTimeout(() => {
          setOutputHistory([
            { type: 'output', content: 'Terminal cleared' }
          ]);
        }, 0);
        return '';
      },
      'echo': () => command.substring(5),
      'date': () => new Date().toString(),
      'ls': () => 'src/ public/ package.json tsconfig.json README.md',
      'pwd': () => '/project/workspace',
      'whoami': () => 'developer'
    };
    
    if (command.startsWith('echo ')) {
      return commands['echo']();
    }
    
    return commands[command] ? commands[command]() : `Command not found: ${command}`;
  };
  
  // Auto-scroll to bottom when output changes
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [outputHistory]);
  
  // Focus input when terminal becomes visible
  useEffect(() => {
    if (visible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [visible]);
  
  if (!visible) return null;
  
  return (
    <div className="bg-sidebar-background text-sidebar-foreground border-t border-border h-64 overflow-hidden flex flex-col">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border">
        <div className="flex items-center">
          <TerminalIcon size={14} className="mr-2" />
          <span className="text-sm font-medium">Terminal</span>
        </div>
        <div className="flex space-x-2">
          <Circle size={10} className="text-red-500" />
          <Circle size={10} className="text-yellow-500" />
          <Circle size={10} className="text-green-500" />
        </div>
      </div>
      
      <div ref={terminalRef} className="flex-1 overflow-y-auto p-2 font-mono text-sm">
        {outputHistory.map((item, index) => (
          <div key={index} className={`mb-1 ${item.type === 'command' ? 'text-primary' : ''}`}>
            {item.type === 'command' ? (
              <div className="flex">
                <span className="text-green-500 mr-2">$</span>
                <span>{item.content}</span>
              </div>
            ) : (
              <div className="pl-4">{item.content}</div>
            )}
          </div>
        ))}
        
        <div className="flex items-center">
          <span className="text-green-500 mr-2">$</span>
          <input
            ref={inputRef}
            type="text"
            value={currentCommand}
            onChange={(e) => setCurrentCommand(e.target.value)}
            onKeyDown={handleCommand}
            className="bg-transparent border-none outline-none flex-1 text-sidebar-foreground"
            autoFocus
          />
        </div>
      </div>
    </div>
  );
};

export default Terminal;
