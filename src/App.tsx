import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { Sidebar, TabType } from './components/Sidebar';
import { Header } from './components/Header';

// Tabler 8.0 Views
import { TablerHomeView } from './views/TablerHomeView';
import { TablerChaptersView } from './views/TablerChaptersView';
import { TablerLabView } from './views/TablerLabView';
import { TablerQuizView } from './views/TablerQuizView';
import { TablerVaultView } from './views/TablerVaultView';
import { TablerPlannerView } from './views/TablerPlannerView';
import { TablerAssistantView } from './views/TablerAssistantView';
import { TablerSourcesView } from './views/TablerSourcesView';

// Comprehensive Curriculum & Scientific Views
import { CurriculumView } from './views/CurriculumView';
import { ExperimentsView } from './views/ExperimentsView';
import { ReflexView } from './views/ReflexView';
import { MinisterialExamView } from './views/MinisterialExamView';
import { FigureStudioView } from './views/FigureStudioView';
import { ExamNightView } from './views/ExamNightView';
import { VoiceCoachView } from './views/VoiceCoachView';
import { OrganSimView } from './views/OrganSimView';
import { GamesView } from './views/GamesView';
import { ParentsView } from './views/ParentsView';

export const AppContent: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [targetChapter, setTargetChapter] = useState<number | undefined>(undefined);
  const [targetPage, setTargetPage] = useState<number | undefined>(undefined);

  const handleNavigateTab = (tab: TabType, params?: { chapter?: number; page?: number }) => {
    setCurrentTab(tab);
    if (params?.chapter !== undefined) setTargetChapter(params.chapter);
    if (params?.page !== undefined) setTargetPage(params.page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderActiveView = () => {
    switch (currentTab) {
      // Tabler 8.0 Primary Views
      case 'home':
        return <TablerHomeView onNavigateTab={handleNavigateTab} />;
      case 'chapters':
        return <TablerChaptersView onNavigateTab={handleNavigateTab} />;
      case 'lab':
      case 'atlas':
        return <TablerLabView initialChapter={targetChapter} />;
      case 'quiz':
        return <TablerQuizView />;
      case 'vault':
        return <TablerVaultView />;
      case 'planner':
        return <TablerPlannerView />;
      case 'assistant':
        return <TablerAssistantView onNavigateTab={handleNavigateTab} />;
      case 'sources':
        return <TablerSourcesView />;

      // Advanced Biology & Research Labs
      case 'curriculum':
        return (
          <CurriculumView
            initialChapter={targetChapter}
            initialPage={targetPage}
            onNavigateToQuiz={() => setCurrentTab('quiz')}
          />
        );
      case 'experiments':
        return <ExperimentsView />;
      case 'reflex':
        return <ReflexView />;
      case 'ministryExam':
        return <MinisterialExamView />;
      case 'figureStudio':
        return <FigureStudioView />;
      case 'examNight':
        return <ExamNightView />;
      case 'voiceCoach':
        return <VoiceCoachView />;
      case 'organSim':
        return <OrganSimView />;
      case 'games':
        return <GamesView />;
      case 'parents':
        return <ParentsView />;
      default:
        return <TablerHomeView onNavigateTab={handleNavigateTab} />;
    }
  };

  return (
    <div className="page d-flex flex-row min-h-screen" style={{ backgroundColor: '#f6f8fb' }}>
      {/* Tabler Vertical Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Page Wrapper */}
      <div className="page-wrapper flex-1 flex flex-col min-w-0">
        <Header
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onNavigateTab={handleNavigateTab}
          currentTab={currentTab}
        />

        <main className="page-body p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full flex-1">
          {renderActiveView()}
        </main>

        <footer className="footer footer-transparent border-t border-[#e6e8eb] py-4 text-center text-xs text-[#868e96]">
          <div className="container-xl flex flex-col sm:flex-row items-center justify-between gap-2 px-4">
            <div>نَبْض · الأحياء للثالث المتوسط · الإصدار 8.0</div>
            <div>
              التصميم المرئي: مكوّنات <b>Tabler</b> الأصلية، والأيقونات من <b>Tabler Icons</b>، والمجسمات من <b>OrganUI</b>.
            </div>
          </div>
        </footer>
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
