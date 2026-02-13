import { useState, useEffect } from 'react';
import type { Message } from '../types';

const WELCOME_MESSAGE: Message = {
  id: 'welcome',
  role: 'assistant',
  content:
    "Bienvenue ! \u{1F680} Je suis l'assistant IA d'Auralis. Comment puis-je vous aider ?",
  timestamp: Date.now(),
};

export function useWelcomeSequence() {
  const [phase, setPhase] = useState<'idle' | 'typing' | 'message' | 'replies'>(
    'idle'
  );

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('typing'), 300);
    const t2 = setTimeout(() => setPhase('message'), 1500);
    const t3 = setTimeout(() => setPhase('replies'), 2000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const isTyping = phase === 'typing';
  const welcomeMessage = phase === 'message' || phase === 'replies' ? WELCOME_MESSAGE : null;
  const showQuickReplies = phase === 'replies';

  return { isTyping, welcomeMessage, showQuickReplies };
}
