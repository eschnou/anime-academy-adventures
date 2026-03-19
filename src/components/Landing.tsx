import { motion } from 'framer-motion';

interface LandingProps {
  onEnter: () => void;
}

const FEATURES = [
  { icon: '🔢', title: 'Math', desc: 'Multiplication, fractions, and sacred geometry' },
  { icon: '⚡', title: 'Physics', desc: 'Gravity, energy, and the laws of motion' },
  { icon: '🧪', title: 'Science', desc: 'Atoms, elements, and chemical reactions' },
  { icon: '🧬', title: 'Biology', desc: 'Cells, ecosystems, and the human body' },
];

const Landing = ({ onEnter }: LandingProps) => {
  return (
    <div className="min-h-screen bg-background halftone flex flex-col">
      {/* Decorative lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-px h-full bg-primary/20" />
        <div className="absolute top-0 left-2/4 w-px h-full bg-accent/20" />
        <div className="absolute top-0 left-3/4 w-px h-full bg-primary/20" />
      </div>

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-20 relative z-10">
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
          className="text-center"
        >
          <h1 className="text-6xl md:text-8xl font-display text-shadow-accent text-foreground mb-4">
            KAIZEN ACADEMY
          </h1>
          <p className="text-muted-foreground font-body text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            An anime-themed learning adventure for young ninjas ages 6–14.
            Master math, physics, science, and biology through ranked missions,
            earn XP, and level up your knowledge!
          </p>
        </motion.div>

        {/* Feature cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-14 max-w-3xl w-full"
        >
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1, duration: 0.4 }}
              className="bg-muted border-brutal p-4 shadow-brutal-sm text-center"
            >
              <span className="text-3xl">{f.icon}</span>
              <h3 className="font-display text-primary text-lg mt-2">{f.title}</h3>
              <p className="font-body text-muted-foreground text-xs mt-1">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* How it works */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-14 text-center max-w-xl"
        >
          <h2 className="font-display text-2xl text-foreground text-shadow-primary mb-4">
            HOW IT WORKS
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 font-body text-sm text-muted-foreground">
            <span className="bg-muted border-brutal px-4 py-2 shadow-brutal-sm">1. Enter your age</span>
            <span className="hidden sm:block text-primary font-display">→</span>
            <span className="bg-muted border-brutal px-4 py-2 shadow-brutal-sm">2. Pick a mission</span>
            <span className="hidden sm:block text-primary font-display">→</span>
            <span className="bg-muted border-brutal px-4 py-2 shadow-brutal-sm">3. Earn XP & rank up</span>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.button
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
          onClick={onEnter}
          whileHover={{ rotate: -2 }}
          whileTap={{ x: 4, y: 4 }}
          className="mt-14 px-12 py-5 bg-primary border-brutal-thick font-display text-3xl tracking-widest text-primary-foreground shadow-brutal-lg impact-press hover:-rotate-1 transition-transform"
        >
          ENTER THE ACADEMY
        </motion.button>
      </div>

      {/* Footer */}
      <footer className="border-t-[3px] border-foreground/20 bg-background/90 backdrop-blur-sm relative z-10">
        <div className="container mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 font-body text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Kaizen Academy</p>
          <div className="flex items-center gap-6">
            <a
              href="https://docs.kaizen-academy.example.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              Documentation
            </a>
            <a
              href="mailto:contact@kaizen-academy.example.com"
              className="hover:text-primary transition-colors"
            >
              contact@kaizen-academy.example.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
