import { useState, useCallback } from 'react';
import type { Message } from '../types';
import { sendMessage } from '../services/api';
import { useRateLimit } from './useRateLimit';

function createId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const { checkLimit } = useRateLimit();

  const send = useCallback(
    async (content: string) => {
      const trimmed = content.trim();
      if (!trimmed || isTyping) return;

      if (!checkLimit()) {
        const errorMsg: Message = {
          id: createId(),
          role: 'assistant',
          content:
            'Vous envoyez trop de messages. Merci de patienter un instant avant de réessayer.',
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, errorMsg]);
        return;
      }

      const userMsg: Message = {
        id: createId(),
        role: 'user',
        content: trimmed,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsTyping(true);

      try {
        const allMessages = [...messages, userMsg];
        const reply = await sendMessage(allMessages);
        const botMsg: Message = {
          id: createId(),
          role: 'assistant',
          content: reply,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, botMsg]);
      } catch {
        const errorMsg: Message = {
          id: createId(),
          role: 'assistant',
          content:
            'Je suis momentanément indisponible. Contactez contact@studio-auralis.com !',
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setIsTyping(false);
      }
    },
    [messages, isTyping, checkLimit]
  );

  return { messages, isTyping, send };
}
