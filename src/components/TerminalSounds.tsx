import { useEffect, useState } from 'react';

interface TerminalSoundsProps {
  onKeyPress?: () => void;
  onCommand?: () => void;
  onBoot?: () => void;
}

export const TerminalSounds = ({ onKeyPress, onCommand, onBoot }: TerminalSoundsProps) => {
  const [isEnabled, setIsEnabled] = useState(true); // Auto-enabled by default
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  useEffect(() => {
    // Initialize audio context when user enables sounds
    if (isEnabled && !audioContext) {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      setAudioContext(ctx);
    }
  }, [isEnabled, audioContext]);

  const createBeep = (frequency: number, duration: number, volume: number = 0.1) => {
    if (!audioContext || !isEnabled) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  };

  const playKeyPressSound = () => {
    createBeep(800, 0.05, 0.05); // Short, high-pitched beep
  };

  const playCommandSound = () => {
    createBeep(1200, 0.1, 0.08); // Slightly longer, higher beep
  };

  const playBootSound = () => {
    // Classic boot sound sequence
    setTimeout(() => createBeep(440, 0.2, 0.1), 0);
    setTimeout(() => createBeep(554, 0.2, 0.1), 200);
    setTimeout(() => createBeep(659, 0.3, 0.1), 400);
  };

  useEffect(() => {
    if (onKeyPress) {
      playKeyPressSound();
    }
  }, [onKeyPress]);

  useEffect(() => {
    if (onCommand) {
      playCommandSound();
    }
  }, [onCommand]);

  useEffect(() => {
    if (onBoot) {
      playBootSound();
    }
  }, [onBoot]);

  return (
    <button
      onClick={() => setIsEnabled(!isEnabled)}
      className={`p-2 rounded text-xs transition-terminal border border-border ${
        isEnabled 
          ? 'bg-accent text-primary' 
          : 'bg-secondary text-terminal-muted hover:bg-muted'
      }`}
      title={isEnabled ? 'Disable terminal sounds' : 'Enable terminal sounds'}
    >
      {isEnabled ? '🔊' : '🔇'}
    </button>
  );
};