
import { useState, useEffect, useCallback } from 'react';
import { CommandItem } from '@/components/CommandPalette';

const useCommandPalette = (commands: CommandItem[]) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleCommandPalette = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const closeCommandPalette = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K to open command palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        toggleCommandPalette();
      }
      
      // Escape to close command palette
      if (e.key === 'Escape' && isOpen) {
        closeCommandPalette();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, toggleCommandPalette, closeCommandPalette]);

  return {
    isOpen,
    toggleCommandPalette,
    closeCommandPalette
  };
};

export default useCommandPalette;
