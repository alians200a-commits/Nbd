import React, { useMemo } from 'react';
import { ArrowLeft, BookOpenText, CalendarDays, CheckCircle2, ChevronLeft, ClipboardCheck, Clock3, Headphones, Microscope, RotateCcw, Sparkles, Trophy } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TABLER_CHAPTERS } from '../data/tablerData';
import type { TabType } from '../components/Sidebar';

interface Props { onNavigateTab: (tab: TabType, params?: { chapter?: number }) => void }
const artBase = import.meta.env.BASE_URL + 'nabd-art/';
const artMap = ['brain','bone','arm','intestine','heart','lungs','kidneys','dna-fluent','eye','thyroid','antibody'];
const courseTones = ['violet','honey','mint'] as const;
const days = ['سبت','أحد','إثن','ثلا','أرب','خمي','جمع'];

export const StudentHomeView: React.FC<Props> = ({ onNavigateTab }) => {
  const { state } = useApp();
  const completed = Object.keys(state.finishedTopics || {}).filter(k => state.finishedTopics[k]).length;
  const mistakes = Object.keys(state.mistakes || {}).length;
  const tests = state.tests || [];
  const sessions = state.studySessions || [];
  const chaptersDone = TABLER_CHAPTERS.filter(c => Boolean(state.finishedTopics[String(c.id)])).length;
  const next = TABLER_CHAPTERS.find(c => !state.finishedTopics[String(c.id)]) || TABLER_CHAPTERS[0];

  // Only real locally stored study sessions and quiz submissions are counted.
  const weekly = useMemo(() => {
    const today = new Date();
    today.setHours(12, 0, 0, 0);
    const saturday = new Date(today);
    saturday.setDate(today.getDate() - ((today.getDay() + 1) % 7));
    return Array.from({ length: 7 }, (_, i) => {
      const dt = new Date(saturday);
      dt.setDate(saturday.getDate() + i);
      const date = [dt.getFullYear(), String(dt.getMonth() + 1).padStart(2, '0'), String(dt.getDate()).padStart(2, '0')].join('-');
      const sessionsOnDay = sessions.filter(s => s.date === date).length;
      const testsOnDay = tests.filter(t => t.date === date).length;
      return { label: days[i], date, count: sessionsOnDay + testsOnDay, today: dt.toDateString() === today.toDateString() };
    });
  }, [sessions, tests]);
  const maxCount = Math.max(1, ...weekly.map(x => x.count));
  const anyActivity = weekly.some(x => x.count > 0);
  const studyMinutes = sessions.reduce((sum, s) => sum + Math.max(0, s.durationMinutes || 0), 0);
  const recentCourses = TABLER_CHAPTERS.slice(0, 3);

  return <div className="nabd-journey" dir="rtl">
    <div className="nabd-journey-grid">
      <section className="nabd-welcome-phone" aria-label="ابدأ رحلة الأحياء">
        <div className="nabd-welcome-illustration" aria-hidden="true">
          <span className="nabd-welcome-glow"/>
          <img className="nabd-hero-books" src={artBase + 'books.svg'} alt=""/>
          <img className="nabd-hero-brain" src={artBase + 'brain.svg'} alt=""/>
          <span className="nabd-hero-sparkle sparkle-one">✦</span>
          <span className="nabd-hero-sparkle sparkle-two">✦</span>
        </div>
        <div className="nabd-welcome-copy">
          <span className="nabd-welcome-eyebrow">نَبْض · رفيقك في الأحياء</span>
          <h1>تعلّم الأحياء<br/><em>بطريقة ممتعة!</em></h1>
          <p>افهم المعلومة، شاهدها في المختبر، اختبر نفسك، ثم راجعها حتى تتذكرها.</p>
          <button type="button" className="nabd-start-button" onClick={()=>onNavigateTab('curriculum',{chapter:next.id})}>
            <span>ابدأ التعلّم</span><span className="nabd-arrow-circle"><ArrowLeft size={21}/></span>
          </button>
          <button type="button" className="nabd-welcome-secondary" onClick={()=>onNavigateTab('chapters')}>تصفّح الفصول الأحد عشر <ChevronLeft size={16}/></button>
        </div>
      </section>

      <section className="nabd-today-panel" aria-labelledby="today-heading">
        <div className="nabd-today-topline">
          <span className="nabd-hello-avatar"><img src={artBase+'brain.svg'} alt=""/></span>
          <div><strong>مرحباً بك في نَبْض!</strong><small>كل درس خطوة نحو فهم أفضل</small></div>
          <button type="button" className="nabd-circle-utility" title="مراجعة الأخطاء" aria-label="مراجعة أخطائك" onClick={()=>onNavigateTab('vault')}><RotateCcw size={21}/></button>
        </div>
        <div className="nabd-today-heading"><div><span>رحلتك العلمية</span><h2 id="today-heading">تقدّمك اليوم</h2></div><span className="nabd-heading-star"><Sparkles size={20}/></span></div>
        <div className="nabd-course-list">
          {recentCourses.map((chapter, i)=>{
            const lastTest = tests.find(t=>t.chapter===chapter.id);
            const markedComplete = Boolean(state.finishedTopics[String(chapter.id)]);
            const pct = markedComplete ? 100 : (lastTest && lastTest.total>0 ? Math.round(lastTest.score/lastTest.total*100) : 0);
            const measured = markedComplete || Boolean(lastTest && lastTest.total>0);
            return <article key={chapter.id} className={'nabd-learning-card nabd-tone-'+courseTones[i]}>
              <div className="nabd-learning-art"><img src={artBase+artMap[chapter.id-1]+'.svg'} alt={chapter.name}/></div>
              <div className="nabd-learning-card-info">
                <div className="nabd-learning-badges"><span className="nabd-learning-level">{markedComplete?'تمت مراجعته':lastTest?'اختبار سابق':'جاهز للتعلّم'}</span><span className="nabd-learning-page"><BookOpenText size={13}/> ص {chapter.page}</span></div>
                <h3>{chapter.name}</h3><p>{chapter.desc}</p>
                <div className="nabd-learning-bottom"><div className="nabd-learning-track" role="progressbar" aria-label={'تقدم '+chapter.name} aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}><span style={{width:pct+'%'}}/></div><small>{measured?pct+'٪':'ابدأ الآن'}</small></div>
                <small className="nabd-progress-meaning">{lastTest&&!markedComplete?'نتيجة الاختبار الأخير':'حالة مراجعة الفصل'}</small>
              </div>
              <button type="button" className="nabd-course-go" onClick={()=>onNavigateTab('curriculum',{chapter:chapter.id})} aria-label={'افتح درس '+chapter.name}><ArrowLeft size={19}/></button>
            </article>;
          })}
        </div>
        <button className="nabd-view-all" type="button" onClick={()=>onNavigateTab('chapters')}>اكتشف جميع الفصول <ChevronLeft size={19}/></button>
      </section>

      <section className="nabd-tracker-panel" aria-labelledby="tracker-heading">
        <header className="nabd-tracker-head"><span className="nabd-tracker-label">متابعة التعلّم</span><button aria-label="خطة الدراسة" className="nabd-circle-utility" onClick={()=>onNavigateTab('planner')}><CalendarDays size={19}/></button></header>
        <div className="nabd-tracker-mascot"><img src={artBase+'open-book.svg'} alt="" aria-hidden="true"/><h2 id="tracker-heading">إنجازاتك<br/>خطوة بخطوة</h2><span>استمرّ في التعلّم</span></div>
        <div className="nabd-tracker-stats">
          <button type="button" className="nabd-stat-tile nabd-stat-violet" onClick={()=>onNavigateTab('chapters')}><BookOpenText size={23}/><strong>{completed}</strong><span>دروس راجعتها</span></button>
          <button type="button" className="nabd-stat-tile nabd-stat-honey" onClick={()=>onNavigateTab('quiz')}><ClipboardCheck size={23}/><strong>{tests.length}</strong><span>اختبارات أنجزتها</span></button>
        </div>
        <div className="nabd-chart-head"><h3>نشاطك هذا الأسبوع</h3><span>جلسات واختبارات</span></div>
        <div className="nabd-activity-chart" role="img" aria-label={anyActivity?'مخطط النشاط الحقيقي للأسبوع':'لا توجد جلسات أو اختبارات محفوظة لهذا الأسبوع'}>
          {weekly.map((day,i)=><div key={day.date} className={'nabd-activity-day'+(day.today?' is-today':'')}>
            <span className="nabd-activity-count">{day.count?day.count:''}</span>
            <span className={'nabd-activity-bar nabd-bar-'+(i%4)} style={{height:day.count? Math.max(18,Math.round(day.count/maxCount*100))+'%':'12%'}}/>
            <span className="nabd-day-label">{day.label}</span>
          </div>)}
        </div>
        {!anyActivity&&<p className="nabd-empty-activity">لا يوجد نشاط مسجّل هذا الأسبوع بعد. ابدأ باختبار قصير!</p>}
        <button type="button" className="nabd-achievement" onClick={()=>onNavigateTab(mistakes?'vault':'planner')}>
          <span className="nabd-achievement-art"><img src={artBase+'trophy.svg'} alt=""/></span>
          <span><strong>{mistakes?'خطوتك القادمة: راجع أخطاءك':'أحسنت! البداية تصنع الفرق'}</strong><small>{mistakes?mistakes+' أسئلة تنتظر مراجعتك':'ابدأ درساً جديداً اليوم'}</small></span><ChevronLeft size={18}/>
        </button>
        <p className="nabd-tracker-note"><CheckCircle2 size={14}/> الأرقام من نشاطك المحفوظ فقط. {studyMinutes? 'مدة جلساتك المسجلة: '+studyMinutes+' دقيقة.':''}</p>
      </section>
    </div>

    <section className="nabd-quick-section" aria-labelledby="quick-title">
      <div className="nabd-quick-heading"><div><span>تعلّم بطريقتك</span><h2 id="quick-title">ماذا تريد أن تفعل الآن؟</h2></div></div>
      <div className="nabd-quick-actions">
        <button type="button" className="nabd-quick-action qa-violet" onClick={()=>onNavigateTab('chapters')}><span className="nabd-quick-art"><img src={artBase+'books.svg'} alt=""/></span><strong>دروسي</strong><small>شرح واضح خطوة بخطوة</small></button>
        <button type="button" className="nabd-quick-action qa-mint" onClick={()=>onNavigateTab('lab')}><span className="nabd-quick-art"><img src={artBase+'microscope.svg'} alt=""/></span><strong>المختبر</strong><small>شاهد الأعضاء وتفاعل معها</small></button>
        <button type="button" className="nabd-quick-action qa-honey" onClick={()=>onNavigateTab('quiz')}><span className="nabd-quick-art"><img src={artBase+'quiz-memo.svg'} alt=""/></span><strong>اختبر نفسك</strong><small>أسئلة لتثبيت المعلومة</small></button>
        <button type="button" className="nabd-quick-action qa-pink" onClick={()=>onNavigateTab('vault')}><span className="nabd-quick-art"><img src={artBase+'review-search.svg'} alt=""/></span><strong>مراجعة الأخطاء</strong><small>ارجع لما يحتاج تقوية</small></button>
      </div>
      <div className="nabd-more-shortcuts"><button type="button" onClick={()=>window.location.assign(import.meta.env.BASE_URL+'learn.html')}><Headphones size={19}/> استمع إلى شرح الخلية العصبية</button><button type="button" onClick={()=>onNavigateTab('planner')}><Clock3 size={19}/> خطة المراجعة</button><button type="button" onClick={()=>onNavigateTab('ministryExam')}><Trophy size={19}/> التدريب الوزاري</button></div>
      <p className="nabd-study-disclaimer">المجسمات والتسجيلات والأسئلة الوزارية التي لم تُراجع بعد تُعرض بحسب حالتها الفعلية؛ لا تُحتسب ميزة غير مكتملة إنجازاً دراسياً.</p>
    </section>
  </div>;
};