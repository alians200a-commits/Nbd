import React from 'react';
import {
  Home,
  Layers,
  BookOpen,
  FlaskConical,
  Zap,
  HelpCircle,
  Award,
  ShieldAlert,
  Image,
  Moon,
  Calendar,
  Mic,
  Activity,
  Gamepad2,
  Users,
  Compass
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export type TabType =
  | 'home'
  | 'atlas'
  | 'curriculum'
  | 'experiments'
  | 'reflex'
  | 'quiz'
  | 'ministryExam'
  | 'vault'
  | 'figureStudio'
  | 'examNight'
  | 'planner'
  | 'voiceCoach'
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

  const navItems: { id: TabType; label: string; icon: React.ReactNode; badge?: number | string }[] = [
    { id: 'home', label: 'الرئيسية', icon: <Home size={18} /> },
    { id: 'atlas', label: 'الأطلس التشريحي 3D', icon: <Layers size={18} />, badge: '25 مجسماً' },
    { id: 'curriculum', label: 'دروس الكتاب المنهجي', icon: <BookOpen size={18} />, badge: '11 فصلاً' },
    { id: 'experiments', label: 'استوديو الأبحاث والتجارب', icon: <FlaskConical size={18} />, badge: '16 تجربة' },
    { id: 'reflex', label: 'محاكاة المنعكس العصبي', icon: <Zap size={18} /> },
    { id: 'quiz', label: 'الاختبارات والأسئلة الوزارية', icon: <HelpCircle size={18} />, badge: '431 سؤالاً' },
    { id: 'ministryExam', label: 'محاكي الامتحان الوزاري', icon: <Award size={18} /> },
    { id: 'figureStudio', label: 'استوديو الرسوم والمخططات', icon: <Image size={18} />, badge: '18 رسماً' },
    { id: 'vault', label: 'خزنة الأخطاء والمراجعة', icon: <ShieldAlert size={18} />, badge: Object.keys(state.mistakes).length || undefined },
    { id: 'examNight', label: 'مراجعة ليلة الامتحان', icon: <Moon size={18} /> },
    { id: 'organSim', label: 'محاكاة أجهزة الجسم', icon: <Activity size={18} /> },
    { id: 'voiceCoach', label: 'المعلّمة الصوتية والتسميع', icon: <Mic size={18} />, badge: 'صوت B' },
    { id: 'planner', label: 'جدول الدراسة والواجبات', icon: <Calendar size={18} /> },
    { id: 'games', label: 'ألعاب التعلّم والتحدي', icon: <Gamepad2 size={18} /> },
    { id: 'parents', label: 'متابعة الأهل والواجبات', icon: <Users size={18} /> },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed top-0 bottom-0 right-0 z-50 w-72 bg-[#0b1729] border-l border-[#24374b]
        flex flex-col p-4 transition-transform duration-300 overflow-y-auto
        lg:static lg:translate-x-0
        ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand */}
        <div className="flex items-center gap-3 px-2 py-3 mb-4 border-b border-[#1f354c]">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#32e2cc] to-[#468dd8] flex items-center justify-center text-[#052437] font-black text-2xl shadow-lg shadow-[#31bdb333]">
            ن
          </div>
          <div>
            <div className="text-xl font-bold tracking-tight text-[#effbff]">نَبْض</div>
            <div className="text-xs text-[#9ab1c5]">مختبر الأحياء الذكي — V7.8</div>
          </div>
        </div>

        {/* Quick Points Widget */}
        <div className="bg-gradient-to-r from-[#11273f] to-[#0e2136] border border-[#234564] rounded-xl p-3 mb-4 flex items-center justify-between text-xs">
          <div>
            <span className="text-[#9ab1c5] block">رصيد النقاط المعرفية</span>
            <span className="text-lg font-black text-[#f2c575]">{state.points} نقطة</span>
          </div>
          <div className="bg-[#173a56] px-2.5 py-1 rounded-lg text-[#36e0dd] font-bold">
            مستوى متقدم
          </div>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1 flex-1">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onClose();
                }}
                className={`
                  w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all text-right
                  ${isActive
                    ? 'bg-[#153447] text-[#eaffff] border border-[#24636b] shadow-sm shadow-[#24636b44]'
                    : 'text-[#b9d1df] hover:bg-[#11243b] hover:text-[#e0f5fc] border border-transparent'}
                `}
              >
                <div className="flex items-center gap-3">
                  <span className={`${isActive ? 'text-[#36e0dd]' : 'text-[#87a5b8]'}`}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                    isActive ? 'bg-[#265d6b] text-[#86f5e3]' : 'bg-[#182d46] text-[#9cb6c9]'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer Info */}
        <div className="mt-4 pt-3 border-t border-[#1d3348] text-center text-xs text-[#7896aa]">
          <div>منهج الأحياء — الصف الثالث المتوسط</div>
          <div className="text-[10px] text-[#5c7a8e] mt-1">نسخة تفاعلية تعليمية V7.8</div>
        </div>
      </aside>
    </>
  );
};
