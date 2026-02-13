import { AnimatePresence } from 'framer-motion';
import type { Message } from '../types';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { QuickReplies } from './QuickReplies';
import { useAutoScroll } from '../hooks/useAutoScroll';

interface MessageListProps {
  messages: Message[];
  isTyping: boolean;
  showQuickReplies: boolean;
  onQuickReply: (text: string) => void;
}

export function MessageList({ messages, isTyping, showQuickReplies, onQuickReply }: MessageListProps) {
  const scrollRef = useAutoScroll([messages.length, isTyping]);

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto chat-scrollbar" style={{ padding: '12px 0' }}>
      <div className="flex flex-col gap-3">
        <AnimatePresence mode="popLayout">
          {messages.map((msg, i) => {
            const showAvatar = msg.role === 'assistant' && (i === 0 || messages[i - 1].role !== 'assistant');
            return <MessageBubble key={msg.id} message={msg} showAvatar={showAvatar} index={0} />;
          })}
          {isTyping && <TypingIndicator key="typing" />}
        </AnimatePresence>
        {showQuickReplies && !isTyping && <QuickReplies onSelect={onQuickReply} />}
      </div>
    </div>
  );
}
