import React, { useEffect, useState } from 'react';
import { BookOpen, ClipboardCheck, Home, Microscope, RotateCcw } from 'lucide-react';
import { AppProvider } from './context/AppContext';
import { Sidebar, TabType } from './components/Sidebar';
import { Header } from './components/Header';
import { TablerHomeView } from './views/TablerHomeView';
import { TablerChaptersView } from './views/TablerChaptersView';
import { TablerLabView } from './views/TablerLabView';
import { TablerQuizView } from './views/TablerQuizView';
import { TablerVaultView } from './views/TablerVaultView';
import { TablerPlannerView } from './views/TablerPlannerView';
import { TablerAssistantView } from './views/TablerAssistantView';
import { TablerSourcesView } from './views/TablerSourcesView';
import { CurriculumView } from './views/CurriculumView';
import { ExperimentsView } from './views/ExperimentsView';
import { MembraneSimView } from './views/MembraneSimView';
import { ReflexView } from './views/ReflexView';
import { MinisterialExamView } from './views/MinisterialExamView';
import { FigureStudioView } from './views/FigureStudioView';
import { ExamNightView } from './views/ExamNightView';
import { VoiceCoachView } from './views/VoiceCoachView';
import { OrganSimView } from './views/OrganSimView';
import { GamesView } from './views/GamesView';
import { ParentsView } from './views/ParentsView';
import './styles/student-ui.css';

const mobileTabs = [
  { id:'home', label:'الرئيسية', icon:Home },
  { id:'chapters', label:'الدروس', icon:BookOpen },
  { id:'lab', label:'المختبر', icon:Microscope },
  { id:'quiz', label:'الاختبارات', icon:ClipboardCheck },
  { id:'vault', label:'مراجعتي', icon:RotateCcw },
] as const;

export const AppContent: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [targetChapter, setTargetChapter] = useState<number | undefined>();
  const [targetPage, setTargetPage] = useState<number | undefined>();

  const navigate = (tab: TabType, params?: { chapter?: number; page?: number }) => {
    if (params?.chapter !== undefined) setTargetChapter(params.chapter);
    if (params?.page !== undefined) setTargetPage(params.page);
    setCurrentTab(tab);
    setIsSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  useEffect(() => {
    if (!isSidebarOpen) return;
    const close = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsSidebarOpen(false); };
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, [isSidebarOpen]);

  const activeView = () => {
    switch (currentTab) {
      case 'home': return <TablerHomeView onNavigateTab={navigate} />;
      case 'chapters': return <TablerChaptersView onNavigateTab={navigate} />;
      case 'lab':
      case 'atlas': return <TablerLabView initialChapter={targetChapter} onNavigateTab={navigate} />;
      case 'quiz': return <TablerQuizView />;
      case 'vault': return <TablerVaultView />;
      case 'planner': return <TablerPlannerView />;
      case 'assistant': return <TablerAssistantView onNavigateTab={navigate} />;
      case 'sources': return <TablerSourcesView />;
      case 'membraneSim': return <MembraneSimView />;
      case 'curriculum': return <CurriculumView initialChapter={targetChapter} initialPage={targetPage} onNavigateToQuiz={() => navigate('quiz')} />;
      case 'experiments': return <ExperimentsView />;
      case 'reflex': return <ReflexView />;
      case 'ministryExam': return <MinisterialExamView />;
      case 'figureStudio': return <FigureStudioView />;
      case 'examNight': return <ExamNightView />;
      case 'voiceCoach': return <VoiceCoachView />;
      case 'organSim': return <OrganSimView />;
      case 'games': return <GamesView />;
      case 'parents': return <ParentsView />;
      default: return <TablerHomeView onNavigateTab={navigate} />;
    }
  };

  const selectedNav = currentTab === 'curriculum' ? 'chapters' : currentTab === 'atlas' ? 'lab' : currentTab;

  return (
    <div className="nabd-app-shell" dir="rtl">
      <a href="#nabd-main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-white focus:p-4">تجاوز القائمة إلى المحتوى</a>
      <Sidebar currentTab={currentTab} onSelectTab={navigate} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="nabd-app-content">
        <Header currentTab={currentTab} onNavigateTab={navigate} onToggleSidebar={() => setIsSidebarOpen(open => !open)} />
        <main id="nabd-main" className="nabd-app-main">{activeView()}</main>
        <div className="nabd-app-footnote">نَبْض · تعلم الأحياء خطوة بخطوة · الثالث المتوسط</div>
      </div>
      <nav className="nabd-bottom-nav" aria-label="التنقل الرئيسي على الهاتف">
        {mobileTabs.map(({id,label,icon: Icon}) => (
          <button key={id} className={`nabd-bottom-link ${selectedNav === id ? 'is-active' : ''}`}
            onClick={() => navigate(id)} aria-label={label} aria-current={selectedNav === id ? 'page' : undefined}>
            <Icon strokeWidth={1.9} aria-hidden="true" />
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default function App() {
  return <AppProvider><AppContent /></AppProvider>;
}
