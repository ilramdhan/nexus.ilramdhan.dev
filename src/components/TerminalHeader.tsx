import { useState, useEffect } from 'react';

export const TerminalHeader = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const jakartaTime = currentTime.toLocaleTimeString('id-ID', {
    timeZone: 'Asia/Jakarta',
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

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
        {jakartaTime} WIB
      </div>
    </div>
  );
};