import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TopicService, type EnrichedTopic, type UserProfile } from '@/services/topicService';
import type { Category } from '@/lib/api';
import MissionCard from './MissionCard';
import PowerLevelBar from './PowerLevelBar';
import TopicDetail from './TopicDetail';

interface DashboardProps {
  profile: UserProfile;
}

const CATEGORY_FILTERS: { id: Category | 'all'; label: string; icon: string }[] = [
  { id: 'all', label: 'ALL', icon: '🌀' },
  { id: 'math', label: 'MATH', icon: '🔢' },
  { id: 'physics', label: 'PHYSICS', icon: '⚡' },
  { id: 'science', label: 'SCIENCE', icon: '🧪' },
  { id: 'biology', label: 'BIOLOGY', icon: '🧬' },
];

const Dashboard = ({ profile }: DashboardProps) => {
  const [topics, setTopics] = useState<EnrichedTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<Category | 'all'>('all');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  useEffect(() => {
    loadTopics();
  }, [profile.age]);

  const loadTopics = async () => {
    setLoading(true);
    const data = await TopicService.getAvailableMissions(profile.age);
    setTopics(data);
    setLoading(false);
  };

  const filteredTopics = activeFilter === 'all'
    ? topics
    : topics.filter(t => t.category === activeFilter);

  if (selectedTopic) {
    return (
      <TopicDetail
        topicId={selectedTopic}
        onBack={() => {
          setSelectedTopic(null);
          loadTopics(); // Refresh progress
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background halftone">
      {/* Header */}
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
        className="border-b-[3px] border-foreground/20 bg-background/90 backdrop-blur-sm sticky top-0 z-40"
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-display text-shadow-accent text-foreground">
              KAIZEN ACADEMY
            </h1>
            <p className="font-body text-muted-foreground text-sm">
              {profile.rank} · Age {profile.age}
            </p>
          </div>
          <div className="text-right">
            <p className="font-display text-2xl text-primary">{profile.totalXp} XP</p>
            <p className="font-body text-xs text-muted-foreground tracking-widest">POWER LEVEL</p>
          </div>
        </div>
      </motion.header>

      {/* Category filters */}
      <div className="container mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="flex flex-wrap gap-2 mb-8"
        >
          {CATEGORY_FILTERS.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveFilter(cat.id)}
              className={`px-5 py-2 border-brutal font-display text-sm tracking-widest shadow-brutal-sm impact-press transition-all ${
                activeFilter === cat.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-foreground hover:bg-muted/80'
              }`}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </motion.div>

        {/* Topic grid */}
        {loading ? (
          <PowerLevelBar />
        ) : (
          <>
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-display text-2xl text-foreground text-shadow-primary mb-6"
            >
              {filteredTopics.length} MISSIONS AVAILABLE
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
              {filteredTopics.map((topic, i) => (
                <MissionCard
                  key={topic.id}
                  topic={topic}
                  index={i}
                  onClick={() => setSelectedTopic(topic.id)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
