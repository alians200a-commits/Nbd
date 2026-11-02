import React, { useMemo, useState } from 'react';
import { ArrowLeft, BookOpen, FlaskConical, Search, Sparkles } from 'lucide-react';
import { TABLER_CHAPTERS } from '../data/tablerData';
import { useApp } from '../context/AppContext';
import type { TabType } from '../components/Sidebar';

interface Props { onNavigateTab: (tab: TabType, params?: {chapter?: number}) => void }
const artBase=import.meta.env.BASE_URL + 'nabd-art/';
const artFor=['brain','bone','arm','intestine','heart','lungs','kidneys','dna','eye','thyroid','cell-nuclei'];
const colors=['lilac','peach','mint','sky','peach','lilac','sky','mint','lilac','peach','mint'];

export const StudentChaptersView: React.FC<Props> = ({ onNavigateTab }) => {
  const {state}=useApp();
  const [search,setSearch]=useState('');
  const chapters=useMemo(()=>TABLER_CHAPTERS.filter(c=>(c.name+' '+c.desc).includes(search.trim())),[search]);
  return <div className="student-chapters">
    <div className="student-page-heading">
      <span className="student-eyebrow"><Sparkles size={16}/> تعلّم خطوة خطوة</span>
      <h1>كل فصل حكاية اكتشاف</h1>
      <p>اختَر جهازاً من جسم الإنسان، واقرأ درسه أو شوف مجسمه بالمختبر.</p>
    </div>
    <label className="student-chapter-search">
      <Search size={20} aria-hidden="true" />
      <input aria-label="ابحث في فصول الأحياء" type="search" value={search} onChange={e=>setSearch(e.target.value)} placeholder="ابحث عن فصل، عضو أو موضوع..." />
    </label>
    <div className="student-chapters-count">فصول المنهج <strong>{chapters.length} من 11</strong></div>
    {chapters.length===0 && <div className="student-empty-state">ما لقينا فصل بهذا الاسم. جرّب اسم جهاز أو عضو ثاني.</div>}
    <div className="student-all-chapters">
      {chapters.map(c=>{
        const complete=Boolean(state.finishedTopics[String(c.id)]);
        return <article key={c.id} className={'student-chapter-row student-tint-'+colors[c.id-1]}>
          <div className="student-chapter-figure"><img src={artBase+artFor[c.id-1]+'.svg'} alt="" loading="lazy"/></div>
          <div className="student-chapter-copy">
            <div className="student-chapter-meta"><span>الفصل {c.id} · صفحة {c.page}</span>{complete&&<span className="student-chapter-complete">تمّت مراجعته</span>}</div>
            <h2>{c.name}</h2>
            <p>{c.desc}</p>
            <div className="student-chapter-buttons">
              <button type="button" className="student-pill-primary" onClick={()=>onNavigateTab('curriculum',{chapter:c.id})}><BookOpen size={16}/> اقرأ الدرس</button>
              <button type="button" className="student-pill-secondary" onClick={()=>onNavigateTab('lab',{chapter:c.id})}><FlaskConical size={16}/> شاهد المجسم</button>
            </div>
          </div>
          <ArrowLeft size={18} className="student-row-arrow" aria-hidden="true"/>
        </article>
      })}
    </div>
    <p className="student-trust-note">المجسمات المرجعية تختلف حسب توفر الملفات العلمية، وبعض الفقرات تحتاج نماذج أدق.</p>
  </div>;
};