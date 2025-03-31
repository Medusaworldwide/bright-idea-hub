import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Editor from '@/components/Editor';
import SplitView from '@/components/SplitView';
import Tabs from '@/components/Tabs';
import StatusBar from '@/components/StatusBar';
import Terminal from '@/components/Terminal';
import CommandPalette, { CommandItem } from '@/components/CommandPalette';
import useCommandPalette from '@/hooks/use-command-palette';
import { useSplitView } from '@/hooks/use-split-view';
import { FileText, Terminal as TerminalIcon, SplitSquareVertical, Copy, Save, FileSearch, Trash, Settings, Command, SplitSquareHorizontal } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { TooltipProvider } from '@/components/ui/tooltip';

const sampleTSCode = `import React, { useState, useEffect } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
}

/**
 * A component that displays user information
 */
const UserProfile: React.FC<{ userId: number }> = ({ userId }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(\`/api/users/\${userId}\`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        
        const userData = await response.json();
        setUser(userData);
      } catch (err) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);
  
  if (loading) {
    return <div>Loading user data...</div>;
  }
  
  if (error) {
    return <div>Error: {error}</div>;
  }
  
  return (
    <div className="user-profile">
      <h2>{user?.name}</h2>
      <p>Email: {user?.email}</p>
      <button onClick={() => console.log('Edit profile')}>
        Edit Profile
      </button>
    </div>
  );
};

export default UserProfile;`;

const sampleCSS = `/* Main application styles */
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.header {
  background-color: #2c2c2c;
  color: white;
  padding: 1rem;
}

.content {
  flex: 1;
  padding: 2rem;
}

.footer {
  background-color: #2c2c2c;
  color: white;
  padding: 1rem;
  text-align: center;
}`;

const sampleJSON = `{
  "name": "code-editor",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^4.9.5"
  },
  "scripts": {
    "start": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "eslintConfig": {
    "extends": [
      "react-app"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}`;

interface TabFile {
  id: string;
  title: string;
  content: string;
  language: string;
  icon: React.ReactNode;
}

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
  
  const { 
    isActive: splitViewActive, 
    layout: splitViewLayout, 
    activeFileIds: splitViewFiles,
    toggleSplitView,
    toggleLayout,
    addFileToSplit,
    removeFileFromSplit
  } = useSplitView();
  
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
          description: "Search functionality coming soon",
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
        toast({
          title: "Settings",
          description: "Settings panel coming soon",
        });
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
    }
  ];

  const { isOpen, toggleCommandPalette, closeCommandPalette } = useCommandPalette(commands);
  
  const activeFile = tabs.find(tab => tab.id === activeTab) || tabs[0];
  const lineCount = activeFile.content.split('\n').length;
  
  return (
    <TooltipProvider>
      <div className="h-screen flex flex-col overflow-hidden">
        <CommandPalette 
          isOpen={isOpen} 
          onClose={closeCommandPalette} 
          commands={commands} 
        />
        
        <div className="flex flex-1 overflow-hidden">
          <div className="w-64 flex-shrink-0 overflow-hidden">
            <Sidebar />
          </div>
          
          <div className="flex-1 flex flex-col overflow-hidden">
            <Tabs 
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={handleTabChange}
              onTabClose={handleTabClose}
            />
            
            <div className={`flex-1 ${terminalVisible ? 'h-[calc(100%-16rem)]' : 'h-full'} overflow-hidden`}>
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
  );
};

export default Index;
