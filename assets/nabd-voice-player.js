/* NABD B-only narration player: never use speechSynthesis or other browser voices.
   Uses the same local IndexedDB vault as voice_production.html. */
(()=>{"use strict";
const DB="nabd-b-voice-library-v1";const $=id=>document.getElementById(id);let audioUrl=null;
function read(k){return new Promise((resolve,reject)=>{let req=indexedDB.open(DB,1);req.onupgradeneeded=()=>{const db=req.result;for(const name of ["references","clips"])if(!db.objectStoreNames.contains(name))db.createObjectStore(name)};req.onerror=()=>reject(req.error);req.onsuccess=()=>{const db=req.result;let t=db.transaction("clips","readonly"),q=t.objectStore("clips").get(k);q.onsuccess=()=>resolve(q.result);q.onerror=()=>reject(q.error);t.oncomplete=()=>db.close()}})}
function status(t){const el=$("voice-lesson-status");if(el)el.textContent=t}
function clearAudio(){const p=$("voice-lesson-player");if(p){p.pause();p.removeAttribute("src");p.load()}if(audioUrl){URL.revokeObjectURL(audioUrl);audioUrl=null}}
async function play(){const model=$("organ-select")?.value;if(!model){status("اختَر المجسم أولاً");return;}const key="atlas/"+model;
try{const clip=await read(key);if(!(clip?.blob instanceof Blob) || clip.voice!=="B"||!clip.approved){clearAudio();status("شرح هذا المجسم بصوت المعلّمة B غير جاهز بعد. ما راح نستخدم صوت المتصفح.");$("upload-voice-link").href="voice_production.html?key="+encodeURIComponent(key);return;}
clearAudio();audioUrl=URL.createObjectURL(clip.blob);$("voice-lesson-player").src=audioUrl;$("voice-lesson-player").hidden=false;await $("voice-lesson-player").play();status("يشتغل تسجيل المعلّمة B المعتمد لهذا المجسم فقط.");}
catch(e){status("تعذّر تشغيل صوت B المحفوظ: "+(e?.message||"خطأ غير معروف"));}}
function init(){const b=$("play-voice-clip");if(!b)return;b.addEventListener("click",play);$("organ-select")?.addEventListener("ionChange",()=>{clearAudio();$("voice-lesson-player").hidden=true;status("للاستماع إلى هذا الجزء، يجب أن يكون له تسجيل B معتمد.");const m=$("organ-select")?.value;if(m)$("upload-voice-link").href="voice_production.html?key="+encodeURIComponent("atlas/"+m)});
const m=$("organ-select")?.value;if(m)$("upload-voice-link").href="voice_production.html?key="+encodeURIComponent("atlas/"+m)}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();