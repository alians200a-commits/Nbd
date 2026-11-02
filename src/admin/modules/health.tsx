import React, { useEffect, useState } from 'react';
import { CheckCircle2, CircleAlert, RefreshCw } from 'lucide-react';

const resources=[
  {title:'واجهة الطالب',path:'index.html'},
  {title:'صفحة الدروس',path:'learn.html'},
  {title:'بنك الأسئلة',path:'exam-bank.html'},
  {title:'المختبر',path:'simulations.html'},
  {title:'فهرس صوت المعلّمة',path:'nabd-voice/library.json'},
  {title:'الشرح الصوتي المعتمد',path:'nabd-voice/neuron-baghdad-sulafat.wav'},
];
function HealthModule(){
  const [results,setResults]=useState<{title:string;ok:boolean;detail:string}[]>([]);
  const [busy,setBusy]=useState(false);
  const test=async()=>{
    setBusy(true);
    const list=await Promise.all(resources.map(async r=>{
      try{
        const response=await fetch(import.meta.env.BASE_URL+r.path,{method:'HEAD',cache:'no-store'});
        return {title:r.title,ok:response.ok,detail:response.ok?'متوفر':'خطأ '+response.status};
      }catch{return {title:r.title,ok:false,detail:'تعذّر الوصول'}}
    }));
    setResults(list);setBusy(false);
  };
  useEffect(()=>{void test()},[]);
  return <div>
    <p style={{color:'#788398',fontSize:13,lineHeight:1.9}}>هذا مثال على إضافة إدارية تُكتشف تلقائياً من مجلد الوحدات. يفحص ملفات الطالب المنشورة، بدون الوصول لمعلومات شخصية.</p>
    <button type="button" className="ad-button light" onClick={()=>void test()} disabled={busy}><RefreshCw size={16}/> {busy?'جاري الفحص…':'إعادة فحص الملفات'}</button>
    <div style={{display:'grid',gap:9,marginTop:15}}>
      {results.map(x=><div key={x.title} style={{display:'flex',alignItems:'center',gap:10,border:'1px solid #eeedf5',padding:13,borderRadius:12}}>
        {x.ok?<CheckCircle2 size={20} color="#229976"/>:<CircleAlert size={20} color="#b86646"/>}
        <strong style={{flex:1,fontSize:13}}>{x.title}</strong><small style={{color:x.ok?'#178563':'#b0603a'}}>{x.detail}</small>
      </div>)}
    </div>
  </div>;
}
export default {
  title:'فحص تشغيل التطبيق',
  description:'يتحقق من صفحات الطالب والصوت المعتمد بعد كل تحديث ونشر.',
  Component:HealthModule
};
