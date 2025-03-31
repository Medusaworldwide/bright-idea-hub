import React, { useState, useEffect } from 'react';

interface EditorProps {
  content: string;
  language: string;
  mode: 'default' | 'agent';
}

// Simple syntax highlighter
const highlightSyntax = (code: string, language: string): React.ReactNode[] => {
  // Basic highlighting for TypeScript/JavaScript
  if (language === 'typescript' || language === 'javascript') {
    const lines = code.split('\n');
    
    return lines.map((line, lineIndex) => {
      // Very simple syntax highlighting (this would be more complex in a real IDE)
      const parts: React.ReactNode[] = [];
      
      // Keywords
      const keywords = ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'import', 'export', 'from', 'default', 'interface', 'type', 'class', 'extends', 'implements'];
      
      let currentPart = '';
      let inString = false;
      let stringChar = '';
      let inComment = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        // Check for comments
        if (!inString && char === '/' && line[i + 1] === '/') {
          if (currentPart) {
            parts.push(<span key={`p-${lineIndex}-${parts.length}`}>{currentPart}</span>);
            currentPart = '';
          }
          parts.push(<span key={`c-${lineIndex}`} className="line-comment">{line.substring(i)}</span>);
          break;
        }
        
        // Check for strings
        if (!inString && (char === '"' || char === "'" || char === '`')) {
          if (currentPart) {
            parts.push(<span key={`p-${lineIndex}-${parts.length}`}>{currentPart}</span>);
            currentPart = '';
          }
          inString = true;
          stringChar = char;
          currentPart = char;
        } else if (inString && char === stringChar && line[i - 1] !== '\\') {
          currentPart += char;
          parts.push(<span key={`s-${lineIndex}-${parts.length}`} className="line-string">{currentPart}</span>);
          currentPart = '';
          inString = false;
        } else if (inString) {
          currentPart += char;
        } else if (/[a-zA-Z_$]/.test(char)) {
          // Start of a word
          let word = char;
          let j = i + 1;
          while (j < line.length && /[a-zA-Z0-9_$]/.test(line[j])) {
            word += line[j];
            j++;
          }
          
          if (keywords.includes(word)) {
            if (currentPart) {
              parts.push(<span key={`p-${lineIndex}-${parts.length}`}>{currentPart}</span>);
              currentPart = '';
            }
            parts.push(<span key={`k-${lineIndex}-${parts.length}`} className="line-keyword">{word}</span>);
            i = j - 1;
          } else if (/^[A-Z]/.test(word)) {
            // Types (capitalized words)
            if (currentPart) {
              parts.push(<span key={`p-${lineIndex}-${parts.length}`}>{currentPart}</span>);
              currentPart = '';
            }
            parts.push(<span key={`t-${lineIndex}-${parts.length}`} className="line-type">{word}</span>);
            i = j - 1;
          } else {
            // Function calls
            let isFunction = false;
            for (let k = j; k < line.length; k++) {
              if (line[k] === '(') {
                isFunction = true;
                break;
              } else if (line[k] !== ' ') {
                break;
              }
            }
            
            if (isFunction) {
              if (currentPart) {
                parts.push(<span key={`p-${lineIndex}-${parts.length}`}>{currentPart}</span>);
                currentPart = '';
              }
              parts.push(<span key={`f-${lineIndex}-${parts.length}`} className="line-function">{word}</span>);
            } else {
              currentPart += word;
            }
            i = j - 1;
          }
        } else if (/[0-9]/.test(char)) {
          // Numbers
          let number = char;
          let j = i + 1;
          while (j < line.length && /[0-9.]/.test(line[j])) {
            number += line[j];
            j++;
          }
          
          if (currentPart) {
            parts.push(<span key={`p-${lineIndex}-${parts.length}`}>{currentPart}</span>);
            currentPart = '';
          }
          parts.push(<span key={`n-${lineIndex}-${parts.length}`} className="line-number">{number}</span>);
          i = j - 1;
        } else if (/[+\-*/%=<>!&|^~?:.]/.test(char)) {
          // Operators
          if (currentPart) {
            parts.push(<span key={`p-${lineIndex}-${parts.length}`}>{currentPart}</span>);
            currentPart = '';
          }
          
          let operator = char;
          if ((char === '=' && line[i + 1] === '=') ||
              (char === '!' && line[i + 1] === '=') ||
              (char === '<' && line[i + 1] === '=') ||
              (char === '>' && line[i + 1] === '=') ||
              (char === '&' && line[i + 1] === '&') ||
              (char === '|' && line[i + 1] === '|')) {
            operator += line[i + 1];
            i++;
          }
          
          parts.push(<span key={`o-${lineIndex}-${parts.length}`} className="line-operator">{operator}</span>);
        } else {
          currentPart += char;
        }
      }
      
      if (currentPart) {
        parts.push(<span key={`p-${lineIndex}-${parts.length}`}>{currentPart}</span>);
      }
      
      return (
        <div key={lineIndex} className="editor-line">
          <span className="editor-line-number">{lineIndex + 1}</span>
          {parts}
          {lineIndex === lines.length - 1 && <span className="cursor" />}
        </div>
      );
    });
  }
  
  // Fallback for other languages
  return code.split('\n').map((line, i) => (
    <div key={i} className="editor-line">
      <span className="editor-line-number">{i + 1}</span>
      {line}
      {i === code.split('\n').length - 1 && <span className="cursor" />}
    </div>
  ));
};

const Editor: React.FC<EditorProps> = ({ content, language, mode }) => {
  const [highlightedContent, setHighlightedContent] = useState<React.ReactNode[]>([]);
  const [suggestion, setSuggestion] = useState<string>('');
  const [showSuggestion, setShowSuggestion] = useState<boolean>(false);
  const [cursorPosition, setCursorPosition] = useState<{line: number, col: number}>({line: 0, col: 0});
  const [agentMessage, setAgentMessage] = useState<string | null>(null);
  
  // Simulate typing effect with the agent cursor
  useEffect(() => {
    if (mode !== 'agent') {
      setShowSuggestion(false);
      return;
    }
    
    const timer = setTimeout(() => {
      if (Math.random() > 0.7) {
        // Randomly show code suggestions based on language
        const suggestions = {
          'typescript': ['interface', 'function', 'const', 'export default', 'useState', 'useEffect'],
          'javascript': ['function', 'const', 'let', 'console.log', 'return', 'if (condition) {'],
          'css': ['.class {', 'display: flex;', 'margin: 0 auto;', 'padding: 1rem;'],
          'json': ['{\n  "key": "value"\n}', '"dependencies": {', '"scripts": {']
        };
        
        const langSuggestions = suggestions[language as keyof typeof suggestions] || suggestions['javascript'];
        const randomSuggestion = langSuggestions[Math.floor(Math.random() * langSuggestions.length)];
        
        setSuggestion(randomSuggestion);
        setShowSuggestion(true);
        
        // Hide suggestion after 3 seconds
        setTimeout(() => {
          setShowSuggestion(false);
        }, 3000);
      }
    }, 5000); // Show suggestions every 5 seconds
    
    return () => clearTimeout(timer);
  }, [language, showSuggestion, mode]);
  
  // Show agent mode activation message
  useEffect(() => {
    if (mode === 'agent') {
      setAgentMessage('Agent mode activated. AI assistance enabled.');
      setTimeout(() => {
        setAgentMessage(null);
      }, 3000);
    }
  }, [mode]);
  
  // Update cursor position randomly to simulate movement
  useEffect(() => {
    if (mode !== 'agent') return;
    
    const timer = setInterval(() => {
      const lines = content.split('\n');
      const randomLine = Math.floor(Math.random() * lines.length);
      const randomCol = Math.floor(Math.random() * (lines[randomLine].length + 1));
      
      setCursorPosition({
        line: randomLine,
        col: randomCol
      });
    }, 8000); // Move cursor every 8 seconds
    
    return () => clearInterval(timer);
  }, [content, mode]);
  
  useEffect(() => {
    setHighlightedContent(highlightSyntax(content, language));
  }, [content, language]);
  
  return (
    <div className="h-full overflow-auto font-mono text-sm relative">
      <div className="min-h-full py-2">
        {highlightedContent}
        
        {/* Agent cursor with suggestion */}
        {mode === 'agent' && showSuggestion && (
          <div 
            className="absolute bg-editor-background border border-primary rounded-md p-1 shadow-lg z-10"
            style={{ 
              top: `${cursorPosition.line * 24 + 40}px`, 
              left: `${cursorPosition.col * 8 + 60}px`
            }}
          >
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs opacity-70">Agent suggests:</span>
            </div>
            <div className="text-primary font-mono mt-1">{suggestion}</div>
          </div>
        )}
        
        {/* Agent mode notification */}
        {agentMessage && (
          <div className="absolute top-4 right-4 bg-primary/10 border border-primary text-primary px-3 py-1.5 rounded-md animate-fade-in">
            <div className="flex items-center space-x-2">
              <Zap size={14} className="text-primary animate-pulse" />
              <span className="text-xs">{agentMessage}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Editor;
