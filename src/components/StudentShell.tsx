import React, { useEffect, useState } from 'react';
import { BookOpen, BookOpenText, Brain, CalendarDays, ChevronLeft, ClipboardCheck, FlaskConical, Gamepad2, HeartPulse, Home, LibraryBig, Menu, Microscope, RotateCcw, Sparkles, Users, Volume2, X } from 'lucide-react';
import type { TabType } from './Sidebar';
import type { LucideIcon } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface Props {
  currentTab: TabType;
  onNavigateTab: (tab: TabType, params?: {chapter?: number;page?: number}) => void;
  children: React.ReactNode;
}
const artBase = import.meta.env.BASE_URL + 'nabd-art/';
const primary: { id: TabType; name: string; icon: LucideIcon; art: string }[] = [
  { id:'home',name:'الرئيسية',icon:Home,art:'home-house' },
  { id:'chapters',name:'دروسي',icon:BookOpenText,art:'books' },
  { id:'lab',name:'المختبر',icon:Microscope,art:'microscope' },
  { id:'quiz',name:'اختبرني',icon:ClipboardCheck,art:'quiz-memo' },
  { id:'vault',name:'المراجعة',icon:RotateCcw,art:'review-search' },
];
const extras: {label:string;detail:string;icon: LucideIcon; art:string; tab?:TabType;href?:string}[] = [
  {label:'الكتاب والدرس',detail:'تصفح الدروس والملخصات',icon:BookOpen,art:'open-book',tab:'curriculum'},
  {label:'مختبر كل فقرة',detail:'تجارب فهم مرتبطة بالفصول',icon:FlaskConical,art:'microscope',href:'simulations.html'},
  {label:'بنك أسئلة الملزمة',detail:'أسئلة مستخرجة تحتاج تدقيق المصدر',icon:ClipboardCheck,art:'quiz-memo',href:'exam-bank.html'},
  {label:'المعلّمة B',detail:'إدارة التسجيلات الصوتية المرجعية',icon:Volume2,art:'teacher-microphone',href:'learn.html?voice=1'},
  {label:'استوديو الصوت البغدادي',detail:'إعداد نص الشرح وتوليده بصوت أنثوي جديد',icon:Volume2,art:'study-headphones',href:'voice_production.html'},
  {label:'ألعاب الأحياء',detail:'اختبر معلوماتك بطرق مختلفة',icon:Gamepad2,art:'game-controller',tab:'games'},
  {label:'جدول دراستي',detail:'وزّع مراجعتك حسب وقتك',icon:CalendarDays,art:'study-calendar',tab:'planner'},
  {label:'متابعة الأهل',detail:'عرض التقدم على الجهاز',icon:Users,art:'family-group',tab:'parents'},
  {label:'المنعكس العصبي',detail:'نشاط تفاعلي لفهم الاستجابة',icon:Brain,art:'brain',tab:'reflex'},
  {label:'المصادر',detail:'المراجع والمشاريع المجانية',icon:LibraryBig,art:'notebook',tab:'sources'},
];
export const StudentShell: React.FC<Props> = ({currentTab,onNavigateTab,children}) => {
  const {state}=useApp();
  const [open,setOpen]=useState(false);
  useEffect(()=>{if(!open)return;const key=(e:KeyboardEvent)=>{if(e.key==='Escape')setOpen(false)};document.addEventListener('keydown',key);return()=>document.removeEventListener('keydown',key)},[open]);
  const navigate=(to:TabType)=>{setOpen(false);onNavigateTab(to);window.scrollTo({top:0,behavior:'smooth'})};
  const launch=(item:typeof extras[number])=>{
    setOpen(false);
    if(item.tab){navigate(item.tab);return}
    if(item.href)window.location.assign(import.meta.env.BASE_URL+item.href);
  };
  const active=(tab:TabType)=>(currentTab===tab)||(currentTab==='atlas'&&tab==='lab')||(currentTab==='ministryExam'&&tab==='quiz');
  const due=Object.keys(state.mistakes||{}).length;
  return <div className="student-app">
    <header className="student-topbar">
      <div className="student-topbar-inner">
        <button type="button" className="student-brand" onClick={()=>navigate('home')} aria-label="العودة إلى الرئيسية">
          <span className="student-brand-mark"><HeartPulse size={23} strokeWidth={2.5}/></span>
          <span><strong>نَبْض</strong><small>مختبر الأحياء الذكي</small></span>
        </button>
        <nav className="student-desktop-nav" aria-label="الأقسام الرئيسية">
          {primary.map(n=><button type="button" key={n.id} className={active(n.id)?'is-current':''} aria-current={active(n.id)?'page':undefined} onClick={()=>navigate(n.id)}><img className="nabd-nav-illustration" src={artBase+n.art+'.svg'} alt="" aria-hidden="true"/>{n.name}</button>)}
        </nav>
        <div className="student-topbar-actions">
          <button type="button" className="student-reminder-button" onClick={()=>navigate('vault')} aria-label={'الأسئلة التي تحتاج مراجعة: '+due}>
            <RotateCcw size={20}/>{due>0&&<span className="student-count-bubble">{due}</span>}
          </button>
          <button type="button" className="student-menu-button" onClick={()=>setOpen(true)} aria-expanded={open} aria-haspopup="dialog">
            <Menu size={20}/><span className="student-menu-label">المزيد</span>
          </button>
        </div>
      </div>
    </header>
    <main id="main" className="student-page" role="main">{children}</main>
    <nav className="student-mobile-nav" aria-label="القائمة السفلية">
      {primary.map(n=><button type="button" key={n.id} onClick={()=>navigate(n.id)} className={active(n.id)?'is-current':''} aria-current={active(n.id)?'page':undefined}>
        <span className="student-nav-symbol"><img className="nabd-nav-illustration" src={artBase+n.art+'.svg'} alt="" aria-hidden="true"/></span><span>{n.name}</span>
      </button>)}
    </nav>
    {open&&<div className="student-menu-backdrop" onClick={()=>setOpen(false)}>
      <section className="student-more-panel" role="dialog" aria-modal="true" aria-label="جميع أدوات نَبْض" onClick={e=>e.stopPropagation()}>
        <div className="student-more-header"><div><span className="student-eyebrow"><Sparkles size={15}/> كل أدواتك</span><h2>نَبْض وياك بكل خطوة</h2></div>
          <button type="button" aria-label="إغلاق القائمة" onClick={()=>setOpen(false)}><X size={23}/></button>
        </div>
        <div className="student-more-grid">{extras.map(item=><button key={item.label} type="button" onClick={()=>launch(item)}>
          <span className="student-more-icon"><img className="nabd-menu-illustration" src={artBase+item.art+'.svg'} alt="" aria-hidden="true"/></span><span><strong>{item.label}</strong><small>{item.detail}</small></span><ChevronLeft size={18}/></button>)}</div>
      </section>
    </div>}
  </div>;
};