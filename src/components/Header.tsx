import React from 'react';
import { Menu, Sparkles, BookOpen, Search, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TabType } from './Sidebar';

interface HeaderProps {
  onToggleSidebar: () => void;
  onNavigateTab: (tab: TabType) => void;
  currentTab: TabType;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, onNavigateTab, currentTab }) => {
  const { state } = useApp();

  const getTabTitle = () => {
    switch (currentTab) {
      case 'home': return 'الرئيسية والمتابعة اليومية';
      case 'atlas': return 'الأطلس التشريحي المرجعي ثلاثي الأبعاد';
      case 'curriculum': return 'دروس ومباحث كتاب الأحياء الوزاري';
      case 'experiments': return 'استوديو الأبحاث والتجارب التفاعلية';
      case 'reflex': return 'محاكاة القوس والمنعكس العصبي';
      case 'quiz': return 'بنك الأسئلة الوزارية والاختبارات';
      case 'ministryExam': return 'محاكي الامتحان الوزاري الشامل';
      case 'figureStudio': return 'استوديو الرسوم والمخططات الوزارية';
      case 'vault': return 'خزنة الأخطاء والمراجعة التكرارية';
      case 'examNight': return 'مراجعة ليلة الامتحان والملخصات المركزة';
      case 'organSim': return 'محاكاة أجهزة الجسم الحيوية';
      case 'voiceCoach': return 'المعلّمة الصوتية الذكية وهندسة الصوت';
      case 'planner': return 'جدول الدراسة والمهام والواجبات';
      case 'games': return 'ألعاب ومسابقات الأحياء العلمية';
      case 'parents': return 'لوحة متابعة أولياء الأمور وتقارير الإنجاز';
      default: return 'نَبْض — مختبر الأحياء';
    }
  };

  const completedTopicsCount = Object.keys(state.finishedTopics).length;

  return (
    <header className="sticky top-0 z-30 bg-[#070f1f]/90 backdrop-blur-md border-b border-[#20374e] px-4 py-3 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl bg-[#11223b] text-[#86e9dc] hover:bg-[#183256] transition"
          aria-label="القائمة"
        >
          <Menu size={20} />
        </button>
        <div>
          <h1 className="text-base sm:text-lg font-bold text-[#effaff] tracking-tight flex items-center gap-2">
            <span>{getTabTitle()}</span>
          </h1>
          <div className="text-xs text-[#829eaf] hidden sm:block">
            جمهورية العراق — وزارة التربية — الأحياء للثالث المتوسط
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Progress badge */}
        <div className="hidden md:flex items-center gap-2 bg-[#0c1f36] border border-[#234360] px-3 py-1.5 rounded-xl text-xs text-[#cbe5ee]">
          <CheckCircle2 size={15} className="text-[#6bf4c7]" />
          <span>الموضوعات المنجزة: <b>{completedTopicsCount}</b> / 58</span>
        </div>

        {/* Quick Launch Atlas */}
        {currentTab !== 'atlas' && (
          <button
            onClick={() => onNavigateTab('atlas')}
            className="flex items-center gap-1.5 bg-[#143d4c] hover:bg-[#1d5265] text-[#7bf0da] text-xs font-bold px-3 py-2 rounded-xl border border-[#296873] transition"
          >
            <Sparkles size={14} />
            <span>الأطلس 3D</span>
          </button>
        )}

        {/* Quick Launch Book */}
        {currentTab !== 'curriculum' && (
          <button
            onClick={() => onNavigateTab('curriculum')}
            className="flex items-center gap-1.5 bg-[#172e48] hover:bg-[#203e61] text-[#9bd9f1] text-xs font-bold px-3 py-2 rounded-xl border border-[#274f74] transition"
          >
            <BookOpen size={14} />
            <span>الكتاب</span>
          </button>
        )}
      </div>
    </header>
  );
};
