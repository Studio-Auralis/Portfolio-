import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ChatButton } from './ChatButton';
import { ChatPanel, ChatPanelMobile } from './ChatPanel';

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const handleClose = useCallback(() => setIsOpen(false), []);
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, handleClose]);

  return (
    <>
      <AnimatePresence>
        {isOpen && (isMobile
          ? <ChatPanelMobile key="panel-mobile" onClose={handleClose} />
          : <ChatPanel key="panel" onClose={handleClose} />
        )}
      </AnimatePresence>
      <ChatButton isOpen={isOpen} onClick={() => setIsOpen((o) => !o)} />
    </>
  );
}
