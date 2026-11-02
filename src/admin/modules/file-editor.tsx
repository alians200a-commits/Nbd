import React,{useState} from 'react';
import { Code2,FileText,RefreshCw,Save,TriangleAlert } from 'lucide-react';
import {useAdminClient} from '../AdminContext';
const editable=/^(?:src\/|data\/|assets\/|public\/|)(?:[a-zA-Z0-9._/-]+)\.(?:tsx?|jsx?|css|json|md|html)$/;
function base64Text(src:string){
 const binary=atob(src.replace(/\s/g,''));
 const data=new Uint8Array(binary.length);
 for(let i=0;i<binary.length;i++)data[i]=binary.charCodeAt(i);
 return new TextDecoder().decode(data);
}
function encodeText(src:string){
 const bytes=new TextEncoder().encode(src);let binary='';
 for(let i=0;i<bytes.length;i+=8192)binary+=String.fromCharCode(...bytes.subarray(i,i+8192));
 return btoa(binary);
}
function AdvancedEditor(){
 const client=useAdminClient();
 const [path,setPath]=useState('src/styles/nabd-reference-v13.css');
 const [content,setContent]=useState('');
 const [original,setOriginal]=useState('');
 const [sha,setSha]=useState('');
 const [busy,setBusy]=useState(false);
 const [status,setStatus]=useState('');
 const [error,setError]=useState(false);
 const validate=(p:string)=>editable.test(p)&&!p.includes('..')&&!p.includes('node_modules')&&!p.includes('.github')&&!/\.env|secret|token|key/i.test(p)&&!p.startsWith('/');
 const open=async()=>{
  if(!validate(path)){setError(true);setStatus('مسار غير مسموح؛ اختَر ملف نصي من الشيفرة أو بيانات التطبيق فقط');return}
  setBusy(true);
  try{
   const v=await client.request<{sha:string;encoding:string;content:string;size:number}>('/contents/'+path+'?ref=main');
   if(v.encoding!=='base64'||v.size>350000){throw Error('الملف غير نصي أو أكبر من الحد المسموح للمحرر')}
   const txt=base64Text(v.content);
   setSha(v.sha);setContent(txt);setOriginal(txt);setError(false);setStatus('انفتح الملف. عدّل محتواه ثم احفظ.');
  }catch(e){setError(true);setStatus((e as Error).message)}
  finally{setBusy(false)}
 };
 const save=async()=>{
  if(!sha||original===content)return;
  if(content.length>350000){setError(true);setStatus('الملف كبير جداً');return}
  if(!confirm('هذي عملية تعديل على كود التطبيق مباشرة، ممكن تأثر على تشغيله. تريد تحفَظ هذا الملف وتبدأ بناء نسخة جديدة؟'))return;
  setBusy(true);
  try{
   const current=await client.request<{sha:string}>('/contents/'+path+'?ref=main');
   if(current.sha!==sha)throw Error('الملف تغيّر من محرر ثاني. افتحه من جديد قبل الحفظ.');
   const r=await client.request<{content:{sha:string}}>('/contents/'+path,{
     method:'PUT',body:JSON.stringify({message:'Administrator advanced edit: '+path,branch:'main',sha,content:encodeText(content)})
   });
   setSha(r.content.sha);setOriginal(content);setError(false);setStatus('انحفظ الملف؛ متابعة حالة البناء تساعدك تتأكد ماكو أخطاء.');
  }catch(e){setError(true);setStatus((e as Error).message)}
  finally{setBusy(false)}
 };
 return <div>
  <div className="ad-section-top"><div><h3>محرّر ملفات المشروع — متقدم</h3><p>للتعديل المباشر على الواجهة والألوان والأسئلة والملفات النصية التي ما عندها نموذج تحرير خاص.</p></div></div>
  <p className="ad-status warning"><TriangleAlert size={18} style={{verticalAlign:'middle',display:'inline',marginLeft:6}}/> هذا القسم للمسؤول فقط. التعديل البرمجي غير المدروس ممكن يوقف التطبيق؛ استخدم «المحتوى والصور» للمواد الدراسية.</p>
  <label style={{display:'block',fontWeight:800,fontSize:12,marginTop:10}}>مسار الملف داخل مشروع نَبْض</label>
  <div style={{display:'flex',gap:8,margin:'10px 0 15px'}}>
   <input type="text" spellCheck={false} value={path} onChange={e=>setPath(e.target.value)} placeholder="src/styles/student-ui.css" style={{flex:1,borderRadius:11,border:'1px solid #e4e1ee',padding:12,direction:'ltr',minWidth:0}}/>
   <button className="ad-button light" onClick={()=>void open()} disabled={busy}><FileText size={17}/> فتح</button>
  </div>
  {!!sha&&<><div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:10,flexWrap:'wrap',marginBottom:10}}>
    <span style={{fontSize:11,color:'#8b90a2'}}>النص يتخزن بمستودع GitHub، مع تسجيل تعديل يمكن الرجوع عنه</span>
    <button className="ad-button primary" onClick={()=>void save()} disabled={busy||content===original}><Save size={17}/> حفظ الملف</button>
   </div>
   <textarea aria-label="محرر كود الملف" spellCheck={false} value={content} onChange={e=>setContent(e.target.value)}
     style={{width:'100%',fontFamily:'Consolas,monospace',fontSize:12,direction:'ltr',textAlign:'left',lineHeight:1.65,border:'1px solid #dcd8e9',borderRadius:13,padding:15,minHeight:360,resize:'vertical',background:'#161e35',color:'#f2eefb'}}/>
   {content!==original&&<p className="ad-status warning">عندك تغييرات غير محفوظة.</p>}
  </>}
  {!!status&&<p className={'ad-status '+(error?'error':'success')} role="status">{status}</p>}
 </div>;
}
export default {title:'ملفات المشروع (متقدم)',description:'تعديل الملفات النصية للمشروع من داخل لوحة الإدارة مع حفظ الإصدارات.',Component:AdvancedEditor};
