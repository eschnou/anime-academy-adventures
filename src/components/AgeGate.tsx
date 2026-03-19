import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AgeGateProps {
  onAgeSubmit: (age: number) => void;
}

const AgeGate = ({ onAgeSubmit }: AgeGateProps) => {
  const [age, setAge] = useState('');
  const [isExploding, setIsExploding] = useState(false);

  const handleSubmit = () => {
    const numAge = parseInt(age);
    if (numAge >= 6 && numAge <= 14) {
      setIsExploding(true);
      setTimeout(() => onAgeSubmit(numAge), 800);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex flex-col items-center justify-center bg-background halftone z-50"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.5 }}
        animate={isExploding ? { opacity: 0, scale: 2 } : { opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
      >
        {/* Decorative lines */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-px h-full bg-primary/20" />
          <div className="absolute top-0 left-2/4 w-px h-full bg-accent/20" />
          <div className="absolute top-0 left-3/4 w-px h-full bg-primary/20" />
          <div className="absolute top-1/4 left-0 w-full h-px bg-accent/10" />
          <div className="absolute top-3/4 left-0 w-full h-px bg-primary/10" />
        </div>

        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
          className="text-center relative z-10"
        >
          <h1 className="text-5xl md:text-7xl font-display text-shadow-accent text-foreground mb-2">
            KAIZEN ACADEMY
          </h1>
          <p className="text-muted-foreground font-body text-lg md:text-xl tracking-wide mb-12">
            CHOOSE YOUR PATH, RECRUIT.
          </p>
        </motion.div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
          className="relative z-10 flex flex-col items-center"
        >
          <label className="font-display text-primary text-xl tracking-widest mb-4">
            ENTER YOUR AGE
          </label>
          <input
            type="number"
            min={6}
            max={14}
            value={age}
            onChange={e => setAge(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="?"
            className="w-48 h-48 text-center text-8xl font-display bg-muted border-brutal-thick text-foreground shadow-brutal-lg focus:outline-none focus:border-primary placeholder:text-muted-foreground/30"
            autoFocus
          />
          <p className="text-muted-foreground text-sm mt-3 font-body">Ages 6–14</p>

          <motion.button
            onClick={handleSubmit}
            disabled={!age || parseInt(age) < 6 || parseInt(age) > 14}
            className="mt-8 px-10 py-4 bg-primary border-brutal-thick font-display text-2xl tracking-widest text-primary-foreground shadow-brutal-lg impact-press hover:-rotate-1 transition-transform disabled:opacity-30 disabled:cursor-not-allowed"
            whileHover={{ rotate: -2 }}
            whileTap={{ x: 4, y: 4 }}
          >
            BEGIN TRAINING ⚔️
          </motion.button>
        </motion.div>

        {/* Bottom decorative text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 1 }}
          className="absolute bottom-6 text-muted-foreground font-body text-xs tracking-[0.3em]"
        >
          力 — THE POWER TO LEARN IS THE POWER TO GROW — 力
        </motion.p>
      </motion.div>
    </AnimatePresence>
  );
};

export default AgeGate;
