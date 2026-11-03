/* NABD V10: 44 distinct source-linked exercises alongside 3D anatomy. NOT 44 independent physiological simulations.
   Questions are taken from NABD curriculum summaries; alternatives are answers from other topics of same chapter. */
(()=>{"use strict";
const $=id=>document.getElementById(id);
const book=window.NABD_CURRICULUM;
if(!book?.chapters?.length)return;
const KEY="nabd-v10-microlab-results",results=(()=>{try{return JSON.parse(localStorage.getItem(KEY)||"{}")}catch(_){return {}}})();
let chapter=1,topic=0,selected=null;
const ch=()=>book.chapters.find(x=>x.id===chapter),current=()=>ch()?.topics?.[topic]||null;
function make(tag,txt){const x=document.createElement(tag);if(txt!==undefined)x.textContent=txt;return x}
function randomize(arr,seed){let a=[...arr],v=seed*41+137;for(let i=a.length-1;i>0;i--){v=(v*1664525+1013904223)>>>0;const j=v%(i+1);[a[i],a[j]]=[a[j],a[i]]}return a}
function render(){
 const data=current(),list=$("topic-challenge-answers");if(!data||!list)return;
 const n=chapter+"/"+topic,done=results[n],answers=ch().topics.map(t=>t[5]),correct=data[5];
 const alternatives=[...new Set(answers.filter(x=>x!==correct))].slice(0,3);
 const options=randomize([correct,...alternatives].slice(0,4),chapter*100+topic);
 $("topic-challenge-title").textContent=data[0];
 $("topic-challenge-question").textContent=data[4];
 $("topic-challenge-source").textContent="الفصل "+chapter+" — صفحة "+data[1]+" من فهرس المنهج. الإجابات مأخوذة من شروح الدروس المبسطة وليست من بنك الأسئلة الوزارية المدقّق.";
 list.replaceChildren();
 for(const [i,text] of options.entries()){
  const button=make("ion-button",text);button.expand="block";button.fill="outline";button.color="primary";
  button.setAttribute("aria-label","الخيار "+(i+1)+": "+text);
  button.addEventListener("click",()=>{
    selected=text;const right=text===correct;
    results[n]={correct:right,when:new Date().toISOString(),page:data[1]};
    try{localStorage.setItem(KEY,JSON.stringify(results))}catch(_){}
    $("topic-challenge-feedback").textContent=right?"✓ إجابة صحيحة. راجع العضو الثلاثي الأبعاد وتأكد من التركيب المرتبط بها.":"✕ مو الإجابة الصحيحة. أعد المحاولة بعد مراجعة شرح الفقرة والنموذج المرجعي.";
    $("topic-challenge-feedback").style.background=right?"#e9f7f0":"#fff1e9";
    for(const b of list.querySelectorAll("ion-button")){b.disabled=right;b.color=b.textContent===correct?"success":b.textContent===text?"danger":"medium"}
    $("topic-challenge-progress").textContent=Object.values(results).filter(x=>x.correct).length+" / 44 موضوعاً تمت الإجابة عنها بشكل صحيح";
   });list.append(button)
 }
 $("topic-challenge-feedback").textContent=done?.correct?"✓ سبق ونجحت بهذا السؤال. تگدر تعيده للتثبيت.":"اختر الجواب بعد ما تشاهد المشهد ثلاثي الأبعاد وتقرأ فقرة الشرح.";
 $("topic-challenge-feedback").style.background="#eef5fb";
 $("topic-challenge-progress").textContent=Object.values(results).filter(x=>x.correct).length+" / 44 موضوعاً تمت الإجابة عنها بشكل صحيح";
}
function sync(){const newChapter=Number($("sim-chapter")?.value)||1,newTopic=Number($("sim-topic")?.value)||0;
if(newChapter!==chapter||newTopic!==topic){chapter=newChapter;topic=newTopic;render()} }
function initialize(){
 if(!$("topic-challenge-answers"))return;
 chapter=Number($("sim-chapter")?.value)||1;topic=Number($("sim-topic")?.value)||0;render();
 $("sim-chapter").addEventListener("ionChange",()=>queueMicrotask(sync));
 $("sim-topic").addEventListener("ionChange",()=>queueMicrotask(sync));
 $("topic-challenge-retry").addEventListener("click",render);
 // The primary module fires this event on explicit chapter/topic changes, independent of framework select events.
 document.addEventListener("nabd:topic-change",e=>{chapter=Number(e.detail.chapter)||1;topic=Number(e.detail.topic)||0;render()});
}
document.readyState==="loading"?document.addEventListener("DOMContentLoaded",initialize):initialize();
})();