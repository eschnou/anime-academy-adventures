import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Landing from '@/components/Landing';
import AgeGate from '@/components/AgeGate';
import Dashboard from '@/components/Dashboard';
import { TopicService, type UserProfile } from '@/services/topicService';

type Screen = 'landing' | 'age-gate' | 'dashboard';

const Index = () => {
  const [screen, setScreen] = useState<Screen>('landing');
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const handleAgeSubmit = (age: number) => {
    const newProfile = TopicService.createProfile(age);
    setProfile(newProfile);
    setScreen('dashboard');
  };

  return (
    <AnimatePresence mode="wait">
      {screen === 'landing' && (
        <Landing key="landing" onEnter={() => setScreen('age-gate')} />
      )}
      {screen === 'age-gate' && (
        <AgeGate key="gate" onAgeSubmit={handleAgeSubmit} />
      )}
      {screen === 'dashboard' && profile && (
        <Dashboard key="dashboard" profile={profile} />
      )}
    </AnimatePresence>
  );
};

export default Index;
