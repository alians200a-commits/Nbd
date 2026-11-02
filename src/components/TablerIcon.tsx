import React from 'react';

interface TablerIconProps {
  name: string;
  className?: string;
  size?: number;
}

export const TablerIcon: React.FC<TablerIconProps> = ({ name, className = '', size = 24 }) => {
  return (
    <svg className={`icon ${className}`} width={size} height={size} aria-hidden="true" style={{ verticalAlign: 'middle', display: 'inline-block' }}>
      <use href={`/assets/tabler-icons.svg#ti-${name}`} />
    </svg>
  );
};
