/* NABD — Teacher B local voice management.
   No browser speechSynthesis, external calls or false synthetic-voice fallback. */
(()=>{"use strict";
const DB="nabd-b-voice-library-v1",STORES=["references","clips"],MAX_AUDIO=15*1024*1024;
const $=id=>document.getElementById(id);
const organs=[
 ["brain","الدماغ"],["spinal-cord","الحبل الشوكي"],["skeleton","الهيكل العظمي"],
 ["joints","المفاصل"],["muscles","العضلات"],["stomach","المعدة"],
 ["liver","الكبد"],["heart","القلب"],["lungs","الرئتان"],["kidneys","الكليتان"],
 ["eye","العين"],["ear","الأذن"],["thyroid","الغدة الدرقية"],["spleen","الطحال"]
];
const lessons=[
 ["01","الخلية العصبية"],["02","النسيج العصبي والأعصاب"],
 ["03","أقسام الجهاز العصبي"],["04","الدماغ"],
 ["05","الجهاز العصبي المحيطي"],["06","الجهاز العصبي الذاتي"],
 ["07","الإيعاز والفعل الانعكاسي"],["08","أمراض الجهاز العصبي"]
];
const topics=[...lessons.map(([id,t])=>({key:"chapter1/lesson/"+id,label:"الفصل الأول — "+t})),...organs.map(([id,t])=>({key:"atlas/"+id,label:"المختبر التشريحي — "+t}))];
let refUrl=null,lessonUrl=null;
function db(){return new Promise((resolve,reject)=>{try{let req=indexedDB.open(DB,1);req.onupgradeneeded=()=>{for(const name of STORES)if(!req.result.objectStoreNames.contains(name))req.result.createObjectStore(name)};req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error)}catch(e){reject(e)}})}
async function read(store,key){const d=await db();return new Promise((resolve,reject)=>{let t=d.transaction(store,"readonly");let req=t.objectStore(store).get(key);req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);t.oncomplete=()=>d.close();t.onerror=()=>reject(t.error)})}
async function write(store,key,data){const d=await db();return new Promise((resolve,reject)=>{let t=d.transaction(store,"readwrite");t.objectStore(store).put(data,key);t.oncomplete=()=>{d.close();resolve()};t.onerror=()=>{d.close();reject(t.error)}})}
async function remove(store,key){const d=await db();return new Promise((resolve,reject)=>{let t=d.transaction(store,"readwrite");t.objectStore(store).delete(key);t.oncomplete=()=>{d.close();resolve()};t.onerror=()=>{d.close();reject(t.error)}})}
async function allKeys(store){const d=await db();return new Promise((resolve,reject)=>{let t=d.transaction(store,"readonly");let q=t.objectStore(store).getAllKeys();q.onsuccess=()=>resolve(q.result);q.onerror=()=>reject(q.error);t.oncomplete=()=>d.close();t.onerror=()=>reject(t.error)})}
function notify(text){const t=$("voice-toast");if(t){t.message=text;t.present()}}
function checkFile(file){if(!file)throw Error("اختَر ملفاً صوتياً أولاً");if(!/\.(mp3|wav|m4a|ogg)$/i.test(file.name)&&!file.type.startsWith("audio/"))throw Error("استعمل ملف صوت MP3 أو WAV أو M4A");if(file.size>MAX_AUDIO)throw Error("حجم التسجيل يتجاوز 15 ميغابايت");if(file.size<1000)throw Error("التسجيل فارغ أو غير صالح");return file}
function setAudio(player,blob,kind){const old=kind==="ref"?refUrl:lessonUrl;if(old)URL.revokeObjectURL(old);const url=blob instanceof Blob?URL.createObjectURL(blob):null;if(kind==="ref")refUrl=url;else lessonUrl=url;player.pause();player.removeAttribute("src");if(url)player.src=url;else player.load()}
function topicLabel(key){return topics.find(x=>x.key===key)?.label||key}
function cur(){return $("lesson-select").value}
async function renderRef(){const x=await read("references","B");const status=$("reference-state");if(x?.blob){status.textContent="✓ عينة B محفوظة على جهازك — "+x.filename;setAudio($("reference-player"),x.blob,"ref")}else{status.textContent="ماكو عينة B محفوظة. ارفع عينة المتحدث B فقط؛ مو تسجيل الحوار الثنائي.";setAudio($("reference-player"),null,"ref")}}
async function renderLesson(){const key=cur();const x=await read("clips",key);const status=$("lesson-status");if(x?.blob){status.textContent="✓ تسجيل صوت B المعتمد متوفر لهذا الموضوع: "+topicLabel(key);setAudio($("lesson-player"),x.blob,"lesson")}else{status.textContent="ماكو تسجيل شرح بصوت B لهذا الموضوع. ما راح يستخدم صوت المتصفح بديلاً.";setAudio($("lesson-player"),null,"lesson")} }
async function renderAll(){await Promise.all([renderRef(),renderLesson()]);const keys=await allKeys("clips");const root=$("approved-list");root.replaceChildren();if(!keys.length){const p=document.createElement("p");p.className="voice-small";p.textContent="ماكو شروحات معتمدة حالياً. كل موضوع يحتاج تسجيل B مستقل.";root.append(p);return}
for(const key of keys){const row=document.createElement("div");row.className="voice-clip";const text=document.createElement("span");text.textContent=topicLabel(key);const btn=document.createElement("ion-button");btn.size="small";btn.fill="outline";btn.textContent="استمع";btn.addEventListener("click",async()=>{$("lesson-select").value=key;await renderLesson();$("lesson-player").play().catch(()=>notify("ما گدرنا نشغّل الملف"))});row.append(text,btn);root.appendChild(row)}}
async function safeRun(fn){try{await fn()}catch(e){notify(e.message||"تعذر إجراء العملية");const status=$("lesson-status");status.textContent="تنبيه: "+(e.message||"تعذر الحفظ")}}
function setup(){const sel=$("lesson-select");for(const item of topics){const option=document.createElement("option");option.value=item.key;option.textContent=item.label;sel.append(option)}const params=new URLSearchParams(location.search);const k=params.get("key");if(topics.some(x=>x.key===k))sel.value=k;
$("save-reference").addEventListener("click",()=>safeRun(async()=>{const f=checkFile($("reference-file").files?.[0]);await write("references","B",{blob:f,filename:f.name,speaker:"B",timestamp:Date.now()});$("reference-file").value="";await renderRef();notify("انحفظ مرجع الصوت B محلياً")}));
$("delete-reference").addEventListener("click",()=>safeRun(async()=>{if(!confirm("مسح عينة B المحفوظة من جهازك؟"))return;await remove("references","B");await renderRef();notify("انمسح المرجع من هذا الجهاز")}));
$("lesson-select").addEventListener("change",()=>safeRun(renderLesson));
$("save-lesson").addEventListener("click",()=>safeRun(async()=>{if(!$("approved-b").checked)throw Error("لازم تسمع وتتحقق أن التسجيل بنفس صوت B ويشرح الموضوع المختار");const f=checkFile($("lesson-file").files?.[0]);await write("clips",cur(),{blob:f,filename:f.name,voice:"B",approved:true,approvedAt:Date.now()});$("lesson-file").value="";$("approved-b").checked=false;await renderAll();notify("تم اعتماد التسجيل لهذا الدرس فقط")}));
$("delete-lesson").addEventListener("click",()=>safeRun(async()=>{if(!confirm("حذف التسجيل المعتمد لهذا الموضوع؟"))return;await remove("clips",cur());await renderAll();notify("تم حذف التسجيل")}));
safeRun(renderAll);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",setup);else setup();
})();