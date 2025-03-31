
import React, { useState, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FileNode } from '@/components/FileExplorer';

interface SearchResult {
  fileId: string;
  fileName: string;
  lineNumber: number;
  lineContent: string;
  matchIndex: number;
}

interface SearchFilesProps {
  files: FileNode[];
  onResultClick: (fileId: string, lineNumber: number) => void;
}

const SearchFiles: React.FC<SearchFilesProps> = ({ files, onResultClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchInFiles = useCallback((term: string) => {
    if (!term.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    
    const searchResults: SearchResult[] = [];
    
    const searchInNode = (node: FileNode) => {
      if (node.type === 'file' && node.content) {
        const lines = node.content.split('\n');
        
        lines.forEach((line, lineIndex) => {
          const lowerCaseLine = line.toLowerCase();
          const lowerCaseTerm = term.toLowerCase();
          let matchIndex = lowerCaseLine.indexOf(lowerCaseTerm);
          
          while (matchIndex !== -1) {
            searchResults.push({
              fileId: node.id,
              fileName: node.name,
              lineNumber: lineIndex + 1,
              lineContent: line.trim(),
              matchIndex
            });
            
            matchIndex = lowerCaseLine.indexOf(lowerCaseTerm, matchIndex + 1);
          }
        });
      }
      
      if (node.children) {
        node.children.forEach(searchInNode);
      }
    };
    
    files.forEach(searchInNode);
    setResults(searchResults);
    setIsSearching(false);
  }, [files]);

  const handleSearch = () => {
    searchInFiles(searchTerm);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setResults([]);
  };
  
  return (
    <div className="p-4 flex flex-col h-full overflow-hidden">
      <h2 className="text-sm uppercase font-semibold mb-2">Search in Files</h2>
      
      <div className="flex space-x-1 mb-3">
        <div className="relative flex-1">
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search term..."
            className="pr-8"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              } else if (e.key === 'Escape') {
                clearSearch();
              }
            }}
          />
          {searchTerm && (
            <button 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={clearSearch}
            >
              <X size={14} />
            </button>
          )}
        </div>
        <Button 
          onClick={handleSearch} 
          size="sm" 
          variant="secondary" 
          disabled={isSearching || !searchTerm.trim()}
        >
          <Search size={14} className="mr-1" />
          Search
        </Button>
      </div>
      
      <div className="overflow-auto flex-1">
        {isSearching ? (
          <div className="flex justify-center items-center h-20 text-muted-foreground">
            Searching...
          </div>
        ) : results.length > 0 ? (
          <div className="space-y-2">
            {results.map((result, index) => (
              <div 
                key={`${result.fileId}-${result.lineNumber}-${index}`}
                className="p-2 bg-sidebar-accent rounded-md text-sm cursor-pointer hover:bg-primary/10"
                onClick={() => onResultClick(result.fileId, result.lineNumber)}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{result.fileName}</span>
                  <span className="text-xs text-muted-foreground">Line {result.lineNumber}</span>
                </div>
                <div className="mt-1 text-xs font-mono whitespace-pre-wrap overflow-hidden text-ellipsis">
                  {result.lineContent}
                </div>
              </div>
            ))}
          </div>
        ) : searchTerm ? (
          <div className="flex justify-center items-center h-20 text-muted-foreground">
            No results found
          </div>
        ) : (
          <div className="flex justify-center items-center h-20 text-muted-foreground">
            Enter a search term and press Enter
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchFiles;
