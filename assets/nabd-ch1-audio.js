/* NABD first-chapter six private audio recordings.
   User-provided WAV originals are packaged separately; nothing is uploaded from the browser. */
(()=>{"use strict";
const BASE="nabd/chapter1/recording/",DB="nabd-voice-bank-v1",STORE="audios",LS="nabd-ch1-recording-topics-v1";
const $=id=>document.getElementById(id);
const topics=[["غير محدد — يحتاج مراجعة","ذات السحايا","شلل الأطفال","الكزاز","الأمراض النفسية والاكتئاب","عدة مواضيع أو تتمة درس"],["غير محدد — يحتاج مراجعة","ذات السحايا","شلل الأطفال","الكزاز","الأمراض النفسية والاكتئاب","عدة مواضيع أو تتمة درس"]];
let local={};try{local=JSON.parse(localStorage.getItem(LS)||"{}")||{}}catch(_){}
const EXPECTED={"ch1_01":"62b316e8f2e497b3de0f1f956a2ac8a411a2aa27adbfdd0594b127776cf9e948","ch1_02":"65f5cbfad68d660b26e659a717f557b37e14f9718b29ce99b0e113cd913028e7","ch1_03":"85a3b365c3a284bfa4d7fb3a3382d7cbf8ea18b5ca578da8357b52c96b886bf1","ch1_04":"00f71e3e4840089632ad0455bbc69d5a355015aafa26f292e4f7532fd088d050","ch1_05":"ef985fbcfb5c58f298ed8e51c1e39136089bc05825c172834aa0452794232003","ch1_06":"b411a1742944c7ccb9509213f75058e874b5f548d6505891d451b01083149e24"};
const rows=Array.from({length:6},(_,i)=>({id:"ch1_"+String(i+1).padStart(2,"0"),num:i+1}));
function openDB(){return new Promise((ok,bad)=>{if(!globalThis.indexedDB)return bad(new Error("التخزين المحلي غير متاح في هذا المتصفح"));const r=indexedDB.open(DB,1);r.onupgradeneeded=()=>{if(!r.result.objectStoreNames.contains(STORE))r.result.createObjectStore(STORE)};r.onsuccess=()=>ok(r.result);r.onerror=()=>bad(r.error)})}
async function io(id,blob){const db=await openDB();return new Promise((ok,bad)=>{const tx=db.transaction(STORE,blob?"readwrite":"readonly");const rq=blob?tx.objectStore(STORE).put(blob,BASE+id):tx.objectStore(STORE).get(BASE+id);rq.onsuccess=()=>ok(rq.result);rq.onerror=()=>bad(rq.error);tx.oncomplete=()=>db.close();tx.onerror=()=>{db.close();bad(tx.error)}})}
const el=(tag,txt)=>{const n=document.createElement(tag);if(txt!==undefined)n.textContent=txt;return n};
let currentAudio=null,currentObjectUrl=null;
function dispose(){if(currentAudio){currentAudio.pause();currentAudio.removeAttribute("src");currentAudio.load()}if(currentObjectUrl){URL.revokeObjectURL(currentObjectUrl);currentObjectUrl=null}}
function notify(msg){const x=$("chapter-audio-import-status");if(x)x.textContent=msg}
function fileSha(arr){if(!crypto?.subtle)throw Error("التحقق من الملفات يحتاج HTTPS أو اتصالاً محلياً آمناً");return crypto.subtle.digest("SHA-256",arr).then(a=>[...new Uint8Array(a)].map(n=>n.toString(16).padStart(2,"0")).join(""))}
function b64decode(v){const raw=atob(v),bytes=new Uint8Array(raw.length);for(let i=0;i<raw.length;i++)bytes[i]=raw.charCodeAt(i);return bytes}
function selectTopic(row,root){const menu=el("select");menu.className="form-select";menu.setAttribute("aria-label","موضوع التسجيل "+row.num);
for(const name of topics[0]){const option=el("option",name);option.value=name;menu.append(option)}
menu.value=topics[0].includes(local[row.id]?.topic)?local[row.id].topic:topics[0][0];
menu.onchange=()=>{local[row.id]={...(local[row.id]||{}),topic:menu.value};try{localStorage.setItem(LS,JSON.stringify(local))}catch(_){}};
root.append(menu)}
async function render(){const list=$("chapter-audio-list");if(!list)return;dispose();list.replaceChildren();let saved=0;
for(const row of rows){
 const blob=await io(row.id).catch(()=>null);
 const item=el("ion-item");item.lines="none";const inner=el("div");inner.className="recording-item";inner.append(el("strong","التسجيل "+row.num+" — "+(blob?"جاهز للمعاينة":"غير مستورد")));
 if(blob instanceof Blob){
  saved++;const button=el("ion-button","استمع");button.fill="outline";button.size="small";
  const player=el("audio");player.controls=true;player.preload="none";player.hidden=true;player.setAttribute("aria-label","التسجيل "+row.num);
  button.onclick=()=>{
    dispose();
    currentAudio=player;currentObjectUrl=URL.createObjectURL(blob);
    player.src=currentObjectUrl;player.hidden=false;
    player.play().catch(()=>notify("اضغط تشغيل في المشغّل لاستماع التسجيل."));
  };
  inner.append(button,player);
  const review=el("label");
  const checked=el("input");checked.type="checkbox";checked.checked=!!local[row.id]?.reviewed;
  checked.onchange=()=>{local[row.id]={...(local[row.id]||{}),reviewed:checked.checked};try{localStorage.setItem(LS,JSON.stringify(local))}catch(_){}};
  review.append(checked,document.createTextNode(" راجعت النطق والمعلومات العلمية بنفسي"));review.className="recording-review";inner.append(review);
  selectTopic(row,inner);
 }else inner.append(el("p","استورد الحزمة الخاصة حتى يظهر زر الاستماع."));
 item.append(inner);list.append(item);
}
$("chapter-audio-count").textContent=saved+" / 6";
}
async function importPack(file){
 if(!file)return;
 if(file.size>20*1024*1024)throw Error("ملف الاستيراد أكبر من 20 ميغابايت");
 const data=JSON.parse(await file.text());
 if(data.format!=="NABD_CH1_VOICES_V1"||data.version!==1||data.chapter!==1||!Array.isArray(data.clips)||data.clips.length!==6)throw Error("ملف الاستيراد ليس حزمة الفصل الأول المعتمدة (ستة مقاطع)");
 let total=0;const clips=[];
 const ids=new Set();
 for(const clip of data.clips){
  if(!clip||!rows.some(x=>x.id===clip.id)||ids.has(clip.id)||clip.mime!=="audio/mpeg"||typeof clip.base64!=="string")throw Error("يوجد تسجيل غير صالح أو مكرر");
  ids.add(clip.id);
  const binary=b64decode(clip.base64);total+=binary.length;
  if(binary.length!==clip.size||binary.length<1000||binary.length>2*1024*1024||total>9*1024*1024)throw Error("حجم التسجيل غير صحيح");
  const fingerprint=await fileSha(binary.buffer);
  if(fingerprint!==clip.sha256||fingerprint!==EXPECTED[clip.id])throw Error("هذا التسجيل لا يطابق الملف الذي أرسله صاحب المشروع: "+clip.id);
  clips.push({id:clip.id,blob:new Blob([binary],{type:"audio/mpeg"})});
 }
 for(const c of clips)await io(c.id,c.blob);
 notify("✓ حفظت جميع التسجيلات الستة على جهازك. استمع وحدد موضوع كل تسجيل، ثم راجع المعلومات الطبية قبل استخدامها بالصف.");
 await render();
}
function init(){const file=$("chapter-audio-import");if(!file)return;file.onchange=e=>{const f=e.target.files?.[0];importPack(f).catch(x=>notify("فشل الاستيراد: "+x.message)).finally(()=>{file.value=""})};render().catch(e=>notify("تعذّر تشغيل مكتبة الصوت: "+e.message))}
document.readyState==="loading"?document.addEventListener("DOMContentLoaded",init):init();
})();