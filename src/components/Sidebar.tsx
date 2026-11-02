import React from 'react';
import {
  Activity, ArrowLeft, BookOpen, Brain, CalendarDays, ChevronDown,
  ClipboardCheck, Dna, FlaskConical, HeartPulse, Home, Library,
  Menu, MessageCircle, Microscope, Moon, NotebookTabs, RotateCcw,
  ScanSearch, ShieldCheck, Sparkles, Users, Volume2, X, Gamepad2,
  Layers3, Search, BookMarked, ScanEye
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export type TabType =
  | 'home' | 'chapters' | 'lab' | 'atlas' | 'quiz' | 'vault'
  | 'planner' | 'assistant' | 'voiceCoach' | 'sources' | 'curriculum'
  | 'experiments' | 'membraneSim' | 'reflex' | 'ministryExam'
  | 'figureStudio' | 'examNight' | 'organSim' | 'games' | 'parents';

interface SidebarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  isOpen: boolean;
  onClose: () => void;
}

const primary = [
  { id: 'home', label: 'الرئيسية', icon: Home },
  { id: 'chapters', label: 'الدروس والفصول', icon: BookOpen },
  { id: 'lab', label: 'المختبر التشريحي', icon: Microscope },
  { id: 'quiz', label: 'اختبر نفسك', icon: ClipboardCheck },
  { id: 'vault', label: 'مراجعة أخطائي', icon: RotateCcw },
] as const;

const other: { id: TabType; label: string; icon: React.ElementType }[] = [
  { id:'curriculum', label:'محتوى الكتاب', icon: BookMarked },
  { id:'planner', label:'جدول الدراسة', icon: CalendarDays },
  { id:'assistant', label:'مساعد الأحياء', icon: MessageCircle },
  { id:'voiceCoach', label:'التدريب الصوتي', icon: Volume2 },
  { id:'examNight', label:'ليلة الامتحان', icon: Moon },
  { id:'ministryExam', label:'تدريب الأسئلة الوزارية', icon: NotebookTabs },
  { id:'games', label:'الألعاب التعليمية', icon: Gamepad2 },
  { id:'membraneSim', label:'الغشاء الخلوي', icon: Layers3 },
  { id:'reflex', label:'المنعكس العصبي', icon: Brain },
  { id:'organSim', label:'محاكاة الأعضاء', icon: HeartPulse },
  { id:'experiments', label:'أنشطة وتجارب', icon: FlaskConical },
  { id:'figureStudio', label:'الرسوم العلمية', icon: ScanEye },
  { id:'sources', label:'مصادر الدراسة', icon: Library },
  { id:'parents', label:'متابعة ولي الأمر', icon: Users },
];

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab, isOpen, onClose }) => {
  const { state } = useApp();
  const openTab = (tab: TabType) => { onSelectTab(tab); onClose(); };

  return (
    <>
      {isOpen && <button type="button" className="nabd-drawer-backdrop" onClick={onClose} aria-label="إغلاق القائمة" />}
      <aside className={`nabd-sidebar ${isOpen ? 'is-open' : ''}`} aria-label="قائمة التنقل">
        <div className="nabd-sidebar-head">
          <button className="nabd-brand" onClick={() => openTab('home')} aria-label="نَبْض — الرئيسية">
            <span className="nabd-brand-symbol"><Activity size={26} strokeWidth={2.2} aria-hidden="true" /></span>
            <span><strong>نَبْض</strong><small>الأحياء تصير أوضح</small></span>
          </button>
          <button className="nabd-close-drawer" onClick={onClose} aria-label="إغلاق القائمة"><X size={24} /></button>
        </div>
        <div className="nabd-sidebar-inner">
          <p className="nabd-nav-caption">مسار التعلّم</p>
          <nav className="nabd-side-nav" aria-label="الأقسام الرئيسية">
            {primary.map(({id,label,icon: Icon}) => {
              const active = currentTab === id || (id === 'chapters' && currentTab === 'curriculum') || (id === 'lab' && currentTab === 'atlas');
              return (
                <button key={id} className={`nabd-side-link ${active ? 'is-active' : ''}`}
                  aria-current={active ? 'page' : undefined} onClick={() => openTab(id)}>
                  <Icon size={23} strokeWidth={1.9} aria-hidden="true" />
                  <span>{label}</span>
                  {id === 'vault' && Object.keys(state.mistakes).length > 0 && (
                    <span className="nabd-side-count">{Object.keys(state.mistakes).length}</span>
                  )}
                </button>
              );
            })}
          </nav>
          <details className="nabd-more-details">
            <summary><span><Sparkles size={20} aria-hidden="true" /> أقسام ثانية</span><ChevronDown size={18} aria-hidden="true" /></summary>
            <nav className="nabd-side-nav" aria-label="الأقسام الإضافية">
              {other.map(({ id, label, icon: Icon }) => (
                <button key={id} className={`nabd-side-link ${currentTab === id ? 'is-active' : ''}`}
                  aria-current={currentTab === id ? 'page' : undefined} onClick={() => openTab(id)}>
                  <Icon size={21} strokeWidth={1.85} aria-hidden="true" /><span>{label}</span>
                </button>
              ))}
            </nav>
          </details>
        </div>
        <div className="nabd-sidebar-footer">
          <span className="nabd-footer-icon"><ShieldCheck size={20} aria-hidden="true" /></span>
          <p><strong>تعلّم على راحتك</strong><small>التقدّم محفوظ محلياً على هذا الجهاز</small></p>
        </div>
      </aside>
    </>
  );
};