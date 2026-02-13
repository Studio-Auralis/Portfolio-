import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

interface Ripple {
  id: number;
  x: number;
  y: number;
}

export function ChatButton({ isOpen, onClick }: ChatButtonProps) {
  const [showHint, setShowHint] = useState(false);
  const [hintDismissed, setHintDismissed] = useState(false);
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const handleClick = useCallback(() => {
    const newRipple: Ripple = { id: Date.now(), x: 32, y: 32 };
    setRipples((prev) => [...prev, newRipple]);
    setTimeout(() => { setRipples((prev) => prev.filter((r) => r.id !== newRipple.id)); }, 600);
    onClick();
  }, [onClick]);

  useEffect(() => {
    if (hintDismissed || isOpen) return;
    const timer = setTimeout(() => {
      setShowHint(true);
      setTimeout(() => { setShowHint(false); setHintDismissed(true); }, 4000);
    }, 5000);
    return () => clearTimeout(timer);
  }, [hintDismissed, isOpen]);

  useEffect(() => {
    if (isOpen) { setShowHint(false); setHintDismissed(true); }
  }, [isOpen]);

  return (
    <div className="fixed z-50" style={{ bottom: '28px', right: '28px' }}>
      <AnimatePresence>
        {showHint && (
          <motion.div initial={{ opacity: 0, y: 10, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 whitespace-nowrap pointer-events-none"
            style={{ bottom: '76px', background: 'rgba(14, 20, 35, 0.9)', border: '1px solid rgba(14, 165, 233, 0.15)', borderRadius: '12px', padding: '8px 14px', fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#e2e8f0', backdropFilter: 'blur(16px)', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}
          >
            <span aria-hidden="true">&#128075;</span> Besoin d&apos;aide ?
            <div className="absolute" style={{ bottom: '-6px', right: '24px', width: '12px', height: '12px', background: 'rgba(14, 20, 35, 0.9)', border: '1px solid rgba(14, 165, 233, 0.15)', borderTop: 'none', borderLeft: 'none', transform: 'rotate(45deg)' }} />
          </motion.div>
        )}
      </AnimatePresence>

      {!isOpen && (
        <div className="absolute inset-0 rounded-full pointer-events-none"
          style={{ animation: 'pulseRing 3s ease-out infinite', background: 'linear-gradient(135deg, rgba(14,165,233,0.3), rgba(52,211,153,0.2))' }}
        />
      )}

      <motion.button onClick={handleClick} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
        aria-label={isOpen ? 'Fermer le chat' : 'Ouvrir le chat'}
        className="relative w-16 h-16 rounded-full flex items-center justify-center cursor-pointer overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0ea5e9, #0d9488, #34d399)', backgroundSize: '200% 200%', animation: 'gradientShift 6s ease infinite, glowPulse 3s ease-in-out infinite', border: 'none', boxShadow: '0 0 20px rgba(14, 165, 233, 0.4)' }}
      >
        {ripples.map((ripple) => (
          <span key={ripple.id} className="absolute rounded-full pointer-events-none"
            style={{ left: ripple.x - 8, top: ripple.y - 8, width: 16, height: 16, background: 'rgba(255, 255, 255, 0.35)', animation: 'rippleExpand 0.6s ease-out forwards' }}
          />
        ))}
        <AnimatePresence mode="wait" initial={false}>
          {isOpen ? (
            <motion.svg key="close" initial={{ rotate: -90, opacity: 0, scale: 0.5 }} animate={{ rotate: 0, opacity: 1, scale: 1 }} exit={{ rotate: 90, opacity: 0, scale: 0.5 }} transition={{ duration: 0.25 }}
              width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </motion.svg>
          ) : (
            <motion.svg key="chat" initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
              animate={{ rotate: 0, opacity: 1, scale: 1, y: [0, -2, 0] }} whileHover={{ rotate: 15 }}
              exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.25, y: { duration: 2, repeat: Infinity, ease: 'easeInOut' } }}
              width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </motion.svg>
          )}
        </AnimatePresence>

        {!isOpen && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 15, delay: 0.5 }}
            className="absolute rounded-full"
            style={{ top: '2px', right: '2px', width: '14px', height: '14px', background: '#f59e0b', border: '2.5px solid #030712', animation: 'dotPulse 2s ease-in-out infinite' }}
          />
        )}
      </motion.button>
    </div>
  );
}
