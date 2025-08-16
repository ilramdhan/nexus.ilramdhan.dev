export const TerminalHeader = () => {
  return (
    <div className="terminal-header">
      <div className="flex items-center">
        <div className="terminal-button close"></div>
        <div className="terminal-button minimize"></div>
        <div className="terminal-button maximize"></div>
      </div>
      <div className="flex-1 text-center">
        <span className="text-terminal-muted text-sm font-medium">
          ilham@portfolio:~$ Interactive Terminal Portfolio
        </span>
      </div>
      <div className="text-terminal-muted text-xs">
        {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
};