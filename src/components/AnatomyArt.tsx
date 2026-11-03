import React, { useEffect, useState } from 'react';

/** Curated free Servier illustrations, not stock photos or AI art.
 * The subject of every image corresponds to the named Iraqi biology chapter.
 * Source/author/license are documented in /nabd-anatomy/attribution.json.
 *
 * Admin-created chapter imagery takes precedence over the suggested default.
 * Chapter 8 and 11 retain previously approved artwork: the current source set
 * cannot represent both reproductive anatomy or the complete immune system
 * accurately in a single small icon.
 */
const anatomy: Record<number,string> = {
  1:'brain',
  2:'skeleton',
  3:'muscles',
  4:'digestive',
  5:'circulation',
  6:'lungs',
  7:'kidney',
  9:'eye',
  10:'thyroid'
};
const prior = ['brain','bone','arm','intestine','heart','lungs','kidneys','dna-fluent','eye','thyroid','antibody'];

interface Props {
 chapter: number;
 alt: string;
 override?: string;
 className?: string;
 eager?: boolean;
}

export function AnatomyArt({ chapter,alt,override,className='',eager=false }:Props) {
 const base=import.meta.env.BASE_URL;
 const backup=base+'nabd-art/'+(prior[chapter-1]||'brain')+'.svg';
 const suggested=anatomy[chapter]?base+'nabd-anatomy/'+anatomy[chapter]+'.webp':backup;
 const requested=override||suggested;
 const [src,setSrc]=useState(requested);
 useEffect(()=>setSrc(requested),[requested]);
 return <img
   src={src}
   className={['nabd-organ-art',anatomy[chapter]&&!override?'nabd-servier-art':'',className].filter(Boolean).join(' ')}
   alt={alt}
   title={alt}
   width={96}
   height={96}
   loading={eager?'eager':'lazy'}
   decoding="async"
   onError={()=>{if(src!==backup)setSrc(backup)}}
   draggable={false}
 />;
}
