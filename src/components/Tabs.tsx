
import React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Tab {
  id: string;
  title: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (id: string) => void;
  onTabClose: (id: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onTabChange, onTabClose }) => {
  return (
    <div className="flex bg-sidebar-background border-b border-border overflow-x-auto">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={cn(
            "flex items-center px-4 py-2 border-r border-border min-w-[120px] max-w-[200px]",
            activeTab === tab.id ? "tab-active" : "tab-inactive"
          )}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.icon && <span className="mr-2">{tab.icon}</span>}
          <span className="truncate flex-1">{tab.title}</span>
          <button
            className="ml-2 rounded-full p-1 opacity-60 hover:opacity-100 hover:bg-muted/20"
            onClick={(e) => {
              e.stopPropagation();
              onTabClose(tab.id);
            }}
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default Tabs;
