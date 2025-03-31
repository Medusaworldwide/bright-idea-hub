
import React, { useState } from 'react';
import { 
  Code, Plus, Trash2, Copy, Check, ArrowRight, FileCode, Save 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

export interface CodeSnippet {
  id: string;
  title: string;
  description: string;
  code: string;
  language: string;
}

interface CodeSnippetsProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (snippet: CodeSnippet) => void;
}

const defaultSnippets: CodeSnippet[] = [
  {
    id: 'react-component',
    title: 'React Functional Component',
    description: 'Basic React functional component with TypeScript',
    code: `import React from 'react';\n\ninterface Props {\n  // Define your props here\n}\n\nconst Component: React.FC<Props> = (props) => {\n  return (\n    <div>\n      {/* Your JSX here */}\n    </div>\n  );\n};\n\nexport default Component;`,
    language: 'typescript'
  },
  {
    id: 'react-hook',
    title: 'Custom React Hook',
    description: 'Template for a custom React hook',
    code: `import { useState, useEffect } from 'react';\n\nexport function useCustomHook(param: any) {\n  const [state, setState] = useState<any>(null);\n\n  useEffect(() => {\n    // Effect logic here\n    return () => {\n      // Cleanup logic here\n    };\n  }, [param]);\n\n  const doSomething = () => {\n    // Function logic here\n  };\n\n  return {\n    state,\n    doSomething\n  };\n}`,
    language: 'typescript'
  },
  {
    id: 'tailwind-card',
    title: 'Tailwind Card',
    description: 'A simple card component with Tailwind CSS',
    code: `<div className="bg-white rounded-lg shadow-md p-6 max-w-sm">\n  <h2 className="text-xl font-bold mb-2">Card Title</h2>\n  <p className="text-gray-700 mb-4">This is the card content with a nice description.</p>\n  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">\n    Button\n  </button>\n</div>`,
    language: 'html'
  }
];

const CodeSnippets: React.FC<CodeSnippetsProps> = ({ isOpen, onClose, onInsert }) => {
  const [snippets, setSnippets] = useState<CodeSnippet[]>(defaultSnippets);
  const [selectedSnippet, setSelectedSnippet] = useState<CodeSnippet | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editCode, setEditCode] = useState('');
  const [editLanguage, setEditLanguage] = useState('typescript');
  const [isCopied, setIsCopied] = useState(false);
  
  const handleEdit = (snippet: CodeSnippet) => {
    setSelectedSnippet(snippet);
    setEditTitle(snippet.title);
    setEditDescription(snippet.description);
    setEditCode(snippet.code);
    setEditLanguage(snippet.language);
    setIsEditing(true);
    setIsAddingNew(false);
  };
  
  const handleAddNew = () => {
    setSelectedSnippet(null);
    setEditTitle('');
    setEditDescription('');
    setEditCode('');
    setEditLanguage('typescript');
    setIsEditing(false);
    setIsAddingNew(true);
  };
  
  const handleSave = () => {
    if (isAddingNew) {
      const newSnippet: CodeSnippet = {
        id: `snippet-${Date.now()}`,
        title: editTitle,
        description: editDescription,
        code: editCode,
        language: editLanguage
      };
      
      setSnippets([...snippets, newSnippet]);
      toast({
        title: "Snippet created",
        description: `Created '${editTitle}' snippet`
      });
    } else if (selectedSnippet) {
      const updatedSnippets = snippets.map(s => 
        s.id === selectedSnippet.id 
          ? { ...s, title: editTitle, description: editDescription, code: editCode, language: editLanguage }
          : s
      );
      setSnippets(updatedSnippets);
      toast({
        title: "Snippet updated",
        description: `Updated '${editTitle}' snippet`
      });
    }
    
    setIsEditing(false);
    setIsAddingNew(false);
  };
  
  const handleDelete = (id: string) => {
    setSnippets(snippets.filter(s => s.id !== id));
    if (selectedSnippet?.id === id) {
      setSelectedSnippet(null);
    }
    toast({
      title: "Snippet deleted",
      description: "The snippet has been removed"
    });
  };
  
  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    toast({
      title: "Copied to clipboard",
      description: "Snippet code copied to clipboard"
    });
  };
  
  const handleInsert = (snippet: CodeSnippet) => {
    onInsert(snippet);
    onClose();
    toast({
      title: "Snippet inserted",
      description: `Inserted '${snippet.title}' into editor`
    });
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl h-[80vh] p-0">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="flex items-center">
            <Code size={18} className="mr-2" />
            Code Snippets Library
          </DialogTitle>
          <DialogDescription>
            Save and reuse code snippets across your projects
          </DialogDescription>
        </DialogHeader>
        
        {(isEditing || isAddingNew) ? (
          <div className="flex flex-col h-[calc(80vh-64px-64px)]">
            <div className="p-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title" 
                  value={editTitle} 
                  onChange={(e) => setEditTitle(e.target.value)} 
                  placeholder="Snippet title"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input 
                  id="description" 
                  value={editDescription} 
                  onChange={(e) => setEditDescription(e.target.value)} 
                  placeholder="Brief description"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select 
                  value={editLanguage} 
                  onValueChange={setEditLanguage}
                >
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="typescript">TypeScript</SelectItem>
                    <SelectItem value="javascript">JavaScript</SelectItem>
                    <SelectItem value="html">HTML</SelectItem>
                    <SelectItem value="css">CSS</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2 flex-1">
                <Label htmlFor="code">Code</Label>
                <Textarea 
                  id="code" 
                  value={editCode} 
                  onChange={(e) => setEditCode(e.target.value)} 
                  placeholder="Paste or type your code here"
                  className="h-[calc(80vh-400px)] min-h-[200px] font-mono"
                />
              </div>
            </div>
            
            <div className="mt-auto p-4 flex justify-end space-x-2 border-t">
              <Button variant="outline" onClick={() => {
                setIsEditing(false);
                setIsAddingNew(false);
              }}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={!editTitle || !editCode}>
                <Save size={16} className="mr-2" />
                Save Snippet
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-[250px_1fr] h-[calc(80vh-64px-64px)]">
            <div className="border-r overflow-hidden flex flex-col">
              <div className="p-2 border-b flex justify-between items-center">
                <h3 className="text-sm font-medium">My Snippets</h3>
                <Button size="icon" variant="ghost" onClick={handleAddNew} title="Add New Snippet">
                  <Plus size={16} />
                </Button>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-2 space-y-1">
                  {snippets.map((snippet) => (
                    <div 
                      key={snippet.id}
                      className={`p-2 rounded-md cursor-pointer hover:bg-muted flex items-center justify-between group ${selectedSnippet?.id === snippet.id ? 'bg-muted' : ''}`}
                      onClick={() => setSelectedSnippet(snippet)}
                    >
                      <div className="flex items-center space-x-2 truncate">
                        <FileCode size={16} className="flex-shrink-0" />
                        <span className="truncate">{snippet.title}</span>
                      </div>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-6 w-6 opacity-0 group-hover:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(snippet.id);
                        }}
                      >
                        <Trash2 size={14} className="text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
            
            <div className="overflow-hidden flex flex-col">
              {selectedSnippet ? (
                <>
                  <div className="p-4 border-b">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-xl font-medium">{selectedSnippet.title}</h2>
                        <p className="text-muted-foreground mt-1">{selectedSnippet.description}</p>
                      </div>
                      <div className="flex space-x-1">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleEdit(selectedSnippet)}
                        >
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleCopy(selectedSnippet.code)}
                        >
                          {isCopied ? <Check size={16} /> : <Copy size={16} />}
                        </Button>
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleInsert(selectedSnippet)}
                        >
                          <ArrowRight size={16} className="mr-1" /> Insert
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center mt-2">
                      <span className="text-xs px-2 py-0.5 bg-muted rounded-full">
                        {selectedSnippet.language}
                      </span>
                    </div>
                  </div>
                  
                  <ScrollArea className="flex-1 p-4">
                    <pre className="bg-muted p-4 rounded-md overflow-auto font-mono text-sm">
                      <code>{selectedSnippet.code}</code>
                    </pre>
                  </ScrollArea>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <Code size={48} className="mb-4" />
                  <h3 className="text-lg font-medium">No snippet selected</h3>
                  <p className="mt-2 text-center max-w-md">
                    Select a snippet from the list or create a new one to view its details
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={handleAddNew}
                  >
                    <Plus size={16} className="mr-2" />
                    Create New Snippet
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
        
        <DialogFooter className="p-4 border-t">
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CodeSnippets;
