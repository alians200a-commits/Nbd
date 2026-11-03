import React, { useEffect, useState } from 'react';

/**
 * Real CC0 Blender-rendered imagery, bundled locally in /nabd-3d/.
 * Gracefully falls back to an existing semantic SVG if an optional file is unavailable.
 * Accessible text belongs in the adjacent real HTML label, never inside the image.
 */
type Props = {
  name: string;
  fallback: string;
  className?: string;
  animated?: boolean;
  priority?: boolean;
};
const base = import.meta.env.BASE_URL;
export function ThreeDIcon({name, fallback, className='', animated=false, priority=false}:Props) {
  const image = base+'nabd-3d/'+name+'.webp';
  const fallbackUrl = base+'nabd-art/'+fallback+'.svg';
  const [src, setSrc] = useState(image);
  useEffect(() => { setSrc(image); }, [image]);
  return (
    <img
      src={src}
      className={['nabd-3d-asset',animated?'nabd-3d-animate':'',className].filter(Boolean).join(' ')}
      alt=""
      aria-hidden="true"
      draggable={false}
      decoding="async"
      loading={priority?'eager':'lazy'}
      onError={() => { if(src!==fallbackUrl)setSrc(fallbackUrl); }}
    />
  );
}
