import { motion } from 'framer-motion';

interface PowerLevelBarProps {
  label?: string;
}

const PowerLevelBar = ({ label = 'LOADING MISSIONS...' }: PowerLevelBarProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <p className="font-display text-lg text-primary tracking-widest mb-4 animate-power-pulse">
        {label}
      </p>
      <div className="w-64 h-4 border-brutal bg-muted overflow-hidden">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </div>
      <p className="text-muted-foreground font-body text-xs mt-2 tracking-widest">
        CHARGING POWER LEVEL...
      </p>
    </div>
  );
};

export default PowerLevelBar;
