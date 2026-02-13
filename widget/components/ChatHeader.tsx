import { motion } from 'framer-motion';

interface ChatHeaderProps {
  onClose: () => void;
}

export function ChatHeader({ onClose }: ChatHeaderProps) {
  return (
    <div className="relative flex-shrink-0">
      <div className="flex items-center justify-between px-4" style={{ height: '56px' }}>
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-[-3px] rounded-full"
              style={{
                background: 'conic-gradient(from 0deg, #0ea5e9, transparent 40%, #34d399, transparent 80%, #0ea5e9)',
                animation: 'ringRotate 8s linear infinite',
                mask: 'radial-gradient(farthest-side, transparent calc(100% - 1.5px), black calc(100% - 1.5px))',
                WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 1.5px), black calc(100% - 1.5px))',
              }}
            />
            <div className="w-[38px] h-[38px] rounded-full flex items-center justify-center relative z-10"
              style={{ background: 'linear-gradient(135deg, #0ea5e9, #34d399)' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
          </div>
          <div>
            <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '15px', fontWeight: 600, color: '#f1f5f9', margin: 0, lineHeight: 1.3 }}>
              Auralis AI
            </h3>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full"
                style={{ backgroundColor: '#34d399', animation: 'glowPulse 2s ease-in-out infinite', boxShadow: '0 0 6px rgba(52, 211, 153, 0.5)' }}
              />
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: '#34d399' }}>En ligne</span>
            </div>
          </div>
        </div>
        <motion.button
          whileHover={{ rotate: 90, scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          aria-label="Fermer le chat"
          className="w-8 h-8 flex items-center justify-center rounded-full cursor-pointer"
          style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#94a3b8' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </motion.button>
      </div>
      <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, #0ea5e9, #34d399, transparent)', opacity: 0.3 }} />
    </div>
  );
}
