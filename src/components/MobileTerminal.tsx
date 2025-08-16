import { useState } from 'react';

interface MobileTerminalProps {
  onCommand: (command: string) => void;
}

export const MobileTerminal = ({ onCommand }: MobileTerminalProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const quickCommands = [
    { cmd: 'about', label: '👤 About', desc: 'Learn about Ilham' },
    { cmd: 'projects', label: '💼 Projects', desc: 'View my work' },
    { cmd: 'articles', label: '📝 Articles', desc: 'Read my blog posts' },
    { cmd: 'skills', label: '🛠️ Skills', desc: 'Technical expertise' },
    { cmd: 'experience', label: '🏢 Experience', desc: 'Work history' },
    { cmd: 'contact', label: '📞 Contact', desc: 'Get in touch' },
    { cmd: 'ascii', label: '🎨 ASCII Art', desc: 'Cool terminal art' },
    { cmd: 'help', label: '❓ Help', desc: 'All commands' },
  ];

  return (
    <div className="md:hidden fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="bg-accent text-primary p-3 rounded-full shadow-glow hover:bg-accent/80 transition-terminal"
      >
        <span className="text-lg">⌨️</span>
      </button>

      {isMenuOpen && (
        <div className="absolute bottom-16 right-0 bg-card border border-border rounded-lg shadow-terminal p-4 w-64">
          <div className="text-terminal-accent text-sm font-medium mb-3">Quick Commands</div>
          <div className="grid grid-cols-2 gap-2">
            {quickCommands.map((item) => (
              <button
                key={item.cmd}
                onClick={() => {
                  onCommand(item.cmd);
                  setIsMenuOpen(false);
                }}
                className="bg-secondary hover:bg-accent text-terminal-accent p-2 rounded text-xs
                         transition-terminal border border-border text-left"
              >
                <div className="font-medium">{item.label}</div>
                <div className="text-terminal-muted text-xs mt-1">{item.desc}</div>
              </button>
            ))}
          </div>
          
          <div className="mt-3 pt-3 border-t border-border">
            <div className="text-terminal-muted text-xs">
              💡 You can also type commands directly in the terminal above
            </div>
          </div>
        </div>
      )}
    </div>
  );
};