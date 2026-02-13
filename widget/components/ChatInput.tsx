import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
}

interface Particle {
  id: number;
  x: number;
  y: number;
}

function playSendSound() {
  try {
    const ctx = new AudioContext();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.08);
    oscillator.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.2);
    setTimeout(() => ctx.close(), 300);
  } catch {
    // Silently fail
  }
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const particleId = useRef(0);

  const handleSend = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    playSendSound();
    const newParticles: Particle[] = Array.from({ length: 5 }, () => ({
      id: particleId.current++,
      x: (Math.random() - 0.5) * 60,
      y: (Math.random() - 0.5) * 60,
    }));
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 600);
    onSend(trimmed);
    setValue('');
  }, [value, disabled, onSend]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const isEmpty = value.trim().length === 0;

  return (
    <div className="relative flex-shrink-0">
      <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, #0ea5e9, #34d399, transparent)', opacity: 0.3 }} />
      <div className="flex items-center gap-2 p-3" style={{ background: 'rgba(10, 15, 30, 0.6)' }}>
        <div className="flex-1 relative">
          <input
            type="text" value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)} disabled={disabled}
            placeholder="Posez votre question..." aria-label="Écrire un message" className="w-full outline-none"
            style={{
              background: 'rgba(15, 23, 42, 0.4)',
              border: `1px solid ${isFocused ? 'rgba(14, 165, 233, 0.35)' : 'rgba(14, 165, 233, 0.1)'}`,
              borderRadius: '14px', padding: '12px 16px', fontFamily: "'DM Sans', sans-serif", fontSize: '14px', color: '#f1f5f9',
              transition: 'border-color 0.3s, box-shadow 0.3s',
              boxShadow: isFocused ? '0 0 12px rgba(14, 165, 233, 0.1)' : 'none',
              animation: value.length > 0 && isFocused ? 'breathingGlow 2s ease-in-out infinite' : 'none',
            }}
          />
          <style>{`input::placeholder { color: #475569; font-style: italic; }`}</style>
        </div>
        <div className="relative">
          <motion.button
            whileHover={!isEmpty ? { scale: 1.08 } : undefined} whileTap={!isEmpty ? { scale: 0.95 } : undefined}
            onClick={handleSend} disabled={isEmpty || disabled} aria-label="Envoyer le message"
            className="flex items-center justify-center cursor-pointer"
            style={{
              width: '42px', height: '42px', borderRadius: '14px', background: 'linear-gradient(135deg, #0ea5e9, #34d399)',
              border: 'none', opacity: isEmpty ? 0.3 : 1, transition: 'opacity 0.2s, box-shadow 0.2s',
              boxShadow: !isEmpty ? '0 0 16px rgba(14, 165, 233, 0.3)' : 'none',
            }}
          >
            <motion.svg animate={isEmpty ? {} : { x: 0 }} whileTap={!isEmpty ? { x: 3 } : undefined}
              transition={{ duration: 0.15 }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </motion.svg>
          </motion.button>
          <AnimatePresence>
            {particles.map((p) => (
              <motion.div key={p.id}
                initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                animate={{ scale: [0, 1, 0], x: p.x, y: p.y, opacity: [1, 1, 0] }}
                exit={{ opacity: 0 }} transition={{ duration: 0.5, ease: 'easeOut' }}
                className="absolute rounded-full pointer-events-none"
                style={{ width: '6px', height: '6px', top: '50%', left: '50%', marginTop: '-3px', marginLeft: '-3px', background: Math.random() > 0.5 ? '#0ea5e9' : '#34d399' }}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
