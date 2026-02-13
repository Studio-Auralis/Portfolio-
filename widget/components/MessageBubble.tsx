import { motion } from 'framer-motion';
import type { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
  showAvatar: boolean;
  index: number;
}

export function MessageBubble({ message, showAvatar, index }: MessageBubbleProps) {
  const isBot = message.role === 'assistant';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className={`flex ${isBot ? 'justify-start' : 'justify-end'} px-4`}
    >
      {isBot && (
        <div className="flex-shrink-0 mr-2 mt-1">
          {showAvatar ? (
            <div className="w-6 h-6 rounded-full flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #0ea5e9, #34d399)' }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
          ) : (
            <div className="w-6" />
          )}
        </div>
      )}
      <div
        className={`max-w-[80%] px-4 py-3 ${isBot ? 'message-shimmer' : ''}`}
        style={{
          background: isBot ? 'rgba(14, 20, 35, 0.7)' : 'linear-gradient(135deg, rgba(14,165,233,0.15), rgba(52,211,153,0.1))',
          border: isBot ? '1px solid rgba(14, 165, 233, 0.06)' : '1px solid rgba(14, 165, 233, 0.12)',
          borderRadius: isBot ? '18px 18px 18px 4px' : '18px 18px 4px 18px',
          fontFamily: "'DM Sans', sans-serif", fontSize: '14px', lineHeight: '1.6', color: '#e2e8f0',
        }}
      >
        {message.content}
      </div>
    </motion.div>
  );
}
