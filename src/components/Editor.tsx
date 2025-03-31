
import React, { useState, useEffect } from 'react';

interface EditorProps {
  content: string;
  language: string;
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

const Editor: React.FC<EditorProps> = ({ content, language }) => {
  const [highlightedContent, setHighlightedContent] = useState<React.ReactNode[]>([]);
  
  useEffect(() => {
    setHighlightedContent(highlightSyntax(content, language));
  }, [content, language]);
  
  return (
    <div className="h-full overflow-auto font-mono text-sm">
      <div className="min-h-full py-2">
        {highlightedContent}
      </div>
    </div>
  );
};

export default Editor;
