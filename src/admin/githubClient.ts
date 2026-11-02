const REPO = 'alians200a-commits/Nbd';
const ROOT = 'https://api.github.com/repos/'+REPO;
export type WorkflowRun = { id:number; name:string; status:string; conclusion:string|null; created_at:string; html_url:string; run_number:number };
export type Artifact = { id:number; name:string; size_in_bytes:number; expired:boolean };
export type Commit = { sha:string; commit:{message:string;author?:{date?:string}}; html_url:string };
export class GithubAdmin {
  constructor(private readonly token:string) {}
  async request<T>(path:string, options:RequestInit={}):Promise<T>{
    const response=await fetch(path.startsWith('https://api.github.com')?path:ROOT+path,{
      ...options,
      headers:{
        Accept:'application/vnd.github+json',
        Authorization:'Bearer '+this.token,
        ...(options.body?{'Content-Type':'application/json'}:{}),
        ...options.headers
      },
      cache:'no-store',credentials:'omit'
    });
    if(!response.ok){
      const text=await response.text().catch(()=>'');
      const message=(()=>{try{return JSON.parse(text).message as string}catch{return ''}})();
      throw new Error(response.status===401?'مفتاح الدخول غير صالح':response.status===403?'ما عندك صلاحية كافية أو وصل حدّ الطلبات':response.status===404?'المهمة أو الملف غير موجود':message||'خطأ اتصال '+response.status);
    }
    if(response.status===204)return undefined as T;
    return (await response.json()) as T;
  }
  async verify(){
    const user=await this.request<{login:string}>('https://api.github.com/user');
    if(user.login.toLowerCase()!=='alians200a-commits')throw Error('الدخول مخصص لحساب مالك المشروع فقط');
    const repo=await this.request<{owner?:{login?:string}}>('');
    if(repo.owner?.login?.toLowerCase()!=='alians200a-commits')throw Error('لا يمكن التحقق من ملكية المشروع');
    // Verify Actions scope before displaying actionable controls.
    await this.request('/actions/workflows?per_page=1');
    return user.login;
  }
  runs(workflow:string){
    return this.request<{workflow_runs:WorkflowRun[]}>(`/actions/workflows/${encodeURIComponent(workflow)}/runs?per_page=20`).then(x=>x.workflow_runs);
  }
  artifacts(runId:number){
    return this.request<{artifacts:Artifact[]}>(`/actions/runs/${runId}/artifacts`).then(x=>x.artifacts);
  }
  dispatch(workflow:string,inputs:Record<string,string>){
    return this.request<void>(`/actions/workflows/${encodeURIComponent(workflow)}/dispatches`,{
      method:'POST',body:JSON.stringify({ref:'main',inputs})
    });
  }
  commits(){
    return this.request<Commit[]>('/commits?per_page=10');
  }
  async artifactZip(id:number):Promise<Blob>{
    const response=await fetch(`${ROOT}/actions/artifacts/${id}/zip`,{
      headers:{Authorization:'Bearer '+this.token,Accept:'application/vnd.github+json'},
      credentials:'omit',cache:'no-store'
    });
    if(!response.ok)throw Error('تعذّر تنزيل الملف من GitHub: '+response.status);
    const blob=await response.blob();
    if(blob.size>60*1024*1024)throw Error('الملف كبير جداً للمعاينة على المتصفح');
    if(blob.type.includes('json'))throw Error('الملف الصوتي غير متوفر');
    return blob;
  }
}
/** Minimal ZIP central directory reader; no external scripts and no server upload. */
export async function extractWav(zip:Blob):Promise<Blob>{
  const bytes=new Uint8Array(await zip.arrayBuffer());
  const view=new DataView(bytes.buffer);
  let eocd=-1;
  for(let i=bytes.length-22;i>=Math.max(0,bytes.length-65557);i--){
    if(view.getUint32(i,true)===0x06054b50){eocd=i;break}
  }
  if(eocd<0)throw Error('ملف التسجيل ليس أرشيفاً صحيحاً');
  const count=view.getUint16(eocd+10,true);
  let at=view.getUint32(eocd+16,true);
  for(let entry=0;entry<count;entry++){
    if(view.getUint32(at,true)!==0x02014b50)throw Error('أرشيف غير صالح');
    const method=view.getUint16(at+10,true);
    const size=view.getUint32(at+20,true);
    const filenameLen=view.getUint16(at+28,true),extra=view.getUint16(at+30,true),comment=view.getUint16(at+32,true);
    const filename=new TextDecoder().decode(bytes.subarray(at+46,at+46+filenameLen));
    const offset=view.getUint32(at+42,true);
    at+=46+filenameLen+extra+comment;
    if(!/^([^/]+\/)*[^/]+\.wav$/i.test(filename))continue;
    if(view.getUint32(offset,true)!==0x04034b50)throw Error('جزء صوت تالف');
    const dataStart=offset+30+view.getUint16(offset+26,true)+view.getUint16(offset+28,true);
    const raw=bytes.slice(dataStart,dataStart+size);
    if(method===0)return new Blob([raw],{type:'audio/wav'});
    if(method!==8)throw Error('ضغط الأرشيف غير مدعوم');
    if(typeof DecompressionStream==='undefined')throw Error('المتصفح لا يدعم فك ضغط الصوت');
    const stream=new Blob([raw]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
    return new Blob([await new Response(stream).arrayBuffer()],{type:'audio/wav'});
  }
  throw Error('ماكو تسجيل WAV داخل الحزمة');
}
