import type {ManagedCatalog} from '../content/types';
import type {GithubAdmin} from './githubClient';
export const CONTENT_PATH='public/nabd-content/catalog.json';
function utf8ToBase64(str:string){
 const bytes=new TextEncoder().encode(str);
 let bin='';
 for(let i=0;i<bytes.length;i+=8192)bin+=String.fromCharCode(...bytes.subarray(i,i+8192));
 return btoa(bin);
}
function base64ToUtf8(encoded:string){
 const bin=atob(encoded.replace(/\s/g,''));
 const bytes=new Uint8Array(bin.length);
 for(let i=0;i<bin.length;i++)bytes[i]=bin.charCodeAt(i);
 return new TextDecoder().decode(bytes);
}
type GithubFile={sha:string;content:string;encoding:string;path:string};
export async function fetchManagedCatalog(client:GithubAdmin):Promise<{catalog:ManagedCatalog;sha:string}>{
 const result=await client.request<GithubFile>('/contents/'+CONTENT_PATH+'?ref=main');
 if(result.encoding!=='base64')throw Error('تعذّر قراءة فهرس المحتوى');
 const catalog=JSON.parse(base64ToUtf8(result.content)) as ManagedCatalog;
 if(catalog.version!==1||!Array.isArray(catalog.chapters)||!Array.isArray(catalog.lessons))throw Error('ملف المحتوى غير صالح');
 return {catalog,sha:result.sha};
}
export async function saveManagedCatalog(client:GithubAdmin,catalog:ManagedCatalog,sha:string){
 if(catalog.lessons.length>5000||catalog.chapters.length>200)throw Error('حجم المحتوى كبير جداً');
 const payload={...catalog,updatedAt:new Date().toISOString()};
 const result=await client.request<{content:{sha:string}}>('/contents/'+CONTENT_PATH,{
   method:'PUT',body:JSON.stringify({
     message:'Update NABD educational content and learning assets from owner dashboard',
     branch:'main',sha,
     content:utf8ToBase64(JSON.stringify(payload,null,2)+'\n')
   })
 });
 return result.content.sha;
}
export async function uploadManagedImage(client:GithubAdmin,file:File){
 if(file.size<100||file.size>2*1024*1024)throw Error('الصورة لازم تكون أقل من ٢ ميغابايت');
 const ext:Record<string,string>={'image/png':'png','image/jpeg':'jpg','image/webp':'webp'};
 const ending=ext[file.type];
 if(!ending)throw Error('الصيغ المسموحة: PNG أو JPG أو WebP فقط');
 const bytes=new Uint8Array(await file.arrayBuffer());
 const valid=ending==='png'
 ? bytes.length>8 && bytes[0]===137 && bytes[1]===80 && bytes[2]===78 && bytes[3]===71
 :ending==='jpg' ? bytes[0]===255&&bytes[1]===216 : bytes.length>12 && String.fromCharCode(...bytes.slice(0,4))==='RIFF' && String.fromCharCode(...bytes.slice(8,12))==='WEBP';
 if(!valid)throw Error('الملف مو صورة حقيقية بالصيغة المطلوبة');
 let bin='';
 for(let i=0;i<bytes.length;i+=8192)bin+=String.fromCharCode(...bytes.subarray(i,i+8192));
 const digest=await crypto.subtle.digest('SHA-256',bytes);
 const hash=[...new Uint8Array(digest)].slice(0,12).map(x=>x.toString(16).padStart(2,'0')).join('');
 const path='public/nabd-content/media/'+hash+'.'+ending;
 try{
   await client.request('/contents/'+path,{
     method:'PUT',body:JSON.stringify({message:'Add reviewed educational image from NABD administrator',branch:'main',content:btoa(bin)})
   });
 }catch(e){
   if(!String(e).includes('already exists')&&!String(e).includes('422'))throw e;
 }
 return 'media/'+hash+'.'+ending;
}
