
import React, { useState } from 'react';
import { File, FolderOpen, Settings, Search, GitBranch, Package, Play, BookOpen } from 'lucide-react';
import FileExplorer, { FileNode } from './FileExplorer';
import SearchFiles from './SearchFiles';
import GitPanel from './GitPanel';
import { toast } from '@/hooks/use-toast';

interface SidebarProps {
  files: FileNode[];
  onFilesChange: (files: FileNode[]) => void;
  onFileSelect: (file: FileNode) => void;
  selectedFileId: string | null;
  onSettingsOpen: () => void;
}

type SidebarTab = 'explorer' | 'search' | 'git' | 'extensions' | 'run';

const Sidebar: React.FC<SidebarProps> = ({
  files,
  onFilesChange,
  onFileSelect,
  selectedFileId,
  onSettingsOpen
}) => {
  const [activeTab, setActiveTab] = useState<SidebarTab>('explorer');
  const [currentBranch, setCurrentBranch] = useState('main');

  const handleResultClick = (fileId: string, lineNumber: number) => {
    // Find the file node by id
    const findFileNode = (nodes: FileNode[]): FileNode | null => {
      for (const node of nodes) {
        if (node.id === fileId) {
          return node;
        }
        
        if (node.children) {
          const found = findFileNode(node.children);
          if (found) return found;
        }
      }
      
      return null;
    };
    
    const fileNode = findFileNode(files);
    if (fileNode) {
      onFileSelect(fileNode);
      // In a real implementation, we would need to scroll to the specific line
      toast({
        title: "Jumped to search result",
        description: `${fileNode.name}, line ${lineNumber}`,
      });
    }
  };

  const handleCommit = (message: string) => {
    toast({
      title: "Commit created",
      description: `"${message}" committed to ${currentBranch}`,
    });
  };

  const handleBranchChange = (branch: string) => {
    setCurrentBranch(branch);
    toast({
      title: "Branch changed",
      description: `Switched to ${branch}`,
    });
  };

  return (
    <div className="flex flex-col h-screen bg-sidebar-background text-sidebar-foreground border-r border-border">
      <div className="flex flex-col items-center py-4 border-b border-border">
        <div className="flex flex-col space-y-6">
          <button 
            className={`p-2 rounded-md ${activeTab === 'explorer' ? 'bg-primary text-primary-foreground' : 'hover:bg-sidebar-accent'}`}
            onClick={() => setActiveTab('explorer')}
            title="Explorer"
          >
            <File size={20} />
          </button>
          <button 
            className={`p-2 rounded-md ${activeTab === 'search' ? 'bg-primary text-primary-foreground' : 'hover:bg-sidebar-accent'}`}
            onClick={() => setActiveTab('search')}
            title="Search"
          >
            <Search size={20} />
          </button>
          <button 
            className={`p-2 rounded-md ${activeTab === 'git' ? 'bg-primary text-primary-foreground' : 'hover:bg-sidebar-accent'}`}
            onClick={() => setActiveTab('git')}
            title="Source Control"
          >
            <GitBranch size={20} />
          </button>
          <button 
            className={`p-2 rounded-md ${activeTab === 'extensions' ? 'bg-primary text-primary-foreground' : 'hover:bg-sidebar-accent'}`}
            onClick={() => setActiveTab('extensions')}
            title="Extensions"
          >
            <Package size={20} />
          </button>
          <button 
            className={`p-2 rounded-md ${activeTab === 'run' ? 'bg-primary text-primary-foreground' : 'hover:bg-sidebar-accent'}`}
            onClick={() => setActiveTab('run')}
            title="Run and Debug"
          >
            <Play size={20} />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto">
        {activeTab === 'explorer' && (
          <div className="p-4">
            <FileExplorer 
              files={files}
              onFilesChange={onFilesChange}
              onFileSelect={onFileSelect}
              selectedFileId={selectedFileId}
            />
          </div>
        )}
        
        {activeTab === 'search' && (
          <SearchFiles 
            files={files}
            onResultClick={handleResultClick}
          />
        )}
        
        {activeTab === 'git' && (
          <GitPanel
            onCommit={handleCommit}
            onBranchChange={handleBranchChange}
          />
        )}
        
        {activeTab === 'extensions' && (
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm uppercase font-semibold">Extensions</h2>
            </div>
            <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
              <Package size={32} className="mb-2" />
              <p className="text-sm">Extensions marketplace</p>
              <p className="text-xs mt-1">Coming soon</p>
            </div>
          </div>
        )}
        
        {activeTab === 'run' && (
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm uppercase font-semibold">Run</h2>
            </div>
            <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
              <Play size={32} className="mb-2" />
              <p className="text-sm">Run and Debug</p>
              <p className="text-xs mt-1">Coming soon</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-auto p-4 border-t border-border">
        <button 
          className="flex items-center space-x-2 text-sidebar-foreground opacity-60 hover:opacity-100"
          onClick={onSettingsOpen}
        >
          <Settings size={16} />
          <span>Settings</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
