import { useState, useEffect } from 'react';

interface CommandAutocompleteProps {
  input: string;
  onComplete: (command: string) => void;
  availableCommands: string[];
}

export const CommandAutocomplete = ({ input, onComplete, availableCommands }: CommandAutocompleteProps) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (input.length > 0) {
      const filtered = availableCommands.filter(cmd => 
        cmd.toLowerCase().startsWith(input.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0 && filtered[0] !== input);
    } else {
      setShowSuggestions(false);
    }
  }, [input, availableCommands]);

  if (!showSuggestions) return null;

  return (
    <div className="absolute top-full left-0 right-0 bg-card border border-border rounded mt-1 shadow-terminal z-10">
      {suggestions.slice(0, 6).map((suggestion, index) => (
        <button
          key={suggestion}
          onClick={() => onComplete(suggestion)}
          className="w-full text-left px-3 py-2 text-terminal-accent hover:bg-secondary 
                   transition-terminal border-b border-border last:border-b-0 text-sm font-terminal"
        >
          <span className="text-terminal-muted">$ </span>
          {suggestion}
          {index === 0 && (
            <span className="text-terminal-muted text-xs ml-2">(Tab to complete)</span>
          )}
        </button>
      ))}
    </div>
  );
};