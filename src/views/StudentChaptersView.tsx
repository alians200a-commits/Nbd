import React, { useMemo, useState } from 'react';
import { BookOpen, FlaskConical, Search, Sparkles } from 'lucide-react';
import { TABLER_CHAPTERS } from '../data/tablerData';
import { useApp } from '../context/AppContext';
import { useManagedContent,safeMediaUrl } from '../content/useManagedContent';
import type { TabType } from '../components/Sidebar';
import { AnatomyArt } from '../components/AnatomyArt';

interface Props { onNavigateTab: (tab: TabType, params?: {chapter?: number}) => void }
const colors=['lilac','peach','mint','sky','peach','lilac','sky','mint','lilac','peach','mint'];

export const StudentChaptersView: React.FC<Props> = ({ onNavigateTab }) => {
  const {state}=useApp();
  const managed=useManagedContent();
  const [search,setSearch]=useState('');
  const chapters=useMemo(()=>TABLER_CHAPTERS.map(c=>{
    const edited=managed.chapters.find(x=>x.id===c.id);
    return {...c,name:edited?.title||c.name,desc:edited?.description||c.desc,
      image:edited?.image||'',visible:edited?.visible!==false,order:edited?.order||c.id};
  }).filter(c=>c.visible&&(c.name+' '+c.desc).includes(search.trim())).sort((a,b)=>a.order-b.order),[search,managed.chapters]);
  return <div className="student-chapters">
    <div className="student-page-heading">
      <span className="student-eyebrow"><Sparkles size={16}/> تعلّم خطوة خطوة</span>
      <h1>كل فصل حكاية اكتشاف</h1>
      <p>اختَر جهازاً من جسم الإنسان، واقرأ درسه أو شاهد مجسمه في المختبر.</p>
    </div>
    <label className="student-chapter-search">
      <Search size={20} aria-hidden="true" />
      <input aria-label="ابحث في فصول الأحياء" type="search" value={search} onChange={e=>setSearch(e.target.value)} placeholder="ابحث عن فصل، عضو أو موضوع..." />
    </label>
    <div className="student-chapters-count">فصول المنهج <strong>{chapters.length} من {managed.chapters.filter(c=>c.visible).length||11}</strong></div>
    {chapters.length===0 && <div className="student-empty-state">لم نعثر على فصل بهذا الاسم. جرّب البحث باسم الجهاز أو العضو.</div>}
    <div className="student-all-chapters">
      {chapters.map(c=>{
        const complete=Boolean(state.finishedTopics[String(c.id)]);
        return <article key={c.id} className={'student-chapter-row student-tint-'+colors[c.id-1]}>
          <div className="student-chapter-figure"><AnatomyArt chapter={c.id} alt={'رسم تعليمي: '+c.name} override={safeMediaUrl(c.image)||undefined}/></div>
          <div className="student-chapter-copy">
            <div className="student-chapter-meta"><span>الفصل {c.id} · صفحة {c.page}</span>{complete&&<span className="student-chapter-complete">تمّت مراجعته</span>}</div>
            <h2>{c.name}</h2>
            <p>{c.desc}</p>
            <div className="student-chapter-buttons">
              <button type="button" className="student-pill-primary" onClick={()=>onNavigateTab('curriculum',{chapter:c.id})}><BookOpen size={16}/> اقرأ الدرس</button>
              <button type="button" className="student-pill-secondary" onClick={()=>onNavigateTab('lab',{chapter:c.id})}><FlaskConical size={16}/> شاهد المجسم</button>
            </div>
            {managed.lessons.some(l=>l.chapter===c.id&&l.visible)&&<details className="student-managed-lessons">
              <summary>شروحات هذا الفصل ({managed.lessons.filter(l=>l.chapter===c.id&&l.visible).length})</summary>
              {managed.lessons.filter(l=>l.chapter===c.id&&l.visible).sort((a,b)=>a.order-b.order).map(l=><section key={l.id} className="student-managed-lesson">
                <h3>{l.title}</h3>
                {l.page>0&&<small>صفحة {l.page}</small>}
                <p className="student-managed-text">{l.text}</p>
                {!!l.images?.length&&<div className="student-managed-images">{l.images.map((img,i)=>safeMediaUrl(img)?<img key={img+i} loading="lazy" src={safeMediaUrl(img)} alt={'صورة تعليمية: '+l.title}/>:null)}</div>}
                {l.question&&<div className="student-managed-question"><b>راجع فهمك: {l.question}</b><details><summary>شوف الجواب</summary><p>{l.answer}</p></details></div>}
              </section>)}
            </details>}
          </div>
        </article>
      })}
    </div>
    <p className="student-trust-note">الرسومات التشريحية من <a href="https://smart.servier.com/" target="_blank" rel="noopener noreferrer">Servier Medical Art</a> بترخيص <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">CC BY 4.0</a>، وقد جرى تكييف أحجامها للواجهة. رسومات أخرى من مكتباتها المفتوحة السابقة. المجسمات ثلاثية الأبعاد لها مصادر وتراخيص مستقلة.</p>
  </div>;
};