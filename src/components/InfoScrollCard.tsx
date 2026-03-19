import { motion } from 'framer-motion';
import type { InfoScroll } from '@/lib/api';

interface InfoScrollCardProps {
  scroll: InfoScroll;
  index: number;
}

const InfoScrollCard = ({ scroll, index }: InfoScrollCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
      className="bg-card border-brutal shadow-brutal-sm"
    >
      <div className="border-b-[3px] border-card-foreground bg-accent/10 px-4 py-2">
        <h4 className="font-display text-lg text-card-foreground tracking-wider">
          📜 {scroll.title}
        </h4>
      </div>
      <div className="p-4">
        <p className="font-body text-sm text-card-foreground/80 leading-relaxed mb-3">
          {scroll.content}
        </p>
        <div className="border-t-2 border-dashed border-card-foreground/20 pt-3">
          <p className="font-display text-xs text-primary tracking-wider">⚡ FUN FACT</p>
          <p className="font-body text-xs text-card-foreground/60 mt-1 italic">
            {scroll.funFact}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default InfoScrollCard;
