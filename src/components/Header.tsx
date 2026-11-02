import React, { useState } from 'react';
import { TablerIcon } from './TablerIcon';
import { useApp } from '../context/AppContext';
import { TabType } from './Sidebar';

interface HeaderProps {
  onToggleSidebar: () => void;
  onNavigateTab: (tab: TabType, params?: any) => void;
  currentTab: TabType;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, onNavigateTab, currentTab }) => {
  const { state } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const getBreadcrumbTitle = () => {
    switch (currentTab) {
      case 'home': return 'الرئيسية';
      case 'chapters': return 'فصول المنهج';
      case 'lab': return 'المختبر التشريحي';
      case 'quiz': return 'الاختبارات';
      case 'vault': return 'خزنة الأخطاء';
      case 'planner': return 'المراجعة الذكية';
      case 'assistant': return 'المعلّمة الذكية';
      case 'sources': return 'المصادر';
      case 'curriculum': return 'الكتاب المنهجي';
      case 'experiments': return 'استوديو التجارب';
      case 'reflex': return 'محاكاة المنعكس';
      case 'ministryExam': return 'محاكي الامتحان الوزاري';
      case 'figureStudio': return 'استوديو الرسوم';
      case 'examNight': return 'ليلة الامتحان';
      case 'organSim': return 'محاكاة الأعضاء';
      case 'games': return 'ألعاب التعلّم';
      case 'parents': return 'متابعة الأهل';
      default: return 'الرئيسية';
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    onNavigateTab('chapters');
  };

  const mistakesDue = Object.keys(state.mistakes).length;

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-[#e6e8eb] px-4 py-2.5 flex items-center justify-between gap-3 shadow-sm">
      <div className="flex items-center gap-3">
        {/* Mobile toggler */}
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-1.5 rounded-lg border border-[#e6e8eb] text-[#182433] hover:bg-[#f8fafc]"
          aria-label="فتح القائمة"
        >
          <TablerIcon name="home" size={20} />
        </button>

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#868e96] hidden sm:inline">الأحياء · الثالث المتوسط</span>
          <span className="text-[#868e96] hidden sm:inline">/</span>
          <strong className="text-[#182433] text-sm">{getBreadcrumbTitle()}</strong>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Search bar */}
        <form onSubmit={handleSearch} className="hidden sm:flex items-center">
          <div className="relative">
            <input
              type="search"
              placeholder="ابحث عن فصل أو جهاز..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#f8fafc] border border-[#dce1e7] rounded-xl px-8 py-1.5 text-xs text-[#182433] placeholder-[#868e96] focus:outline-none focus:border-[#0054a6] w-48 transition-all"
            />
            <span className="absolute right-2.5 top-2 text-[#868e96] pointer-events-none">
              <TablerIcon name="search" size={14} />
            </span>
          </div>
        </form>

        {/* Reminders / Vault shortcut button */}
        <button
          onClick={() => onNavigateTab('vault')}
          className="btn btn-icon border border-[#0054a6] text-[#0054a6] hover:bg-[#e6f4fe] p-1.5 rounded-xl transition relative"
          title={`المراجعات المستحقة (${mistakesDue})`}
          aria-label="المراجعات المستحقة"
        >
          <TablerIcon name="calendar-event" size={18} />
          {mistakesDue > 0 && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#d63939] rounded-full ring-2 ring-white" />
          )}
        </button>

        {/* Student Avatar */}
        <span
          className="w-8 h-8 rounded-full bg-[#e6f4fe] text-[#0054a6] font-bold text-xs flex items-center justify-center border border-[#b8e2fb]"
          aria-label="وضع الطالب"
        >
          ط
        </span>
      </div>
    </header>
  );
};
