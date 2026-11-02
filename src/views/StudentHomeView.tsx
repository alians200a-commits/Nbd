import React from 'react';
import { ArrowLeft, BookOpen, BookOpenText, CheckCircle2, ChevronLeft, ClipboardCheck, FlaskConical, Headphones, Microscope, RotateCcw, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TABLER_CHAPTERS } from '../data/tablerData';
import type { TabType } from '../components/Sidebar';

interface Props { onNavigateTab: (tab: TabType, params?: { chapter?: number }) => void }
const artBase = import.meta.env.BASE_URL + 'nabd-art/';
const artForChapter = ['brain','bone','arm','intestine','heart','lungs','kidneys','dna','eye','thyroid','cell-nuclei'];

const studyActions = [
  { label: 'دروسي', description: 'شرح وفهم كل فصل', icon: BookOpenText, tint: 'lilac', action: 'chapters' as TabType },
  { label: 'المختبر', description: 'شوف العضو وتفاعل وياه', icon: Microscope, tint: 'mint', action: 'lab' as TabType },
  { label: 'اختبرني', description: 'أسئلة تثبّت المعلومة', icon: ClipboardCheck, tint: 'peach', action: 'quiz' as TabType },
  { label: 'المراجعة', description: 'ارجع للأسئلة الصعبة', icon: RotateCcw, tint: 'sky', action: 'vault' as TabType },
];

export const StudentHomeView: React.FC<Props> = ({ onNavigateTab }) => {
  const { state } = useApp();
  const finishedKeys = Object.keys(state.finishedTopics || {});
  const completedChapters = TABLER_CHAPTERS.filter(c => Boolean(state.finishedTopics[String(c.id)])).length;
  const mistakes = Object.keys(state.mistakes || {}).length;
  const pendingHomework = (state.homework || []).filter(h => !h.done);
  const nextChapter = TABLER_CHAPTERS.find(c => !state.finishedTopics[String(c.id)]) || TABLER_CHAPTERS[0];

  return <div className="student-home">
    <section className="student-greeting">
      <div>
        <span className="student-eyebrow"><Sparkles size={16} aria-hidden="true" /> نَبْض · رفيقك في الأحياء</span>
        <h1>كل يوم تفهم أكثر، وتقرّب لهدفك.</h1>
        <p>خلّ العلم يصير تجربة تشوفها وتشارك بيها، مو مجرد حفظ.</p>
      </div>
      <div className="student-greeting-stats" aria-label="إحصاءات الدراسة المسجلة">
        <span><strong>{finishedKeys.length}</strong> مراجعة محفوظة</span>
        <span><strong>{mistakes}</strong> سؤال للمراجعة</span>
      </div>
    </section>

    <section className="student-hero">
      <div className="student-hero-copy">
        <span className="student-hero-kicker">رحلتك العلمية تبدأ هنا</span>
        <h2>جسم الإنسان<br />عالم كامل ينتظر اكتشافك!</h2>
        <p>ابدأ بفصل الجهاز العصبي، وبعدها استكشف أجزاءه بالمختبر وحل أسئلته.</p>
        <button className="student-primary-button" onClick={() => onNavigateTab('curriculum', { chapter: nextChapter.id })}>
          افتح درسك <ArrowLeft size={18} aria-hidden="true" />
        </button>
      </div>
      <div className="student-hero-art">
        
        
        <img src={artBase + 'brain.svg'} alt="رسم توضيحي للدماغ" />
      </div>
    </section>

    <div className="student-section-title">
      <div><span className="student-eyebrow">اختَر طريقتك</span><h2>شنو تحب تسوي هسه؟</h2></div>
    </div>
    <section className="student-actions-grid" aria-label="الأقسام التعليمية">
      {studyActions.map(action =>
        <button type="button" key={action.label} className={'student-action-card student-tint-' + action.tint} onClick={() => onNavigateTab(action.action)}>
          <span className="student-action-art"><action.icon size={34} strokeWidth={1.8} aria-hidden="true" /></span>
          <strong>{action.label}</strong>
          <small>{action.description}</small>
          <ChevronLeft size={16} className="student-action-chevron" aria-hidden="true" />
        </button>
      )}
    </section>

    <div className="student-section-title student-section-spaced">
      <div><span className="student-eyebrow">دروس الأحياء</span><h2>اكتشف الفصول</h2></div>
      <button type="button" className="student-link" onClick={() => onNavigateTab('chapters')}>عرض كل الفصول <ChevronLeft size={17}/></button>
    </div>
    <section className="student-course-grid" aria-label="الفصول الأولى">
      {TABLER_CHAPTERS.slice(0,3).map((chapter, i) =>
        <button type="button" key={chapter.id} className={'student-course-card student-tint-' + ['lilac','peach','mint'][i]} onClick={() => onNavigateTab('curriculum', { chapter: chapter.id })}>
          <span className="student-course-art"><img src={artBase + artForChapter[chapter.id-1] + '.svg'} alt="" /></span>
          <span className="student-course-info">
            <span className="student-course-label">الفصل {chapter.id} · صفحة {chapter.page}</span>
            <strong>{chapter.name}</strong>
            <small>{chapter.desc}</small>
            <span className="student-course-cta">افتح الدرس <ArrowLeft size={15}/></span>
          </span>
        </button>
      )}
    </section>

    <section className="student-progress-panel" aria-label="مسار التعلّم">
      <div className="student-progress-head">
        <div><span className="student-eyebrow">رحلتك مستمرة</span><h2>قدّيش تقدمت؟</h2></div>
        <span className="student-progress-fraction">{completedChapters} / 11 <small>فصول معلّمة كمكتملة</small></span>
      </div>
      <div className="student-progress-track" role="progressbar" aria-valuemin={0} aria-valuemax={11} aria-valuenow={completedChapters} aria-label="الفصول المعلّمة كمكتملة"><span style={{width: (completedChapters/11*100)+'%'}} /></div>
      <p>{completedChapters ? 'أحسنت! كمّل على نفس الوتيرة، وخلي اختبار الفهم يثبت المعلومة.' : 'بعدك بالبداية؟ كل فصل تراجعه ينضاف إلى مسارك.'}</p>
      {pendingHomework.length > 0 && <button type="button" onClick={() => onNavigateTab('planner')} className="student-next-task">
        <span className="student-task-symbol"><BookOpen size={22}/></span>
        <span><strong>خطوتك القادمة</strong><small>{pendingHomework[0].title}</small></span>
        <ArrowLeft size={18}/>
      </button>}
    </section>

    <section className="student-extras" aria-label="مزايا إضافية">
      <button onClick={() => onNavigateTab('lab')}><FlaskConical size={19}/><span>مختبر التشريح</span></button>
      <button onClick={() => onNavigateTab('quiz')}><ClipboardCheck size={19}/><span>اختبارات تدريبية</span></button>
      <button onClick={() => window.location.assign(import.meta.env.BASE_URL + 'learn.html?voice=1')}><Headphones size={19}/><span>صوت المعلّمة B</span></button>
      <button onClick={() => onNavigateTab('vault')}><RotateCcw size={19}/><span>خزنة الأخطاء</span></button>
    </section>
    <p className="student-trust-note"><CheckCircle2 size={14} /> تقدّمك محسوب من المراجعات المحفوظة فعلياً. محتوى الملزمة الوزاري والصوت الكامل ما زالا قيد التدقيق والإنتاج.</p>
  </div>
};