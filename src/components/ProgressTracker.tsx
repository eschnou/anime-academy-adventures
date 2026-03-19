import { motion } from 'framer-motion';
import { TopicService, type UserProfile, type ProgressStats } from '@/services/topicService';
import { CATEGORY_COLORS } from './MissionCard';
import type { Category } from '@/lib/api';

interface ProgressTrackerProps {
  profile: UserProfile;
  onBack: () => void;
}

const CATEGORY_ICONS: Record<Category, string> = {
  math: '🔢',
  physics: '⚡',
  science: '🧪',
  biology: '🧬',
};

const TYPE_ICONS: Record<string, string> = {
  'multiple-choice': '🎯',
  'fill-blank': '✏️',
  'true-false': '⚖️',
};

const TYPE_LABELS: Record<string, string> = {
  'multiple-choice': 'Multiple Choice',
  'fill-blank': 'Fill in the Blank',
  'true-false': 'True or False',
};

const RANK_THRESHOLDS = [
  { rank: 'Genin', min: 0, max: 200 },
  { rank: 'Chunin', min: 200, max: 500 },
  { rank: 'Jonin', min: 500, max: Infinity },
];

const ease = [0.34, 1.56, 0.64, 1] as const;

const ProgressTracker = ({ profile, onBack }: ProgressTrackerProps) => {
  const stats: ProgressStats = TopicService.getProgressStats();

  const currentRankInfo = RANK_THRESHOLDS.find(r => r.rank === profile.rank)!;
  const xpInRank = profile.totalXp - currentRankInfo.min;
  const xpRankRange = currentRankInfo.max === Infinity ? 500 : currentRankInfo.max - currentRankInfo.min;
  const rankProgress = Math.min(100, Math.round((xpInRank / xpRankRange) * 100));

  if (stats.totalAttempts === 0) {
    return (
      <div className="min-h-screen bg-background halftone flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease }}
          className="bg-card border-brutal-thick shadow-brutal p-8 max-w-md text-center"
        >
          <div className="text-6xl mb-4">🥷</div>
          <h2 className="font-display text-2xl text-card-foreground text-shadow-primary mb-3">
            NO MISSIONS COMPLETED YET
          </h2>
          <p className="font-body text-card-foreground/70 mb-6">
            Every great ninja starts somewhere. Complete your first mission to begin tracking your progress!
          </p>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-primary text-primary-foreground border-brutal font-display tracking-widest shadow-brutal impact-press"
          >
            ← BACK TO MISSIONS
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background halftone">
      {/* Header */}
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease }}
        className="border-b-[3px] border-foreground/20 bg-background/90 backdrop-blur-sm sticky top-0 z-40"
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="px-4 py-2 bg-muted text-foreground border-brutal font-display text-sm tracking-widest shadow-brutal-sm impact-press"
          >
            ← MISSIONS
          </button>
          <h1 className="text-2xl md:text-3xl font-display text-shadow-accent text-foreground">
            NINJA DOJO
          </h1>
          <div className="w-[100px]" /> {/* Spacer for centering */}
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* 1. Ninja Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5, ease }}
          className="bg-card border-brutal-thick shadow-brutal p-6"
        >
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="text-6xl">🥷</div>
            <div className="flex-1 text-center sm:text-left">
              <p className="font-body text-sm text-card-foreground/60 tracking-widest mb-1">{profile.rank} NINJA</p>
              <p className="font-display text-5xl text-primary">{profile.totalXp} XP</p>
              <p className="font-body text-card-foreground/70 mt-1">
                Overall accuracy: <span className="font-display text-card-foreground">{stats.accuracy}%</span>
              </p>
            </div>
            <div className="text-center">
              <p className="font-display text-sm text-card-foreground/60 mb-1">
                {stats.totalAttempts} ATTEMPTS
              </p>
              <p className="font-display text-sm text-success">
                {stats.correctAttempts} CORRECT
              </p>
            </div>
          </div>
          {/* XP progress bar toward next rank */}
          <div className="mt-5">
            <div className="flex justify-between text-xs font-display text-card-foreground/60 mb-1">
              <span>{profile.rank.toUpperCase()} PROGRESS</span>
              <span>{currentRankInfo.max === Infinity ? `${xpInRank} XP` : `${xpInRank} / ${xpRankRange} XP`}</span>
            </div>
            <div className="h-3 bg-card-foreground/10 border border-card-foreground/30">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${rankProgress}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full bg-primary"
              />
            </div>
          </div>
        </motion.div>

        {/* 2. Category Breakdown */}
        <div>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="font-display text-2xl text-foreground text-shadow-primary mb-4"
          >
            CATEGORY BREAKDOWN
          </motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(['math', 'physics', 'science', 'biology'] as Category[]).map((cat, index) => {
              const catStats = stats.categoryBreakdown[cat];
              return (
                <motion.div
                  key={cat}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.08, duration: 0.5, ease }}
                  className="bg-card border-brutal shadow-brutal overflow-hidden"
                >
                  <div className={`h-2 ${CATEGORY_COLORS[cat]}`} />
                  <div className="p-4">
                    <div className="text-2xl mb-1">{CATEGORY_ICONS[cat]}</div>
                    <h3 className="font-display text-sm text-card-foreground tracking-widest mb-2">
                      {cat.toUpperCase()}
                    </h3>
                    {catStats.attempts > 0 ? (
                      <>
                        <p className="font-display text-xl text-primary">{catStats.accuracy}%</p>
                        <p className="font-body text-xs text-card-foreground/60">
                          {catStats.correct}/{catStats.attempts} correct
                        </p>
                      </>
                    ) : (
                      <p className="font-body text-xs text-card-foreground/40">No attempts yet</p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* 3. Exercise Type Stats */}
        <div>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="font-display text-2xl text-foreground text-shadow-primary mb-4"
          >
            EXERCISE TYPES
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.4 }}
            className="flex flex-wrap gap-3"
          >
            {['multiple-choice', 'fill-blank', 'true-false'].map(type => {
              const typeStats = stats.exerciseTypeBreakdown[type];
              return (
                <div
                  key={type}
                  className="bg-card border-brutal shadow-brutal-sm px-5 py-3 flex items-center gap-3"
                >
                  <span className="text-xl">{TYPE_ICONS[type]}</span>
                  <div>
                    <p className="font-display text-xs tracking-widest text-card-foreground">{TYPE_LABELS[type]}</p>
                    <p className="font-body text-sm text-card-foreground/70">
                      <span className="text-success font-display">{typeStats.correct}</span> / {typeStats.attempts} correct
                    </p>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* 4. Recent Activity Feed */}
        <div className="pb-12">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="font-display text-2xl text-foreground text-shadow-primary mb-4"
          >
            RECENT ACTIVITY
          </motion.h2>
          <div className="space-y-2">
            {stats.recentAttempts.map((attempt, index) => (
              <motion.div
                key={`${attempt.exerciseId}-${attempt.timestamp}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.08, duration: 0.4, ease }}
                className="bg-card border-brutal shadow-brutal-sm p-3 flex items-center gap-3"
              >
                <span className="text-lg">{TYPE_ICONS[attempt.exerciseType]}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-display text-xs tracking-widest text-card-foreground truncate">
                    {attempt.topicId.replace(/-/g, ' ').toUpperCase()}
                  </p>
                  <p className="font-body text-xs text-card-foreground/50">
                    {TYPE_LABELS[attempt.exerciseType]}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 font-display text-xs tracking-widest border-brutal ${
                    attempt.isCorrect
                      ? 'bg-success text-success-foreground'
                      : 'bg-destructive text-destructive-foreground'
                  }`}
                >
                  {attempt.isCorrect ? 'CORRECT' : 'FAILED'}
                </span>
                {attempt.xpEarned > 0 && (
                  <span className="font-display text-sm text-primary">+{attempt.xpEarned} XP</span>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;
