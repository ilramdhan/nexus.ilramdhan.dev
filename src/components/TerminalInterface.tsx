import { useState, useEffect, useRef } from 'react';
import { useTerminalCommands } from '../hooks/useTerminalCommands';
import { TerminalHeader } from './TerminalHeader';
import { BootSequence } from './BootSequence';
import { MatrixBackground } from './MatrixBackground';

interface TerminalLine {
  id: string;
  content: string;
  type: 'command' | 'output' | 'error' | 'info';
  timestamp: number;
}

export const TerminalInterface = () => {
  const [input, setInput] = useState('');
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [isBooting, setIsBooting] = useState(true);
  const [currentPath, setCurrentPath] = useState('~');
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  const { executeCommand, getAvailableCommands } = useTerminalCommands({
    setLines,
    setCurrentPath,
  });

  useEffect(() => {
    const bootTimer = setTimeout(() => {
      setIsBooting(false);
      // Add welcome message
      setLines([
        {
          id: '1',
          content: 'Welcome to Ilham Ramadhan\'s Terminal Portfolio',
          type: 'info',
          timestamp: Date.now(),
        },
        {
          id: '2',
          content: 'Type "help" to see available commands or click on links below.',
          type: 'info',
          timestamp: Date.now(),
        },
        {
          id: '3',
          content: '',
          type: 'info',
          timestamp: Date.now(),
        },
      ]);
    }, 3000);

    return () => clearTimeout(bootTimer);
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      // Add command to history
      const commandLine: TerminalLine = {
        id: Date.now().toString(),
        content: input,
        type: 'command',
        timestamp: Date.now(),
      };
      
      setLines(prev => [...prev, commandLine]);
      
      // Execute command
      executeCommand(input.trim());
      
      setInput('');
    }
  };

  const handleQuickCommand = (command: string) => {
    setInput(command);
    inputRef.current?.focus();
  };

  if (isBooting) {
    return <BootSequence onComplete={() => setIsBooting(false)} />;
  }

  return (
    <div className="min-h-screen bg-terminal scan-lines relative">
      <MatrixBackground />
      <div className="max-w-6xl mx-auto p-4 relative z-10">
        <div className="terminal-window">
          <TerminalHeader />
          
          <div 
            ref={terminalRef}
            className="p-6 h-[calc(100vh-200px)] overflow-y-auto font-terminal text-sm"
          >
            {lines.map((line) => (
              <div key={line.id} className="mb-2">
                {line.type === 'command' && (
                  <div className="terminal-line text-terminal">
                    <span className="text-terminal-muted">[{currentPath}]</span> {line.content}
                  </div>
                )}
                {line.type === 'output' && (
                  <div className={`ml-4 ${
                    line.content.includes('Error') ? 'text-terminal-error' : 'text-terminal'
                  }`}>
                    {line.content}
                  </div>
                )}
                {line.type === 'info' && (
                  <div className="text-terminal-accent">{line.content}</div>
                )}
                {line.type === 'error' && (
                  <div className="text-terminal-error ml-4">{line.content}</div>
                )}
              </div>
            ))}
            
            <form onSubmit={handleSubmit} className="terminal-line">
              <span className="text-terminal-muted">[{currentPath}]</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="bg-transparent outline-none text-terminal ml-1 flex-1"
                placeholder="Type a command... (try 'help')"
                autoFocus
              />
              <span className="terminal-cursor">_</span>
            </form>
          </div>
          
          {/* Quick Navigation */}
          <div className="p-4 border-t border-border bg-muted/30">
            <div className="text-terminal-muted text-xs mb-2">Quick Navigation:</div>
            <div className="flex flex-wrap gap-2">
              {['about', 'projects', 'skills', 'contact', 'help'].map((cmd) => (
                <button
                  key={cmd}
                  onClick={() => handleQuickCommand(cmd)}
                  className="px-3 py-1 text-xs bg-secondary hover:bg-accent text-terminal-accent 
                           transition-terminal border border-border rounded"
                >
                  {cmd}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};