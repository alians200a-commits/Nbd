import React from 'react';
import { useApp } from '../context/AppContext';
import { TABLER_CHAPTERS } from '../data/tablerData';
import { BiologySymbolIcon } from '../components/BiologySymbolIcon';
import { TabType } from '../components/Sidebar';
import {
  ArrowLeft, BookOpen, Brain, Bone, CheckCircle2, ClipboardCheck,
  Dna, Droplets, Eye, FlaskConical, HeartPulse, Microscope,
  RotateCcw, ShieldPlus, Sparkles, Wind, BookMarked,
  Play, CalendarDays, Volume2, Activity
} from 'lucide-react';

interface Props {
  onNavigateTab: (tab: TabType, params?: { chapter?: number }) => void;
}

const anatomySymbols = ['nerve','skeleton','arm','intestine','blood-vessel','lungs'] as const;
const palettes = ['blue','violet','orange','mint','rose','sky','blue','violet','orange','mint','rose'];

export const TablerHomeView: React.FC<Props> = ({ onNavigateTab }) => {
  const { state } = useApp();
  const completedChapters = TABLER_CHAPTERS.filter(ch => !!state.finishedTopics[String(ch.id)]);
  const count = completedChapters.length;
  const nextChapter = TABLER_CHAPTERS.find(ch => !state.finishedTopics[String(ch.id)]) ?? TABLER_CHAPTERS[0];
  const mistakes = Object.keys(state.mistakes).length;
  const unfinished = state.homework.filter(h => !h.done);
  const percent = Math.round(count / TABLER_CHAPTERS.length * 100);

  const actions = [
    {
      title: 'افهم الدرس', description: 'شرح مرتب فصل بعد فصل',
      label: 'افتح الدروس', icon: BookOpen, tone: 'blue', tab: 'curriculum' as TabType
    },
    {
      title: 'ادخل المختبر', description: 'شوف تركيب العضو وجرّب بنفسك',
      label: 'افتح المختبر', icon: Microscope, tone: 'mint', tab: 'lab' as TabType
    },
    {
      title: 'اختبر فهمك', description: 'أسئلة تدريبية مع توضيح الإجابة',
      label: 'ابدأ الاختبار', icon: ClipboardCheck, tone: 'violet', tab: 'quiz' as TabType
    },
    {
      title: 'راجع أخطاءك', description: mistakes ? `${mistakes} سؤال يحتاج مراجعة` : 'ثبّت اللي تعلّمته أول بأول',
      label: 'افتح المراجعة', icon: RotateCcw, tone: 'amber', tab: 'vault' as TabType
    },
  ];

  return (
    <div className="nabd-student-home">
      <section className="nabd-welcome" aria-labelledby="welcome-heading">
        <div className="nabd-welcome-copy">
          <div className="nabd-eyebrow"><Sparkles size={17} aria-hidden="true" /> رفيقك في أحياء الثالث المتوسط</div>
          <h1 id="welcome-heading">هلا بيك! <span>شنو ندرس اليوم؟</span></h1>
          <p>نفهم الفكرة أول، نشوفها بالمختبر، وبعدها نختبر نفسنا. كلشي خطوة بخطوة ومن دون زحمة.</p>
          <button className="nabd-primary-button" onClick={() => onNavigateTab('curriculum', { chapter: nextChapter.id })}>
            <BookOpen size={20} aria-hidden="true" />
            <span>{count ? 'كمل دراسة الفصل التالي' : 'يلا نبدأ أول درس'}</span>
            <ArrowLeft size={19} aria-hidden="true" />
          </button>
        </div>
        <div className="nabd-hero-visual" aria-label="رمز الدماغ والجهاز العصبي">
          <div className="nabd-anatomy-picture"><Brain size={106} strokeWidth={1.15} aria-hidden="true" /></div>
          <div className="nabd-hero-caption"><Activity size={17} aria-hidden="true" /> أحياء نفهمها، مو بس نحفظها</div>
        </div>
      </section>

      <section className="nabd-learning-layout" aria-label="رحلتك الدراسية">
        <div className="nabd-section-block">
          <div className="nabd-section-heading">
            <div><span className="nabd-overline">مسارك اليومي</span><h2>وين تريد تبدأ؟</h2></div>
            <span className="nabd-small-hint">اختار طريقة تناسبك</span>
          </div>
          <div className="nabd-action-grid">
            {actions.map(({ title, description, label, icon: Icon, tone, tab }) => (
              <button key={tab} className={`nabd-action-card tone-${tone}`} onClick={() => onNavigateTab(tab)}>
                <span className="nabd-action-icon"><Icon size={30} strokeWidth={1.8} aria-hidden="true" /></span>
                <span className="nabd-action-copy"><strong>{title}</strong><small>{description}</small></span>
                <span className="nabd-action-bottom"><span>{label}</span><ArrowLeft size={18} aria-hidden="true" /></span>
              </button>
            ))}
          </div>
        </div>

        <aside className="nabd-side-column">
          <div className="nabd-progress-panel">
            <div className="nabd-panel-heading"><span className="nabd-panel-icon"><BookMarked size={22} aria-hidden="true" /></span><span>رحلتي بالمنهج</span></div>
            <div className="nabd-progress-main"><strong>{count}<small> / {TABLER_CHAPTERS.length}</small></strong><span>فصول تمت مراجعتها</span></div>
            <div className="nabd-progress-track" role="progressbar" aria-valuenow={count} aria-valuemin={0} aria-valuemax={TABLER_CHAPTERS.length} aria-label="الفصول التي تمّت مراجعتها"><span style={{ width: `${percent}%` }} /></div>
            <p>كل فصل تكمله يقربك من إنهاء المنهج.</p>
            <button className="nabd-text-link" onClick={() => onNavigateTab('chapters')}>استعرض جميع الفصول <ArrowLeft size={16} aria-hidden="true" /></button>
          </div>
          <div className="nabd-todo-panel">
            <div className="nabd-panel-heading"><span className="nabd-panel-icon"><CalendarDays size={22} aria-hidden="true" /></span><span>تذكير خفيف</span></div>
            <strong>{unfinished.length ? `عندك ${unfinished.length} واجب للمراجعة` : 'ما عندك واجبات معلّقة'}</strong>
            <p>{unfinished[0]?.title ?? 'استغل وقتك بتثبيت أحد المواضيع اللي قريتها.'}</p>
            <button className="nabd-text-link" onClick={() => onNavigateTab('planner')}>افتح جدول المراجعة <ArrowLeft size={16} aria-hidden="true" /></button>
          </div>
        </aside>
      </section>

      <section className="nabd-chapter-section" aria-labelledby="chapters-heading">
        <div className="nabd-section-heading">
          <div><span className="nabd-overline">مادة الأحياء</span><h2 id="chapters-heading">فصول المنهج</h2></div>
          <button className="nabd-text-link" onClick={() => onNavigateTab('chapters')}>عرض الكل <ArrowLeft size={16} aria-hidden="true" /></button>
        </div>
        <div className="nabd-chapter-strip">
          {TABLER_CHAPTERS.slice(0, 6).map((ch, i) => {
            
            const done = !!state.finishedTopics[String(ch.id)];
            return (
              <button className="nabd-chapter-tile" key={ch.id} onClick={() => onNavigateTab('curriculum', { chapter: ch.id })}>
                <span className={`nabd-chapter-art tone-${palettes[i]}`}><BiologySymbolIcon name={anatomySymbols[i]} size={36} /></span>
                <span className="nabd-chapter-details">
                  <small>الفصل {ch.id}</small>
                  <strong>{ch.name}</strong>
                  <span>{done ? <><CheckCircle2 size={14} aria-hidden="true" /> تمت مراجعته</> : <>افتح الدرس <ArrowLeft size={14} aria-hidden="true" /></>}</span>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="nabd-helper-note">
        <Volume2 size={23} aria-hidden="true" />
        <div><strong>الصوت والمجسمات قيد التطوير</strong><p>التسجيلات والمشاهد المتوفرة تشتغل حسب جاهزيتها، وما راح نشغّل صوتاً مختلفاً عن المعلمة المعتمدة.</p></div>
        <button onClick={() => onNavigateTab('assistant')} aria-label="افتح مساعد الأحياء"><ArrowLeft size={20} /></button>
      </section>
    </div>
  );
};