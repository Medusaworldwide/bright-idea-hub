
import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Editor from '@/components/Editor';
import SplitView from '@/components/SplitView';
import Tabs from '@/components/Tabs';
import StatusBar from '@/components/StatusBar';
import Terminal from '@/components/Terminal';
import CommandPalette, { CommandItem } from '@/components/CommandPalette';
import useCommandPalette from '@/hooks/use-command-palette';
import { useSplitView } from '@/hooks/use-split-view';
import { FileNode } from '@/components/FileExplorer';
import SettingsPanel from '@/components/SettingsPanel';
import CodeSnippets, { CodeSnippet } from '@/components/CodeSnippets';
import Minimap from '@/components/Minimap';
import { ThemeProvider } from '@/hooks/use-theme';
import { 
  FileText, Terminal as TerminalIcon, SplitSquareVertical, 
  Copy, Save, FileSearch, Trash, Settings, Command, 
  SplitSquareHorizontal, Code, Palette, 
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { TooltipProvider } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

const sampleTSCode = `// ... keep existing code`;

const sampleCSS = `// ... keep existing code`;

const sampleJSON = `// ... keep existing code`;

interface TabFile {
  id: string;
  title: string;
  content: string;
  language: string;
  icon: React.ReactNode;
}

// Convert TabFile array to FileNode array for the file explorer
const tabsToFileNodes = (tabs: TabFile[]): FileNode[] => {
  // Group files by folder structure based on title
  const rootFolder: FileNode = {
    id: 'root',
    name: 'root',
    type: 'folder',
    expanded: true,
    children: []
  };
  
  // Create src folder
  const srcFolder: FileNode = {
    id: 'src',
    name: 'src',
    type: 'folder',
    expanded: true,
    children: []
  };
  
  // Create components folder
  const componentsFolder: FileNode = {
    id: 'components',
    name: 'components',
    type: 'folder',
    expanded: true,
    children: []
  };
  
  // Add each tab as a file
  tabs.forEach(tab => {
    const fileNode: FileNode = {
      id: tab.id,
      name: tab.title,
      type: 'file',
      content: tab.content,
      language: tab.language,
      icon: tab.icon
    };
    
    // Simple logic to organize files
    if (tab.title.includes('Component') || tab.title.includes('tsx')) {
      componentsFolder.children!.push(fileNode);
    } else if (tab.title.includes('.css')) {
      srcFolder.children!.push(fileNode);
    } else {
      rootFolder.children!.push(fileNode);
    }
  });
  
  // Add component folder to src
  srcFolder.children!.push(componentsFolder);
  
  // Add src folder to root
  rootFolder.children!.push(srcFolder);
  
  // Add some more sample folders and files
  rootFolder.children!.push({
    id: 'public',
    name: 'public',
    type: 'folder',
    children: [
      { id: 'index.html', name: 'index.html', type: 'file', language: 'html' },
      { id: 'favicon.ico', name: 'favicon.ico', type: 'file' }
    ]
  });
  
  rootFolder.children!.push({ id: 'package.json', name: 'package.json', type: 'file', language: 'json', content: sampleJSON });
  rootFolder.children!.push({ id: 'README.md', name: 'README.md', type: 'file', language: 'markdown' });
  
  return rootFolder.children!;
};

const Index = () => {
  const [tabs, setTabs] = useState<TabFile[]>([
    {
      id: 'tab1',
      title: 'UserProfile.tsx',
      content: sampleTSCode,
      language: 'typescript',
      icon: <FileText size={16} className="text-blue-400" />
    },
    {
      id: 'tab2',
      title: 'styles.css',
      content: sampleCSS,
      language: 'css',
      icon: <FileText size={16} className="text-orange-400" />
    },
    {
      id: 'tab3',
      title: 'package.json',
      content: sampleJSON,
      language: 'json',
      icon: <FileText size={16} className="text-yellow-400" />
    }
  ]);
  
  const [activeTab, setActiveTab] = useState<string>('tab1');
  const [terminalVisible, setTerminalVisible] = useState<boolean>(false);
  const [editorMode, setEditorMode] = useState<'default' | 'agent'>('agent');
  const [showMinimap, setShowMinimap] = useState<boolean>(true);
  const [visibleLines, setVisibleLines] = useState<[number, number]>([0, 20]);
  const [files, setFiles] = useState<FileNode[]>(tabsToFileNodes(tabs));
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [snippetsOpen, setSnippetsOpen] = useState<boolean>(false);
  
  const { 
    isActive: splitViewActive, 
    layout: splitViewLayout, 
    activeFileIds: splitViewFiles,
    toggleSplitView,
    toggleLayout,
    addFileToSplit,
    removeFileFromSplit
  } = useSplitView();
  
  // Update file explorer when tabs change
  useEffect(() => {
    setFiles(tabsToFileNodes(tabs));
  }, [tabs]);
  
  const handleTabChange = (id: string) => {
    setActiveTab(id);
  };
  
  const handleTabClose = (id: string) => {
    if (tabs.length > 1) {
      const newTabs = tabs.filter(tab => tab.id !== id);
      setTabs(newTabs);
      
      if (activeTab === id) {
        setActiveTab(newTabs[0].id);
      }
      
      removeFileFromSplit(id);
    }
  };
  
  const toggleTerminal = () => {
    setTerminalVisible(prev => !prev);
  };
  
  const handleModeChange = (mode: 'default' | 'agent') => {
    setEditorMode(mode);
  };

  const handleFileSelect = (file: FileNode) => {
    // Check if the file is already open in a tab
    const existingTab = tabs.find(tab => tab.id === file.id);
    
    if (existingTab) {
      setActiveTab(file.id);
    } else if (file.type === 'file') {
      // Create a new tab for this file
      const newTab: TabFile = {
        id: file.id,
        title: file.name,
        content: file.content || '',
        language: file.language || 'typescript',
        icon: <FileText size={16} className="text-blue-400" />
      };
      
      setTabs([...tabs, newTab]);
      setActiveTab(file.id);
    }
  };
  
  const handleFilesChange = (newFiles: FileNode[]) => {
    setFiles(newFiles);
    
    // Update tabs if any open files have changed
    const updatedTabs = tabs.map(tab => {
      // Find the corresponding file node
      const findNode = (nodes: FileNode[]): FileNode | null => {
        for (const node of nodes) {
          if (node.id === tab.id) {
            return node;
          }
          
          if (node.children) {
            const found = findNode(node.children);
            if (found) return found;
          }
        }
        
        return null;
      };
      
      const node = findNode(newFiles);
      
      if (node && node.type === 'file') {
        return {
          ...tab,
          title: node.name,
          content: node.content || tab.content,
          language: node.language || tab.language
        };
      }
      
      return tab;
    });
    
    setTabs(updatedTabs);
  };
  
  const handleMinimapClick = (lineNumber: number) => {
    // In a real implementation, this would scroll the editor to the clicked line
    setVisibleLines([Math.max(0, lineNumber - 10), lineNumber + 10]);
    toast({
      title: "Jumped to line",
      description: `Navigated to line ${lineNumber}`,
    });
  };
  
  const handleInsertSnippet = (snippet: CodeSnippet) => {
    // In a real implementation, this would insert the code at the cursor position
    // For this demo, we'll just create a new file with the snippet
    const newId = `snippet-${Date.now()}`;
    const newTab: TabFile = {
      id: newId,
      title: `${snippet.title}.${snippet.language === 'typescript' ? 'tsx' : snippet.language}`,
      content: snippet.code,
      language: snippet.language,
      icon: <FileText size={16} className="text-blue-400" />
    };
    
    setTabs([...tabs, newTab]);
    setActiveTab(newId);
  };
  
  const commands: CommandItem[] = [
    {
      id: 'toggle-terminal',
      name: 'Toggle Terminal',
      shortcut: 'Ctrl+`',
      icon: <TerminalIcon size={16} />,
      action: toggleTerminal
    },
    {
      id: 'toggle-editor-mode',
      name: editorMode === 'default' ? 'Switch to Agent Mode' : 'Switch to Default Mode',
      shortcut: 'Alt+M',
      icon: <SplitSquareVertical size={16} />,
      action: () => handleModeChange(editorMode === 'default' ? 'agent' : 'default')
    },
    {
      id: 'duplicate-file',
      name: 'Duplicate Current File',
      shortcut: 'Ctrl+D',
      icon: <Copy size={16} />,
      action: () => {
        const currentTab = tabs.find(tab => tab.id === activeTab);
        if (currentTab) {
          const newTab = {
            ...currentTab,
            id: `tab${Date.now()}`,
            title: `Copy of ${currentTab.title}`
          };
          setTabs([...tabs, newTab]);
          toast({
            title: "File duplicated",
            description: `Created ${newTab.title}`,
          });
        }
      }
    },
    {
      id: 'save-file',
      name: 'Save File',
      shortcut: 'Ctrl+S',
      icon: <Save size={16} />,
      action: () => {
        toast({
          title: "File saved",
          description: "Your changes have been saved",
        });
      }
    },
    {
      id: 'search-in-file',
      name: 'Search in File',
      shortcut: 'Ctrl+F',
      icon: <FileSearch size={16} />,
      action: () => {
        toast({
          title: "Search",
          description: "Search functionality activated",
        });
      }
    },
    {
      id: 'close-current-tab',
      name: 'Close Current Tab',
      shortcut: 'Ctrl+W',
      icon: <Trash size={16} />,
      action: () => {
        if (tabs.length > 1) {
          handleTabClose(activeTab);
        }
      }
    },
    {
      id: 'open-settings',
      name: 'Open Settings',
      shortcut: 'Ctrl+,',
      icon: <Settings size={16} />,
      action: () => {
        setSettingsOpen(true);
      }
    },
    {
      id: 'toggle-split-view',
      name: splitViewActive ? 'Disable Split View' : 'Enable Split View',
      shortcut: 'Alt+S',
      icon: <SplitSquareVertical size={16} />,
      action: toggleSplitView
    },
    {
      id: 'toggle-split-layout',
      name: `Change Split to ${splitViewLayout === 'horizontal' ? 'Vertical' : 'Horizontal'}`,
      shortcut: 'Alt+L',
      icon: <SplitSquareHorizontal size={16} />,
      action: toggleLayout
    },
    {
      id: 'add-to-split-view',
      name: 'Add Current File to Split View',
      shortcut: 'Alt+A',
      icon: <Copy size={16} />,
      action: () => {
        if (splitViewFiles.includes(activeTab)) {
          toast({
            title: "Already in split view",
            description: "This file is already in the split view",
          });
          return;
        }
        
        addFileToSplit(activeTab);
        
        if (!splitViewActive) {
          toggleSplitView();
        }
        
        toast({
          title: "Added to split view",
          description: "File added to split view",
        });
      }
    },
    {
      id: 'open-snippets',
      name: 'Open Code Snippets',
      shortcut: 'Ctrl+Shift+S',
      icon: <Code size={16} />,
      action: () => {
        setSnippetsOpen(true);
      }
    },
    {
      id: 'toggle-minimap',
      name: showMinimap ? 'Hide Minimap' : 'Show Minimap',
      shortcut: 'Alt+M',
      icon: <FileText size={16} />,
      action: () => {
        setShowMinimap(!showMinimap);
      }
    },
    {
      id: 'change-color-theme',
      name: 'Change Color Theme',
      shortcut: 'Alt+T',
      icon: <Palette size={16} />,
      action: () => {
        setSettingsOpen(true);
      }
    }
  ];

  const { isOpen, toggleCommandPalette, closeCommandPalette } = useCommandPalette(commands);
  
  const activeFile = tabs.find(tab => tab.id === activeTab) || tabs[0];
  const lineCount = activeFile.content.split('\n').length;
  
  return (
    <ThemeProvider>
      <TooltipProvider>
        <div className="h-screen flex flex-col overflow-hidden">
          <CommandPalette 
            isOpen={isOpen} 
            onClose={closeCommandPalette} 
            commands={commands} 
          />
          
          <SettingsPanel
            isOpen={settingsOpen}
            onClose={() => setSettingsOpen(false)}
            editorMode={editorMode}
            onEditorModeChange={handleModeChange}
            splitViewActive={splitViewActive}
            onToggleSplitView={toggleSplitView}
            splitViewLayout={splitViewLayout}
            onToggleSplitLayout={toggleLayout}
          />
          
          <CodeSnippets
            isOpen={snippetsOpen}
            onClose={() => setSnippetsOpen(false)}
            onInsert={handleInsertSnippet}
          />
          
          <div className="flex flex-1 overflow-hidden">
            <div className="w-64 flex-shrink-0 overflow-hidden">
              <Sidebar 
                files={files}
                onFilesChange={handleFilesChange}
                onFileSelect={handleFileSelect}
                selectedFileId={activeTab}
                onSettingsOpen={() => setSettingsOpen(true)}
              />
            </div>
            
            <div className="flex-1 flex flex-col overflow-hidden">
              <Tabs 
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={handleTabChange}
                onTabClose={handleTabClose}
              />
              
              <div className={cn(
                "flex-1",
                terminalVisible ? 'h-[calc(100%-16rem)]' : 'h-full',
                "overflow-hidden flex"
              )}>
                <div className="flex-1 relative">
                  {splitViewActive && splitViewFiles.length > 0 ? (
                    <SplitView 
                      files={tabs}
                      activeFileIds={splitViewFiles}
                      layout={splitViewLayout}
                      editorMode={editorMode}
                    />
                  ) : (
                    <Editor 
                      content={activeFile.content}
                      language={activeFile.language}
                      mode={editorMode}
                    />
                  )}
                </div>
                
                {showMinimap && !splitViewActive && (
                  <Minimap 
                    content={activeFile.content}
                    language={activeFile.language}
                    visibleRange={visibleLines}
                    onMinimapClick={handleMinimapClick}
                  />
                )}
              </div>
              
              <Terminal visible={terminalVisible} />
              
              <StatusBar 
                language={activeFile.language}
                lineCount={lineCount}
                currentLine={1}
                branch="main"
                editorMode={editorMode}
                onModeChange={handleModeChange}
                splitViewActive={splitViewActive}
                onToggleSplitView={toggleSplitView}
                splitViewLayout={splitViewLayout}
                onToggleSplitLayout={toggleLayout}
              />
            </div>
          </div>
          
          <button 
            className="absolute bottom-8 right-8 bg-primary text-white p-2 rounded-full shadow-lg hover:bg-primary/90 transition-colors"
            onClick={toggleCommandPalette}
            title="Open Command Palette (Ctrl+K)"
          >
            <Command size={20} />
          </button>
        </div>
      </TooltipProvider>
    </ThemeProvider>
  );
};

export default Index;
