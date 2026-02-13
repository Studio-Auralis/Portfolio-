import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { useChat } from '../hooks/useChat';
import { useWelcomeSequence } from '../hooks/useWelcomeSequence';

interface ChatPanelProps {
  onClose: () => void;
}

function ChatContent({ onClose }: ChatPanelProps) {
  const { messages, isTyping, send } = useChat();
  const welcome = useWelcomeSequence();
  const [quickRepliesVisible, setQuickRepliesVisible] = useState(true);

  const allMessages = welcome.welcomeMessage
    ? [welcome.welcomeMessage, ...messages]
    : messages;

  const handleSend = useCallback(
    (text: string) => { setQuickRepliesVisible(false); send(text); },
    [send]
  );

  return (
    <div className="relative z-10 flex flex-col h-full">
      <ChatHeader onClose={onClose} />
      <MessageList
        messages={allMessages}
        isTyping={isTyping || welcome.isTyping}
        showQuickReplies={welcome.showQuickReplies && quickRepliesVisible && messages.length === 0}
        onQuickReply={handleSend}
      />
      <ChatInput onSend={handleSend} disabled={isTyping} />
      <div className="flex-shrink-0 flex items-center justify-center py-1.5"
        style={{ background: 'rgba(3, 7, 18, 0.5)', fontFamily: "'DM Sans', sans-serif", fontSize: '10px', color: '#475569', letterSpacing: '0.02em' }}
      >
        Powered by{' '}
        <span className="ml-1 font-medium"
          style={{ background: 'linear-gradient(135deg, #0ea5e9, #34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
        >Auralis</span>
      </div>
    </div>
  );
}

const MESH_BG = `
  radial-gradient(ellipse at 20% 0%, rgba(14, 165, 233, 0.08) 0%, transparent 60%),
  radial-gradient(ellipse at 80% 100%, rgba(52, 211, 153, 0.06) 0%, transparent 60%),
  radial-gradient(ellipse at 50% 50%, rgba(6, 12, 24, 0.95) 0%, rgba(3, 7, 18, 0.98) 100%)
`;

const BORDER_GRADIENT = `linear-gradient(135deg,
  rgba(14, 165, 233, 0.15) 0%, rgba(52, 211, 153, 0.08) 25%,
  transparent 50%, rgba(14, 165, 233, 0.08) 75%, rgba(52, 211, 153, 0.12) 100%)`;

function AnimatedBorderOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none"
      style={{
        borderRadius: 'inherit', padding: '1px', background: BORDER_GRADIENT,
        backgroundSize: '300% 300%', animation: 'borderShift 6s ease infinite',
        mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        maskComposite: 'exclude', WebkitMaskComposite: 'xor',
      }}
    />
  );
}

export function ChatPanel({ onClose }: ChatPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.4, y: 40, x: 40 }}
      animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, scale: 0.4, y: 40, x: 40 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      style={{
        transformOrigin: 'bottom right', position: 'fixed', bottom: '100px', right: '28px',
        width: '400px', height: '540px', borderRadius: '24px', display: 'flex', flexDirection: 'column',
        overflow: 'hidden', zIndex: 50,
        boxShadow: '0 24px 48px rgba(0,0,0,0.4), 0 0 0 1px rgba(14,165,233,0.05), 0 0 80px rgba(14,165,233,0.06)',
        border: '1px solid rgba(14, 165, 233, 0.08)', backdropFilter: 'blur(32px) saturate(1.2)',
      }}
      className="grain-overlay"
    >
      <div className="absolute inset-0 pointer-events-none" style={{ borderRadius: 'inherit', background: MESH_BG }} />
      <AnimatedBorderOverlay />
      <ChatContent onClose={onClose} />
    </motion.div>
  );
}

export function ChatPanelMobile({ onClose }: ChatPanelProps) {
  return (
    <motion.div
      initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 bottom-0 z-50 grain-overlay"
      style={{
        height: '70vh', borderRadius: '24px 24px 0 0', display: 'flex', flexDirection: 'column', overflow: 'hidden',
        boxShadow: '0 -24px 48px rgba(0,0,0,0.4), 0 0 0 1px rgba(14,165,233,0.05), 0 0 80px rgba(14,165,233,0.06)',
        border: '1px solid rgba(14, 165, 233, 0.08)', borderBottom: 'none', backdropFilter: 'blur(32px) saturate(1.2)',
      }}
    >
      <div className="absolute inset-0 pointer-events-none" style={{ borderRadius: 'inherit', background: MESH_BG }} />
      <AnimatedBorderOverlay />
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-center pt-2 pb-1">
          <div className="rounded-full" style={{ width: '36px', height: '4px', background: 'rgba(148, 163, 184, 0.3)' }} />
        </div>
        <ChatContent onClose={onClose} />
      </div>
    </motion.div>
  );
}
