import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Landing from '@/components/Landing';
import AgeGate from '@/components/AgeGate';
import Dashboard from '@/components/Dashboard';
import { TopicService, type UserProfile } from '@/services/topicService';
import PowerLevelBar from '@/components/PowerLevelBar';

type Screen = 'landing' | 'age-gate' | 'dashboard' | 'loading';

const Index = () => {
  const [screen, setScreen] = useState<Screen>('loading');
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const restoreSession = async () => {
      const existing = await TopicService.getProfile();
      if (existing) {
        setProfile(existing);
        setScreen('dashboard');
      } else {
        setScreen('landing');
      }
    };
    restoreSession();
  }, []);

  const handleAgeSubmit = async (age: number) => {
    const newProfile = await TopicService.createProfile(age);
    setProfile(newProfile);
    setScreen('dashboard');
  };

  if (screen === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <PowerLevelBar />
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {screen === 'landing' && (
        <Landing key="landing" onEnter={() => setScreen('age-gate')} />
      )}
      {screen === 'age-gate' && (
        <AgeGate key="gate" onAgeSubmit={handleAgeSubmit} />
      )}
      {screen === 'dashboard' && profile && (
        <Dashboard key="dashboard" profile={profile} onProfileUpdate={setProfile} />
      )}
    </AnimatePresence>
  );
};

export default Index;
