
import React from 'react';
import { File, FolderOpen, Settings, Search, GitBranch, Package, Play } from 'lucide-react';
import FileTree from './FileTree';

const Sidebar = () => {
  return (
    <div className="flex flex-col h-screen bg-sidebar-background text-sidebar-foreground border-r border-border">
      <div className="flex flex-col items-center py-4 border-b border-border">
        <div className="flex flex-col space-y-6">
          <button className="p-2 rounded-md bg-primary text-primary-foreground">
            <File size={20} />
          </button>
          <button className="p-2 rounded-md hover:bg-sidebar-accent">
            <Search size={20} />
          </button>
          <button className="p-2 rounded-md hover:bg-sidebar-accent">
            <GitBranch size={20} />
          </button>
          <button className="p-2 rounded-md hover:bg-sidebar-accent">
            <Package size={20} />
          </button>
          <button className="p-2 rounded-md hover:bg-sidebar-accent">
            <Play size={20} />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto">
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm uppercase font-semibold">Explorer</h2>
            <button className="text-sidebar-foreground opacity-60 hover:opacity-100">
              <FolderOpen size={16} />
            </button>
          </div>
          <FileTree />
        </div>
      </div>
      
      <div className="mt-auto p-4 border-t border-border">
        <button className="flex items-center space-x-2 text-sidebar-foreground opacity-60 hover:opacity-100">
          <Settings size={16} />
          <span>Settings</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
