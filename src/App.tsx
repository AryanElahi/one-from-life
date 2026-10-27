import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LandingView } from './components/LandingView';
import { OneView } from './components/OneView';
import { WanderView } from './components/WanderView';
import { ExploreView } from './components/ExploreView';
import { JourneyView } from './components/JourneyView';
import { PreviousLessonsView } from './components/PreviousLessonsView';
import { ModerationView } from './components/ModerationView';
import { ShareYoursModal } from './components/ShareYoursModal';
import { ReflectModal } from './components/ReflectModal';
import { ShareCardModal } from './components/ShareCardModal';
import { ReportModal } from './components/ReportModal';
import { AuthModal } from './components/AuthModal';
import { SettingsModal } from './components/SettingsModal';
import { Toast } from './components/Toast';

const AppContent: React.FC = () => {
  const { activeView, setActiveView, setShareCardLesson } = useApp();

  // Check URL hashtag on initial load
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#lesson-')) {
      const lessonId = hash.replace('#lesson-', '');
      fetch(`/api/lessons/${lessonId}`)
        .then(res => res.json())
        .then(data => {
          if (data.lesson) {
            setShareCardLesson(data.lesson);
          }
        })
        .catch(err => console.error(err));
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] dark:bg-[#121211] text-[#191918] dark:text-[#EDE8DF] selection:bg-[#191918] dark:selection:bg-[#EDE8DF] selection:text-[#FAF8F5] dark:selection:text-[#121211] transition-colors duration-300">
      <Header />

      <main className="flex-1">
        {activeView === 'landing' && <LandingView />}
        {activeView === 'one' && <OneView />}
        {activeView === 'wander' && <WanderView />}
        {activeView === 'explore' && <ExploreView />}
        {activeView === 'previous' && <PreviousLessonsView />}
        {activeView === 'journey' && <JourneyView />}
        {activeView === 'moderation' && <ModerationView />}
      </main>

      <Footer />

      {/* Global Modals & Notifications */}
      <ShareYoursModal />
      <ReflectModal />
      <ShareCardModal />
      <ReportModal />
      <AuthModal />
      <SettingsModal />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
