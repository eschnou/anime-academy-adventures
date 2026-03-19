import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Topic, Exercise, InfoScroll } from '@/lib/api';
import { TopicService } from '@/services/topicService';
import ExerciseTerminal from './ExerciseTerminal';
import InfoScrollCard from './InfoScrollCard';
import PowerLevelBar from './PowerLevelBar';

interface TopicDetailProps {
  topicId: string;
  onBack: () => void;
}

const TopicDetail = ({ topicId, onBack }: TopicDetailProps) => {
  const [topic, setTopic] = useState<Topic | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [scrolls, setScrolls] = useState<InfoScroll[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'exercises' | 'scrolls'>('exercises');
  const [missionComplete, setMissionComplete] = useState(false);
  const [earnedXp, setEarnedXp] = useState(0);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await TopicService.getTopicDetail(topicId);
      setTopic(data.topic);
      setExercises(data.exercises);
      setScrolls(data.scrolls);
      setLoading(false);
    };
    load();
  }, [topicId]);

  if (loading) return <PowerLevelBar label="DECRYPTING SCROLL..." />;
  if (!topic) return null;

  return (
    <div className="min-h-screen bg-background halftone">
      {/* Header */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
        className="border-b-[3px] border-foreground/20 bg-background/90 backdrop-blur-sm sticky top-0 z-40"
      >
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={onBack}
            className="font-display text-sm text-primary tracking-widest hover:text-accent transition-colors mb-2"
          >
            ← BACK TO MISSIONS
          </button>
          <div className="flex items-center gap-4">
            <span className="text-5xl">{topic.icon}</span>
            <div>
              <h1 className="text-2xl md:text-3xl font-display text-foreground text-shadow-accent">
                {topic.title}
              </h1>
              <p className="font-body text-muted-foreground text-sm">
                {topic.difficulty} · {topic.category.toUpperCase()} · {topic.missionCount} missions
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('exercises')}
            className={`px-6 py-3 border-brutal font-display text-base tracking-widest shadow-brutal-sm impact-press transition-all ${
              activeTab === 'exercises'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-foreground'
            }`}
          >
            ⚔️ EXERCISES
          </button>
          <button
            onClick={() => setActiveTab('scrolls')}
            className={`px-6 py-3 border-brutal font-display text-base tracking-widest shadow-brutal-sm impact-press transition-all ${
              activeTab === 'scrolls'
                ? 'bg-accent text-accent-foreground'
                : 'bg-muted text-foreground'
            }`}
          >
            📜 SCROLLS
          </button>
        </div>

        {/* Content */}
        {activeTab === 'exercises' ? (
          missionComplete ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
              className="text-center py-16"
            >
              <p className="text-7xl mb-4">🏆</p>
              <h2 className="font-display text-4xl text-primary text-shadow-accent mb-2">
                MISSION COMPLETE!
              </h2>
              <p className="font-display text-2xl text-accent mb-6">+{earnedXp} XP EARNED</p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => { setMissionComplete(false); setEarnedXp(0); }}
                  className="px-8 py-3 bg-primary border-brutal font-display text-lg tracking-widest text-primary-foreground shadow-brutal impact-press"
                >
                  RETRY MISSION
                </button>
                <button
                  onClick={onBack}
                  className="px-8 py-3 bg-accent border-brutal font-display text-lg tracking-widest text-accent-foreground shadow-brutal impact-press"
                >
                  BACK TO BASE
                </button>
              </div>
            </motion.div>
          ) : (
            <ExerciseTerminal
              exercises={exercises}
              onComplete={(xp) => {
                setEarnedXp(xp);
                setMissionComplete(true);
              }}
            />
          )
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {scrolls.map((scroll, i) => (
              <InfoScrollCard key={scroll.id} scroll={scroll} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TopicDetail;
