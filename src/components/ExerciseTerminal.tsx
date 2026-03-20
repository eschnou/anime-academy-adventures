import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Exercise } from '@/lib/api';
import { TopicService, type ExerciseResult } from '@/services/topicService';

interface ExerciseTerminalProps {
  exercises: Exercise[];
  onComplete: (totalXp: number) => void;
}

const ExerciseTerminal = ({ exercises, onComplete }: ExerciseTerminalProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [fillAnswer, setFillAnswer] = useState('');
  const [result, setResult] = useState<ExerciseResult | null>(null);
  const [totalXp, setTotalXp] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const exercise = exercises[currentIndex];
  if (!exercise) return null;

  const handleSubmit = async () => {
    const answer = exercise.type === 'fill-blank' ? fillAnswer : selectedAnswer;
    if (!answer || submitting) return;

    setSubmitting(true);
    try {
      const res = await TopicService.submitAnswer(exercise, answer);
      setResult(res);
      setShowExplanation(true);
      setTotalXp(prev => prev + res.xpEarned);
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer('');
      setFillAnswer('');
      setResult(null);
      setShowExplanation(false);
    } else {
      onComplete(totalXp);
    }
  };

  const isLast = currentIndex === exercises.length - 1;

  return (
    <div className="bg-background border-brutal halftone">
      {/* Header */}
      <div className="flex items-center justify-between border-b-[3px] border-foreground/30 px-4 py-3">
        <span className="font-display text-sm text-primary tracking-widest">
          MISSION {currentIndex + 1}/{exercises.length}
        </span>
        <span className="font-display text-sm text-accent tracking-wider">
          XP: {totalXp}
        </span>
      </div>

      {/* Exercise */}
      <AnimatePresence mode="wait">
        <motion.div
          key={exercise.id}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.3 }}
          className="p-6"
        >
          <p className="font-body text-xl text-foreground mb-6 leading-relaxed">
            {exercise.question}
          </p>

          {/* Options */}
          {exercise.type === 'fill-blank' ? (
            <input
              type="text"
              value={fillAnswer}
              onChange={e => setFillAnswer(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !result && handleSubmit()}
              disabled={!!result}
              placeholder="Type your answer..."
              className="w-full px-4 py-3 bg-muted border-brutal font-body text-lg text-foreground focus:outline-none focus:border-primary disabled:opacity-50"
              autoFocus
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {exercise.options?.map((option) => {
                let optionStyle = 'bg-muted text-foreground hover:bg-muted/80';
                if (result) {
                  if (option === exercise.correctAnswer) {
                    optionStyle = 'bg-success text-success-foreground';
                  } else if (option === selectedAnswer && !result.isCorrect) {
                    optionStyle = 'bg-destructive text-destructive-foreground';
                  } else {
                    optionStyle = 'bg-muted/50 text-muted-foreground';
                  }
                } else if (option === selectedAnswer) {
                  optionStyle = 'bg-primary text-primary-foreground';
                }

                return (
                  <button
                    key={option}
                    onClick={() => !result && setSelectedAnswer(option)}
                    disabled={!!result}
                    className={`px-4 py-3 border-brutal font-body text-left text-base transition-all impact-press shadow-brutal-sm ${optionStyle} disabled:cursor-default`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          )}

          {/* Result feedback */}
          <AnimatePresence>
            {showExplanation && result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-6 p-4 border-brutal ${result.isCorrect ? 'bg-success/10 border-success' : 'bg-destructive/10 border-destructive'}`}
              >
                <p className={`font-display text-lg tracking-wider ${result.isCorrect ? 'text-success' : 'text-destructive'}`}>
                  {result.message}
                </p>
                {result.xpEarned > 0 && (
                  <p className="font-display text-sm text-primary mt-1">+{result.xpEarned} XP</p>
                )}
                <p className="font-body text-sm text-foreground/70 mt-2">
                  {exercise.explanation}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action buttons */}
          <div className="flex gap-3 mt-6">
            {!result ? (
              <button
                onClick={handleSubmit}
                disabled={(!selectedAnswer && !fillAnswer) || submitting}
                className="px-8 py-3 bg-primary border-brutal font-display text-lg tracking-widest text-primary-foreground shadow-brutal impact-press hover:-rotate-1 transition-transform disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {submitting ? 'SUBMITTING...' : 'SUBMIT ⚔️'}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-8 py-3 bg-accent border-brutal font-display text-lg tracking-widest text-accent-foreground shadow-brutal impact-press hover:rotate-1 transition-transform"
              >
                {isLast ? 'COMPLETE MISSION 🏆' : 'NEXT MISSION →'}
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ExerciseTerminal;
