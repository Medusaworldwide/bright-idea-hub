
import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface MinimapProps {
  content: string;
  language: string;
  visibleRange: [number, number];
  onMinimapClick: (lineNumber: number) => void;
  className?: string;
}

const Minimap: React.FC<MinimapProps> = ({ 
  content, 
  language, 
  visibleRange, 
  onMinimapClick,
  className 
}) => {
  const minimapRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Scroll the minimap to match the current visible portion in the editor
    if (minimapRef.current) {
      const lines = content.split('\n').length;
      const minimapHeight = minimapRef.current.clientHeight;
      const lineHeight = minimapHeight / lines;
      
      const scrollTop = visibleRange[0] * lineHeight;
      minimapRef.current.scrollTop = scrollTop;
    }
  }, [visibleRange, content]);
  
  const handleMinimapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (minimapRef.current) {
      const rect = minimapRef.current.getBoundingClientRect();
      const relativeY = e.clientY - rect.top;
      const totalHeight = minimapRef.current.scrollHeight;
      const lineCount = content.split('\n').length;
      
      // Calculate the clicked line number
      const lineNumber = Math.floor((relativeY / rect.height) * lineCount);
      onMinimapClick(lineNumber);
    }
  };
  
  // Generate a simpler representation of the code for the minimap
  const generateMinimapContent = () => {
    const lines = content.split('\n');
    return lines.map((line, index) => {
      let bgClass = 'bg-transparent';
      
      // Assign different colors based on content type (very simple heuristic)
      if (line.includes('function') || line.includes('const') || line.includes('let') || line.includes('var')) {
        bgClass = 'bg-blue-300/20';
      } else if (line.includes('class') || line.includes('interface') || line.includes('type')) {
        bgClass = 'bg-purple-300/20';
      } else if (line.includes('if') || line.includes('for') || line.includes('while') || line.includes('switch')) {
        bgClass = 'bg-yellow-300/20';
      } else if (line.includes('import') || line.includes('export')) {
        bgClass = 'bg-green-300/20';
      } else if (line.includes('return')) {
        bgClass = 'bg-red-300/20';
      } else if (line.trim().startsWith('//') || line.trim().startsWith('/*') || line.trim().startsWith('*')) {
        bgClass = 'bg-gray-300/20';
      }
      
      const isVisible = index >= visibleRange[0] && index <= visibleRange[1];
      
      return (
        <div 
          key={index} 
          className={cn(
            'h-[2px] my-[1px]', 
            bgClass,
            isVisible && 'bg-primary/30'
          )}
        />
      );
    });
  };
  
  return (
    <div 
      ref={minimapRef}
      className={cn(
        'w-20 h-full overflow-hidden opacity-70 hover:opacity-100 transition-opacity',
        className
      )}
      onClick={handleMinimapClick}
    >
      <div className="p-1">
        {generateMinimapContent()}
      </div>
      
      {/* Visible portion indicator */}
      <div 
        className="absolute w-full bg-primary/10 pointer-events-none border-l-2 border-primary"
        style={{
          top: `${(visibleRange[0] / content.split('\n').length) * 100}%`,
          height: `${((visibleRange[1] - visibleRange[0] + 1) / content.split('\n').length) * 100}%`
        }}
      />
    </div>
  );
};

export default Minimap;
