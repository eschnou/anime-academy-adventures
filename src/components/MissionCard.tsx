import { motion } from 'framer-motion';
import type { EnrichedTopic } from '@/services/topicService';
import type { Category } from '@/lib/api';

interface MissionCardProps {
  topic: EnrichedTopic;
  index: number;
  onClick: () => void;
}

export const CATEGORY_COLORS: Record<Category, string> = {
  math: 'bg-primary text-primary-foreground',
  physics: 'bg-secondary text-secondary-foreground',
  science: 'bg-success text-success-foreground',
  biology: 'bg-accent text-accent-foreground',
};

const MissionCard = ({ topic, index, onClick }: MissionCardProps) => {
  const rotation = index % 2 === 0 ? -1 : 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotate: rotation * 3 }}
      animate={{ opacity: 1, y: 0, rotate: rotation }}
      transition={{
        delay: index * 0.08,
        duration: 0.5,
        ease: [0.34, 1.56, 0.64, 1],
      }}
      onClick={onClick}
      className="group cursor-pointer"
    >
      <div className="relative bg-card border-brutal-thick shadow-brutal impact-press hover:-translate-y-1 transition-transform overflow-hidden">
        {/* Category ribbon */}
        <div className={`absolute top-0 right-0 ${CATEGORY_COLORS[topic.category]} font-display text-xs tracking-widest px-3 py-1 border-b-[3px] border-l-[3px] border-card-foreground`}>
          {topic.category.toUpperCase()}
        </div>

        {/* Difficulty badge */}
        <div className="absolute top-0 left-0 bg-card-foreground text-card font-display text-xs px-2 py-1">
          {topic.difficulty}
        </div>

        {/* Content */}
        <div className="p-5 pt-10">
          <div className="text-4xl mb-2">{topic.icon}</div>
          <h3 className="font-display text-xl text-card-foreground text-shadow-primary mb-2 leading-tight">
            {topic.title}
          </h3>
          <p className="font-body text-sm text-card-foreground/70 leading-relaxed mb-4">
            {topic.description}
          </p>

          {/* Progress bar */}
          <div className="mb-3">
            <div className="flex justify-between text-xs font-display text-card-foreground/60 mb-1">
              <span>PROGRESS</span>
              <span>{topic.progress}%</span>
            </div>
            <div className="h-2 bg-card-foreground/10 border border-card-foreground/30">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${topic.progress}%` }}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <span className="font-body text-xs text-card-foreground/50">
              {topic.missionCount} missions · {topic.xpValue} XP
            </span>
            <span className="font-display text-sm text-primary group-hover:skew-x-2 transition-transform">
              START →
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MissionCard;
