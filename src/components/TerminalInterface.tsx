import { useState, useEffect, useRef } from 'react';
import { useTerminalCommands } from '../hooks/useTerminalCommands';
import { TerminalHeader } from './TerminalHeader';
import { BootSequence } from './BootSequence';
import { AnimatedBackground } from './AnimatedBackground';
import { MobileTerminal } from './MobileTerminal';
import { CommandAutocomplete } from './CommandAutocomplete';
import { TerminalSounds } from './TerminalSounds';
import { ThemeToggle } from './ThemeToggle';

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
  const [currentPath, setCurrentPath] = useState('/home/ilham');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [soundTrigger, setSoundTrigger] = useState(0);
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
      // Add to command history
      setCommandHistory(prev => [input.trim(), ...prev.slice(0, 49)]); // Keep last 50 commands
      setHistoryIndex(-1);
      
      // Add command to history
      const commandLine: TerminalLine = {
        id: Date.now().toString(),
        content: input,
        type: 'command',
        timestamp: Date.now(),
      };
      
      setLines(prev => [...prev, commandLine]);
      
      // Execute command
      executeCommand(input.trim(), currentPath);
      
      // Trigger command sound
      setSoundTrigger(Date.now());
      
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const availableCommands = getAvailableCommands();
      const matches = availableCommands.filter(cmd => 
        cmd.toLowerCase().startsWith(input.toLowerCase())
      );
      if (matches.length === 1) {
        setInput(matches[0]);
      }
    }
  };

  const handleQuickCommand = (command: string) => {
    // Add command to history first
    const commandLine: TerminalLine = {
      id: Date.now().toString(),
      content: command,
      type: 'command',
      timestamp: Date.now(),
    };
    
    setLines(prev => [...prev, commandLine]);
    
    // Execute command
    executeCommand(command, currentPath);
    
    // Focus input for next command
    inputRef.current?.focus();
  };

  if (isBooting) {
    return <BootSequence onComplete={() => setIsBooting(false)} />;
  }

  return (
    <div className="min-h-screen bg-terminal scan-lines relative">
      <AnimatedBackground />
      
      {/* Control Panel */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <TerminalSounds key={soundTrigger} onCommand={() => {}} />
        <ThemeToggle />
      </div>
      
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
            
            <form onSubmit={handleSubmit}>
              <div className="terminal-line flex items-center relative">
                <span className="text-terminal-muted">[{currentPath}]</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="bg-transparent outline-none text-terminal ml-1 flex-1 font-terminal"
                  placeholder="Type a command... (try 'help')"
                  autoFocus
                  autoComplete="off"
                  spellCheck="false"
                />
                <span className="terminal-cursor">_</span>
                
                <CommandAutocomplete 
                  input={input}
                  onComplete={setInput}
                  availableCommands={getAvailableCommands()}
                />
              </div>
            </form>
          </div>
          
          {/* Quick Navigation */}
          <div className="p-4 border-t border-border bg-muted/30">
            <div className="text-terminal-muted text-xs mb-2">Quick Navigation:</div>
            <div className="flex flex-wrap gap-2">
              {['about', 'projects', 'articles', 'skills', 'experience', 'contact', 'ascii', 'help'].map((cmd) => (
                <button
                  key={cmd}
                  onClick={() => handleQuickCommand(cmd)}
                  className="px-3 py-1 text-xs bg-secondary hover:bg-accent text-muted-foreground 
                           hover:text-accent-foreground transition-terminal border border-border rounded"
                >
                  {cmd}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <MobileTerminal onCommand={handleQuickCommand} />
    </div>
  );
};