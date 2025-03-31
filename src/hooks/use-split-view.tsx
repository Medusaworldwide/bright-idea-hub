
import { useState } from 'react';

interface UseSplitViewOptions {
  initialActive?: boolean;
  initialLayout?: 'horizontal' | 'vertical';
  initialFileIds?: string[];
  maxFiles?: number;
}

export function useSplitView({
  initialActive = false,
  initialLayout = 'horizontal',
  initialFileIds = [],
  maxFiles = 2
}: UseSplitViewOptions = {}) {
  const [isActive, setIsActive] = useState(initialActive);
  const [layout, setLayout] = useState<'horizontal' | 'vertical'>(initialLayout);
  const [activeFileIds, setActiveFileIds] = useState<string[]>(initialFileIds);

  const toggleSplitView = () => {
    setIsActive(prev => !prev);
  };

  const toggleLayout = () => {
    setLayout(prev => prev === 'horizontal' ? 'vertical' : 'horizontal');
  };

  const addFileToSplit = (fileId: string) => {
    if (activeFileIds.includes(fileId)) return;
    
    if (activeFileIds.length >= maxFiles) {
      // Replace the last file if we've reached the max
      setActiveFileIds(prev => [...prev.slice(0, maxFiles - 1), fileId]);
    } else {
      setActiveFileIds(prev => [...prev, fileId]);
    }
  };

  const removeFileFromSplit = (fileId: string) => {
    setActiveFileIds(prev => prev.filter(id => id !== fileId));
  };

  const clearSplitView = () => {
    setActiveFileIds([]);
  };

  return {
    isActive,
    layout,
    activeFileIds,
    toggleSplitView,
    toggleLayout,
    addFileToSplit,
    removeFileFromSplit,
    clearSplitView,
    setIsActive
  };
}
