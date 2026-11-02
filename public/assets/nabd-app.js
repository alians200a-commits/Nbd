/* NABD integration: uses actual Tabler HTML components + original MIT Tabler Icons.
   UI component source: https://github.com/tabler/tabler-starter
   No generated icon artwork, SVG paths or synthetic anatomy models. */
(() => {
"use strict";
const $ = id => document.getElementById(id);
const ico = n => '<svg class="icon" width="24" height="24" aria-hidden="true"><use href="assets/tabler-icons.svg#ti-'+n+'"></use></svg>';
const chapters = [
[1,"الجهاز العصبي",5,"الخلية العصبية والدماغ والحبل الشوكي","brain"],
[2,"الجهاز الهيكلي",15,"العظام والمفاصل","book"],
[3,"الجهاز العضلي",31,"العضلات وأنواعها","heart"],
[4,"الجهاز الهضمي",41,"الهضم والامتصاص","book"],
[5,"جهاز الدوران",57,"القلب والدم والأوعية","heart"],
[6,"جهاز التنفس",71,"الرئتان والتبادل الغازي","heart"],
[7,"الجهاز البولي والإخراج",81,"الكليتان والإخراج","flask-2"],
[8,"الجهاز التناسلي",93,"التكاثر وأعضاء الجهاز","book"],
[9,"أعضاء الحس",101,"العين والأذن والحواس","brain"],
[10,"الإفراز",115,"الغدد والهرمونات","flask-2"],
[11,"المناعة والأمراض",123,"المناعة والدفاع عن الجسم","heart"]
];
/* The GLB paths below exist in open-source GitHub repositories, but are fetched
   at display time, not bundled. Model asset licenses differ across sources. */
const models = [
["brain","الدماغ",1,"brain","CC BY 4.0"],
["spinal-cord","الحبل الشوكي",1,"spinal-cord","CC BY-SA 2.1 JP"],
["skeleton","الهيكل العظمي",2,"skeleton","CC BY-SA 2.1 JP"],
["muscles","العضلات",3,"muscles","CC BY-SA 2.1 JP"],
["stomach","المعدة",4,"stomach","CC BY-SA 2.1 JP"],
["liver","الكبد",4,"liver","CC BY 4.0"],
["heart","القلب",5,"heart","CC BY 4.0"],
["lungs","الرئتان",6,"lungs","CC BY-SA 2.1 JP"],
["kidneys","الكليتان",7,"kidneys","CC BY 4.0"],
["eye","العين",9,"eye","راجع مصدر المجسم"],
["ear","الأذن",9,"ear","راجع مصدر المجسم"],
["thyroid","الغدة الدرقية",10,"thyroid","راجع مصدر المجسم"],
["adrenals","الغدتان الكظريتان",10,"adrenals","راجع مصدر المجسم"],
["spleen","الطحال",11,"spleen","راجع مصدر المجسم"]
];
const questions = [
["ما الوحدة الأساسية في بناء الجهاز العصبي؟",["النسيج العصبي","الخلية العصبية","العصب الحسي","الحبل الشوكي"],1,"الخلية العصبية وحدة البناء والوظيفة في الجهاز العصبي. (ص 6)"],
["أي جزء من الدماغ يسيطر على الحركات الإرادية؟",["النخاع المستطيل","المخيخ","المخ","الحبل الشوكي"],2,"المخ يسيطر على الحركات الإرادية. (ص 7)"],
["ما وظيفة المخيخ؟",["تنظيم حركة العضلات الإرادية","تكوين البول","إفراز الهرمونات","نقل الدم"],0,"المخيخ ينظم حركة العضلات الإرادية. (ص 7)"],
["كم زوجاً من الأعصاب الشوكية؟",["12","31","24","40"],1,"الأعصاب الشوكية 31 زوجاً. (ص 8)"],
["كم زوجاً من الأعصاب القحفية؟",["20","31","12","40"],2,"الأعصاب القحفية 12 زوجاً. (ص 8)"],
["أين يقع مركز فعل سحب اليد الانعكاسي عند الوخز؟",["المخ","المخيخ","النخاع المستطيل","الحبل الشوكي"],3,"هذا الفعل الانعكاسي مركزه الحبل الشوكي. (ص 9)"],
["ماذا ينقل العصب الحسي؟",["الهرمونات","الإيعاز إلى العضلة","الحافز إلى الجهاز العصبي المركزي","الدم إلى الرئتين"],2,"العصب الحسي ينقل الحافز من الجسم إلى الجهاز العصبي المركزي. (ص 7)"],
["كيف يستجيب الجهاز الودي في حالات الخطر؟",["يخفض ضربات القلب","يزيد ضربات القلب","يوقف التنفس","يمنع التعرق"],1,"من وظائف الودي زيادة ضربات القلب في حالة الخطر. (ص 8)"]
];
const K="nabd-tabler-open-source-v1";
let state={finished:[],wrong:{},plan:[]};
try{state={...state,...JSON.parse(localStorage.getItem(K)||"{}")};}catch(e){}
let view="home", selectedModel=0, qIndex=0, score=0, answered=false;
function persist(){try{localStorage.setItem(K,JSON.stringify(state));}catch(e){announce("الحفظ المحلي غير متاح في هذا المتصفح");}}
function announce(msg){const e=$("notice");e.textContent=msg;e.classList.remove("d-none");clearTimeout(announce.timer);announce.timer=setTimeout(()=>e.classList.add("d-none"),4500);}
const due=()=>Object.entries(state.wrong).filter(([_,v])=>v.active&&Date.parse(v.next)<=Date.now());
const mistakes=()=>Object.entries(state.wrong).filter(([_,v])=>v.active);
function nav(t){if(!["home","chapters","lab","quiz","vault","planner","assistant","sources"].includes(t))t="home";view=t;document.querySelectorAll("[data-view]").forEach(a=>a.classList.toggle("active",a.dataset.view===t));document.querySelectorAll(".app-panel").forEach(e=>e.classList.toggle("d-none",e.id!=="panel-"+t));const names={home:"الرئيسية",chapters:"فصول المنهج",lab:"المختبر التشريحي",quiz:"الاختبارات",vault:"خزنة الأخطاء",planner:"خطة المراجعة",assistant:"المعلّمة الذكية",sources:"المصادر والمراجع"};$("breadcrumb-title").textContent=names[t];if(t==="vault")renderVault();if(t==="planner")renderPlan();if(t==="quiz")renderQuiz();window.scrollTo({top:0,behavior:"auto"});if(location.hash!=="#"+t)history.replaceState(null,"","#"+t);}
function box(text){return '<div class="alert alert-info mb-0">'+text+'</div>';}
function card(c){let done=state.finished.includes(c[0]);return '<div class="col-md-6 col-xl-4"><div class="card h-100"><div class="card-body"><div class="d-flex justify-content-between align-items-start"><span class="avatar bg-azure-lt text-azure">'+ico(c[4])+'</span><span class="badge bg-'+(done?"green":"azure")+'-lt">'+(done?"تمت مراجعته":"الفصل "+c[0])+'</span></div><h3 class="card-title mt-3">'+c[1]+'</h3><p class="text-secondary small">'+c[3]+'</p><div class="d-flex justify-content-between align-items-center mt-3"><span class="text-secondary small">ص '+c[2]+'</span><button class="btn btn-outline-primary btn-sm" data-chapter="'+c[0]+'">افتح الموضوع '+ico("book")+'</button></div></div></div></div>';}
function refresh(){const fin=state.finished.length;$("stat-complete").textContent=fin+"/11";$("stat-errors").textContent=mistakes().length;$("stat-due").textContent=due().length;$("home-progress").style.width=Math.round(fin/11*100)+"%";$("chapter-grid").innerHTML=chapters.map(card).join("");$("review-due").textContent=due().length?due().length+" أسئلة مستحقة للمراجعة":"كل المراجعات مكتملة حالياً";$("due-pill").textContent=due().length;}
function startChapter(num){const c=chapters.find(x=>x[0]===num);if(!c)return;const ms=models.findIndex(m=>m[2]===num);if(ms!==-1){selectedModel=ms;nav("lab");showModel(selectedModel);}else{nav("chapters");announce("لم نعتمد مجسماً لهذا الفصل بعد؛ تگدر تراجع الفصل وتبدأ الاختبار.");} }
function showModel(n){const m=models[n];if(!m)return;selectedModel=n;const slug=m[0],name=m[1];$("model-title").textContent=name;$("model-chapter").textContent="الفصل "+m[2]+" · "+chapters[m[2]-1][1];$("model-source").href="https://github.com/organui/"+slug+"-3d";$("model-license").textContent=m[4];$("model-credit").textContent="المجسم من OrganUI على GitHub؛ العرض يحتاج إنترنت. تحقّق من حقوق الملف قبل استخدامه تجارياً.";$("model-status").textContent="جاري تحميل المجسم من مشروع GitHub…";const v=$("anatomy-viewer");v.removeAttribute("src");v.src="https://cdn.jsdelivr.net/gh/organui/"+slug+"-3d@main/public/models/"+slug+".glb";$("model-list").querySelectorAll("button").forEach((b,i)=>b.classList.toggle("active",i===n));}
function renderLab(){const list=$("model-list");list.innerHTML=models.map((m,i)=>'<button class="list-group-item list-group-item-action '+(i===selectedModel?"active":"")+'" type="button" data-model="'+i+'"><span class="me-2">'+ico("brain")+'</span>'+m[1]+'<small class="text-secondary float-end">ف '+m[2]+'</small></button>').join("");showModel(selectedModel);}
function renderQuiz(){const q=questions[qIndex];$("quiz-label").textContent="السؤال "+(qIndex+1)+" من "+questions.length;$("quiz-score").textContent="الصحيح: "+score;$("quiz-question").textContent=q[0];$("quiz-options").innerHTML=q[1].map((a,i)=>'<button type="button" class="btn btn-outline-primary text-start w-100 mb-2 py-3" data-answer="'+i+'">'+String.fromCharCode(65+i)+". "+a+'</button>').join("");$("quiz-feedback").classList.add("d-none");$("next-question").disabled=true;answered=false;}
function chooseAnswer(idx){if(answered)return;answered=true;const q=questions[qIndex],correct=idx===q[2];if(correct)score++;else{const prev=state.wrong[qIndex]||{tries:0};state.wrong[qIndex]={tries:prev.tries+1,active:true,next:new Date(Date.now()+24*3600e3).toISOString()};persist();}document.querySelectorAll("[data-answer]").forEach(b=>{b.disabled=true;if(+b.dataset.answer===q[2])b.className="btn btn-success text-start w-100 mb-2 py-3";else if(+b.dataset.answer===idx)b.className="btn btn-danger text-start w-100 mb-2 py-3";});$("quiz-feedback").textContent=(correct?"إجابة صحيحة. ":"نحتاج نراجعها. ")+q[3];$("quiz-feedback").className="alert alert-"+(correct?"success":"warning");$("next-question").disabled=false;$("quiz-score").textContent="الصحيح: "+score;refresh();}
function next(){qIndex=(qIndex+1)%questions.length;if(qIndex===0){announce("أنهيت الجولة: "+score+" / "+questions.length);score=0;}renderQuiz();}
function renderVault(){const list=$("vault-list"),items=mistakes();list.innerHTML=items.length?items.map(([id,v])=>'<div class="list-group-item"><div class="d-flex justify-content-between gap-3 align-items-center"><div><strong>'+questions[id][0]+'</strong><div class="text-secondary small">مرات الخطأ: '+v.tries+' · المراجعة: '+new Date(v.next).toLocaleDateString("ar-IQ")+'</div></div><button class="btn btn-outline-primary btn-sm" data-repeat="'+id+'">راجعني</button></div></div>').join(""):'<div class="empty p-4 text-secondary">لا توجد أخطاء محفوظة. اختبر نفسك حتى تبدأ المراجعة الذكية.</div>';$("vault-count").textContent=items.length+" أخطاء تحتاج متابعة";}
function repeat(id){const q=questions[id];if(!q)return;const ans=prompt(q[0]+'\n'+q[1].map((v,i)=>(i+1)+') '+v).join('\n')+'\nاكتب رقم الإجابة الصحيحة (1-4)');if(ans===null)return;if(Number(ans)-1===q[2]){const prev=state.wrong[id];let tries=prev.tries||1;let interval=[1,3,7,14,30][Math.min(tries,4)];prev.tries=tries+1;prev.next=new Date(Date.now()+interval*86400000).toISOString();if(tries>=3)prev.active=false;announce("صحيح! راح نراجعها حسب موعد التكرار المتباعد. "+q[3]);}else{state.wrong[id]={tries:1,active:true,next:new Date(Date.now()+86400000).toISOString()};announce("بعدها تحتاج مراجعة. "+q[3]);}persist();renderVault();refresh();}
function renderPlan(){$("plan-list").innerHTML=state.plan.length?state.plan.map((p,i)=>'<label class="list-group-item"><input type="checkbox" class="form-check-input me-3" data-plan="'+i+'" '+(p.done?"checked":"")+'><span class="'+(p.done?"text-secondary text-decoration-line-through":"")+'">'+p.title+'</span></label>').join(""):'<div class="p-4 text-secondary">اختَر عدد أيام المراجعة حتى ننظم الفصول.';}
function plan(){const days=Number($("days-input").value);if(!Number.isInteger(days)||days<1||days>120){announce("اختَر من يوم إلى 120 يوماً");return;}state.plan=Array.from({length:days},(_,i)=>({title:"اليوم "+(i+1)+" — "+chapters[Math.min(10,Math.floor(i*11/days))][1],done:false}));persist();renderPlan();announce("تمت إضافة الخطة على هذا الجهاز.");}
function search(s){if(!s.trim())return;nav("chapters");const w=s.trim();$("chapter-grid").innerHTML=chapters.filter(x=>x[1].includes(w)||x[3].includes(w)).map(card).join("")||'<div class="col-12">'+box("ما لكينا تطابق. جرّب اسم جهاز آخر.")+'</div>';}
document.addEventListener("click",e=>{const v=e.target.closest("[data-view]");if(v){e.preventDefault();nav(v.dataset.view);return;}const ch=e.target.closest("[data-chapter]");if(ch)return startChapter(Number(ch.dataset.chapter));const mod=e.target.closest("[data-model]");if(mod)return showModel(Number(mod.dataset.model));const answer=e.target.closest("[data-answer]");if(answer)return chooseAnswer(Number(answer.dataset.answer));const rep=e.target.closest("[data-repeat]");if(rep)return repeat(Number(rep.dataset.repeat));});
$("next-question").addEventListener("click",next);$("restart-quiz").addEventListener("click",()=>{qIndex=0;score=0;renderQuiz();});
$("plan-generate").addEventListener("click",plan);
$("plan-list").addEventListener("change",e=>{const el=e.target.closest("[data-plan]");if(!el)return;state.plan[+el.dataset.plan].done=el.checked;persist();renderPlan();});
$("model-done").addEventListener("click",()=>{const c=models[selectedModel][2];if(!state.finished.includes(c))state.finished.push(c);persist();refresh();announce("أحسنت! حفظنا تقدمك بهذا الفصل على الجهاز.");});
$("anatomy-viewer").addEventListener("load",()=>{$("model-status").textContent="المجسم جاهز. اسحب للتدوير وكبّر بإصبعين.";});
$("anatomy-viewer").addEventListener("error",()=>{$("model-status").textContent="تعذّر تنزيل هذا النموذج من المصدر. افتح رابط GitHub للتحقق منه.";});
$("search-form").addEventListener("submit",e=>{e.preventDefault();search($("search-input").value);});
$("reminders").addEventListener("click",()=>{nav("vault");announce("تستحق المراجعة حالياً "+due().length+" أسئلة.");});
$("open-voice").addEventListener("click",()=>window.location.href="voice_production.html");
refresh();renderLab();renderQuiz();renderPlan();nav((location.hash||"#home").slice(1));
})();