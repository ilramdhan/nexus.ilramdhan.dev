import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useTerminalCommands } from '../hooks/useTerminalCommands';
import { TerminalHeader } from './TerminalHeader';
import { BootSequence } from './BootSequence';
import { AnimatedBackground } from './AnimatedBackground';
import { MobileTerminal } from './MobileTerminal';
import { CommandAutocomplete } from './CommandAutocomplete';
import { TerminalSounds } from './TerminalSounds';
import { ThemeToggle } from './ThemeToggle';
import { Project, Blog, Resume, TechStack, Profile } from '@/types/database';

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

  // Fetch data from Supabase with error handling
  const { data: projects = [], error: projectsError } = useQuery({
    queryKey: ['public-projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        console.error('Error fetching projects:', error);
        throw error;
      }
      console.log('Projects fetched:', data);
      return (data || []) as Project[];
    },
    retry: 1,
  });

  const { data: blogs = [], error: blogsError } = useQuery({
    queryKey: ['public-blogs'],
    queryFn: async () => {
      // Fetch all blogs (not just published) for now
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        console.error('Error fetching blogs:', error);
        throw error;
      }
      console.log('Blogs fetched:', data);
      return (data || []) as Blog[];
    },
    retry: 1,
  });

  const { data: resume = [], error: resumeError } = useQuery({
    queryKey: ['public-resume'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('resume')
        .select('*')
        .order('id', { ascending: false });
      if (error) {
        console.error('Error fetching resume:', error);
        throw error;
      }
      console.log('Resume fetched:', data);
      return (data || []) as Resume[];
    },
    retry: 1,
  });

  const { data: techStack = [], error: techStackError } = useQuery({
    queryKey: ['public-tech-stack'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tech_stack')
        .select('*')
        .order('category');
      if (error) {
        console.error('Error fetching tech_stack:', error);
        throw error;
      }
      console.log('Tech stack fetched:', data);
      return (data || []) as TechStack[];
    },
    retry: 1,
  });

  const { data: profile, error: profileError } = useQuery({
    queryKey: ['public-profile'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profile')
        .select('*')
        .limit(1)
        .maybeSingle();
      if (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }
      console.log('Profile fetched:', data);
      return data as Profile | null;
    },
    retry: 1,
  });

  // Log any errors
  useEffect(() => {
    if (projectsError) console.error('Projects query error:', projectsError);
    if (blogsError) console.error('Blogs query error:', blogsError);
    if (resumeError) console.error('Resume query error:', resumeError);
    if (techStackError) console.error('Tech stack query error:', techStackError);
    if (profileError) console.error('Profile query error:', profileError);
  }, [projectsError, blogsError, resumeError, techStackError, profileError]);

  const { executeCommand, getAvailableCommands } = useTerminalCommands({
    setLines,
    setCurrentPath,
    projects,
    blogs,
    resume,
    techStack,
    profile,
  });

  useEffect(() => {
    const bootTimer = setTimeout(() => {
      setIsBooting(false);
      setLines([
        {
          id: '1',
          content: `Welcome to ${profile?.display_name || "Ilham Ramadhan"}'s Terminal Portfolio`,
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
  }, [profile?.display_name]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      setCommandHistory(prev => [input.trim(), ...prev.slice(0, 49)]);
      setHistoryIndex(-1);

      const commandLine: TerminalLine = {
        id: Date.now().toString(),
        content: input,
        type: 'command',
        timestamp: Date.now(),
      };

      setLines(prev => [...prev, commandLine]);
      executeCommand(input.trim(), currentPath);
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
    const commandLine: TerminalLine = {
      id: Date.now().toString(),
      content: command,
      type: 'command',
      timestamp: Date.now(),
    };

    setLines(prev => [...prev, commandLine]);
    executeCommand(command, currentPath);
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
        <TerminalSounds key={soundTrigger} onCommand={() => { }} />
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
                  <div className={`ml-4 ${line.content.includes('Error') ? 'text-terminal-error' : 'text-terminal'
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

      <MobileTerminal onCommand={handleQuickCommand} />
    </div>
  );
};