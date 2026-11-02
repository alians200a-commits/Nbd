import React from 'react';

export type BiologySymbol =
  | 'nerve' | 'skeleton' | 'arm' | 'intestine' | 'blood-vessel'
  | 'lungs' | 'kidneys' | 'dna' | 'eye' | 'thyroid' | 'cell-nuclei';

interface Props {
  name: BiologySymbol;
  size?: number;
  className?: string;
}

/**
 * Original Health Icons artwork (CC0) copied from github.com/resolvetosavelives/healthicons.
 * Not an AI-generated illustration. External sprite is bundled under public/assets.
 */
export const BiologySymbolIcon: React.FC<Props> = ({ name, size = 38, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48"
    className={className} aria-hidden="true" focusable="false" fill="currentColor">
    <use href={`${import.meta.env.BASE_URL}assets/healthicons-anatomy.svg#an-${name}`} />
  </svg>
);
