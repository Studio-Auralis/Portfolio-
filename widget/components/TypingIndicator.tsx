import { motion } from 'framer-motion';

export function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -5, scale: 0.97 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-start gap-2 px-4"
    >
      <div className="w-6 h-6 rounded-full flex-shrink-0 mt-1 flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #0ea5e9, #34d399)' }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      </div>
      <div
        className="relative rounded-[18px_18px_18px_4px] px-5 py-4 overflow-hidden"
        style={{ background: 'rgba(14, 20, 35, 0.7)', border: '1px solid rgba(14, 165, 233, 0.06)', minWidth: '120px' }}
      >
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(14, 165, 233, 0.04) 50%, transparent 100%)', backgroundSize: '200% 100%', animation: 'typingShimmer 2s ease-in-out infinite' }}
        />
        <div className="flex items-center gap-1.5 relative z-10">
          {[0, 1, 2].map((i) => (
            <div key={i} className="w-2 h-2 rounded-full"
              style={{ background: 'linear-gradient(135deg, #0ea5e9, #34d399)', animation: `typingBounce 1.4s ease-in-out ${i * 0.2}s infinite` }}
            />
          ))}
        </div>
        <p className="relative z-10 mt-1.5 italic"
          style={{ fontSize: '11px', color: '#64748b', fontFamily: "'DM Sans', sans-serif" }}
        >
          Auralis réfléchit...
        </p>
      </div>
    </motion.div>
  );
}
