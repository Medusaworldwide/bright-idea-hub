
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface CodeCompletionProps {
  language: string;
  currentText: string;
  cursorPosition: {
    line: number;
    column: number;
  };
  onAccept: (completion: string) => void;
  onDismiss: () => void;
}

const CodeCompletion: React.FC<CodeCompletionProps> = ({
  language,
  currentText,
  cursorPosition,
  onAccept,
  onDismiss
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Simple suggestion generator based on language and current text
  useEffect(() => {
    const generateSuggestions = () => {
      const lines = currentText.split('\n');
      const currentLine = lines[cursorPosition.line] || '';
      const textBeforeCursor = currentLine.substring(0, cursorPosition.column);
      
      // Get the last word being typed
      const lastWord = textBeforeCursor.match(/[a-zA-Z0-9_]+$/)?.[0] || '';
      
      if (lastWord.length < 2) {
        setIsVisible(false);
        return [];
      }

      // Simple language-specific suggestions
      let possibleSuggestions: string[] = [];
      
      if (language === 'typescript' || language === 'javascript') {
        const jsKeywords = [
          'function', 'const', 'let', 'var', 'return', 'if', 'else', 'for', 'while',
          'switch', 'case', 'break', 'continue', 'class', 'interface', 'type',
          'export', 'import', 'from', 'async', 'await', 'try', 'catch', 'finally',
          'throw', 'new', 'this', 'super', 'extends', 'implements', 'static'
        ];
        
        const reactHooks = [
          'useState', 'useEffect', 'useContext', 'useReducer', 'useCallback',
          'useMemo', 'useRef', 'useImperativeHandle', 'useLayoutEffect', 'useDebugValue'
        ];
        
        possibleSuggestions = [...jsKeywords, ...reactHooks];
      } else if (language === 'css') {
        possibleSuggestions = [
          'display', 'position', 'margin', 'padding', 'width', 'height',
          'color', 'background', 'font-size', 'border', 'flex', 'grid',
          'transition', 'animation', 'transform', 'opacity', 'visibility'
        ];
      } else if (language === 'html') {
        possibleSuggestions = [
          'div', 'span', 'p', 'h1', 'h2', 'h3', 'a', 'img', 'ul', 'li',
          'button', 'input', 'form', 'table', 'tr', 'td', 'th', 'section', 'article'
        ];
      }
      
      // Filter suggestions that match the current word
      const filtered = possibleSuggestions.filter(s => 
        s.toLowerCase().startsWith(lastWord.toLowerCase())
      );
      
      setIsVisible(filtered.length > 0);
      return filtered;
    };

    setSuggestions(generateSuggestions());
    setSelectedIndex(0);
  }, [currentText, cursorPosition, language]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isVisible) return;
      
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => (prev + 1) % suggestions.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => (prev - 1 + suggestions.length) % suggestions.length);
          break;
        case 'Tab':
        case 'Enter':
          e.preventDefault();
          if (suggestions[selectedIndex]) {
            onAccept(suggestions[selectedIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          onDismiss();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, suggestions, selectedIndex, onAccept, onDismiss]);

  if (!isVisible || suggestions.length === 0) {
    return null;
  }

  return (
    <div className="absolute z-50 bg-popover border border-border rounded-md shadow-md overflow-hidden w-64">
      <div className="max-h-60 overflow-y-auto">
        {suggestions.map((suggestion, index) => (
          <div 
            key={suggestion}
            className={cn(
              "px-2 py-1 cursor-pointer hover:bg-muted text-sm",
              index === selectedIndex && "bg-primary/10 text-primary"
            )}
            onClick={() => onAccept(suggestion)}
          >
            {suggestion}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CodeCompletion;
