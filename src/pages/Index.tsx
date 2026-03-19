import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import AgeGate from '@/components/AgeGate';
import Dashboard from '@/components/Dashboard';
import { TopicService, type UserProfile } from '@/services/topicService';

const Index = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const handleAgeSubmit = (age: number) => {
    const newProfile = TopicService.createProfile(age);
    setProfile(newProfile);
  };

  return (
    <AnimatePresence mode="wait">
      {!profile ? (
        <AgeGate key="gate" onAgeSubmit={handleAgeSubmit} />
      ) : (
        <Dashboard key="dashboard" profile={profile} />
      )}
    </AnimatePresence>
  );
};

export default Index;
