
import React, { useState } from 'react';
import { GitBranch, GitCommit, GitPullRequest, GitMerge, Plus, Check, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

interface GitPanelProps {
  onCommit: (message: string) => void;
  onBranchChange: (branch: string) => void;
}

type GitChange = {
  filename: string;
  status: 'modified' | 'added' | 'deleted' | 'untracked';
  staged: boolean;
};

const GitPanel: React.FC<GitPanelProps> = ({ onCommit, onBranchChange }) => {
  const [commitMessage, setCommitMessage] = useState('');
  const [currentBranch, setCurrentBranch] = useState('main');
  const [branches, setBranches] = useState(['main', 'develop', 'feature/auth']);
  const [changes, setChanges] = useState<GitChange[]>([
    { filename: 'src/components/Editor.tsx', status: 'modified', staged: false },
    { filename: 'src/components/Sidebar.tsx', status: 'modified', staged: false },
    { filename: 'src/pages/Index.tsx', status: 'modified', staged: false },
    { filename: 'src/hooks/use-theme.tsx', status: 'untracked', staged: false },
  ]);
  const [isCreatingBranch, setIsCreatingBranch] = useState(false);
  const [newBranchName, setNewBranchName] = useState('');

  const toggleStaged = (filename: string) => {
    setChanges(changes.map(change => 
      change.filename === filename 
        ? { ...change, staged: !change.staged } 
        : change
    ));
  };

  const handleCommit = () => {
    if (!commitMessage.trim()) {
      toast({
        title: "Error",
        description: "Please enter a commit message",
        variant: "destructive"
      });
      return;
    }

    const stagedChanges = changes.filter(c => c.staged);
    if (stagedChanges.length === 0) {
      toast({
        title: "Error",
        description: "No changes staged for commit",
        variant: "destructive"
      });
      return;
    }

    onCommit(commitMessage);
    
    // Simulate a successful commit by removing staged changes
    setChanges(changes.filter(c => !c.staged));
    setCommitMessage('');
    
    toast({
      title: "Commit successful",
      description: `Committed ${stagedChanges.length} file(s) to ${currentBranch}`,
    });
  };

  const handleBranchChange = (branch: string) => {
    setCurrentBranch(branch);
    onBranchChange(branch);
    
    toast({
      title: "Branch changed",
      description: `Switched to branch: ${branch}`,
    });
  };

  const handleCreateBranch = () => {
    if (!newBranchName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a branch name",
        variant: "destructive"
      });
      return;
    }

    if (branches.includes(newBranchName)) {
      toast({
        title: "Error",
        description: "Branch already exists",
        variant: "destructive"
      });
      return;
    }

    setBranches([...branches, newBranchName]);
    handleBranchChange(newBranchName);
    setIsCreatingBranch(false);
    setNewBranchName('');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'modified':
        return <GitCommit size={16} className="text-blue-500" />;
      case 'added':
        return <Plus size={16} className="text-green-500" />;
      case 'deleted':
        return <FileText size={16} className="text-red-500" />;
      case 'untracked':
        return <FileText size={16} className="text-gray-500" />;
      default:
        return <FileText size={16} />;
    }
  };

  return (
    <div className="p-4 h-full overflow-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm uppercase font-semibold">Source Control</h2>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="h-7">
                <GitBranch size={14} className="mr-1" />
                {currentBranch}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Switch Branch</DialogTitle>
                <DialogDescription>
                  Select a branch or create a new one.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-2 my-4 max-h-60 overflow-auto">
                {branches.map(branch => (
                  <div 
                    key={branch} 
                    className={`flex items-center p-2 rounded cursor-pointer hover:bg-secondary ${branch === currentBranch ? 'bg-primary/10' : ''}`}
                    onClick={() => handleBranchChange(branch)}
                  >
                    <GitBranch size={16} className="mr-2" />
                    <span>{branch}</span>
                    {branch === currentBranch && <Check size={16} className="ml-auto text-green-500" />}
                  </div>
                ))}
              </div>
              <Button 
                variant="outline" 
                onClick={() => setIsCreatingBranch(true)}
                className="w-full"
              >
                <Plus size={14} className="mr-1" />
                Create New Branch
              </Button>
              {isCreatingBranch && (
                <div className="mt-4 space-y-2">
                  <Input 
                    placeholder="Enter branch name" 
                    value={newBranchName}
                    onChange={e => setNewBranchName(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleCreateBranch} className="flex-1">
                      Create
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsCreatingBranch(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
          <Button variant="outline" size="sm" className="h-7">
            <GitPullRequest size={14} className="mr-1" />
            Pull
          </Button>
          <Button variant="outline" size="sm" className="h-7">
            <GitMerge size={14} className="mr-1" />
            Push
          </Button>
        </div>
      </div>

      {changes.length > 0 ? (
        <div className="space-y-4">
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground mb-2">Changes</div>
            {changes.map(change => (
              <div 
                key={change.filename} 
                className="flex items-center text-sm py-1 px-2 hover:bg-secondary/50 rounded cursor-pointer"
                onClick={() => toggleStaged(change.filename)}
              >
                <input 
                  type="checkbox" 
                  checked={change.staged}
                  onChange={() => toggleStaged(change.filename)}
                  className="mr-2"
                />
                {getStatusIcon(change.status)}
                <span className="ml-2 truncate">{change.filename}</span>
                <span className="ml-auto text-xs opacity-60">{change.status}</span>
              </div>
            ))}
          </div>

          <div>
            <div className="text-xs text-muted-foreground mb-2">Commit Message</div>
            <textarea 
              className="w-full p-2 text-sm border rounded-md bg-background resize-none focus:outline-none focus:ring-1 focus:ring-primary"
              rows={3}
              placeholder="Summary (required)"
              value={commitMessage}
              onChange={e => setCommitMessage(e.target.value)}
            />
            <div className="flex gap-2 mt-2">
              <Button 
                onClick={handleCommit}
                disabled={!commitMessage.trim() || !changes.some(c => c.staged)}
                className="w-full"
              >
                Commit
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setChanges(changes.map(c => ({ ...c, staged: true })))}
                className="whitespace-nowrap"
              >
                Stage All
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
          <GitBranch size={32} className="mb-2" />
          <p className="text-sm">No changes detected</p>
          <p className="text-xs mt-1">Current branch: {currentBranch}</p>
        </div>
      )}
    </div>
  );
};

export default GitPanel;
