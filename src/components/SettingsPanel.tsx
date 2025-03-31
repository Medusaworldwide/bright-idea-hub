
import React from 'react';
import { 
  Palette, Monitor, SunMedium, Moon, X, Copy, Save, 
  RefreshCw, Layout, Laptop, Languages 
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Switch 
} from '@/components/ui/switch';
import { useTheme } from '@/hooks/use-theme';
import { toast } from '@/hooks/use-toast';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  editorMode: 'default' | 'agent';
  onEditorModeChange: (mode: 'default' | 'agent') => void;
  splitViewActive: boolean;
  onToggleSplitView: () => void;
  splitViewLayout: 'horizontal' | 'vertical';
  onToggleSplitLayout: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  isOpen,
  onClose,
  editorMode,
  onEditorModeChange,
  splitViewActive,
  onToggleSplitView,
  splitViewLayout,
  onToggleSplitLayout
}) => {
  const { theme, setTheme } = useTheme();
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-[80vh] p-0">
        <DialogHeader className="p-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle>Settings</DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X size={18} />
            </Button>
          </div>
          <DialogDescription>
            Configure your editor preferences
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="appearance" className="h-full">
          <div className="grid grid-cols-[200px_1fr] h-full">
            <div className="border-r">
              <TabsList className="flex flex-col h-full space-y-1 rounded-none p-2 w-full justify-start">
                <TabsTrigger value="appearance" className="justify-start w-full">
                  <Palette size={16} className="mr-2" />
                  Appearance
                </TabsTrigger>
                <TabsTrigger value="editor" className="justify-start w-full">
                  <Copy size={16} className="mr-2" />
                  Editor
                </TabsTrigger>
                <TabsTrigger value="interface" className="justify-start w-full">
                  <Layout size={16} className="mr-2" />
                  Interface
                </TabsTrigger>
                <TabsTrigger value="keybindings" className="justify-start w-full">
                  <Laptop size={16} className="mr-2" />
                  Keybindings
                </TabsTrigger>
              </TabsList>
            </div>
            
            <ScrollArea className="h-[calc(80vh-10rem)]">
              <TabsContent value="appearance" className="p-4 focus-visible:outline-none focus-visible:ring-0">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Theme</h3>
                    <div className="grid grid-cols-3 gap-2">
                      <Button 
                        variant={theme === 'light' ? 'default' : 'outline'} 
                        className="w-full justify-start" 
                        onClick={() => setTheme('light')}
                      >
                        <SunMedium size={16} className="mr-2" />
                        Light
                      </Button>
                      <Button 
                        variant={theme === 'dark' ? 'default' : 'outline'} 
                        className="w-full justify-start" 
                        onClick={() => setTheme('dark')}
                      >
                        <Moon size={16} className="mr-2" />
                        Dark
                      </Button>
                      <Button 
                        variant={theme === 'system' ? 'default' : 'outline'} 
                        className="w-full justify-start" 
                        onClick={() => setTheme('system')}
                      >
                        <Monitor size={16} className="mr-2" />
                        System
                      </Button>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Font</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="font-family">Font Family</Label>
                        <Select defaultValue="jetbrains-mono">
                          <SelectTrigger id="font-family">
                            <SelectValue placeholder="Select font family" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="jetbrains-mono">JetBrains Mono</SelectItem>
                            <SelectItem value="fira-code">Fira Code</SelectItem>
                            <SelectItem value="source-code-pro">Source Code Pro</SelectItem>
                            <SelectItem value="ubuntu-mono">Ubuntu Mono</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="font-size">Font Size</Label>
                        <Select defaultValue="14">
                          <SelectTrigger id="font-size">
                            <SelectValue placeholder="Select font size" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="12">12px</SelectItem>
                            <SelectItem value="14">14px</SelectItem>
                            <SelectItem value="16">16px</SelectItem>
                            <SelectItem value="18">18px</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="editor" className="p-4 focus-visible:outline-none focus-visible:ring-0">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Editor Preferences</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="word-wrap">Word Wrap</Label>
                          <div className="text-sm text-muted-foreground">
                            Wrap long lines to fit in the viewport
                          </div>
                        </div>
                        <Switch id="word-wrap" defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="tab-size">Tab Size</Label>
                          <div className="text-sm text-muted-foreground">
                            Number of spaces that a tab is equal to
                          </div>
                        </div>
                        <Select defaultValue="2">
                          <SelectTrigger id="tab-size" className="w-20">
                            <SelectValue placeholder="Tabs" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="2">2</SelectItem>
                            <SelectItem value="4">4</SelectItem>
                            <SelectItem value="8">8</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="editor-mode">Editor Mode</Label>
                          <div className="text-sm text-muted-foreground">
                            Switch between normal and AI-assisted editing
                          </div>
                        </div>
                        <Select 
                          value={editorMode} 
                          onValueChange={(value) => onEditorModeChange(value as 'default' | 'agent')}
                        >
                          <SelectTrigger id="editor-mode" className="w-28">
                            <SelectValue placeholder="Mode" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="default">Default</SelectItem>
                            <SelectItem value="agent">Agent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Format Options</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="format-on-save">Format on Save</Label>
                          <div className="text-sm text-muted-foreground">
                            Automatically format files when saving
                          </div>
                        </div>
                        <Switch id="format-on-save" defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="trailing-commas">Trailing Commas</Label>
                          <div className="text-sm text-muted-foreground">
                            Include trailing commas in objects and arrays
                          </div>
                        </div>
                        <Switch id="trailing-commas" />
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="interface" className="p-4 focus-visible:outline-none focus-visible:ring-0">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Layout</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="split-view">Split View</Label>
                          <div className="text-sm text-muted-foreground">
                            Enable split view for editing multiple files
                          </div>
                        </div>
                        <Switch 
                          id="split-view" 
                          checked={splitViewActive}
                          onCheckedChange={onToggleSplitView}
                        />
                      </div>
                      
                      {splitViewActive && (
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="split-layout">Split Layout</Label>
                            <div className="text-sm text-muted-foreground">
                              Choose how to arrange split panes
                            </div>
                          </div>
                          <Select 
                            value={splitViewLayout} 
                            onValueChange={(value) => {
                              if (value !== splitViewLayout) {
                                onToggleSplitLayout();
                              }
                            }}
                          >
                            <SelectTrigger id="split-layout" className="w-36">
                              <SelectValue placeholder="Layout" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="horizontal">Side by Side</SelectItem>
                              <SelectItem value="vertical">Top and Bottom</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="show-minimap">Show Minimap</Label>
                          <div className="text-sm text-muted-foreground">
                            Display a minimap of the code on the right side
                          </div>
                        </div>
                        <Switch id="show-minimap" />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="show-terminal">Show Terminal</Label>
                          <div className="text-sm text-muted-foreground">
                            Show terminal panel at the bottom by default
                          </div>
                        </div>
                        <Switch id="show-terminal" />
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="keybindings" className="p-4 focus-visible:outline-none focus-visible:ring-0">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Keyboard Shortcuts</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-[1fr_auto] gap-4">
                        <div className="space-y-0.5">
                          <Label>Open Command Palette</Label>
                        </div>
                        <kbd className="px-2 py-1 bg-muted rounded text-sm font-mono">Ctrl+K</kbd>
                        
                        <div className="space-y-0.5">
                          <Label>Toggle Terminal</Label>
                        </div>
                        <kbd className="px-2 py-1 bg-muted rounded text-sm font-mono">Ctrl+`</kbd>
                        
                        <div className="space-y-0.5">
                          <Label>Toggle Split View</Label>
                        </div>
                        <kbd className="px-2 py-1 bg-muted rounded text-sm font-mono">Alt+S</kbd>
                        
                        <div className="space-y-0.5">
                          <Label>Save File</Label>
                        </div>
                        <kbd className="px-2 py-1 bg-muted rounded text-sm font-mono">Ctrl+S</kbd>
                        
                        <div className="space-y-0.5">
                          <Label>Search in Files</Label>
                        </div>
                        <kbd className="px-2 py-1 bg-muted rounded text-sm font-mono">Ctrl+F</kbd>
                        
                        <div className="space-y-0.5">
                          <Label>Open Settings</Label>
                        </div>
                        <kbd className="px-2 py-1 bg-muted rounded text-sm font-mono">Ctrl+,</kbd>
                        
                        <div className="space-y-0.5">
                          <Label>Duplicate File</Label>
                        </div>
                        <kbd className="px-2 py-1 bg-muted rounded text-sm font-mono">Ctrl+D</kbd>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      toast({
                        title: "Default keybindings restored",
                        description: "Your keyboard shortcuts have been reset to defaults",
                      });
                    }}
                  >
                    <RefreshCw size={16} className="mr-2" />
                    Restore Defaults
                  </Button>
                </div>
              </TabsContent>
            </ScrollArea>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsPanel;
