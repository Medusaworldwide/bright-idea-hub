
import React, { useState } from 'react';
import { 
  File, Folder, FolderOpen, ChevronRight, ChevronDown, 
  Plus, FileText, Code, FileCode, Image, PlusCircle, Trash2, 
  Edit, Save, X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';

export interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  expanded?: boolean;
  content?: string;
  language?: string;
  icon?: React.ReactNode;
}

interface FileExplorerProps {
  files: FileNode[];
  onFilesChange: (files: FileNode[]) => void;
  onFileSelect: (file: FileNode) => void;
  selectedFileId: string | null;
}

const FileExplorer: React.FC<FileExplorerProps> = ({ 
  files, 
  onFilesChange, 
  onFileSelect,
  selectedFileId
}) => {
  const [editingNode, setEditingNode] = useState<{ id: string, name: string } | null>(null);

  const toggleFolder = (id: string) => {
    const updateNodes = (nodes: FileNode[]): FileNode[] => {
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
    
    onFilesChange(updateNodes(files));
  };
  
  const getFileIcon = (fileName: string): React.ReactNode => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'ts':
      case 'tsx':
        return <FileCode size={16} className="text-blue-400" />;
      case 'js':
      case 'jsx':
        return <FileCode size={16} className="text-yellow-400" />;
      case 'json':
        return <FileText size={16} className="text-yellow-600" />;
      case 'css':
        return <FileText size={16} className="text-blue-600" />;
      case 'html':
        return <Code size={16} className="text-orange-400" />;
      case 'md':
        return <FileText size={16} className="text-gray-400" />;
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'svg':
        return <Image size={16} className="text-green-400" />;
      default:
        return <File size={16} className="text-gray-400" />;
    }
  };
  
  const addFile = (parentId: string | null, type: 'file' | 'folder') => {
    const newId = `new-${Date.now()}`;
    const newName = type === 'file' ? 'new-file.ts' : 'new-folder';
    
    if (!parentId) {
      // Add to root
      const newNode: FileNode = {
        id: newId,
        name: newName,
        type,
        ...(type === 'folder' && { children: [], expanded: true }),
        ...(type === 'file' && { content: '', language: 'typescript' })
      };
      
      onFilesChange([...files, newNode]);
      setEditingNode({ id: newId, name: newName });
      return;
    }
    
    const addNodeToParent = (nodes: FileNode[]): FileNode[] => {
      return nodes.map((node) => {
        if (node.id === parentId) {
          const newNode: FileNode = {
            id: newId,
            name: newName,
            type,
            ...(type === 'folder' && { children: [], expanded: true }),
            ...(type === 'file' && { content: '', language: 'typescript' })
          };
          
          return {
            ...node,
            expanded: true,
            children: [...(node.children || []), newNode]
          };
        }
        
        if (node.children) {
          return {
            ...node,
            children: addNodeToParent(node.children)
          };
        }
        
        return node;
      });
    };
    
    onFilesChange(addNodeToParent(files));
    setEditingNode({ id: newId, name: newName });
  };
  
  const deleteNode = (id: string) => {
    const removeNodeById = (nodes: FileNode[]): FileNode[] => {
      return nodes.filter((node) => {
        if (node.id === id) {
          return false;
        }
        
        if (node.children) {
          node.children = removeNodeById(node.children);
        }
        
        return true;
      });
    };
    
    onFilesChange(removeNodeById(files));
    toast({
      title: "Deleted",
      description: "File or folder has been deleted",
    });
  };
  
  const handleRename = (id: string) => {
    const findNode = (nodes: FileNode[]): FileNode | null => {
      for (const node of nodes) {
        if (node.id === id) {
          return node;
        }
        
        if (node.children) {
          const found = findNode(node.children);
          if (found) return found;
        }
      }
      
      return null;
    };
    
    const node = findNode(files);
    if (node) {
      setEditingNode({ id, name: node.name });
    }
  };
  
  const handleSaveRename = () => {
    if (!editingNode) return;
    
    const updateNodeName = (nodes: FileNode[]): FileNode[] => {
      return nodes.map((node) => {
        if (node.id === editingNode.id) {
          // If it's a file, update the language based on extension
          let language = node.language;
          if (node.type === 'file') {
            const extension = editingNode.name.split('.').pop()?.toLowerCase();
            switch (extension) {
              case 'ts':
              case 'tsx':
                language = 'typescript';
                break;
              case 'js':
              case 'jsx':
                language = 'javascript';
                break;
              case 'css':
                language = 'css';
                break;
              case 'json':
                language = 'json';
                break;
              case 'html':
                language = 'html';
                break;
              case 'md':
                language = 'markdown';
                break;
              default:
                language = 'typescript';
            }
          }
          
          return { 
            ...node, 
            name: editingNode.name,
            ...(language && { language })
          };
        }
        
        if (node.children) {
          return {
            ...node,
            children: updateNodeName(node.children)
          };
        }
        
        return node;
      });
    };
    
    onFilesChange(updateNodeName(files));
    setEditingNode(null);
    
    toast({
      title: "Renamed",
      description: "File or folder has been renamed",
    });
  };
  
  const cancelRename = () => {
    setEditingNode(null);
  };
  
  const renderNode = (node: FileNode, level: number = 0) => {
    const isSelected = node.id === selectedFileId;
    const isEditing = editingNode?.id === node.id;
    
    return (
      <div key={node.id}>
        <div 
          className={cn(
            "flex items-center py-1 px-2 cursor-pointer rounded-md text-sm",
            isSelected ? "bg-primary/20" : "hover:bg-sidebar-accent"
          )}
          style={{ paddingLeft: `${(level * 12) + 4}px` }}
          onClick={() => node.type === 'file' && onFileSelect(node)}
        >
          {node.type === 'folder' && (
            <button 
              className="mr-1"
              onClick={(e) => {
                e.stopPropagation();
                toggleFolder(node.id);
              }}
            >
              {node.expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          )}
          
          {node.type === 'folder' ? (
            node.expanded ? <FolderOpen size={16} className="mr-2 text-blue-400" /> : <Folder size={16} className="mr-2 text-blue-400" />
          ) : (
            getFileIcon(node.name)
          )}
          
          {isEditing ? (
            <div className="flex flex-1 items-center ml-1">
              <input
                type="text"
                value={editingNode.name}
                onChange={(e) => setEditingNode({ ...editingNode, name: e.target.value })}
                className="bg-background border border-border rounded-sm px-1 py-0.5 text-xs w-full"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSaveRename();
                  } else if (e.key === 'Escape') {
                    cancelRename();
                  }
                }}
                onClick={(e) => e.stopPropagation()}
              />
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleSaveRename();
                }}
                className="p-1 text-green-500 hover:text-green-400"
              >
                <Save size={14} />
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  cancelRename();
                }}
                className="p-1 text-red-500 hover:text-red-400"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <span className="ml-1 flex-1">{node.name}</span>
          )}
          
          {!isEditing && (
            <div className="opacity-0 group-hover:opacity-100 ml-auto flex">
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Plus size={14} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {node.type === 'folder' && (
                    <>
                      <DropdownMenuItem onClick={() => addFile(node.id, 'file')}>
                        <FileText size={14} className="mr-2" />
                        Add File
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => addFile(node.id, 'folder')}>
                        <Folder size={14} className="mr-2" />
                        Add Folder
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuItem onClick={() => handleRename(node.id)}>
                    <Edit size={14} className="mr-2" />
                    Rename
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => deleteNode(node.id)}
                    className="text-red-500 focus:text-red-500"
                  >
                    <Trash2 size={14} className="mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
        
        {node.type === 'folder' && node.expanded && node.children && (
          <div>
            {node.children.map((child) => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="text-sidebar-foreground">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm uppercase font-semibold">Explorer</h2>
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => addFile(null, 'file')}
            title="New File"
          >
            <FileText size={14} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => addFile(null, 'folder')}
            title="New Folder"
          >
            <Folder size={14} />
          </Button>
        </div>
      </div>
      {files.map((file) => renderNode(file))}
    </div>
  );
};

export default FileExplorer;
