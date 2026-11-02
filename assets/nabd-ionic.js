/* نَبْض V9 — Ionic Framework native components (MIT), real anatomy art from Health Icons CC0.
   No AI-drawn icons or generated human-anatomy imagery are used. */
(()=>{
"use strict";
const $=id=>document.getElementById(id), qs=s=>document.querySelector(s);
const chapters=[
 {id:1,title:"الجهاز العصبي",page:5,summary:"الدماغ والحبل الشوكي والأعصاب",icon:"nerve"},
 {id:2,title:"الجهاز الهيكلي",page:15,summary:"العظام والمفاصل",icon:"skeleton"},
 {id:3,title:"الجهاز العضلي",page:31,summary:"العضلات والحركة",icon:"arm"},
 {id:4,title:"الجهاز الهضمي",page:41,summary:"الهضم والامتصاص",icon:"intestine"},
 {id:5,title:"جهاز الدوران",page:57,summary:"الدم والأوعية والقلب",icon:"blood-vessel"},
 {id:6,title:"جهاز التنفس",page:71,summary:"الرئتان وتبادل الغازات",icon:"lungs"},
 {id:7,title:"الجهاز البولي",page:81,summary:"الكليتان والإخراج",icon:"kidneys"},
 {id:8,title:"الجهاز التناسلي",page:93,summary:"التكاثر وأعضاؤه",icon:"dna"},
 {id:9,title:"أعضاء الحس",page:101,summary:"العين والأذن والحواس",icon:"eye"},
 {id:10,title:"الغدد الصم",page:115,summary:"الغدد والهرمونات",icon:"thyroid"},
 {id:11,title:"المناعة والأمراض",page:123,summary:"المناعة والدفاع عن الجسم",icon:"cell-nuclei"}
];
const models=[
 ["brain","الدماغ",1,"nerve"],["spinal-cord","الحبل الشوكي",1,"nerve"],
 ["skeleton","الهيكل العظمي",2,"skeleton"],
 ["muscles","العضلات",3,"arm"],["stomach","المعدة",4,"stomach"],
 ["liver","الكبد",4,"liver"],["heart","القلب",5,"blood-vessel"],
 ["lungs","الرئتان",6,"lungs"],["kidneys","الكليتان",7,"kidneys"],
 ["eye","العين",9,"eye"],["ear","الأذن",9,"ear"],
 ["thyroid","الغدة الدرقية",10,"thyroid"],["spleen","الطحال",11,"cell-nuclei"]
];
const questions=[
 ["ما الوحدة الأساسية في بناء الجهاز العصبي؟",["النسيج العصبي","الخلية العصبية","العصب الحسي","الحبل الشوكي"],1,"الخلية العصبية وحدة البناء والوظيفة في الجهاز العصبي."],
 ["أي جزء من الدماغ يسيطر على الحركات الإرادية؟",["النخاع المستطيل","المخيخ","المخ","الحبل الشوكي"],2,"المخ يسيطر على الحركات الإرادية."],
 ["ما وظيفة المخيخ؟",["تنظيم حركة العضلات الإرادية","تكوين البول","إفراز الهرمونات","نقل الدم"],0,"المخيخ ينظم حركة العضلات الإرادية."],
 ["كم زوجاً من الأعصاب الشوكية؟",["12","31","24","40"],1,"الأعصاب الشوكية 31 زوجاً."],
 ["كم زوجاً من الأعصاب القحفية؟",["20","31","12","40"],2,"الأعصاب القحفية 12 زوجاً."],
 ["أين يقع مركز فعل سحب اليد الانعكاسي عند الوخز؟",["المخ","المخيخ","النخاع المستطيل","الحبل الشوكي"],3,"هذا الفعل الانعكاسي مركزه الحبل الشوكي."],
 ["ماذا ينقل العصب الحسي؟",["الهرمونات","الإيعاز إلى العضلة","الحافز إلى الجهاز العصبي المركزي","الدم إلى الرئتين"],2,"العصب الحسي ينقل الحافز إلى الجهاز العصبي المركزي."],
 ["كيف يستجيب الجهاز الودي في حالات الخطر؟",["يخفض ضربات القلب","يزيد ضربات القلب","يوقف التنفس","يمنع التعرق"],1,"يمكن أن يزيد ضربات القلب عند الخطر."]
];
const STORAGE="nabd-ionic-education-v9";
let state={completed:[],vault:{},plan:[]};
try{const s=JSON.parse(localStorage.getItem(STORAGE)||"{}");if(s&&typeof s==="object")state={...state,...s}}catch(_){}
if(!Array.isArray(state.completed))state.completed=[];if(!Array.isArray(state.plan))state.plan=[];if(!state.vault||typeof state.vault!=="object")state.vault={};
let active="today",modelIndex=0,questionIndex=0,score=0,answered=false;
const save=()=>{try{localStorage.setItem(STORAGE,JSON.stringify(state))}catch(_){notify("الحفظ غير متاح؛ افتح الموقع في متصفح يسمح بالتخزين.")}};
function notify(t){const toast=$("app-toast");if(toast){toast.message=t;toast.duration=2800;toast.present();}}
function art(name,cls=""){const e=document.createElementNS("http://www.w3.org/2000/svg","svg");e.setAttribute("class","anatomy-pictogram "+cls);e.setAttribute("role","img");e.setAttribute("aria-label",name);const u=document.createElementNS("http://www.w3.org/2000/svg","use");u.setAttribute("href","assets/healthicons-anatomy.svg#an-"+name);e.appendChild(u);return e}
function iconFor(icon){const e=art(icon);const holder=document.createElement("span");holder.className="anatomy-figure";holder.appendChild(e);return holder}
const wrongEntries=()=>Object.entries(state.vault).filter(([,v])=>v&&v.active);
const dueEntries=()=>wrongEntries().filter(([,v])=>Date.parse(v.next)<=Date.now());
function navigate(to){if(!["today","chapters","lab","quiz","review"].includes(to))to="today";active=to;document.querySelectorAll(".screen").forEach(e=>e.classList.toggle("is-active",e.id==="view-"+to));document.querySelectorAll("#bottom-nav ion-tab-button").forEach(e=>e.selected=e.getAttribute("tab")===to);const titles={today:"نَبْض | يومك الدراسي",chapters:"فصول المنهج",lab:"مختبر التشريح",quiz:"اختبرني",review:"المراجعة"};$("nav-title").textContent=titles[to];history.replaceState(null,"","#"+to);if(to==="lab")openModel(modelIndex);if(to==="quiz")renderQuiz();if(to==="review")renderReview();$("main-content").scrollToTop?.(180);}
function makeChapter(ch,compact=false){
 const card=document.createElement(compact?"ion-card":"ion-item");
 if(compact){
  card.setAttribute("button","true");
  const content=document.createElement("ion-card-content");content.appendChild(iconFor(ch.icon));const title=document.createElement("div");title.className="chapter-title";title.textContent=ch.title;const sub=document.createElement("div");sub.className="chapter-sub";sub.textContent="الفصل "+ch.id+" · ص "+ch.page;content.append(title,sub);card.append(content);
 }else{
  card.setAttribute("button","true");card.setAttribute("detail","true");
  const figure=document.createElement("span");figure.slot="start";figure.appendChild(iconFor(ch.icon));card.appendChild(figure);
  const label=document.createElement("ion-label");const title=document.createElement("h3");title.textContent=ch.title;const p=document.createElement("p");p.textContent=ch.summary+" · ص "+ch.page;label.append(title,p);card.appendChild(label);
  if(state.completed.includes(ch.id)){const badge=document.createElement("ion-badge");badge.color="success";badge.slot="end";badge.textContent="راجعته";card.appendChild(badge)}
 }
 card.addEventListener("click",()=>openChapter(ch.id));return card
}
function chapterDisplay(q=""){const list=$("chapters-list");list.replaceChildren();const matching=chapters.filter(c=>!q||[c.title,c.summary,String(c.id)].join(" ").includes(q.trim()));if(!matching.length){const item=document.createElement("ion-item");const label=document.createElement("ion-label");label.textContent="ما لقينا فصل بهذا الاسم";item.append(label);list.append(item)}else matching.forEach(ch=>list.appendChild(makeChapter(ch)));const mini=$("chapter-preview");mini.replaceChildren();chapters.slice(0,4).forEach(ch=>mini.appendChild(makeChapter(ch,true)));}
function openChapter(id){const at=models.findIndex(m=>m[2]===id);if(at>=0){modelIndex=at;navigate("lab")}else{navigate("chapters");notify("هذا الفصل ما إله مجسم تشريحي مدقق بعد. تگدر تختبر معلوماتك من قسم الاختبارات.")}}
function refresh(){const n=state.completed.length;$("home-progress-title").textContent=n?"راجعت "+n+" من أصل 11 فصلاً":"ما راجعت أي فصل بعد";$("home-progress-subtitle").textContent=n?"مراجعة الفصل لا تعني إتقان كل أسئلته؛ اختبر نفسك.":"افتح فصل واختبر فهمك حتى يبدأ تقدمك";$("home-progress-bar").value=n/11;const due=dueEntries().length;$("today-due-count").textContent=due?due+" أسئلة تحتاج مراجعة اليوم":"نبدأ بفكرة وحدة";$("today-task-title").textContent=due?"راجع أخطاءك المستحقة":"افهم ثم اختبر نفسك";$("today-task-desc").textContent=due?"أكو أسئلة لازم ترجع إلها حتى ما تنساها":"ابدأ بدرس الجهاز العصبي، بعدها جاوب أسئلة قصيرة.";}
function renderModels(){const sel=$("organ-select");sel.replaceChildren();models.forEach(m=>{const option=document.createElement("ion-select-option");option.value=m[0];option.textContent=m[1];sel.appendChild(option)});}
function openModel(i){const m=models[i];if(!m)return;modelIndex=i;$("lab-title").textContent=m[1];$("lab-description").textContent="من الفصل "+m[2]+" — حرّك المجسم لتشاهد شكله وعلاقته بالأجزاء المحيطة.";$("organ-select").value=m[0];const repo="https://github.com/organui/"+m[0]+"-3d";$("open-source").dataset.url=repo;$("lab-license").textContent="الملف من OrganUI؛ الترخيص يختلف من نموذج لآخر. راجع مستودع المصدر.";$("model-status").textContent="جاري تحميل نموذج "+m[1]+"…";const viewer=$("anatomy-viewer");viewer.removeAttribute("src");viewer.src="https://cdn.jsdelivr.net/gh/organui/"+m[0]+"-3d@main/public/models/"+m[0]+".glb";}
function renderQuiz(){const q=questions[questionIndex];answered=false;$("quiz-number").textContent="السؤال "+(questionIndex+1)+" من "+questions.length;$("quiz-question").textContent=q[0];$("quiz-score").textContent="الصحيح: "+score;$("quiz-progress").value=(questionIndex+1)/questions.length;const area=$("quiz-options");area.replaceChildren();q[1].forEach((choice,i)=>{const b=document.createElement("ion-button");b.expand="block";b.fill="outline";b.color="primary";const text=document.createElement("span");text.className="answer-text";text.textContent=choice;b.appendChild(text);b.addEventListener("click",()=>answer(i));area.appendChild(b)});$("next-question").disabled=true;$("quiz-feedback").hidden=true;}
function answer(i){if(answered)return;answered=true;const q=questions[questionIndex],good=i===q[2];if(good)score++;else{const v=state.vault[questionIndex]||{level:0,count:0};state.vault[questionIndex]={active:true,level:0,count:v.count+1,next:new Date(Date.now()+86400000).toISOString()};save()}[...$("quiz-options").querySelectorAll("ion-button")].forEach((b,j)=>{b.disabled=true;b.color=j===q[2]?"success":j===i?"danger":"medium";b.fill=j===q[2]||j===i?"solid":"outline"});const message=$("quiz-feedback");message.hidden=false;message.textContent=(good?"ممتاز. ":"تحتاج ترجع لها. ")+q[3];$("quiz-score").textContent="الصحيح: "+score;$("next-question").disabled=false;refresh();}
function advance(){questionIndex=(questionIndex+1)%questions.length;if(questionIndex===0){notify("أنهيت الجولة بنتيجة "+score+" من "+questions.length);score=0;}renderQuiz();}
function renderVault(){const parent=$("vault-list");parent.replaceChildren();const items=wrongEntries();$("vault-empty").hidden=items.length>0;items.forEach(([id,v])=>{const row=document.createElement("ion-item");const label=document.createElement("ion-label");const h=document.createElement("h3");h.textContent=questions[Number(id)]?.[0]||"سؤال سابق";const p=document.createElement("p");p.textContent="خطأت "+v.count+" مرة · المراجعة: "+new Date(v.next).toLocaleDateString("ar-IQ");label.append(h,p);row.appendChild(label);const b=document.createElement("ion-button");b.slot="end";b.fill="outline";b.size="small";b.textContent="سمّعني";b.addEventListener("click",()=>reviewOne(Number(id)));row.appendChild(b);parent.appendChild(row);})}
async function reviewOne(id){const q=questions[id];if(!q)return;const alert=document.createElement("ion-alert");alert.header="مراجعة من خزنة الأخطاء";alert.message=q[0];alert.inputs=q[1].map((v,i)=>({type:"radio",label:v,value:String(i),checked:false}));alert.buttons=[{text:"إلغاء",role:"cancel"},{text:"تحقق",role:"confirm"}];document.body.appendChild(alert);await alert.present();const r=await alert.onDidDismiss();alert.remove();if(r.role!=="confirm")return;const chosen=r.data?.values??r.data?.values?.[0];if(chosen===undefined||chosen===null)return;if(Number(chosen)===q[2]){const p=state.vault[id],levels=[1,3,7,14,30];p.level=Math.min(p.level+1,4);p.next=new Date(Date.now()+levels[p.level]*86400000).toISOString();if(p.level>=4)p.active=false;notify("صحيح. "+q[3]);}else{state.vault[id]={active:true,level:0,count:(state.vault[id]?.count||0)+1,next:new Date(Date.now()+86400000).toISOString()};notify("نراجعها مرة ثانية. "+q[3])}save();renderVault();refresh()}
function renderPlan(){const list=$("plan-list");list.replaceChildren();$("plan-empty").hidden=state.plan.length>0;state.plan.forEach((row,i)=>{const item=document.createElement("ion-item");const check=document.createElement("ion-checkbox");check.justify="space-between";check.labelPlacement="start";check.checked=!!row.done;check.textContent=row.text;check.addEventListener("ionChange",e=>{state.plan[i].done=!!e.detail.checked;save()});item.append(check);list.append(item)})}
function makePlan(){const days=Number($("days-input").value);if(!Number.isInteger(days)||days<1||days>120){notify("اختَر عدد أيام بين 1 و120");return}state.plan=Array.from({length:days},(_,i)=>{const ch=chapters[Math.min(10,Math.floor(i*11/days))];return {text:"اليوم "+(i+1)+" — "+ch.title,done:false}});save();renderPlan();notify("جهزنا لك جدول مراجعة لـ "+days+" يوماً.")}
function renderReview(){const show=$("review-segment").value||"mistakes";$("review-mistakes").hidden=show!=="mistakes";$("review-planner").hidden=show!=="planner";renderVault();renderPlan();}
function selectTab(t){navigate(t)}
function openMore(){const modal=$("more-modal");modal.present()}
function openLink(link){window.open(link,"_blank","noopener,noreferrer")}
function bind(){document.querySelectorAll("#bottom-nav ion-tab-button").forEach(el=>el.addEventListener("click",()=>selectTab(el.getAttribute("tab"))));document.addEventListener("click",e=>{const el=e.target.closest("[data-action],[data-tab]");if(!el)return;if(el.dataset.tab){navigate(el.dataset.tab);return}switch(el.dataset.action){case"home":navigate("today");break;case"start":openChapter(1);break;case"today-task":navigate(dueEntries().length?"review":"chapters");break;case"quiz":navigate("quiz");break;case"due":navigate("review");break;case"more":openMore();break;case"close-more":$("more-modal").dismiss();break;case"source":openLink($("open-source").dataset.url);break;case"teacher":$("more-modal").dismiss();location.href="voice_production.html";break;case"atlas":$("more-modal").dismiss();location.href="atlas_real.html";break;case"sources":$("more-modal").dismiss();openLink("https://github.com/resolvetosavelives/healthicons");break;case"restart-quiz":score=0;questionIndex=0;renderQuiz();break;}});$("chapter-search").addEventListener("ionInput",e=>chapterDisplay(e.detail?.value||""));$("organ-select").addEventListener("ionChange",e=>{const n=models.findIndex(x=>x[0]===e.detail?.value);if(n>=0&&n!==modelIndex)openModel(n)});$("anatomy-viewer").addEventListener("load",()=>$("model-status").textContent="المجسم جاهز — اسحب وقرّب للتدوير والتكبير");$("anatomy-viewer").addEventListener("error",()=>$("model-status").textContent="تعذّر التحميل من GitHub؛ افتح رابط المصدر للتحقق من الملف.");$("next-question").addEventListener("click",advance);$("generate-plan").addEventListener("click",makePlan);$("review-segment").addEventListener("ionChange",renderReview)}
function init(){renderModels();chapterDisplay();refresh();renderQuiz();renderReview();bind();const hash=location.hash.slice(1);navigate(["today","chapters","lab","quiz","review"].includes(hash)?hash:"today")}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();