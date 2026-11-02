(()=>{"use strict";
const $=id=>document.getElementById(id),DBNAME="nabd-source-exams-v1",STORE="private",PROGRESS="nabd-private-quiz-progress-v1";
let bank=null,filtered=[],cursor=0,bookUrl=null,currentPdf=null,self={},manual={},corrections={},pageReview={};
try{self=JSON.parse(localStorage.getItem(PROGRESS)||"{}")||{};manual=JSON.parse(localStorage.getItem(PROGRESS+"-manual")||"{}")||{};corrections=JSON.parse(localStorage.getItem(PROGRESS+"-corrections")||"{}")||{};pageReview=JSON.parse(localStorage.getItem(PROGRESS+"-page-review")||"{}")||{}}catch(_){}
function say(msg){const t=$("exam-toast");t.message=msg;t.present()}
function initDb(){return new Promise((ok,bad)=>{const r=indexedDB.open(DBNAME,1);r.onupgradeneeded=()=>{if(!r.result.objectStoreNames.contains(STORE))r.result.createObjectStore(STORE)};r.onsuccess=()=>ok(r.result);r.onerror=()=>bad(r.error)})}
async function store(k,value){const db=await initDb();return new Promise((ok,bad)=>{let tx=db.transaction(STORE,"readwrite"),q=tx.objectStore(STORE).put(value,k);q.onsuccess=()=>ok();q.onerror=()=>bad(q.error);tx.oncomplete=()=>db.close()})}
async function get(k){const db=await initDb();return new Promise((ok,bad)=>{let tx=db.transaction(STORE,"readonly"),q=tx.objectStore(STORE).get(k);q.onsuccess=()=>ok(q.result);q.onerror=()=>bad(q.error);tx.oncomplete=()=>db.close()})}
function valid(b){return b&&b.format==="NABD_PRIVATE_QUESTION_BANK_V1"&&b.version===1&&b.source_total_pages===143&&Array.isArray(b.questions)&&Array.isArray(b.page_audit)&&b.questions.length>300&&b.questions.every(q=>typeof q.id==="string"&&Number.isInteger(q.pdf_page)&&q.pdf_page>=1&&q.pdf_page<=143&&typeof q.question==="string"&&typeof q.source_segment_normalized==="string"&&typeof q.review_status==="string")}
function drawFilters(){const menu=$("chapter-filter");menu.replaceChildren();const all=document.createElement("ion-select-option");all.value="all";all.textContent="جميع الفصول";menu.append(all);for(let i=1;i<=11;i++){const e=document.createElement("ion-select-option");e.value=String(i);e.textContent="الفصل "+i;menu.append(e)}menu.value="all"}
function filter(){if(!bank)return;let ch=$("chapter-filter").value||"all",q=String($("question-search").value||"").trim(),status=$("question-filter").value||"all";filtered=bank.questions.filter(x=>(ch==="all"||x.chapter===Number(ch))&&(!q||x.question.includes(q)||x.source_segment_normalized.includes(q))&&(status==="all"||(status==="inline"&&Array.isArray(x.practice_parts)&&x.practice_parts.length>0)||(status==="marked"&&x.page_years_mentioned.length)||(status==="needs"&&(x.v4_source_audit?.priority==="HIGH"||(!x.v4_source_audit&&(!x.answer_draft?.trim()||x.review_status!=="auto_split_needs_review"))))));cursor=0;render()}
function renderInlineParts(q){
 const panel=$("inline-practice"),area=$("inline-practice-items");
 panel.classList.add("hidden");area.replaceChildren();
 const parts=q?.practice_parts;
 if(!Array.isArray(parts)||!parts.length)return;
 panel.classList.remove("hidden");
 let successes=0;
 for(const p of parts){
  const row=document.createElement("article");row.className="section";
  row.style.margin="8px 0";row.style.padding="12px";
  const label=document.createElement("strong");label.textContent=(q.practice_parent_prompt||"سؤال من المصدر")+" — "+p.prompt_label;
  row.append(label);
  const answer=document.createElement("p");answer.className="answer hidden";answer.textContent=p.answer_from_page;answer.style.margin="10px 0";
  const controls=document.createElement("div");controls.className="controls";
  const show=document.createElement("ion-button");show.fill="outline";show.size="small";show.textContent="أظهر الجواب المطبوع في الملزمة";
  show.onclick=()=>{answer.classList.toggle("hidden");show.textContent=answer.classList.contains("hidden")?"أظهر الجواب المطبوع في الملزمة":"إخفاء الجواب"};
  const got=document.createElement("ion-button");got.fill="clear";got.color="success";got.size="small";got.textContent="عرفته";
  const missed=document.createElement("ion-button");missed.fill="clear";missed.color="warning";missed.size="small";missed.textContent="أعيد مراجعته";
  const key="source-part:"+p.part_id;
  const check=value=>{self[key]=value;try{localStorage.setItem(PROGRESS,JSON.stringify(self))}catch(_){}
    got.color=value==="correct"?"success":"medium";missed.color=value==="review"?"danger":"medium";drawCount();say("حفظنا تقييمك الذاتي للفقرة "+p.part_id)};
  got.onclick=()=>check("correct");missed.onclick=()=>check("review");
  if(self[key]==="correct")successes++;
  controls.append(show,got,missed);row.append(controls,answer);
  const note=document.createElement("small");note.textContent="مصدر الفقرة: صفحة PDF "+p.source_pdf_page+" · السنة والدور غير مثبتين لهذا الفرع.";row.append(note);
  area.append(row);
 }
 function drawCount(){const n=parts.filter(x=>self["source-part:"+x.part_id]==="correct").length;
 $("inline-practice-progress").textContent=n+" / "+parts.length+" فروع تعرف جوابها — من دون زيادة العدد الأصلي للأسئلة."}
 drawCount();
}
function render(){if(!bank)return;const q=filtered[cursor];$("quiz-panel").classList.remove("hidden");$("prev").disabled=cursor===0;$("next").disabled=cursor>=filtered.length-1;$("reveal").disabled=!q;$("open-page").disabled=!q;$("self-correct").disabled=!q;$("self-wrong").disabled=!q;$("open-topic-lab").disabled=!q;
$("answer").classList.add("hidden");$("reveal").textContent="أظهر الجواب المستخرج";
if(!q){$("inline-practice").classList.add("hidden");$("save-correction").disabled=true;$("manual-review").disabled=true; $("question-text").textContent="لا توجد أسئلة مطابقة للبحث.";$("question-page").textContent="";$("question-number").textContent="";$("question-chapter").textContent="";$("years-note").textContent="";$("review-warning").textContent="";$("score-note").textContent="لا توجد نتائج.";return}
$("save-correction").disabled=false;$("manual-review").disabled=false;$("manual-review").textContent=manual[q.id]?"✓ سبق قارنت هذا السؤال بالأصل":"علّم السؤال: قارنته بالأصل";$("manual-review-note").textContent=manual[q.id]?"مراجعة شخصية بتاريخ "+new Date(manual[q.id]).toLocaleDateString("ar-IQ")+"؛ لا تعني التدقيق الوزاري المعتمد.":"ما زال يحتاج مقارنة حرفية بصفحة الملزمة، بما فيها الرسوم أو الأجزاء المقطوعة.";$("question-number").textContent=q.id;$("question-page").textContent="PDF ص "+q.pdf_page;$("question-chapter").textContent="الفصل "+q.chapter;$("progress").textContent=(cursor+1)+" / "+filtered.length;$("question-text").textContent=q.practice_parts?.length?(q.practice_parent_prompt+" — "+q.practice_parts.length+" فروع منفصلة للمراجعة دون إظهار أجوبتها ضمن السؤال"):(corrections[q.id]?.question||q.question);renderInlineParts(q);
$("years-note").textContent=q.page_years_mentioned.length?"السنوات الظاهرة بهذه الصفحة (ربطها بالسؤال غير موثق): "+q.page_years_mentioned.join("، "):"لا توجد سنة وزارية موثقة لهذا السؤال.";
$("review-warning").textContent=q.review_status==="auto_split_needs_review"?"استخراج السؤال والجواب آلي؛ قارن كلاهما بالصفحة قبل الاعتماد.":"فصل الإجابة عن السؤال لم يُحسم آلياً؛ قد يتضمن النص إجابات أو فقرات أخرى. راجع صورة الصفحة الأصلية.";
$("answer").textContent=q.practice_parts?.length?"الجواب موزّع على فروع السؤال أعلاه. افتح جواب كل فرع مستقلاً للمراجعة." :(corrections[q.id]?.answer||q.answer_draft||q.source_segment_normalized);$("edited-question").value=corrections[q.id]?.question||q.question;$("edited-answer").value=corrections[q.id]?.answer||q.answer_draft||"";$("edited-ministerial-year").value=corrections[q.id]?.year||"";$("edited-ministerial-round").value=corrections[q.id]?.round||"";$("edit-status").textContent=corrections[q.id]?"تصحيح محفوظ محلياً: راجع المصدر قبل الاعتماد.":"لا يوجد تصحيح يدوي محفوظ لهذا السؤال.";$("score-note").textContent="حالة التقييم الذاتي: "+(self[q.id]==="correct"?"أعرف الجواب":self[q.id]==="review"?"أحتاج مراجعة":"لم يُقيّم")+" · هذه ليست درجة امتحان مصححة آلياً.";
}
function assess(correct){if(!filtered[cursor])return;self[filtered[cursor].id]=correct?"correct":"review";try{localStorage.setItem(PROGRESS,JSON.stringify(self))}catch(_){};render();say(correct?"تمت إضافته لأسئلة تعرف جوابها":"أضفنا السؤال إلى المراجعة");}
function openTopicLab(){
 const q=filtered[cursor];if(!q)return;
 const chapter=Number(q.chapter);
 if(!Number.isInteger(chapter)||chapter<1||chapter>11){say("تعذّر تحديد الفصل العلمي من هذا السؤال");return}
 // 3D referral is only at chapter level, NOT a certified question-to-structure map.
 const topics=window.NABD_CURRICULUM?.chapters?.find(x=>x.id===chapter)?.topics||[];
 const txt=String(corrections[q.id]?.question||q.question||"");
 const terms=txt.replace(/[\u064b-\u065f\u0640]/g,"").replace(/[أإآ]/g,"ا").split(/[^\u0621-\u064A]+/).filter(x=>x.length>3);
 let i=0,max=0;
 for(let j=0;j<topics.length;j++){
  const data=(topics[j][0]+" "+topics[j][2]+" "+topics[j][4]).replace(/[أإآ]/g,"ا");
  const score=terms.filter(w=>data.includes(w)).length;
  if(score>max){i=j;max=score;}
 }
 const link="simulations.html#c"+chapter+"t"+(max>0?i:0);
 say("راح نفتح فقرة للمراجعة ضمن نفس الفصل. هذا ترشيح آلي، مو مطابقة تشريحية معتمدة للسؤال.");
 location.href=link;
}
function openPage(){if(!filtered[cursor])return;if(!bookUrl){say("ارفع PDF الملزمة أولاً حتى نفتح الصفحة الأصلية.");return}window.open(bookUrl+"#page="+filtered[cursor].pdf_page,"_blank","noopener,noreferrer")}
function manualCheck(){const q=filtered[cursor];if(!q)return;manual[q.id]=new Date().toISOString();try{localStorage.setItem(PROGRESS+"-manual",JSON.stringify(manual))}catch(_){}render();say("حفظنا علامة المراجعة الشخصية للسؤال "+q.id)}
function auditCSV(){if(!bank)return;const headers=["id","chapter","pdf_page","review_status","has_answer_draft","page_has_years","personal_page_checked"];const quote=v=>'"'+String(v??"").replaceAll('"','""')+'"';const rows=bank.questions.map(q=>[q.id,q.chapter,q.pdf_page,q.review_status,!!q.answer_draft?.trim(),q.page_years_mentioned.length>0,!!manual[q.id]].map(quote).join(","));const out="\uFEFF"+headers.join(",")+"\n"+rows.join("\n");const url=URL.createObjectURL(new Blob([out],{type:"text/csv;charset=utf-8"}));const a=document.createElement("a");a.href=url;a.download="NABD_QBANK_"+bank.questions.length+"_REVIEW_AUDIT.csv";document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),3000)}
function storeCorrection(){
 const q=filtered[cursor];if(!q)return;
 if(!bookUrl){say("ارفع ملف الملزمة PDF أولاً حتى يمكن مقارنة السؤال والجواب بالمصدر.");return}
 const question=String($("edited-question").value||"").trim(),answer=String($("edited-answer").value||"").trim();
 if(question.length<8||answer.length<5){say("نص السؤال أو الجواب ناقص. لا نحفظ جواباً غير مكتمل.");return}
 const year=String($("edited-ministerial-year").value||"").trim();
 const round=String($("edited-ministerial-round").value||"").trim();
 if(year && (!/^(19|20)\d{2}$/.test(year)||!round)){say("إذا كتبت سنة وزارية، أدخل الدور أيضاً كما يظهر بجوار السؤال.");return}
 if(round&&!year){say("الدور الوزاري يحتاج سنة مطابقة مطبوعة في المصدر.");return}
 if(!confirm("هل قارنت نص السؤال والجواب حرفياً بصفحة PDF رقم "+q.pdf_page+" بما في ذلك أجزاؤه المرقمة؟"))return;
 corrections[q.id]={question,answer,year:year||null,round:round||null,checkedAt:new Date().toISOString(),
   sourcePage:q.pdf_page,reviewType:"user_source_page_comparison_unverified_externally",
   verifiedByAuthority:false,autoGradeable:false};
 try{localStorage.setItem(PROGRESS+"-corrections",JSON.stringify(corrections))}catch(e){say("تعذر حفظ المراجعة على هذا المتصفح.");return}
 render();say("حُفظ تصحيحك الشخصي؛ لم يتم تصنيفه تصحيحاً وزارياً معتمداً.")
}
function exportCorrections(){
 const payload={format:"NABD_PRIVATE_QBANK_CORRECTIONS_V1",sourceSha256:bank?.source_pdf_sha256,
 sourceCount:bank?.questions.length,exportedAt:new Date().toISOString(),
 notice:"User-reviewed local annotations only. Official exam labels and automatic grading remain unverified.",
 corrections};
 const u=URL.createObjectURL(new Blob([JSON.stringify(payload,null,2)],{type:"application/json"}));
 const a=document.createElement("a");a.href=u;a.download="NABD_MY_QBANK_SOURCE_CORRECTIONS.json";
 document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),3500)
}
function show(){const a=$("answer");const visible=!a.classList.contains("hidden");a.classList.toggle("hidden",visible);$("reveal").textContent=visible?"أظهر الجواب المستخرج":"إخفاء الجواب"}
function stats(){const pages=bank.page_audit;const noQuestion=pages.filter(p=>!p.markers_found).length;const exams=bank.questions.filter(q=>q.page_years_mentioned.length).length;$("bank-status").textContent="✓ استوردت "+bank.questions.length+" سؤالاً مرشحاً من 143 صفحة. صفحات بلا علامة سؤال نصية: "+noQuestion+". أولوية تدقيق عالية: "+(bank.editorial_audit_v4?.questions_high_priority_for_review??"غير مفحوصة")+". الأسئلة المعتمدة حرفياً: صفر.";$("audit").textContent="تم تحليل "+pages.length+" صفحة؛ "+exams+" سؤالاً مرشحاً في صفحات تذكر سنوات امتحانية. "+(bank.editorial_audit_v4?.risk_counts?.ANSWER_ABSENT??"عدد غير معروف من")+" إجابة غير مستخرجة. سنة ودور معتمدان رسمياً: صفر، لحين مراجعة صورة كل سؤال.";drawFilters();filter()}
async function importBank(file){if(!file)return;if(file.size>8*1024*1024)throw Error("ملف الأسئلة أكبر من الحد المسموح");const b=JSON.parse(await file.text());if(!valid(b))throw Error("هذا ليس ملف بنك أسئلة نَبْض المعتمد أو بناؤه غير صحيح");if(b.source_pdf_sha256!=="a8439096ba21b74f5e35927687616d0d23bb9bb2ce42000dcb638c59e527e2b6")throw Error("بنك الأسئلة لا يستند إلى ملف الملزمة الأصلي المعتمد.");bank=b;await store("bank",b);stats();say("تم حفظ بنك الأسئلة بالكامل على جهازك.")}
async function importPdf(file){
 if(!file)return;
 if(file.size>30*1024*1024)throw Error("حجم PDF غير مناسب");
 const first=await file.slice(0,5).text();
 if(first!=="%PDF-")throw Error("ملف المصدر ليس PDF سليماً");
 if(!window.crypto?.subtle)throw Error("تحتاج HTTPS للتحقق من مطابقة صفحة الملزمة الأصلية.");
 const data=await file.arrayBuffer();
 const digest=await crypto.subtle.digest("SHA-256",data);
 const real=[...new Uint8Array(digest)].map(x=>x.toString(16).padStart(2,"0")).join("");
 const expected=bank?.source_pdf_sha256||"a8439096ba21b74f5e35927687616d0d23bb9bb2ce42000dcb638c59e527e2b6";
 if(real!==expected)throw Error("هذا ليس ملف الملزمة المعتمد؛ بصمته مختلفة. لا يجوز اعتماد مقارنة الصفحات من ملف آخر.");
 if(bookUrl)URL.revokeObjectURL(bookUrl);
 currentPdf=file;bookUrl=URL.createObjectURL(file);
 await store("sourcepdf",file);
 say("✓ تم التحقق من بصمة PDF المطابقة للملزمة المعتمدة؛ يمكنك مقارنة الأسئلة بالصفحات الأصلية.");
}
function bind(){$("bank-input").onchange=e=>importBank(e.target.files?.[0]).catch(err=>$("bank-status").textContent=err.message);$("pdf-input").onchange=e=>importPdf(e.target.files?.[0]).catch(err=>say(err.message));$("chapter-filter").addEventListener("ionChange",filter);$("question-search").addEventListener("ionInput",filter);$("question-filter").addEventListener("ionChange",filter);$("prev").onclick=()=>{cursor=Math.max(0,cursor-1);render()};$("next").onclick=()=>{cursor=Math.min(filtered.length-1,cursor+1);render()};$("reveal").onclick=show;$("open-page").onclick=openPage;$("open-topic-lab").onclick=openTopicLab;$("self-correct").onclick=()=>assess(true);$("self-wrong").onclick=()=>assess(false);$("manual-review").onclick=manualCheck;$("download-audit").onclick=auditCSV;$("save-correction").onclick=storeCorrection;$("export-corrections").onclick=exportCorrections}
async function start(){bind();try{const b=await get("bank");if(valid(b)){bank=b;stats()}}catch(_){}try{const blob=await get("sourcepdf");if(blob instanceof Blob)bookUrl=URL.createObjectURL(blob)}catch(_){}}
document.readyState==="loading"?document.addEventListener("DOMContentLoaded",start):start();
})();