
import React, { useState } from 'react';
import { ChevronRight, ChevronDown, FileText, Folder } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TreeNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  children?: TreeNode[];
  expanded?: boolean;
}

const sampleFiles: TreeNode[] = [
  {
    id: '1',
    name: 'src',
    type: 'folder',
    expanded: true,
    children: [
      {
        id: '2',
        name: 'components',
        type: 'folder',
        expanded: true,
        children: [
          { id: '3', name: 'App.tsx', type: 'file' },
          { id: '4', name: 'Button.tsx', type: 'file' },
          { id: '5', name: 'Card.tsx', type: 'file' },
        ],
      },
      {
        id: '6',
        name: 'hooks',
        type: 'folder',
        children: [
          { id: '7', name: 'useAuth.ts', type: 'file' },
          { id: '8', name: 'useForm.ts', type: 'file' },
        ],
      },
      { id: '9', name: 'main.tsx', type: 'file' },
      { id: '10', name: 'index.css', type: 'file' },
    ],
  },
  {
    id: '11',
    name: 'public',
    type: 'folder',
    children: [
      { id: '12', name: 'index.html', type: 'file' },
      { id: '13', name: 'favicon.ico', type: 'file' },
    ],
  },
  { id: '14', name: 'package.json', type: 'file' },
  { id: '15', name: 'tsconfig.json', type: 'file' },
  { id: '16', name: 'README.md', type: 'file' },
];

interface TreeItemProps {
  node: TreeNode;
  level: number;
  onToggle: (id: string) => void;
  onSelect: (node: TreeNode) => void;
  selectedId: string | null;
}

const TreeItem: React.FC<TreeItemProps> = ({ node, level, onToggle, onSelect, selectedId }) => {
  const isSelected = node.id === selectedId;
  
  return (
    <div>
      <div 
        className={cn(
          "flex items-center py-1 px-2 cursor-pointer rounded-md text-sm",
          isSelected ? "bg-primary/20" : "hover:bg-sidebar-accent"
        )}
        style={{ paddingLeft: `${(level * 12) + 4}px` }}
        onClick={() => onSelect(node)}
      >
        {node.type === 'folder' && (
          <button 
            className="mr-1"
            onClick={(e) => {
              e.stopPropagation();
              onToggle(node.id);
            }}
          >
            {node.expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
        )}
        
        {node.type === 'folder' ? (
          <Folder size={16} className="mr-2 text-blue-400" />
        ) : (
          <FileText size={16} className="mr-2 text-gray-400" />
        )}
        
        <span>{node.name}</span>
      </div>
      
      {node.expanded && node.children && (
        <div>
          {node.children.map((child) => (
            <TreeItem 
              key={child.id}
              node={child}
              level={level + 1}
              onToggle={onToggle}
              onSelect={onSelect}
              selectedId={selectedId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const FileTree: React.FC = () => {
  const [files, setFiles] = useState<TreeNode[]>(sampleFiles);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  const toggleFolder = (id: string) => {
    const updateNodes = (nodes: TreeNode[]): TreeNode[] => {
      return nodes.map((node) => {
        if (node.id === id) {
          return { ...node, expanded: !node.expanded };
        }
        
        if (node.children) {
          return { ...node, children: updateNodes(node.children) };
        }
        
        return node;
      });
    };
    
    setFiles(updateNodes(files));
  };
  
  const handleSelect = (node: TreeNode) => {
    setSelectedId(node.id);
  };
  
  return (
    <div className="text-sidebar-foreground">
      {files.map((file) => (
        <TreeItem
          key={file.id}
          node={file}
          level={0}
          onToggle={toggleFolder}
          onSelect={handleSelect}
          selectedId={selectedId}
        />
      ))}
    </div>
  );
};

export default FileTree;
