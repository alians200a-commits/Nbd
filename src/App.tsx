import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { Sidebar, TabType } from './components/Sidebar';
import { Header } from './components/Header';
import { HomeView } from './views/HomeView';
import { AtlasView } from './views/AtlasView';
import { CurriculumView } from './views/CurriculumView';
import { ExperimentsView } from './views/ExperimentsView';
import { ReflexView } from './views/ReflexView';
import { QuizView } from './views/QuizView';
import { MinisterialExamView } from './views/MinisterialExamView';
import { FigureStudioView } from './views/FigureStudioView';
import { VaultView } from './views/VaultView';
import { ExamNightView } from './views/ExamNightView';
import { VoiceCoachView } from './views/VoiceCoachView';
import { OrganSimView } from './views/OrganSimView';
import { PlannerView } from './views/PlannerView';
import { GamesView } from './views/GamesView';
import { ParentsView } from './views/ParentsView';

export const AppContent: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [targetChapter, setTargetChapter] = useState<number | undefined>(undefined);
  const [targetPage, setTargetPage] = useState<number | undefined>(undefined);
  const [targetTopicQuiz, setTargetTopicQuiz] = useState<string | undefined>(undefined);

  const handleNavigateTab = (tab: TabType, params?: { chapter?: number; page?: number }) => {
    setCurrentTab(tab);
    if (params?.chapter) setTargetChapter(params.chapter);
    if (params?.page) setTargetPage(params.page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderActiveView = () => {
    switch (currentTab) {
      case 'home':
        return <HomeView onNavigateTab={handleNavigateTab} />;
      case 'atlas':
        return (
          <AtlasView
            onNavigateToPage={(page) => handleNavigateTab('curriculum', { page })}
          />
        );
      case 'curriculum':
        return (
          <CurriculumView
            initialChapter={targetChapter}
            initialPage={targetPage}
            onNavigateToQuiz={(topicQuiz) => {
              setTargetTopicQuiz(topicQuiz);
              setCurrentTab('quiz');
            }}
          />
        );
      case 'experiments':
        return <ExperimentsView />;
      case 'reflex':
        return <ReflexView />;
      case 'quiz':
        return <QuizView initialTopicId={targetTopicQuiz} />;
      case 'ministryExam':
        return <MinisterialExamView />;
      case 'figureStudio':
        return <FigureStudioView />;
      case 'vault':
        return <VaultView />;
      case 'examNight':
        return <ExamNightView />;
      case 'voiceCoach':
        return <VoiceCoachView />;
      case 'organSim':
        return <OrganSimView />;
      case 'planner':
        return (
          <PlannerView
            onNavigateToPage={(page) => handleNavigateTab('curriculum', { page })}
          />
        );
      case 'games':
        return <GamesView />;
      case 'parents':
        return <ParentsView />;
      default:
        return <HomeView onNavigateTab={handleNavigateTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#070f1f] text-[#effbff] flex flex-col lg:flex-row font-['Tahoma','Noto_Sans_Arabic','Arial',sans-serif]">
      {/* Sidebar navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Header
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onNavigateTab={handleNavigateTab}
          currentTab={currentTab}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {renderActiveView()}
        </main>
      </div>
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
