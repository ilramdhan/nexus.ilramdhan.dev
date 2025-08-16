import { useEffect, useState } from 'react';

interface BootSequenceProps {
  onComplete: () => void;
}

const bootMessages = [
  'Initializing Ilham Ramadhan Terminal Portfolio v2.0.1...',
  'Loading developer modules...',
  'Connecting to GitHub repositories...',
  'Scanning project files...',
  'Loading fullstack configurations...',
  'Initializing interactive shell...',
  'System ready. Welcome!',
];

export const BootSequence = ({ onComplete }: BootSequenceProps) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (currentMessageIndex >= bootMessages.length) {
      setTimeout(onComplete, 500);
      return;
    }

    const currentMessage = bootMessages[currentMessageIndex];
    let charIndex = 0;

    const typeInterval = setInterval(() => {
      if (charIndex < currentMessage.length) {
        setDisplayedText(currentMessage.slice(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(typeInterval);
        setIsTyping(false);
        
        setTimeout(() => {
          setCurrentMessageIndex(prev => prev + 1);
          setDisplayedText('');
          setIsTyping(true);
        }, 300);
      }
    }, 50);

    return () => clearInterval(typeInterval);
  }, [currentMessageIndex, onComplete]);

  return (
    <div className="min-h-screen bg-terminal flex items-center justify-center scan-lines">
      <div className="terminal-window max-w-4xl w-full mx-4">
        <div className="terminal-header">
          <div className="flex items-center">
            <div className="terminal-button close"></div>
            <div className="terminal-button minimize"></div>
            <div className="terminal-button maximize"></div>
          </div>
          <div className="flex-1 text-center">
            <span className="text-terminal-muted text-sm font-medium">
              System Boot
            </span>
          </div>
        </div>
        
        <div className="p-8 h-96">
          <div className="font-terminal text-terminal">
            <div className="mb-8">
              <pre className="text-terminal-accent text-lg glitch" data-text="ILHAM RAMADHAN">
ILHAM RAMADHAN
              </pre>
              <div className="text-terminal-muted">Fullstack Developer Terminal Interface</div>
            </div>
            
            <div className="space-y-2">
              {bootMessages.slice(0, currentMessageIndex).map((message, index) => (
                <div key={index} className="flex items-center">
                  <span className="text-terminal-success mr-2">[OK]</span>
                  <span className="text-terminal-muted">{message}</span>
                </div>
              ))}
              
              {currentMessageIndex < bootMessages.length && (
                <div className="flex items-center">
                  <span className="text-terminal-warning mr-2">[...]</span>
                  <span className="text-terminal">
                    {displayedText}
                    {isTyping && <span className="terminal-cursor">_</span>}
                  </span>
                </div>
              )}
            </div>
            
            <div className="mt-8">
              <div className="w-full bg-secondary h-2 rounded">
                <div 
                  className="bg-accent h-2 rounded transition-all duration-300"
                  style={{ 
                    width: `${(currentMessageIndex / bootMessages.length) * 100}%` 
                  }}
                ></div>
              </div>
              <div className="text-xs text-terminal-muted mt-2">
                Loading... {Math.round((currentMessageIndex / bootMessages.length) * 100)}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};