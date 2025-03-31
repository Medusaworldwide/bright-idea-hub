
import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Editor from '@/components/Editor';
import Tabs from '@/components/Tabs';
import StatusBar from '@/components/StatusBar';
import Terminal from '@/components/Terminal';
import { FileText, Terminal as TerminalIcon } from 'lucide-react';

// Sample code for the editor
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
    // Fetch user data from the API
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
    }
  };
  
  const toggleTerminal = () => {
    setTerminalVisible(prev => !prev);
  };
  
  const handleModeChange = (mode: 'default' | 'agent') => {
    setEditorMode(mode);
  };
  
  const activeFile = tabs.find(tab => tab.id === activeTab) || tabs[0];
  
  const lineCount = activeFile.content.split('\n').length;
  
  return (
    <div className="h-screen flex flex-col overflow-hidden">
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
            <Editor 
              content={activeFile.content}
              language={activeFile.language}
              mode={editorMode}
            />
          </div>
          
          <Terminal visible={terminalVisible} />
          
          <StatusBar 
            language={activeFile.language}
            lineCount={lineCount}
            currentLine={1}
            branch="main"
            editorMode={editorMode}
            onModeChange={handleModeChange}
          />
        </div>
      </div>
      
      <button 
        className="absolute bottom-8 right-8 bg-primary text-white p-2 rounded-full shadow-lg hover:bg-primary/90 transition-colors"
        onClick={toggleTerminal}
      >
        <TerminalIcon size={20} />
      </button>
    </div>
  );
};

export default Index;
