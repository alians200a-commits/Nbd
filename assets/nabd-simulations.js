(()=>{"use strict";
const $=id=>document.getElementById(id),curr=window.NABD_CURRICULUM;
if(!curr||!Array.isArray(curr.chapters))return;
const MODELS={1:"brain",2:"skeleton",3:"muscles",4:"stomach",5:"heart",6:"lungs",7:"kidneys",8:"prostate",9:"eye",10:"thyroid",11:"spleen"};
const SPECIAL={ "1/0":{kind:"neuron",target:"nucleus"}, "1/1":{kind:"neuron",target:"soma"}};
const variants={"1/2":"spinal-cord","1/3":"brain","2/3":"skeleton","3/0":"muscles","4/0":"intestines","4/1":"teeth","4/2":"stomach","4/3":"liver","5/0":"vessels","5/1":"vessels","5/2":"heart","5/3":"vessels","6/0":"lungs","6/1":"larynx","6/2":"lungs","6/3":"lungs","7/0":"kidneys","7/1":"kidneys","7/2":"bladder","7/3":"skin","8/0":"prostate","8/1":"prostate","9/0":"eye","9/1":"skin","9/2":"tongue","9/3":"ear","10/0":"thyroid","10/1":"thyroid","10/2":"thyroid","10/3":"thyroid","11/0":"skin","11/1":"thymus","11/2":"thymus","11/3":"spleen"};
const PARTS=[["nucleus","النواة"],["soma","جسم الخلية"],["dendrite","التفرعات الشجيرية"],["axon","المحور العصبي"]];
let ch=1,ti=0,engine=null,canvas=null,special=null,loadedModel=null,correct=false,three=null;
function toast(text){const x=$("sim-toast");x.message=text;x.present()}
function activeTopic(){const c=curr.chapters.find(x=>x.id===ch);return c?.topics[ti]?{c,t:c.topics[ti]}:null}
function selectTopic(chapter,index){const c=curr.chapters.find(c=>c.id===Number(chapter));if(!c)return;ch=c.id;ti=Math.max(0,Math.min(Number(index)||0,c.topics.length-1));$("sim-chapter").value=String(ch);const pick=$("sim-topic");pick.replaceChildren();for(let i=0;i<c.topics.length;i++){const e=document.createElement("ion-select-option");e.value=String(i);e.textContent=(i+1)+". "+c.topics[i][0];pick.append(e)}pick.value=String(ti);setScene();document.dispatchEvent(new CustomEvent("nabd:topic-change",{detail:{chapter:ch,topic:ti}}));history.replaceState(null,"","#c"+ch+"t"+ti)}
function clearScene(){if(engine?.dispose)engine.dispose();engine=null;const view=$("organ-3d");view.removeAttribute("src");$("part-buttons").replaceChildren();$("neuron-stage").hidden=true;$("model-stage").hidden=false;correct=false}
function buttons(parts){const root=$("part-buttons");root.replaceChildren();for(let [id,title] of parts){const b=document.createElement("ion-button");b.fill="outline";b.size="small";b.textContent=title;b.onclick=()=>check(id);root.append(b)}}
function setScene(){clearScene();const obj=activeTopic();if(!obj)return;const {c,t}=obj,k=ch+"/"+ti;special=SPECIAL[k]||null;
$("page-label").textContent="الفصل "+ch+" · صفحة "+t[1];$("topic-title").textContent=t[0];$("explanation").textContent=t[2];$("answer-status").textContent="ابدأ النشاط، ثم راجع الإجابة على ضوء شرح الفقرة.";
if(special){$("neuron-stage").hidden=false;$("model-stage").hidden=true;$("source-name").textContent="مشهد عصبي تعليمي مجسم بالبرمجة، وليس صورة تشريحية فائقة الدقة";$("source-link").href="https://github.com/mrdoob/three.js";$("task-title").textContent=special.target==="nucleus"?"أشّر على النواة نفسها":"أشّر على جسم الخلية (خارج النواة)";$("task-hint").textContent="الكرة الصغيرة داخل جسم الخلية هي النواة. مساحة جسم الخلية حول النواة تمثل جزءاً مختلفاً؛ اختيار أحدهما لا يساوي الآخر.";buttons(PARTS);const hint=document.createElement("ion-button");hint.id="show-nucleus-hint";hint.fill="outline";hint.color="tertiary";hint.size="small";hint.textContent="دلّني على النواة";hint.onclick=()=>engine?.hint?.();$("part-buttons").append(hint);const pulseBtn=document.createElement("ion-button");pulseBtn.id="run-neuron-signal";pulseBtn.size="small";pulseBtn.color="secondary";pulseBtn.fill="outline";pulseBtn.textContent="حاكي انتقال الإيعاز";pulseBtn.onclick=()=>engine?.startPulse?.();$("part-buttons").append(pulseBtn);startNeuron();}
else{$("task-title").textContent=t[4];$("task-hint").textContent="حرّك النموذج إذا توفر، ثم حاول إجابة السؤال قبل عرض حل المصدر. هذا نشاط فهم وليس محاكاة فسيولوجية مكتملة.";const m=(k==="8/2"||k==="8/3")?null:(variants[k]||MODELS[ch]);if(m){$("source-name").textContent="مجسم مرجعي ذو صلة بالفقرة — OrganUI / "+m+"؛ ليس بالضرورة تصويراً مطابقاً للدرس. ترخيص النموذج مستقل عن ترخيص شيفرة العرض.";$("source-link").href="https://github.com/organui/"+m+"-3d";$("organ-3d").src="https://cdn.jsdelivr.net/gh/organui/"+m+"-3d@main/public/models/"+m+".glb";$("scene-status").textContent="تحميل المجسم المرجعي… يتحكم الطالب بتدويره والتكبير."}else{$("source-name").textContent="لا يتوفر نموذج ثلاثي الأبعاد مطابق لهذه الفقرة من المصادر المتحقق منها";$("source-link").href="https://github.com/organui";$("scene-status").textContent="عرض شرح علمي وسؤال فهم دون الادعاء بوجود مجسم غير متاح."}
buttons([["reveal","أظهر الجواب الأصلي من الملخص"],["understood","فهمت الفقرة"],["review","أحتاج مراجعة"]]);}
}
function check(id){if(special){if(id===special.target){$("answer-status").textContent="✓ إجابة صحيحة: اخترت "+(id==="nucleus"?"النواة":"جسم الخلية")+" بوصفه جزءاً مستقلاً. هذا يمنع خطأ اعتبار جسم الخلية كله نواة.";correct=true}else{$("answer-status").textContent="✕ غير صحيح: "+PARTS.find(p=>p[0]===id)?.[1]+" ليس "+(special.target==="nucleus"?"النواة نفسها":"المنطقة الخارجية لجسم الخلية")+". شوف الجزء البنفسجي الصغير داخل الجسم، أو اضغط زر «دلّني على النواة»."}return}
const t=activeTopic()?.t;if(!t)return;
if(id==="reveal"){$("answer-status").textContent="جواب السؤال في ملخص الدرس: "+t[5];return}
if(id==="understood"){$("answer-status").textContent="✓ سجّلنا مراجعتك ذاتياً. حل أسئلة الملزمة المرتبطة بالصفحة للتأكد من فهمك.";saveProgress(true);return}
if(id==="review"){$("answer-status").textContent="هذه الفقرة تحتاج مراجعة إضافية. ارجع للنص والمجسم ثم أعد الإجابة.";saveProgress(false)}
}
function saveProgress(ok){const key="nabd-sim-progress-v1";let obj={};try{obj=JSON.parse(localStorage.getItem(key)||"{}")}catch(_){}obj[ch+"/"+ti]={checked:ok,time:new Date().toISOString()};try{localStorage.setItem(key,JSON.stringify(obj))}catch(_){}}
async function startNeuron(){
const host=$("neuron-stage");host.querySelectorAll("canvas").forEach(e=>e.remove());const thisTopic=ch+"/"+ti;
try{
const THREE=await import("three");if(!special||ch+"/"+ti!==thisTopic)return;three=THREE;
const scene=new THREE.Scene();const camera=new THREE.PerspectiveCamera(42,1,.1,100);camera.position.set(0,0,5.7);camera.lookAt(0,0,0);const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:"low-power"});renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));host.append(renderer.domElement);
const light=new THREE.HemisphereLight(0xffffff,0x89aacc,2.4);scene.add(light);const direct=new THREE.DirectionalLight(0xffffff,1.6);direct.position.set(-3,5,7);scene.add(direct);
const clickable=[];function mesh(geom,color,name,x,y,z){const m=new THREE.Mesh(geom,new THREE.MeshStandardMaterial({color,roughness:.55,metalness:.04}));m.position.set(x,y,z);m.userData.part=name;scene.add(m);clickable.push(m);return m}
const soma=mesh(new THREE.SphereGeometry(.91,32,20),0x54b9a8,"soma",-0.45,0,0);soma.material.transparent=true;soma.material.opacity=.61;soma.material.depthWrite=false;
const nucleus=mesh(new THREE.SphereGeometry(.32,40,28),0x684cae,"nucleus",-0.46,.05,.95);
const nucleolus=mesh(new THREE.SphereGeometry(.115,28,22),0xd1b3ff,"nucleus",-0.46,.05,1.24);
const cylinder=(a,b,r,color,name)=>{const start=new THREE.Vector3(...a),end=new THREE.Vector3(...b),dir=end.clone().sub(start),g=new THREE.CylinderGeometry(r*.82,r,dir.length(),10);const m=mesh(g,color,name,...start.clone().add(end).multiplyScalar(.5).toArray());m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),dir.normalize());return m};
for(let i=0;i<6;i++){const rad=i*Math.PI*2/6;const base=[-1.1+Math.cos(rad)*.21,Math.sin(rad)*.55,-.08];const end=[-1.54+Math.cos(rad)*.44,Math.sin(rad)*1.1,-.2];cylinder(base,end,.07,0x4ab5a2,"dendrite");}
cylinder([.3,.05,-.06],[1.7,.05,-.06],.14,0xdda969,"axon");cylinder([1.65,.05,-.06],[2.1,.5,-.06],.06,0xdda969,"axon");cylinder([1.65,.05,-.06],[2.15,-.38,-.06],.06,0xdda969,"axon");
// Independent learning simulation of directional communication across neuron parts.
const pulse=new THREE.Mesh(new THREE.SphereGeometry(.14,18,12),new THREE.MeshStandardMaterial({color:0xf9ce59,emissive:0xffb700,emissiveIntensity:1.35}));
pulse.visible=false;scene.add(pulse);
const pulsePath=[new THREE.Vector3(-1.87,-.55,.14),new THREE.Vector3(-1.06,-.27,.34),new THREE.Vector3(-.48,0,1.30),new THREE.Vector3(.3,.05,.42),new THREE.Vector3(1.28,.05,.20),new THREE.Vector3(2.1,.50,.13)];
let pulseActive=false,pulsePosition=0,lastStage=-1;
function startPulse(){pulsePosition=0;pulseActive=true;pulse.visible=true;lastStage=-1;
$("scene-status").textContent="نشاط تعليمي: يبدأ الحافز من المستقبلات في التفرعات ثم يُدمج في جسم الخلية ويستمر نحو المحور العصبي. ليس قياساً كهربائياً حقيقياً.";}
let frame=0,disposed=false,raf=0;
const fit=()=>{if(disposed)return;const w=host.clientWidth,h=host.clientHeight;camera.aspect=w/Math.max(1,h);camera.updateProjectionMatrix();renderer.setSize(w,h,false)};fit();
const resize=typeof ResizeObserver!=="undefined"?new ResizeObserver(fit):null;resize?.observe(host);
const ray=new THREE.Raycaster(),pointer=new THREE.Vector2();
const nucleusPoint=new THREE.Vector3(-.46,.05,1.12);
function showHint(){const world=scene.localToWorld(nucleusPoint.clone()),p=world.project(camera);nucleus.material.emissive.setHex(0x6f2ccb);nucleus.material.emissiveIntensity=1.15;$("answer-status").textContent="شوف الكرة البنفسجية الصغيرة المضيئة بوسط جسم الخلية: هاي هي النواة. اضغط عليها مباشرة، أو اختَر زر «النواة» أدناه.";}
const click=e=>{
 const bounds=renderer.domElement.getBoundingClientRect();
 pointer.set((e.clientX-bounds.left)/bounds.width*2-1,-(e.clientY-bounds.top)/bounds.height*2+1);
 // A mobile finger covers a small nucleus: prioritize taps near its projected centre.
 // The rest of the soma remains a distinct, independently assessed part.
 const p=scene.localToWorld(nucleusPoint.clone()).project(camera);
 const screenX=bounds.left+(p.x+1)*bounds.width/2;
 const screenY=bounds.top+(1-p.y)*bounds.height/2;
 const tolerance=Math.max(30,Math.min(bounds.width,bounds.height)*.075);
 if(Math.hypot(e.clientX-screenX,e.clientY-screenY)<=tolerance){check("nucleus");return;}
 ray.setFromCamera(pointer,camera);const hits=ray.intersectObjects(clickable,false);
 if(hits.length)check(hits[0].object.userData.part);
 else $("answer-status").textContent="اضغط على الجزء المطلوب. زر «دلّني على النواة» يساعدك تميّزها عن جسم الخلية.";
};
renderer.domElement.addEventListener("pointerdown",click);
const loop=()=>{if(disposed)return;
 scene.rotation.y=Math.sin(frame/140)*.12;
 if(pulseActive){
  pulsePosition+=.0045;
  const u=Math.min(1,pulsePosition),pos=u*(pulsePath.length-1),i=Math.min(pulsePath.length-2,Math.floor(pos)),f=pos-i;
  pulse.position.copy(pulsePath[i]).lerp(pulsePath[i+1],f);
  const stage=i<1?0:i<3?1:2;
  if(stage!==lastStage){lastStage=stage;const names=["تستقبل التفرعات الإشارة","يُجمع الإدخال العصبي في جسم الخلية","يمر الإيعاز باتجاه المحور العصبي"];
    $("scene-status").textContent="مسار توضيحي: "+names[stage]+" — اضغط زر التحديد لتمييز النواة عن جسم الخلية."}
  if(u>=1){pulseActive=false;pulse.visible=false;$("scene-status").textContent="اكتمل مسار الإشارة المبسط. النواة ليست مسار انتقال الإيعاز؛ هي جزء من جسم الخلية."}
 }
 frame++;renderer.render(scene,camera);raf=requestAnimationFrame(loop);
};loop();$("scene-status").textContent="المجسم جاهز: النواة كرة بنفسجية مستقلة داخل جسم الخلية. جرّب اللمس.";
engine={hint:showHint,startPulse,dispose(){disposed=true;cancelAnimationFrame(raf);renderer.domElement.removeEventListener("pointerdown",click);resize?.disconnect();renderer.dispose();scene.traverse(o=>{o.geometry?.dispose();if(o.material){if(Array.isArray(o.material))o.material.forEach(m=>m.dispose());else o.material.dispose()}});renderer.domElement.remove()}};
}catch(e){$("scene-status").textContent="تعذر تشغيل الرسم ثلاثي الأبعاد: "+e.message+". تظل أزرار تحديد النواة وجسم الخلية متاحة وتصحيحها منفصل."}}
function initialize(){const s=$("sim-chapter");for(const c of curr.chapters){const opt=document.createElement("ion-select-option");opt.value=String(c.id);opt.textContent=c.id+". "+c.title;s.append(opt)}
s.addEventListener("ionChange",e=>{if(e.detail?.value&&Number(e.detail.value)!==ch)selectTopic(Number(e.detail.value),0)});$("sim-topic").addEventListener("ionChange",e=>{const i=Number(e.detail?.value);if(Number.isInteger(i)&&i!==ti)selectTopic(ch,i)});
$("new-activity").onclick=setScene;$("next-topic").onclick=()=>selectTopic(ti+1<activeTopic().c.topics.length?ch:Math.min(ch+1,11),ti+1<activeTopic().c.topics.length?ti+1:0);
$("organ-3d").addEventListener("load",()=>$("scene-status").textContent="المجسم المرجعي جاهز. اسحب للتحريك وكبّر بإصبعين.");
$("organ-3d").addEventListener("error",()=>$("scene-status").textContent="تعذر تحميل هذا المجسم من GitHub؛ افتح رابط المصدر أو اختر موضوعاً آخر.");
const hash=location.hash.match(/c(\d+)t(\d+)/);selectTopic(hash?Number(hash[1]):1,hash?Number(hash[2]):0);}
document.readyState==="loading"?document.addEventListener("DOMContentLoaded",initialize):initialize();
})();