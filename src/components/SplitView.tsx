
import React from 'react';
import Editor from '@/components/Editor';
import { cn } from '@/lib/utils';

interface SplitViewProps {
  files: {
    id: string;
    content: string;
    language: string;
  }[];
  activeFileIds: string[];
  layout: 'horizontal' | 'vertical';
  editorMode: 'default' | 'agent';
}

const SplitView: React.FC<SplitViewProps> = ({ 
  files, 
  activeFileIds, 
  layout = 'horizontal',
  editorMode
}) => {
  // Get only the files that should be displayed in the split view
  const visibleFiles = files.filter(file => 
    activeFileIds.includes(file.id)
  );

  if (visibleFiles.length === 0) {
    return (
      <div className="flex items-center justify-center h-full bg-background text-muted-foreground">
        No files open in split view
      </div>
    );
  }

  return (
    <div 
      className={cn(
        "flex h-full overflow-hidden",
        layout === 'horizontal' ? 'flex-row' : 'flex-col'
      )}
    >
      {visibleFiles.map((file, index) => (
        <div 
          key={file.id} 
          className={cn(
            "overflow-hidden",
            layout === 'horizontal' ? 'w-1/2' : 'h-1/2',
            index < visibleFiles.length - 1 && layout === 'horizontal' && 'border-r border-border',
            index < visibleFiles.length - 1 && layout === 'vertical' && 'border-b border-border'
          )}
        >
          <Editor
            content={file.content}
            language={file.language}
            mode={editorMode}
          />
        </div>
      ))}
    </div>
  );
};

export default SplitView;
