import React from 'react';
import { BookOpen, Menu, RotateCcw, HelpCircle, Activity } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TabType } from './Sidebar';

interface HeaderProps {
  onToggleSidebar: () => void;
  onNavigateTab: (tab: TabType, params?: { chapter?: number; page?: number }) => void;
  currentTab: TabType;
}
const titles: Partial<Record<TabType,string>> = {
  home:'الرئيسية',chapters:'فصول الأحياء',curriculum:'دروسي',
  lab:'المختبر التشريحي',atlas:'المختبر التشريحي',
  quiz:'اختبر نفسك',vault:'مراجعة أخطائي',planner:'جدول المراجعة',
  assistant:'مساعد الأحياء',voiceCoach:'التدريب الصوتي',sources:'مصادر الدراسة',
  membraneSim:'محاكاة الغشاء',reflex:'المنعكس العصبي',organSim:'محاكاة الأعضاء',
  experiments:'التجارب العلمية',ministryExam:'تدريب الوزاري',
  figureStudio:'الرسوم العلمية',examNight:'ليلة الامتحان',games:'الألعاب',parents:'متابعة الأهل'
};

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, onNavigateTab, currentTab }) => {
  const { state } = useApp();
  const mistakes = Object.keys(state.mistakes).length;
  return (
    <header className="nabd-topbar">
      <div className="nabd-topbar-heading">
        <button className="nabd-menu-button" onClick={onToggleSidebar} aria-label="فتح قائمة الأقسام"><Menu size={24} /></button>
        <div className="nabd-topbar-text"><small>نَبْض / الأحياء للثالث المتوسط</small><strong>{titles[currentTab] || 'الدروس'}</strong></div>
      </div>
      <div className="nabd-topbar-actions">
        <button className="nabd-topbar-help" onClick={() => onNavigateTab('assistant')} aria-label="افتح مساعد الأحياء">
          <HelpCircle size={21} aria-hidden="true" />
          <span>مساعدة</span>
        </button>
        <button className="nabd-review-shortcut" onClick={() => onNavigateTab('vault')} aria-label={`مراجعة أخطائي، عددها ${mistakes}`}>
          <RotateCcw size={20} aria-hidden="true" />
          <span className="nabd-review-shortcut-label">المراجعة</span>
          {mistakes > 0 && <span className="nabd-review-bubble">{mistakes}</span>}
        </button>
      </div>
    </header>
  );
};