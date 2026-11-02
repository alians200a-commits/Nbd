import React from 'react';
import { TablerIcon } from './TablerIcon';
import { useApp } from '../context/AppContext';

export type TabType =
  | 'home'
  | 'chapters'
  | 'lab'
  | 'atlas'
  | 'quiz'
  | 'vault'
  | 'planner'
  | 'assistant'
  | 'voiceCoach'
  | 'sources'
  | 'curriculum'
  | 'experiments'
  | 'reflex'
  | 'ministryExam'
  | 'figureStudio'
  | 'examNight'
  | 'organSim'
  | 'games'
  | 'parents';

interface SidebarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab, isOpen, onClose }) => {
  const { state } = useApp();

  const primaryItems: { id: TabType; label: string; icon: string; badge?: number | string }[] = [
    { id: 'home', label: 'الرئيسية', icon: 'home' },
    { id: 'chapters', label: 'فصول المنهج', icon: 'book' },
    { id: 'lab', label: 'المختبر التشريحي', icon: 'flask-2', badge: '14 مجسماً' },
    { id: 'quiz', label: 'الاختبارات', icon: 'clipboard-check' },
    { id: 'vault', label: 'خزنة الأخطاء', icon: 'bookmark', badge: Object.keys(state.mistakes).length || undefined },
    { id: 'planner', label: 'المراجعة الذكية', icon: 'calendar-event' },
    { id: 'assistant', label: 'المعلّمة الذكية', icon: 'message-chatbot' },
    { id: 'sources', label: 'المصادر', icon: 'search' },
  ];

  const advancedItems: { id: TabType; label: string; icon: string }[] = [
    { id: 'curriculum', label: 'الكتاب المنهجي (132 ص)', icon: 'book' },
    { id: 'experiments', label: 'الأبحاث والتجارب (16)', icon: 'flask-2' },
    { id: 'reflex', label: 'محاكاة المنعكس العصبي', icon: 'brain' },
    { id: 'ministryExam', label: 'محاكي الامتحان الوزاري', icon: 'clipboard-check' },
    { id: 'figureStudio', label: 'استوديو الرسوم (18)', icon: 'book' },
    { id: 'examNight', label: 'مراجعة ليلة الامتحان', icon: 'bookmark' },
    { id: 'organSim', label: 'محاكاة أجهزة الجسم', icon: 'heart' },
    { id: 'games', label: 'ألعاب التعلّم', icon: 'brain' },
    { id: 'parents', label: 'متابعة الأهل والتقارير', icon: 'calendar-event' },
  ];

  const mistakesDueCount = Object.keys(state.mistakes).length;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed top-0 bottom-0 right-0 z-50 w-64 bg-white border-l border-[#e6e8eb]
        flex flex-col transition-transform duration-300 overflow-y-auto
        lg:static lg:translate-x-0
        ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      `}>
        {/* Tabler Navbar Brand */}
        <div className="p-4 border-b border-[#f1f3f5] flex items-center justify-between">
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              onSelectTab('home');
              onClose();
            }}
            className="flex items-center gap-2.5 text-decoration-none"
          >
            <span className="w-9 h-9 rounded-xl bg-[#0054a6] text-white flex items-center justify-center font-black shadow-sm">
              <TablerIcon name="heart" size={20} />
            </span>
            <span className="font-extrabold text-xl text-[#182433] tracking-tight">نَبْض</span>
            <span className="badge bg-[#e6f4fe] text-[#0054a6] text-[10px] px-1.5 py-0.5 rounded font-mono">V8.0</span>
          </a>
        </div>

        {/* Tabler Navigation List */}
        <div className="p-3 flex-1 space-y-4">
          <div>
            <div className="px-3 text-xs font-bold text-[#868e96] uppercase tracking-wider mb-2">
              دراستي
            </div>
            <ul className="space-y-1 p-0 m-0 list-none">
              {primaryItems.map((item) => {
                const isActive = currentTab === item.id;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        onSelectTab(item.id);
                        onClose();
                      }}
                      className={`
                        w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition text-right
                        ${isActive
                          ? 'bg-[#0054a6] text-white font-bold shadow-sm'
                          : 'text-[#182433] hover:bg-[#f8fafc]'}
                      `}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={isActive ? 'text-white' : 'text-[#626976]'}>
                          <TablerIcon name={item.icon} size={18} />
                        </span>
                        <span>{item.label}</span>
                      </div>
                      {item.id === 'vault' ? (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          isActive ? 'bg-white/20 text-white' : 'bg-[#ffeceb] text-[#d63939]'
                        }`}>
                          {mistakesDueCount}
                        </span>
                      ) : item.badge ? (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                          isActive ? 'bg-white/20 text-white' : 'bg-[#f1f3f5] text-[#868e96]'
                        }`}>
                          {item.badge}
                        </span>
                      ) : null}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Advanced Labs Section */}
          <div className="pt-2 border-t border-[#f1f3f5]">
            <div className="px-3 text-xs font-bold text-[#868e96] uppercase tracking-wider mb-2">
              المختبر التفاعلي المتقدم
            </div>
            <ul className="space-y-1 p-0 m-0 list-none">
              {advancedItems.map((item) => {
                const isActive = currentTab === item.id;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        onSelectTab(item.id);
                        onClose();
                      }}
                      className={`
                        w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium transition text-right
                        ${isActive
                          ? 'bg-[#e6f4fe] text-[#0054a6] font-bold'
                          : 'text-[#495057] hover:bg-[#f8fafc]'}
                      `}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={isActive ? 'text-[#0054a6]' : 'text-[#868e96]'}>
                          <TablerIcon name={item.icon} size={16} />
                        </span>
                        <span>{item.label}</span>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Tabler Open Source Provenance Notice */}
        <div className="p-3 border-t border-[#f1f3f5] bg-[#fbfcfd] text-[11px] text-[#868e96] leading-relaxed">
          <div className="font-bold text-[#495057] mb-1">مصدر التصميم:</div>
          واجهة مبنية على مكوّنات Tabler الأصلية وأيقونات Tabler Icons من GitHub.
        </div>
      </aside>
    </>
  );
};
