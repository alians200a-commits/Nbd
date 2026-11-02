import { useEffect, useState } from 'react';
import type { ManagedCatalog } from './types';
import { emptyCatalog } from './types';
const URL=import.meta.env.BASE_URL+'nabd-content/catalog.json';
export function useManagedContent(){
 const [content,setContent]=useState<ManagedCatalog>(emptyCatalog());
 useEffect(()=>{
  const ctl=new AbortController();
  fetch(URL,{signal:ctl.signal,cache:'no-cache'}).then(x=>{
    if(!x.ok)throw new Error('Catalog unavailable');
    return x.json();
  }).then(x=>{
    if(x.version===1&&Array.isArray(x.chapters)&&Array.isArray(x.lessons))setContent(x as ManagedCatalog);
  }).catch(()=>{});
  return()=>ctl.abort();
 },[]);
 return content;
}
export function safeMediaUrl(value:string){
 if(!value||!/^[a-zA-Z0-9._/-]+$/.test(value)||value.includes('..')||!value.startsWith('media/'))return '';
 return import.meta.env.BASE_URL+'nabd-content/'+value;
}
