import { useId } from 'react';

type BrandMarkProps = {
  className?: string;
  title?: string;
};

export function BrandMark({ className, title = 'Murmura' }: BrandMarkProps) {
  const gradientId = useId();

  return (
    <svg viewBox="0 0 160 150" role="img" aria-label={title} className={className}>
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#3730A3" />
        </linearGradient>
      </defs>
      <path
        d="M22 4 L138 4 Q156 4 156 22 L156 106 Q156 124 138 124 L44 124 L12 150 L30 124 L22 124 Q4 124 4 106 L4 22 Q4 4 22 4 Z"
        fill={`url(#${gradientId})`}
      />
      <path
        d="M26 54 C46 40,66 40,80 54 S118 68,130 54"
        stroke="white"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
        opacity="0.4"
      />
      <path
        d="M26 72 C46 58,66 58,80 72 S118 86,130 72"
        stroke="white"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path
        d="M26 90 C46 76,66 76,80 90 S118 104,130 90"
        stroke="white"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
