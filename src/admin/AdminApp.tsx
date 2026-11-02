import React, { useEffect, useRef, useState } from 'react';
import {
  Activity, AudioLines, BookOpen, Check, CheckCircle2, ChevronLeft, CircleAlert,
  Clock3, Download, FileAudio, FileCheck2, FolderOpen, Headphones, KeyRound, LockKeyhole,
  LogOut, Menu, Play, RefreshCw, Save, Settings2, ShieldCheck, Sparkles, Users, Waves, X
} from 'lucide-react';
import { adminModules, biologyChapters, discoveredViews, studentFeatures } from './featureCatalog';
import { GithubAdmin, extractWav, type WorkflowRun, type Artifact, type Commit } from './githubClient';

type Page = 'home' | 'generate' | 'review' | 'features' | 'settings' | string;
type PublicClip = { title:string;file:string;voice:string;approved:boolean };
const GENERATOR='gemini-baghdad-voice.yml';
const APPROVER='approve-nabd-gemini-voice.yml';
const voiceBase='https://alians200a-commits.github.io/Nbd/nabd-voice/';
const messages:Record<string,string> = {queued:'بالانتظار',in_progress:'قيد التنفيذ',completed:'مكتمل',success:'نجحت',failure:'فشلت',cancelled:'أُلغيت'};

const fmtDate=(date:string)=>new Date(date).toLocaleString('ar-IQ',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'});
const describe=(run:WorkflowRun)=>run.status==='completed'
  ? messages[run.conclusion||'']||'مكتمل'
  : messages[run.status]||run.status;

function Status({children,type='info'}:{children:React.ReactNode;type?:'success'|'warning'|'error'|'info'}){
  return <p className={'ad-status '+type} role="status">{children}</p>;
}

export function AdminApp(){
  const [api,setApi]=useState<GithubAdmin|null>(null);
  const [token,setToken]=useState('');
  const [account,setAccount]=useState('');
  const [signingIn,setSigningIn]=useState(false);
  const [page,setPage]=useState<Page>('home');
  const [mobileOpen,setMobileOpen]=useState(false);
  const [message,setMessage]=useState('');
  const [messageType,setMessageType]=useState<'info'|'success'|'warning'|'error'>('info');
  const [loading,setLoading]=useState(false);
  const [runs,setRuns]=useState<WorkflowRun[]>([]);
  const [approvals,setApprovals]=useState<WorkflowRun[]>([]);
  const [commits,setCommits]=useState<Commit[]>([]);
  const [published,setPublished]=useState<Record<string,PublicClip>>({});
  const [chapter,setChapter]=useState(1);
  const [lesson,setLesson]=useState(1);
  const [topic,setTopic]=useState('الخلية العصبية');
  const [script,setScript]=useState('هلا حبايبي! اليوم راح نتعرّف على الخلية العصبية. الخلية العصبية هي الوحدة التركيبية والوظيفية الأساسية للجهاز العصبي. التشجرات تستقبل الإشارات، والمحور ينقل الإيعاز العصبي باتجاه النهايات العصبية.');
  const [selectedRun,setSelectedRun]=useState<WorkflowRun|null>(null);
  const [artifacts,setArtifacts]=useState<Artifact[]>([]);
  const [reviewed,setReviewed]=useState(false);
  const [audioUrl,setAudioUrl]=useState<string|null>(null);
  const [reviewBusy,setReviewBusy]=useState(false);
  const [readyForReview,setReadyForReview]=useState(false);
  const downloadedUrl=useRef<string|null>(null);

  const flash=(text:string,type:typeof messageType='info')=>{setMessage(text);setMessageType(type)};
  const lessonKey=`chapter${chapter}/lesson/${String(lesson).padStart(2,'0')}`;
  const publishedEntries=Object.entries(published);
  const isModule=adminModules.find(x=>x.id===page);

  async function loadPublic(){
    try{
      const r=await fetch(voiceBase+'library.json',{cache:'no-store'});
      if(!r.ok)throw Error('تعذّر قراءة فهرس التسجيلات');
      const content=(await r.json()) as {clips?:Record<string,PublicClip>};
      setPublished(content.clips||{});
    }catch{setPublished({});}
  }
  const refresh=async(client=api)=>{
    if(!client)return;
    setLoading(true);
    try{
      const [voiceResults,approvalResults,changeResults]=await Promise.all([
        client.runs(GENERATOR),client.runs(APPROVER),client.commits()
      ]);
      setRuns(voiceResults);setApprovals(approvalResults);setCommits(changeResults);
      await loadPublic();
      setMessage('');
    }catch(e){flash((e as Error).message,'error')}
    finally{setLoading(false)}
  };

  useEffect(()=>{void loadPublic()},[]);
  useEffect(()=>()=>{if(downloadedUrl.current)URL.revokeObjectURL(downloadedUrl.current)},[]);

  async function connect(event:React.FormEvent){
    event.preventDefault();if(!token.trim())return;
    setSigningIn(true);
    try{
      const client=new GithubAdmin(token.trim());
      const username=await client.verify();
      setApi(client);setAccount(username);setToken('');flash('تم التحقق من صلاحية الإدارة بنجاح','success');
      await refresh(client);
    }catch(e){flash((e as Error).message,'error')}
    finally{setSigningIn(false)}
  }
  const signOut=()=>{
    setApi(null);setAccount('');setToken('');setRuns([]);setApprovals([]);setCommits([]);
    setSelectedRun(null);setArtifacts([]);setReviewed(false);setReadyForReview(false);
    if(downloadedUrl.current){URL.revokeObjectURL(downloadedUrl.current);downloadedUrl.current=null}
    setAudioUrl(null);setPage('home');flash('تم قفل لوحة الإدارة','info');
  };
  async function dispatchVoice(event:React.FormEvent){
    event.preventDefault();if(!api)return;
    if(topic.trim().length<3||script.trim().length<30||script.length>3000){
      flash('اكتب عنواناً صحيحاً ونص شرح من 30 إلى 3000 حرف','warning');return;
    }
    if(!confirm('تشغيل توليد صوت جديد من Gemini؟ سيتم استهلاك محاولة من حصة حسابك.'))return;
    setLoading(true);
    try{
      await api.dispatch(GENERATOR,{request_file:'voice-requests/test-neuron-baghdad.json',
        lesson_key:lessonKey,topic:topic.trim(),script:script.trim()});
      flash('انرسل طلب توليد الصوت. افتح مراجعة التسجيلات وتأكد من النتيجة قبل الاعتماد.','success');
      setPage('review');setSelectedRun(null);
      await refresh(api);
    }catch(e){flash((e as Error).message,'error')}
    finally{setLoading(false)}
  }
  async function chooseRun(run:WorkflowRun){
    setSelectedRun(run);setReviewed(false);setReadyForReview(false);setArtifacts([]);
    setAudioUrl(null);setMessage('');
    if(downloadedUrl.current){URL.revokeObjectURL(downloadedUrl.current);downloadedUrl.current=null}
    if(!api||run.conclusion!=='success')return;
    try{setReviewBusy(true);setArtifacts(await api.artifacts(run.id))}
    catch(e){flash((e as Error).message,'error')}
    finally{setReviewBusy(false)}
  }
  async function downloadDraft(artifact:Artifact){
    if(!api||!selectedRun)return;
    setReviewBusy(true);
    try{
      const zip=await api.artifactZip(artifact.id);
      const wav=await extractWav(zip);
      if(downloadedUrl.current)URL.revokeObjectURL(downloadedUrl.current);
      const u=URL.createObjectURL(wav);
      downloadedUrl.current=u;setAudioUrl(u);setReadyForReview(true);setReviewed(false);
      flash('انفتح التسجيل للمراجعة داخل لوحة الإدارة. اسمعه كاملاً قبل الموافقة.','success');
    }catch(e){
      flash('تعذّرت معاينة الأرشيف داخل التطبيق: '+(e as Error).message,'error');
    }finally{setReviewBusy(false)}
  }
  async function approve(){
    if(!api||!selectedRun||!reviewed||!readyForReview||selectedRun.conclusion!=='success')return;
    if(!confirm('تأكيد نهائي: هل راجعت النص والمعلومة والصوت، وتوافق على نشره لجميع الطلاب؟'))return;
    setLoading(true);
    try{
      await api.dispatch(APPROVER,{source_run:String(selectedRun.id),confirm_review:'true'});
      flash('انرسل طلب النشر. بعد نجاح مهمة الاعتماد يظهر الدرس تلقائياً عند الطالب.','success');
      setReviewed(false);await refresh(api);
    }catch(e){flash((e as Error).message,'error')}
    finally{setLoading(false)}
  }
  const selectPage=(p:Page)=>{setPage(p);setMobileOpen(false);setMessage('')};
  const sidebarItems=[
    {id:'home',title:'نظرة عامة',icon:Activity},
    {id:'generate',title:'توليد صوت المعلّمة',icon:AudioLines},
    {id:'review',title:'مراجعة واعتماد الصوت',icon:FileCheck2},
    {id:'features',title:'المميزات والتحديثات',icon:FolderOpen},
    {id:'settings',title:'إعدادات وصلاحيات',icon:Settings2},
  ] as const;

  if(!api)return <div className="ad-login-layout" dir="rtl">
    <div className="ad-login-hero">
      <span className="ad-logo"><Waves size={25}/> نَبْض</span>
      <h1>لوحة الإدارة<br/><em>كل شغلك بمكان واحد.</em></h1>
      <p>توليد صوت المعلّمة، سماع المسودات، اعتماد الدروس، ومتابعة ميزات التطبيق، بدون دخول لصفحات GitHub.</p>
      <div className="ad-login-points"><span><ShieldCheck size={18}/> صلاحيات الإدارة فقط</span><span><Headphones size={18}/> صوت المعلّمة المعتمد</span><span><Sparkles size={18}/> تحديث تلقائي مع المشروع</span></div>
    </div>
    <div className="ad-login-panel">
      <div className="ad-login-icon"><LockKeyhole size={29}/></div>
      <h2>دخول مدير نَبْض</h2>
      <p className="ad-muted">هذا مدخل خاص داخل التطبيق. للتحقق الآمن نستخدم صلاحية حساب مالك GitHub، مو كلمة سر مخزونة بالموقع.</p>
      <form onSubmit={connect}>
        <label htmlFor="nabd-admin-token">رمز الدخول الإداري</label>
        <input id="nabd-admin-token" type="password" autoComplete="off" spellCheck={false} value={token} onChange={e=>setToken(e.target.value)} placeholder="ألصق رمز وصول GitHub المحدود"/>
        <small>ما ينحفظ الرمز ولا ينرسل لخادم نَبْض؛ يُستخدم مباشرة للتحقق مع GitHub ويُمسح عند الخروج أو إغلاق الصفحة. يحتاج صلاحيات قراءة المستودع وتنفيذ مهام Actions.</small>
        <button type="submit" className="ad-button primary full" disabled={signingIn||!token.trim()}>
          {signingIn?'جاري التحقق…':'دخول لوحة الإدارة'} <ChevronLeft size={18}/>
        </button>
      </form>
      {message&&<Status type={messageType}>{message}</Status>}
      <a className="ad-student-link" href="./index.html">الرجوع لواجهة الطالب</a>
      <p className="ad-footnote">لا يكفي فتح رابط اللوحة للوصول للإدارة. العمليات الحساسة تنفذها خدمة GitHub بعد التحقق من صلاحية مالك المستودع.</p>
    </div>
  </div>;

  return <div className="ad-app" dir="rtl">
    {mobileOpen&&<button className="ad-menu-overlay" onClick={()=>setMobileOpen(false)} aria-label="إغلاق القائمة"/>}
    <aside className={'ad-sidebar '+(mobileOpen?'opened':'')}>
      <div className="ad-brand"><div className="ad-brand-icon"><Waves size={25}/></div><div><b>نَبْض</b><small>لوحة الإدارة</small></div></div>
      <div className="ad-side-label">إدارة المشروع</div>
      <nav aria-label="التنقل داخل لوحة الإدارة">
        {sidebarItems.map(item=><button type="button" key={item.id} className={page===item.id?'selected':''} onClick={()=>selectPage(item.id)}>
          <item.icon size={19}/><span>{item.title}</span>{page===item.id&&<span className="ad-nav-dot"/>}
        </button>)}
      </nav>
      {adminModules.length>0&&<><div className="ad-side-label">وحدات مستقبلية</div><nav>{adminModules.map(item=><button type="button" key={item.id} className={page===item.id?'selected':''} onClick={()=>selectPage(item.id)}>
        <Sparkles size={19}/><span>{item.title}</span>
      </button>)}</nav></>}
      <div className="ad-sidebar-bottom">
        <div className="ad-account"><span className="ad-avatar">{account.slice(0,1).toUpperCase()}</span><div><b>مدير المشروع</b><small>{account}</small></div></div>
        <button type="button" className="ad-logout" onClick={signOut}><LogOut size={17}/> تسجيل الخروج</button>
      </div>
    </aside>
    <main className="ad-main">
      <header className="ad-top">
        <button type="button" className="ad-mobile-button" aria-label="فتح قائمة الإدارة" onClick={()=>setMobileOpen(true)}><Menu size={23}/></button>
        <div className="ad-pageheading"><span>نَبْض / الإدارة</span><h1>{sidebarItems.find(x=>x.id===page)?.title||isModule?.title||'لوحة الإدارة'}</h1></div>
        <div className="ad-top-actions"><span className="ad-verified"><ShieldCheck size={16}/> دخول موثّق</span>
          <button className="ad-button light" type="button" onClick={()=>void refresh()} disabled={loading}><RefreshCw size={16} className={loading?'ad-spin':''}/> تحديث</button>
        </div>
      </header>
      <div className="ad-content">
        {message&&<Status type={messageType}>{message}</Status>}
        {page==='home'&&<>
          <div className="ad-intro"><div><span className="ad-eyebrow">صباح الخير يا مدير نَبْض <Sparkles size={17}/></span><h2>كل أدوات الإدارة،<br/>بواجهة وحدة.</h2><p>أنشئ التسجيلات وراجعها، وبعد موافقتك بس تظهر للطلاب. التعديلات الجديدة بالمشروع تنضاف تلقائياً إلى فهرس المميزات.</p><button className="ad-button white" type="button" onClick={()=>selectPage('generate')}>إنشاء شرح صوتي <ChevronLeft size={18}/></button></div><div className="ad-intro-graphic"><AudioLines size={94} strokeWidth={1.1}/><span>نَبْض · إدارة ذكية</span></div></div>
          <div className="ad-stats">
            <div className="ad-stat"><span className="ad-stat-icon purple"><BookOpen size={22}/></span><strong>{biologyChapters.length}</strong><small>فصل دراسي</small></div>
            <div className="ad-stat"><span className="ad-stat-icon green"><Headphones size={22}/></span><strong>{publishedEntries.length}</strong><small>تسجيل صوتي منشور</small></div>
            <div className="ad-stat"><span className="ad-stat-icon gold"><Clock3 size={22}/></span><strong>{runs.filter(x=>x.status!=='completed').length}</strong><small>محاولات قيد التنفيذ</small></div>
            <div className="ad-stat"><span className="ad-stat-icon blue"><Sparkles size={22}/></span><strong>{studentFeatures.length}</strong><small>ميزة متصلة بالتطبيق</small></div>
          </div>
          <div className="ad-two-columns">
            <section className="ad-panel"><div className="ad-section-top"><h3>مهام سريعة</h3><span>الإدارة</span></div><div className="ad-quick-grid">
              <button onClick={()=>selectPage('generate')}><span className="ad-quick-icon lavender"><AudioLines size={25}/></span><strong>توليد درس</strong><small>بصوت سلافات العراقي</small></button>
              <button onClick={()=>selectPage('review')}><span className="ad-quick-icon mint"><FileCheck2 size={25}/></span><strong>مراجعة الصوت</strong><small>اسمع واعتمد قبل النشر</small></button>
              <button onClick={()=>selectPage('features')}><span className="ad-quick-icon sky"><Sparkles size={25}/></span><strong>مميزات التطبيق</strong><small>تتحدث مع كل إصدار</small></button>
            </div></section>
            <section className="ad-panel"><div className="ad-section-top"><h3>آخر التسجيلات</h3><button onClick={()=>selectPage('review')}>عرض الكل <ChevronLeft size={16}/></button></div>
              {runs.length?runs.slice(0,4).map(x=><div className="ad-activity" key={x.id}><div className={'ad-dot '+(x.conclusion==='success'?'ok':x.conclusion==='failure'?'bad':'pending')}/><div><b>محاولة توليد #{x.run_number}</b><small>{fmtDate(x.created_at)}</small></div><span>{describe(x)}</span></div>):
                <p className="ad-muted">ماكو محاولات مسجلة بعد.</p>}
            </section>
          </div>
        </>}
        {page==='generate'&&<div className="ad-two-columns form-layout">
          <section className="ad-panel">
            <div className="ad-section-top"><div><h3>إنشاء شرح بصوت المعلّمة</h3><p>تختار الموضوع، تكتب الشرح المدقّق، وتضغط توليد. ما تحتاج أي برمجة.</p></div><span className="ad-chip">Gemini 3.1</span></div>
            <form onSubmit={dispatchVoice} className="ad-form">
              <div className="ad-form-grid">
                <label>الفصل الدراسي
                  <select value={chapter} onChange={e=>setChapter(Number(e.target.value))}>
                    {biologyChapters.map(x=><option key={x.id} value={x.id}>{x.id} — {x.title}</option>)}
                  </select>
                </label>
                <label>الدرس
                  <select value={lesson} onChange={e=>setLesson(Number(e.target.value))}>
                    {[1,2,3,4].map(x=><option key={x} value={x}>الدرس {x}</option>)}
                  </select>
                </label>
              </div>
              <label>عنوان الموضوع<input value={topic} maxLength={120} onChange={e=>setTopic(e.target.value)} placeholder="مثلاً: الخلية العصبية"/></label>
              <label>نص الشرح باللهجة العراقية
                <textarea rows={9} dir="rtl" value={script} onChange={e=>setScript(e.target.value)} maxLength={3000} placeholder="اكتب النص العلمي المدقق اللي تريد المعلّمة تقرأه…"/>
              </label>
              <div className="ad-form-footer"><small>{script.length} / 3000 حرف</small><small>هوية الصوت: سلافات · بغدادي دافئ</small></div>
              <button className="ad-button primary" disabled={loading||script.trim().length<30} type="submit"><Play size={18}/> توليد الصوت الآن</button>
            </form>
          </section>
          <aside className="ad-right-notes">
            <div className="ad-panel"><h3>شلون تشتغل العملية؟</h3><div className="ad-steps">
              <div><span>١</span><p><b>نص مدقّق</b><small>اكتب المعلومات من الكتاب أو الملزمة</small></p></div>
              <div><span>٢</span><p><b>صوت تجريبي</b><small>Gemini يولّد المقطع بدون نشره</small></p></div>
              <div><span>٣</span><p><b>استماع ومراجعة</b><small>تسمع وتتأكد من النطق واللهجة</small></p></div>
              <div><span>٤</span><p><b>موافقة ونشر</b><small>يظهر للطالب فقط بعد اعتمادك</small></p></div>
            </div></div>
            <div className="ad-panel"><div className="ad-bullet-title"><ShieldCheck size={20}/><b>خصوصية الحساب</b></div><p className="ad-muted">مفتاح Gemini محفوظ بإعدادات المشروع ولا يظهر للطلاب أو داخل هذه اللوحة. كل محاولة قد تُحسب من حصتك المتاحة.</p></div>
          </aside>
        </div>}
        {page==='review'&&<div className="ad-two-columns review-layout">
          <section className="ad-panel">
            <div className="ad-section-top"><h3>محاولات توليد الصوت</h3><span>{runs.length} محاولة</span></div>
            <div className="ad-runs">
              {runs.map(run=><button type="button" key={run.id} className={'ad-run '+(selectedRun?.id===run.id?'active':'')} onClick={()=>void chooseRun(run)}>
                <span className={'ad-run-icon '+(run.conclusion==='success'?'success':run.conclusion==='failure'?'failed':'working')}><FileAudio size={20}/></span>
                <span><b>تسجيل صوتي #{run.run_number}</b><small>{fmtDate(run.created_at)}</small></span>
                <span className={'ad-run-result '+(run.conclusion==='success'?'success':run.conclusion==='failure'?'failed':'working')}>{describe(run)}</span>
              </button>)}
              {!runs.length&&<p className="ad-muted">ماكو تسجيلات حتى الآن. افتح «توليد صوت المعلّمة» وسوّي أول تسجيل.</p>}
            </div>
          </section>
          <section className="ad-panel">
            <div className="ad-section-top"><h3>الاستماع والاعتماد</h3><ShieldCheck size={20}/></div>
            {!selectedRun?<div className="ad-empty"><Headphones size={47}/><h4>اختَر محاولة من القائمة</h4><p>تسمع التسجيل وتراجعه هنا قبل إرساله للطلاب.</p></div>:
             selectedRun.conclusion!=='success'?<div className="ad-empty"><CircleAlert size={40}/><h4>التسجيل غير جاهز للاعتماد</h4><p>الحالة: {describe(selectedRun)}. حدّث القائمة بعد انتهاء التوليد.</p></div>:
              <div className="ad-review-body">
                <div className="ad-clip-title"><FileAudio size={22}/><div><b>التسجيل #{selectedRun.run_number}</b><small>Gemini 3.1 · صوت سلافات</small></div></div>
                <p className="ad-muted">اضغط «فتح التسجيل» حتى تسمعه من داخل لوحة الإدارة، وبعدها وافق عليه فقط إذا النطق والمعلومة صحيحين.</p>
                {artifacts.filter(a=>!a.expired).map(a=><button type="button" key={a.id} className="ad-button light full" disabled={reviewBusy} onClick={()=>void downloadDraft(a)}><Download size={18}/>{reviewBusy?'جاري جلب الصوت…':'فتح التسجيل للاستماع'}</button>)}
                {!artifacts.length&&!reviewBusy&&<Status type="warning">ماكو حزمة صوت متاحة لهالمحاولة. جرّب تحديث القائمة.</Status>}
                {audioUrl&&<div className="ad-player"><b>معاينة المقطع</b><audio src={audioUrl} controls preload="auto" aria-label="معاينة تسجيل Gemini قبل النشر"/><a href={audioUrl} download="nabd-gemini-review.wav">تحميل نسخة المراجعة <Download size={14}/></a></div>}
                <label className={'ad-check '+(!readyForReview?'disabled':'')}><input type="checkbox" checked={reviewed} disabled={!readyForReview} onChange={e=>setReviewed(e.target.checked)}/><span>استمعت للتسجيل وراجعت صحة المعلومات والنطق واللهجة، وأوافق على نشره للطلاب.</span></label>
                <button type="button" className="ad-button primary full" disabled={!readyForReview||!reviewed||loading} onClick={()=>void approve()}><Check size={19}/> اعتماد ونشر التسجيل</button>
                <p className="ad-footnote">بعد نجاح مهمة النشر، يتحدث فهرس الصوت في التطبيق تلقائياً. الاعتماد مو تلقائي أبداً.</p>
              </div>
            }
            {!!approvals.length&&<div className="ad-published-log"><h4>آخر عمليات الاعتماد</h4>{approvals.slice(0,3).map(r=><div key={r.id}><span>عملية #{r.run_number}</span><small>{describe(r)}</small></div>)}</div>}
          </section>
        </div>}
        {page==='features'&&<>
          <section className="ad-panel"><div className="ad-section-top"><div><h3>أقسام التطبيق المكتشفة تلقائياً</h3><p>هذا الفهرس يتجدد من ملفات المشروع الفعلية مع كل بناء جديد.</p></div><span className="ad-chip">{studentFeatures.length} قسم</span></div>
            <div className="ad-feature-grid">{studentFeatures.map(item=><div className="ad-feature" key={item.id}><span className="ad-feature-symbol"><CheckCircle2 size={19}/></span><div><b>{item.title}</b><small>{item.id}</small></div><span className="ad-online">موجود</span></div>)}</div>
            <p className="ad-footnote">كذلك يكتشف النظام {discoveredViews.length} ملف عرض تعليمي. أي صفحة عرض جديدة أو مسار جديد في التطبيق تظهر هنا بعد رفع التحديث وبناء الموقع.</p>
          </section>
          <section className="ad-panel"><div className="ad-section-top"><h3>آخر التعديلات على المشروع</h3><RefreshCw size={18}/></div>
            {commits.map(c=><div className="ad-change" key={c.sha}><span className="ad-change-icon"><CheckCircle2 size={18}/></span><div><b>{c.commit.message.split('\n')[0]}</b><small>{c.commit.author?.date?fmtDate(c.commit.author.date):''} · {c.sha.slice(0,7)}</small></div></div>)}
            {!commits.length&&<p className="ad-muted">تحتاج تحديث قائمة التغييرات.</p>}
          </section>
        </>}
        {page==='settings'&&<div className="ad-two-columns form-layout">
          <section className="ad-panel"><h3>صلاحيات لوحة الإدارة</h3><div className="ad-settings-list">
            <div><ShieldCheck size={22}/><span><b>المدير الحالي</b><small>{account} — تم التحقق من ملكية الحساب وصلاحية المستودع</small></span><CheckCircle2 size={20}/></div>
            <div><KeyRound size={22}/><span><b>مفتاح Gemini</b><small>موجود بمخزن GitHub Secrets، وليس بملفات التطبيق أو المتصفح</small></span><CheckCircle2 size={20}/></div>
            <div><Users size={22}/><span><b>واجهة الطلاب</b><small>تظهر التسجيلات المعتمدة فقط، بدون أدوات إنشاء أو موافقة</small></span><CheckCircle2 size={20}/></div>
            <div><Sparkles size={22}/><span><b>التحديثات الجديدة</b><small>المسارات وأدوات الإدارة المسجلة تظهر تلقائياً بعد بناء نسخة جديدة</small></span><CheckCircle2 size={20}/></div>
          </div></section>
          <section className="ad-panel"><h3>أمان الحساب</h3><p className="ad-muted">رمز GitHub يُستخدم للاتصال المباشر بمهمات الإدارة فقط، ويبقى بذاكرة هذه الصفحة إلى أن تسجل الخروج أو تغلقها. لا تشاركه ويا أي شخص.</p><button className="ad-button light full" onClick={signOut}><LogOut size={17}/> قفل لوحة الإدارة</button><p className="ad-footnote">هذا دخول بمفتاح GitHub، مو نظام حسابات مستقل. نظام دخول بكلمة مرور أو بريد يتطلب خدمة توثيق خادمية منفصلة.</p></section>
        </div>}
        {isModule&&<section className="ad-panel"><h3>{isModule.title}</h3><p className="ad-muted">{isModule.description}</p><isModule.Component/></section>}
        <footer className="ad-footer"><span>نَبْض · إدارة المشروع</span><span>التعليم أولاً · واجهة خاصة بالمدير</span></footer>
      </div>
    </main>
  </div>;
}
