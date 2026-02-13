import { motion } from 'framer-motion';

interface QuickRepliesProps {
  onSelect: (text: string) => void;
}

const QUICK_REPLIES = [
  'Vos services',
  'Voir les projets',
  'Me contacter',
];

export function QuickReplies({ onSelect }: QuickRepliesProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-wrap gap-2 px-4 mt-2"
    >
      {QUICK_REPLIES.map((text, i) => (
        <motion.button
          key={text}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(text)}
          className="cursor-pointer relative overflow-hidden rounded-full px-4 py-2 text-sm transition-colors"
          style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: 500, color: '#e2e8f0', background: 'transparent', border: '1px solid rgba(14, 165, 233, 0.2)' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'linear-gradient(135deg, rgba(14,165,233,0.12), rgba(52,211,153,0.08))'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(14, 165, 233, 0.35)'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(14, 165, 233, 0.2)'; }}
        >
          {text}
        </motion.button>
      ))}
    </motion.div>
  );
}
