import React,{useCallback,useEffect,useMemo,useState} from 'react';
import { BookOpen,CheckCircle2,ImagePlus,PlusCircle,RefreshCw,Save,Trash2,Eye,EyeOff,FileText,Image as ImageIcon, X,Type,AlertCircle } from 'lucide-react';
import { useAdminClient } from '../AdminContext';
import { fetchManagedCatalog,saveManagedCatalog,uploadManagedImage } from '../contentApi';
import type {ManagedCatalog,ManagedChapter,ManagedLesson,ManagedAnnouncement} from '../../content/types';
const sectionStyle:React.CSSProperties={border:'1px solid #e8e7f1',borderRadius:16,padding:17,background:'#fff'};
const fieldStyle:React.CSSProperties={width:'100%',border:'1px solid #dddfea',borderRadius:10,padding:10,background:'#fff',color:'#273149',font:'inherit'};
const labelStyle:React.CSSProperties={display:'grid',gap:6,fontSize:13,fontWeight:700,marginTop:12};
const miniBtn:React.CSSProperties={background:'#f1eefc',color:'#5e49ad',border:0,borderRadius:10,padding:'9px 12px',display:'inline-flex',alignItems:'center',gap:7,fontWeight:700,fontSize:12};
function createLesson(chapter:number,existing:ManagedLesson[]):ManagedLesson{
 const max=Math.max(0,...existing.filter(x=>x.chapter===chapter).map(x=>x.order));
 return {id:'chapter'+chapter+'-custom-'+Date.now().toString(36),chapter,title:'درس جديد',text:'',page:0,question:'',answer:'',images:[],visible:false,order:max+1};
}
function makeMessage(text:string,type:'ok'|'bad'='ok'){return {text,type};}
function Editor(){
 const client=useAdminClient();
 const [data,setData]=useState<ManagedCatalog|null>(null);
 const [sha,setSha]=useState('');
 const [section,setSection]=useState<'chapters'|'lessons'|'announcements'>('lessons');
 const [chapter,setChapter]=useState(1);
 const [lessonId,setLessonId]=useState('');
 const [announcementId,setAnnouncementId]=useState('');
 const [busy,setBusy]=useState(false);
 const [uploading,setUploading]=useState(false);
 const [dirty,setDirty]=useState(false);
 const [message,setMessage]=useState<{text:string;type:'ok'|'bad'}|null>(null);
 const [search,setSearch]=useState('');
 const load=useCallback(async()=>{
  setBusy(true);
  try{const r=await fetchManagedCatalog(client);
   setData(r.catalog);setSha(r.sha);setDirty(false);
   setChapter(old=>r.catalog.chapters.some(c=>c.id===old)?old:r.catalog.chapters[0]?.id||1);
   setLessonId(old=>r.catalog.lessons.some(l=>l.id===old)?old:r.catalog.lessons[0]?.id||'');
   setMessage(makeMessage('تم تحميل أحدث محتوى من المشروع'));
  }catch(e){setMessage(makeMessage((e as Error).message,'bad'))}
  finally{setBusy(false)}
 },[client]);
 useEffect(()=>{void load()},[load]);
 useEffect(()=>{const handler=(event:BeforeUnloadEvent)=>{if(dirty){event.preventDefault();event.returnValue=''}};window.addEventListener('beforeunload',handler);return()=>window.removeEventListener('beforeunload',handler)},[dirty]);
 const update=(action:(next:ManagedCatalog)=>void)=>{
  setData(previous=>{if(!previous)return previous;const next=structuredClone(previous);action(next);return next});
  setDirty(true);setMessage(null);
 };
 const chapterInfo=data?.chapters.find(x=>x.id===chapter);
 const lessons=data?.lessons.filter(x=>x.chapter===chapter&&x.title.includes(search)).sort((a,b)=>a.order-b.order)||[];
 const active=data?.lessons.find(x=>x.id===lessonId&&x.chapter===chapter)||lessons[0];
 const announcement=data?.announcements.find(x=>x.id===announcementId)||data?.announcements[0];
 const setChapterField=<K extends keyof ManagedChapter>(key:K,value:ManagedChapter[K])=>update(x=>{const c=x.chapters.find(y=>y.id===chapter);if(c)c[key]=value});
 const setLessonField=<K extends keyof ManagedLesson>(key:K,value:ManagedLesson[K])=>update(x=>{const c=x.lessons.find(y=>y.id===active?.id);if(c)c[key]=value});
 const setAnnouncementField=<K extends keyof ManagedAnnouncement>(key:K,value:ManagedAnnouncement[K])=>update(x=>{const c=x.announcements.find(y=>y.id===announcement?.id);if(c)c[key]=value});
 const save=async()=>{
  if(!data||!dirty)return;
  for(const c of data.chapters){if(!c.title.trim())return setMessage(makeMessage('اسم كل فصل مطلوب','bad'))}
  for(const l of data.lessons){if(!l.title.trim())return setMessage(makeMessage('عنوان كل درس مطلوب','bad'));if(l.visible&&l.text.trim().length<20)return setMessage(makeMessage('كل درس منشور يحتاج شرح لا يقل عن ٢٠ حرفاً: '+l.title,'bad'))}
  if(!confirm('حفظ ونشر تعديلات المحتوى؟ الطلاب يشوفوها بعد اكتمال تحديث التطبيق.'))return;
  setBusy(true);
  try{const fresh=await fetchManagedCatalog(client);if(fresh.sha!==sha){setMessage(makeMessage('صار تعديل بالمشروع أثناء شغلك. احفظ نسخة من النص ثم اضغط تحديث حتى ما نمسح تعديلات ثانية.','bad'));return}
   const newSha=await saveManagedCatalog(client,data,sha);setSha(newSha);setDirty(false);
   setMessage(makeMessage('انحفظت التعديلات على GitHub وبدأ تحديث نسخة الطلاب تلقائياً.'));
  }catch(e){setMessage(makeMessage((e as Error).message,'bad'))}
  finally{setBusy(false)}
 };
 const addLesson=()=>{
  if(!data)return;const next=createLesson(chapter,data.lessons);update(x=>x.lessons.push(next));setLessonId(next.id);setSearch('');setSection('lessons');
 };
 const removeLesson=()=>{
  if(!active||!confirm('تريد تحذف الدرس «'+active.title+'» من الكتالوج؟ هذا يحذف محتواه المعروض بعد الحفظ.'))return;
  const id=active.id;update(x=>{x.lessons=x.lessons.filter(y=>y.id!==id)});setLessonId('');
 };
 const addAnnouncement=()=>{
  const item={id:'news-'+Date.now().toString(36),title:'إعلان جديد',text:'',image:'',visible:false,order:(data?.announcements.length||0)+1};
  update(x=>x.announcements.push(item));setAnnouncementId(item.id);setSection('announcements');
 };
 const addImage=async(file:File|undefined,target:'chapter'|'lesson'|'announcement')=>{
  if(!file)return;
  setUploading(true);
  try{
   const image=await uploadManagedImage(client,file);
   if(target==='chapter')setChapterField('image',image);
   if(target==='announcement')setAnnouncementField('image',image);
   if(target==='lesson')setLessonField('images',[...(active?.images||[]),image]);
   setMessage(makeMessage('انرفعت الصورة للمشروع؛ اضغط «حفظ ونشر» حتى تربطها بالدرس.'))
  }catch(e){setMessage(makeMessage((e as Error).message,'bad'))}
  finally{setUploading(false)}
 };
 const imageUpload=(target:'chapter'|'lesson'|'announcement')=><label style={{...miniBtn,cursor:uploading?'progress':'pointer'}}>
  <ImagePlus size={17}/> {uploading?'جاري رفع الصورة…':'إضافة صورة من الجهاز'}
  <input type="file" accept="image/jpeg,image/png,image/webp" disabled={uploading} hidden onChange={e=>{void addImage(e.target.files?.[0],target);e.target.value=''}}/>
 </label>;
 const preview=(path:string)=>path&&/^media\/[a-z0-9-]+\.(png|jpg|webp)$/.test(path)
    ?<img loading="lazy" alt="معاينة صورة الدرس" src={'https://alians200a-commits.github.io/Nbd/nabd-content/'+path} style={{maxWidth:165,maxHeight:120,objectFit:'contain',borderRadius:12,border:'1px solid #e8e7f1'}}/>:null;
 return <div>
  <div className="ad-section-top"><div><h3>إدارة المحتوى والصور</h3><p>عدّل فصول الكتاب، شرح الدروس، الأسئلة، الصور، وإعلانات الرئيسية؛ الحفظ ينشر التغييرات على التطبيق.</p></div><span className="ad-chip">{data?.lessons.length||0} درس</span></div>
  <div style={{display:'flex',gap:9,flexWrap:'wrap',marginBottom:15}}>
   {([{key:'lessons',label:'الدروس والشرح',icon:BookOpen},{key:'chapters',label:'الفصول',icon:FileText},{key:'announcements',label:'إعلانات الرئيسية',icon:Type}]as const).map(x=><button key={x.key} type="button" style={{...miniBtn,background:section===x.key?'#5f4ac5':'#f1eefc',color:section===x.key?'white':'#5f4ac5'}} onClick={()=>setSection(x.key)}><x.icon size={16}/>{x.label}</button>)}
  </div>
  <div style={{display:'flex',gap:10,alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',marginBottom:16}}>
   <button type="button" onClick={()=>void load()} style={miniBtn} disabled={busy||dirty}><RefreshCw size={16}/> تحميل آخر نسخة</button>
   <button type="button" onClick={()=>void save()} disabled={busy||!dirty} className="ad-button primary"><Save size={18}/>{busy?'جاري الحفظ…':'حفظ ونشر التعديلات'}</button>
  </div>
  {dirty&&<p className="ad-status warning">عندك تغييرات بعد ما انحفظت. اضغط «حفظ ونشر» حتى تظهر للطلاب.</p>}
  {message&&<p className={'ad-status '+(message.type==='bad'?'error':'success')}>{message.text}</p>}
  {!data?<p>جاري تحميل محتوى المشروع…</p>:<>
  {section!=='announcements'&&<label style={labelStyle}>اختَر الفصل
   <select style={fieldStyle} value={chapter} onChange={e=>{setChapter(Number(e.target.value));setLessonId('');setSearch('')}}>{data.chapters.sort((a,b)=>a.order-b.order).map(x=><option key={x.id} value={x.id}>الفصل {x.id} — {x.title}</option>)}</select>
  </label>}
  {section==='chapters'&&chapterInfo&&<section style={{...sectionStyle,marginTop:16}}>
   <label style={labelStyle}>عنوان الفصل<input style={fieldStyle} value={chapterInfo.title} onChange={e=>setChapterField('title',e.target.value)}/></label>
   <label style={labelStyle}>وصف الفصل<textarea style={fieldStyle} rows={4} value={chapterInfo.description} onChange={e=>setChapterField('description',e.target.value)}/></label>
   <label style={labelStyle}>ترتيب الفصل<input style={fieldStyle} type="number" min={1} value={chapterInfo.order} onChange={e=>setChapterField('order',Number(e.target.value))}/></label>
   <label style={{...labelStyle,display:'flex',alignItems:'center'}}><input type="checkbox" checked={chapterInfo.visible} onChange={e=>setChapterField('visible',e.target.checked)}/> إظهار الفصل للطلاب</label>
   <div style={{display:'flex',alignItems:'center',gap:12,flexWrap:'wrap',marginTop:17}}>{imageUpload('chapter')}{preview(chapterInfo.image)}{chapterInfo.image&&<button type="button" style={miniBtn} onClick={()=>setChapterField('image','')}><X size={16}/> حذف ربط الصورة</button>}</div>
  </section>}
  {section==='lessons'&&<div style={{display:'grid',gridTemplateColumns:'minmax(210px,.62fr) minmax(260px,1fr)',gap:13,marginTop:16}}>
    <section style={sectionStyle}>
     <input style={fieldStyle} type="search" placeholder="ابحث عن الدرس…" value={search} onChange={e=>setSearch(e.target.value)}/>
     <div style={{display:'grid',gap:5,maxHeight:530,overflowY:'auto',marginTop:12}}>
      {lessons.map(l=><button type="button" key={l.id} style={{...miniBtn,justifyContent:'space-between',background:active?.id===l.id?'#e8e2fc':'#f9f9fc',textAlign:'right',width:'100%'}} onClick={()=>setLessonId(l.id)}><span>{l.title}</span>{l.visible?<Eye size={14}/>:<EyeOff size={14}/>}</button>)}
     </div>
     <button type="button" style={{...miniBtn,width:'100%',justifyContent:'center',marginTop:13}} onClick={addLesson}><PlusCircle size={17}/> إضافة درس جديد</button>
    </section>
    <section style={sectionStyle}>{active?<>
     <label style={labelStyle}>عنوان الدرس<input style={fieldStyle} value={active.title} onChange={e=>setLessonField('title',e.target.value)}/></label>
     <label style={labelStyle}>نص الشرح والتفاصيل<textarea style={fieldStyle} rows={11} value={active.text} onChange={e=>setLessonField('text',e.target.value)} placeholder="اكتب النص الحقيقي للدروس هنا…"/></label>
     <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
      <label style={labelStyle}>صفحة الكتاب<input type="number" style={fieldStyle} value={active.page} min={0} onChange={e=>setLessonField('page',Number(e.target.value))}/></label>
      <label style={labelStyle}>ترتيب الدرس<input type="number" style={fieldStyle} value={active.order} min={1} onChange={e=>setLessonField('order',Number(e.target.value))}/></label>
     </div>
     <label style={labelStyle}>سؤال المراجعة<textarea rows={3} style={fieldStyle} value={active.question} onChange={e=>setLessonField('question',e.target.value)}/></label>
     <label style={labelStyle}>جواب المراجعة<textarea rows={3} style={fieldStyle} value={active.answer} onChange={e=>setLessonField('answer',e.target.value)}/></label>
     <label style={{...labelStyle,display:'flex',alignItems:'center',marginBottom:16}}><input type="checkbox" checked={active.visible} onChange={e=>setLessonField('visible',e.target.checked)}/> نشر الدرس للطلاب</label>
     <b style={{fontSize:13}}>صور الدرس</b><p className="ad-muted">يمكنك إضافة أكثر من صورة، والتسجيل الصوتي يُدار من قسم الصوت.</p>
     <div style={{display:'flex',flexWrap:'wrap',gap:9,margin:'12px 0'}}>
      {(active.images||[]).map((image,i)=><div key={image+i} style={{position:'relative',padding:4}}>{preview(image)}
       <button type="button" aria-label="حذف الصورة" onClick={()=>setLessonField('images',active.images.filter((_,index)=>index!==i))} style={{position:'absolute',top:0,left:0,border:0,borderRadius:30,background:'#fce5e5',color:'#9f3030',padding:4}}><X size={15}/></button>
      </div>)}
     </div>
     <div style={{display:'flex',gap:10,justifyContent:'space-between',flexWrap:'wrap'}}>{imageUpload('lesson')}<button type="button" style={{...miniBtn,color:'#ae4051',background:'#fff1f3'}} onClick={removeLesson}><Trash2 size={16}/> حذف الدرس</button></div>
    </>:<p className="ad-muted">اختَر درساً أو أضف درساً جديداً.</p>}</section>
   </div>}
  {section==='announcements'&&<div style={{display:'grid',gridTemplateColumns:'minmax(200px,.6fr) 1fr',gap:13}}>
    <section style={sectionStyle}><button type="button" style={{...miniBtn,marginBottom:10}} onClick={addAnnouncement}><PlusCircle size={17}/> إعلان جديد</button>{data.announcements.map(a=><button key={a.id} style={{...miniBtn,width:'100%',marginBottom:6,justifyContent:'space-between'}} onClick={()=>setAnnouncementId(a.id)}>{a.title}{a.visible?<Eye size={14}/>:<EyeOff size={14}/>}</button>)}</section>
    <section style={sectionStyle}>{announcement?<><label style={labelStyle}>العنوان<input style={fieldStyle} value={announcement.title} onChange={e=>setAnnouncementField('title',e.target.value)}/></label>
     <label style={labelStyle}>نص الإعلان<textarea style={fieldStyle} rows={5} value={announcement.text} onChange={e=>setAnnouncementField('text',e.target.value)}/></label>
     <label style={{...labelStyle,display:'flex',alignItems:'center'}}><input type="checkbox" checked={announcement.visible} onChange={e=>setAnnouncementField('visible',e.target.checked)}/> إظهار الإعلان</label>
     <div style={{display:'flex',gap:12,alignItems:'center',marginTop:14}}>{imageUpload('announcement')}{preview(announcement.image)}</div>
     <button type="button" style={{...miniBtn,color:'#ae4051',background:'#fff1f3',marginTop:16}} onClick={()=>{if(confirm('حذف الإعلان؟'))update(x=>{x.announcements=x.announcements.filter(y=>y.id!==announcement.id)})}}><Trash2 size={16}/> حذف الإعلان</button>
    </>:<p className="ad-muted">أضف إعلاناً للصفحة الرئيسية.</p>}</section>
   </div>}
  </>}
  <p className="ad-footnote" style={{marginTop:20}}><AlertCircle size={14} style={{display:'inline',verticalAlign:'middle'}}/> تعديلات المحتوى تُحفظ في مشروع نَبْض وتظهر بعد إتمام نشر الموقع. ملفات الصورة المرفوعة عامة عند نشرها. لا ترفع معلومات خاصة بالطلاب أو مفاتيح سرية.</p>
 </div>;
}
export default {title:'المحتوى والصور',description:'تحرير الدروس والفصول وإضافة الصور والإعلانات، مع نشر التعديلات على التطبيق.',Component:Editor};
