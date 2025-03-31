
import React, { useState, useEffect, useRef } from 'react';
import { Command } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Command as CommandPrimitive,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { toast } from '@/hooks/use-toast';

export type CommandItem = {
  id: string;
  name: string;
  shortcut?: string;
  icon?: React.ReactNode;
  action: () => void;
};

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  commands: CommandItem[];
}

const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  commands,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  const handleSelect = (item: CommandItem) => {
    item.action();
    onClose();
    toast({
      title: "Command executed",
      description: `${item.name}`,
      duration: 2000,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
        <DialogHeader className="px-4 pt-4 pb-0">
          <DialogTitle className="text-lg font-semibold flex items-center">
            <Command className="w-5 h-5 mr-2" />
            Command Palette
          </DialogTitle>
        </DialogHeader>
        <CommandPrimitive className="rounded-t-none border-0">
          <CommandInput 
            ref={inputRef}
            placeholder="Type a command or search..."
            value={query}
            onValueChange={setQuery}
            className="border-none focus:ring-0"
          />
          <CommandList>
            <CommandEmpty className="py-6 text-center text-sm">
              No commands found.
            </CommandEmpty>
            <CommandGroup heading="Commands">
              {commands.map((item) => (
                <CommandItem
                  key={item.id}
                  onSelect={() => handleSelect(item)}
                  className="flex items-center justify-between py-2"
                >
                  <div className="flex items-center">
                    {item.icon && <span className="mr-2">{item.icon}</span>}
                    <span>{item.name}</span>
                  </div>
                  {item.shortcut && (
                    <span className="text-xs text-muted-foreground">
                      {item.shortcut}
                    </span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </CommandPrimitive>
      </DialogContent>
    </Dialog>
  );
};

export default CommandPalette;
