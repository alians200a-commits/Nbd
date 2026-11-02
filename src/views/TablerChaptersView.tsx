import React from 'react';
import {
  Activity, ArrowLeft, Bone, BookOpen, Brain, CheckCircle2,
  Dna, Droplets, Eye, FlaskConical, HeartPulse, Microscope,
  ShieldPlus, Wind
} from 'lucide-react';
import { TABLER_CHAPTERS } from '../data/tablerData';
import { useApp } from '../context/AppContext';
import { TabType } from '../components/Sidebar';

interface Props {
  onNavigateTab: (tab: TabType, params?: { chapter?: number }) => void;
}
const icons = [Brain, Bone, Activity, BookOpen, HeartPulse, Wind, Droplets, Dna, Eye, FlaskConical, ShieldPlus];
const colors = ['blue','violet','orange','mint','rose','sky','blue','violet','orange','mint','rose'];
export const TablerChaptersView: React.FC<Props> = ({ onNavigateTab }) => {
  const { state } = useApp();
  const completed = TABLER_CHAPTERS.filter(c => !!state.finishedTopics[String(c.id)]).length;
  return (
    <div className="nabd-course-page">
      <header className="nabd-course-head">
        <span className="nabd-overline">خطوة ورا خطوة</span>
        <h1>رحلتك بفصول الأحياء</h1>
        <p>11 فصلاً حسب فهرس الكتاب العراقي. اختار الدرس حتى تفهمه، وبعدها افتح المجسم المرتبط بيه بالمختبر.</p>
        <div className="nabd-course-overview">
          <CheckCircle2 size={20} aria-hidden="true" />
          <strong>{completed} من 11</strong>
          <span>فصول تمت مراجعتها على هذا الجهاز</span>
        </div>
      </header>
      <ol className="nabd-course-list">
        {TABLER_CHAPTERS.map((ch, i) => {
          const Icon = icons[i];
          const done = !!state.finishedTopics[String(ch.id)];
          return (
            <li key={ch.id} className="nabd-course-row">
              <span className="nabd-course-number" aria-hidden="true">{String(ch.id).padStart(2, '0')}</span>
              <div className={`nabd-course-illustration tone-${colors[i]}`}><Icon size={31} strokeWidth={1.8} aria-hidden="true" /></div>
              <div className="nabd-course-title">
                <span>الفصل {ch.id} · يبدأ من صفحة {ch.page}</span>
                <strong>{ch.name}</strong>
                <p>{ch.desc}</p>
              </div>
              <div className="nabd-course-buttons">
                {done && <span className="nabd-course-done"><CheckCircle2 size={16} aria-hidden="true" /> راجعته</span>}
                <button className="nabd-course-study" onClick={() => onNavigateTab('curriculum', { chapter: ch.id })}>
                  <BookOpen size={17} aria-hidden="true" /> افتح الدرس
                </button>
                <button className="nabd-course-lab" onClick={() => onNavigateTab('lab', { chapter: ch.id })}>
                  <Microscope size={17} aria-hidden="true" /> المختبر
                </button>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
};